import { Users } from "../schema/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { 
    AWS_BUCKET_NAME, 
    JWT_EMAIL_KEY, 
    JWT_OTP_KEY, 
    JWT_REFRESH_SECRET_KEY, 
    JWT_SECRET_KEY, 
    MY_MAIL, 
    AWS_REGION, 
    JWT_UPDATE_KEY,
    JWT_DELETE_KEY
} from "../config/serverConfig.js";
import { S3Client, PutObjectCommand, DeleteObjectsCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import crypto from 'crypto';
import { transporter } from "../config/mailerconfig.js";
import { emailVerification } from './../schema/emailVerification.js';
import { Blog } from './../schema/blog.js';

export const createUser = async ({ email, password, userEmail, userName }) => {
    try {
        if(userEmail !== email) {
            throw {
                message: "Username contains inappropriate word(s).",
                success: false,
                status: 403
            }
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const response = await Users.create({ email: userEmail , password: hashPassword, userName});

        const updateResponse = {
            _id: response._id,
            email: response.email,
            userName: response.userName,
            profileImg: response.profileImg
        }
        return updateResponse;
    } catch (error) {
        console.log(error); 
        if(error.code === 11000) {
            throw {
                message: `Email already exists`,
                status: 400,
                success: false,
                error: error
            }
        }
        throw error;
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const user = await Users.findOne({ email });
        
        if(!user) {
            throw {
                message: 'User does not exist',
                success: false,
                status: 404
            }
        }

        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            throw {
                message: 'Incorrect Password',
                success: false,
                status: 401
            }
        }

        const accessToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                userName: user.userName,
                profileImg: user.profileImg
            },
            JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                userName: user.userName,
                profileImg: user.profileImg
            },
            JWT_REFRESH_SECRET_KEY,
            { expiresIn: '7d'}
        );

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const users = await Users.find();

        const updatedUsers = users.map(e => ({
            _id: e._id,
            email: e.email,
            userName: e.userName,
            profileImg: e.profileImg
        }));
        return updatedUsers;
    } catch (error) {
        throw error;
    }
}

export const getUserById = async (userId) => {
    try {
        const user = await Users.findById(userId);

        if(!user) {
            throw{
                message: 'User not found',
                success: false,
                status: 404
            }
        }
        const updatedUser = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profileImg: user.profileImg
        }
        return updatedUser;
    } catch (error) {
        console.log("This is the getUserById error: ", error);
        throw error;
    }
}

export const forgetPassword = async({ email }) => {
    try {
        //findUser => find the user by email in the database, if not found, throw 404
        const user = await Users.findOne({ email });
        
        if(!user) {
            throw {
                message: 'user not found',
                success: false,
                status: 404
            }
        }
        //if otp already exists
        if(user.otp) {
            throw {
                message: "Can't request otp, you are in cooldown period",
                success: false,
                status: 403
            }
        }
        //crypto => generate random 6 digit OTP with a 10min expiration timmer
        
        const otp = crypto.randomInt(100000,999999);
        const expiresAt = Date.now() + 600000;
        
        //nodemailer => send the OTP to the user email
        const mailOptions = {
            from: `"DevsConner Blog" ${MY_MAIL}`,
            to: email,
            subject: '🔐 Your One-Time Password (OTP)',
            html: `
                <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">
                    <h2 style="text-align: center; color: #333;">DevsConner Blog</h2>
                    <p style="font-size: 16px; color: #333;">Hi there,</p>
                    <p style="font-size: 16px; color: #333;">
                        Your One-Time Password (OTP) for verification is:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; background-color: #4CAF50; color: white; border-radius: 5px;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #555;">
                        This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        You are receiving this email because you are trying to register or reset your password on DevsConner Blog.
                    </p>
                </div>
            `
        };        
        
        const info = await transporter.sendMail(mailOptions);
        console.log("Otp send : ", info.response);

        //hash the otp and store store hashOtp and expiresAt in DB
        const hashOtp = await bcrypt.hash(otp.toString(), 12);
        const newUser = await Users.findByIdAndUpdate(user._id, { otp: hashOtp, expiresAt });
        
        
        const updatedUser = {
            _id: newUser._id,
            email: newUser.email,
            userName: newUser.userName,
            profileImg: newUser.profileImg
        }
        //return => OTP send successfully
        return updatedUser;
    } catch (error) {
        console.log('This is forgetPassword error: ', error);
        throw error;
    }
}

export const otpVerification = async ({ otp, email }) => {
    try {
        //use imcoming email to find the user
        const user = await Users.findOne({ email });
        
        if(!user) {
            throw {
                message: 'User not found',
                success: false,
                status: 404
            }
        }
        
        //check if opt is expired or not using expiresAt in DB
        if(!user.expiresAt ||  user.expiresAt < Date.now()) {
            throw {
                message: 'Otp expried or not requested',
                success: true,
                status: 400
            }
        }
        
        if (!user.otp) {
            throw { 
                message: "OTP expired or not requested", 
                success: false,
                status: 400 
            };
        }
        
        //compare the incoming otp with otp in DB with bcrypt.compare
        const isValid = await bcrypt.compare(otp, user.otp);
        
        if(!isValid) {
            throw {
                message: 'OTP invalid',
                success: false,
                status: 400
            }
        }
        
        //if true return accessToken so that they can access /resetPassword route
        const otpAccessToken = jwt.sign(
            {
                userId: user._id,
            },
            JWT_OTP_KEY,
            { expiresIn: '5m'}
        );
        
        //and change the stored otp and expiresAt in db into null
        const updatedUser = await Users.findByIdAndUpdate(user._id, { otp: null, expiresAt: null });

        const newUser = {
            _id: updatedUser._id,
            email: updatedUser.email,
            userName: updatedUser.userName,
            profileImg: updatedUser.profileImg
        }
        return { otpAccessToken, newUser };
    } catch (error) {
        console.log('This is otpVerification error: ', error);
        throw error;
    }
}

export const resetPassword = async ({ newPassword, userId }) => {
    try {
        const hashPassword = await bcrypt.hash(newPassword, 12);
        const user = await Users.findByIdAndUpdate(userId, { password: hashPassword }, { new: true });

        const newUser = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profileImg: user.profileImg
        }
        return newUser;
    } catch (error) {
        console.log('This error is from resetPassword : ', error);
        throw error;
    }
}

export const verifyEmail = async ({ email }) => {
    try {
        const existingEmailDb = await emailVerification.findOne({ email });

        //create otp useing crypto and hash it using bcrypt and set expiresAt
        const otp = crypto.randomInt(100000,600000);
        console.log(otp.toString());
        const hashOtp = await bcrypt.hash(otp.toString(), 12);
        const expiresAt = Date.now() + 600000;

        //send otp to email
        const mailOptions = {
            from: `"DevsConner Blog" ${MY_MAIL}`,
            to: email,
            subject: '🔐 Your One-Time Password (OTP)',
            html: `
                <div style="max-width: 600px; margin: auto; padding: 20px; font-family: Arial, sans-serif; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #e0e0e0;">
                    <h2 style="text-align: center; color: #333;">DevsConner Blog</h2>
                    <p style="font-size: 16px; color: #333;">Hi there,</p>
                    <p style="font-size: 16px; color: #333;">
                        Your One-Time Password (OTP) for verification is:
                    </p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; padding: 12px 24px; font-size: 24px; font-weight: bold; background-color: #4CAF50; color: white; border-radius: 5px;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #555;">
                        This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
                    </p>
                    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;" />
                    <p style="font-size: 12px; color: #999; text-align: center;">
                        You are receiving this email because you are trying to register or reset your password on DevsConner Blog.
                    </p>
                </div>
            `
        };
        
        await transporter.sendMail(mailOptions);

        //store hashOtp, email and expiresAt in db for verifying otp later
        if(existingEmailDb) {
            await emailVerification.findByIdAndUpdate(
                existingEmailDb._id,
                { otp: hashOtp, expiresAt }, { new: true }
            );
        } 
        else {
            const emailDb = await emailVerification.create({ email, otp: hashOtp, expiresAt });
            return emailDb;
        }

    } catch (error) {
        console.log('This error is from verifyEmail: ', error);
        throw error;
    }
}

export const emailVerifyOtp = async ({ otp, email }) => {
    try {
        const emailDb = await emailVerification.findOne({ email });

        if(!emailDb) {
            throw {
                message: 'Invalid email, not found',
                success: false,
                status: 404
            }
        }

        if(emailDb.expiresAt == null) {
            throw {
                message: 'Otp not reqested, time'
            }
        }

        if(emailDb.expiresAt < Date.now()) {
            await emailVerification.findByIdAndDelete(emailDb._id);
            throw {
                message: 'Otp expired or not reqested, time',
                success: false,
                status: 400
            }
        }

        if(!emailDb.otp) {
            await emailVerification.findByIdAndDelete(emailDb._id);
            throw {
                message: 'Otp expired or not requested, otp',
                success: false,
                status: 400
            }
        }

        const isValid = await bcrypt.compare(otp, emailDb.otp);

        if(!isValid) {
            await emailVerification.findByIdAndDelete(emailDb._id);
            throw {
                message: 'Invalid Otp',
                success: false,
                status: 400
            }
        }

        const emailAccessToken = jwt.sign(
            {
                userId: emailDb._id,
                email: emailDb.email
            },
            JWT_EMAIL_KEY,
            { expiresIn: '5m'}
        );

        const delEmailDb = await emailVerification.findByIdAndDelete(emailDb._id);

        return { delEmailDb, emailAccessToken }

    } catch (error) {
        console.log('This error is from emailVerifyOtp: ', error);
        throw error;
    }
}

export const preSignedUrl = async ({ fileType }) => {
    try {
        const s3Client = new S3Client({ region: AWS_REGION });

        const extension = fileType.split('/')[1]; // e.g., 'png' from 'image/png'
        const fileName = `${Date.now()}.${extension}`; // e.g., '1714567890123.png'

        const command = new PutObjectCommand({
            Bucket: AWS_BUCKET_NAME,
            Key: `uploads/${fileName}`, // Keep this consistent
            ContentType: fileType
        });

        const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 90 });

        const fileUrl = `https://${AWS_BUCKET_NAME}.s3.amazonaws.com/uploads/${fileName}`;

        return { uploadUrl, fileUrl };
    } catch (error) {
        console.log('This error is from preSignedUrl: ', error);
        throw error;
    }
}

export const saveProfileImg = async ({ fileUrl, userId }) => {
    try {
        const user = await Users.findByIdAndUpdate(userId, { profileImg: fileUrl }, { new: true });
        const newUser = {
            _id: user._id,
            email: user.email,
            profileImg: user.profileImg
        }
        return newUser;
    } catch (error) {
        console.log('This error is from saveProfileImg: ', error);
        throw error;
    }
}

export const updateLogin = async ({ email, password }) => {
    try {
        const user = await Users.findOne({ email });

        if(!user) {
            throw {
                message: 'Invalid email, user not found',
                success: false,
                status: 400
            }
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid) {
            throw {
                message: 'Incorrect password',
                success: false,
                status: 403
            }
        }


        const updateAccessToken = await jwt.sign(
            {
                userId: user._id
            },
            JWT_UPDATE_KEY,
            { expiresIn: '5m' }
        );

        return updateAccessToken;
    } catch (error) {
        console.log('This error is from updateLogin: ', error);
        throw error;
    }
}

export const updateUser = async ({ newEmail, newPassword, userId, newUserName }) => {
    try {
        const hashPassword = await bcrypt.hash(newPassword, 12);
        const user = await Users.findByIdAndUpdate(userId, { 
            email: newEmail, 
            password: hashPassword, 
            userName: newUserName 
        }, { new: true });
        const newUser = {
            _id: user._id,
            email: user.email,
            userName: user.userName,
            profileImg: user.profileImg
        }
        return newUser;
    } catch (error) {
        console.log('This error is from updateUser: ', error);
        throw error;
    }
}

export const deleteLogin = async ({ email, password }) => {
    try {
        const user = await Users.findOne({ email });

        if(!user) {
            throw {
                message: 'Invalid email, user not foudn',
                success: false,
                status: 403
            }
        }

        const isValid = await bcrypt.compare(password, user.password);

        if(!isValid) {
            throw {
                message: 'Incorrect password',
                success: false,
                status: 403
            }
        }

        const deleteToken = jwt.sign(
            { userId: user._id },
            JWT_DELETE_KEY,
            { expiresIn: '5m' }
        );

        return deleteToken;
    } catch (error) {
        console.log('This error is from deleteLogin: ', error);
        throw error;
    }
}

export const deleteUser = async ({ userId }) => {
    try {
        const s3 = new S3Client({ region: AWS_REGION });

        // Fetch blogs by user
        const blogs = await Blog.find({ author: userId });

        if (!blogs) {
            throw {
                message: "Couldn't fetch author's blogs to delete",
                success: false,
                status: 500
            };
        }

        // Extract cover image keys for deletion
        const objectsToDelete = blogs
            .map(blog => {
                if (blog.coverImage) {
                    const key = blog.coverImage.split('uploads/')[1];
                    return key ? { Key: `uploads/${key}` } : null;
                }
                return null;
            })
            .filter(Boolean); // remove nulls

        // Delete all blog cover images from S3
        if (objectsToDelete.length > 0) {
            const deleteParams = {
                Bucket: AWS_BUCKET_NAME,
                Delete: {
                    Objects: objectsToDelete,
                    Quiet: false
                }
            };
            await s3.send(new DeleteObjectsCommand(deleteParams));
        }

        // Delete all blogs
        await Promise.all(blogs.map(blog => Blog.findByIdAndDelete(blog._id)));

        // Fetch user
        const user = await Users.findById(userId);
        if (!user) {
            throw {
                message: "User not found",
                success: false,
                status: 404
            };
        }

        // Delete profile image if exists
        if (user.profileImg) {
            const key = user.profileImg.split('uploads/')[1];
            if (key) {
                const command = new DeleteObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: `uploads/${key}`
                });
                await s3.send(command);
            }
        }

        // Delete user
        const deletedUser = await Users.findByIdAndDelete(user._id);
        return deletedUser;

    } catch (error) {
        console.error('This error is from deleteUser:', error);
        throw error;
    }
};

export const delProfileImg = async ({ userId }) => {
    try {
        const s3 = new S3Client({ region: AWS_REGION });

        const user = await Users.findById(userId);

        if (!user) {
            throw {
                message: 'User not found',
                success: false,
                status: 404
            };
        }

        if (user.profileImg) {
            const key = user.profileImg.split('uploads/')[1];

            if (key) {
                const command = new DeleteObjectCommand({
                    Bucket: AWS_BUCKET_NAME,
                    Key: `uploads/${key}`
                });

                await s3.send(command);
            }

            // Clear profile image field in DB
            user.profileImg = null;
            const updatedUser = await user.save();
            const newUser = {
                _id: updatedUser._id,
                email: updatedUser.email,
                userName: updatedUser.userName,
                profileImg: updatedUser.profileImg
            }
            return newUser;
        } else {
            throw {
                message: "User doesn't have a profile image",
                success: false,
                status: 404
            };
        }

    } catch (error) {
        console.log('This error is from delProfileImg:', error);
        throw error;
    }
};

export const toggleFollow = async({ userId, followUserId }) => {
    try {
        const user = await Users.findById(userId);
        const followUser = await Users.findById(followUserId);

        if(!user || !followUser) {
            throw {
                message: 'User not found',
                success: false,
                status: 404
            }
        }

        const hasFollowed = user.following.includes(followUserId);

        if(hasFollowed) {
            user.following.pull(followUserId);
        } else {
            user.following.push(followUserId);
        }

        await user.save();
        return user.following;
    } catch (error) {
        console.log('This error is from toggleFollow: ', error);
        throw error;
    }
}