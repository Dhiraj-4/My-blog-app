import {
    createUser as createUserService,
    getAllUsers as getAllUsersService,
    loginUser as loginUserService,
    getUserById as getUserByIdService,
    preSignedUrl as preSignedUrlService,
    forgetPassword as forgetPasswordService,
    otpVerification as otpVerificationService,
    resetPassword as resetPasswordService,
    verifyEmail as verifyEmailService,
    emailVerifyOtp as emailVerifyOtpService,
    saveProfileImg as saveProfileImgService,
    updateLogin as updateLoginService,
    updateUser as updateUserService,
    deleteLogin as deleteLoginService,
    deleteUser as deleteUserService,
    delProfileImg as delProfileImgService,
    toggleFollow as toggleFollowService
} from '../service/usersService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const createUser = async (req, res) => {
    try {
        const response = await createUserService({
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password.trim(),
            userEmail: req.user.email,
            userName: req.body.userName.trim().toLowerCase(),
            bio: req.body.bio.trim().toLowerCase()
        });

        return successResponse({
            message: 'Signed up successfully',
            success: true,
            data: response,
            status: 201,
            res: res

        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const loginUser = async (req, res) => {
    try {
        const { accessToken, refreshToken } = await loginUserService({
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password.trim()
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict'
        });

        return successResponse({
            message: 'Logged in successfully',
            success: true,
            data: { accessToken: accessToken },
            res: res,
            status: 200
        })
        
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await getAllUsersService();

        return successResponse({
            message: 'Fetched all users successfully',
            success: true,
            data: users,
            res: res,
            status: 200
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const getUserById = async (req, res) => {
    try {
        let user;
        if(req.body.action.trim().toLowerCase() === 'self') {
            user = await getUserByIdService(req.user.userId);
        } else if(req.body.action.trim().toLowerCase() === 'other') {
            user = await getUserByIdService(req.params.id);
        } else {
            return res.status(400).json({
                message: 'Invalid action',
                success: false
            });
        }

        return successResponse({
            message: 'Fetched user successfully',
            success: true,
            res: res,
            status: 200,
            data: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const forgetPassword = async (req, res) => {
    try {
        const user = await forgetPasswordService({
            email: req.body.email.trim().toLowerCase()
        });

        return successResponse({
            message: 'OTP sent successfully',
            success: true,
            data: user,
            res: res,
            status: 200
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const otpVerification = async (req, res) => {
    try {
        const { updatedUser, otpAccessToken } = await otpVerificationService({
            email: req.body.email.trim().toLowerCase(),
            otp: req.body.otp.trim()
        });

        return successResponse({
            message: 'Otp verified successfully',
            success: true,
            status: 200,
            res: res,
            data: { updatedUser, otpAccessToken }
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const resetPassword = async (req, res) => {
    try {
        const user = await resetPasswordService({
            newPassword: req.body.newPassword.trim(),
            userId: req.user.userId
        });

        return successResponse({
            message: 'Password changed successfully',
            success: true,
            status: 201,
            res: res,
            data: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const verifyEmail = async (req, res) => {
    try {
        const emailDb = await verifyEmailService({ email: req.body.email.trim().toLowerCase() });

        return successResponse({
            message: 'Otp sent successfully',
            success: true,
            status: 200,
            res: res,
            data: emailDb
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const emailVerifyOtp = async (req, res) => {
    try {
        const { delEmailDb, emailAccessToken } = await emailVerifyOtpService({
            email: req.body.email.trim().toLowerCase(),
            otp: req.body.otp.trim()
        });

        return successResponse({
            message: 'Otp verified successfully',
            success: true,
            status: 200,
            res: res,
            data: { delEmailDb, emailAccessToken }
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const preSignedUrl = async (req, res) => {
    try {
        const { uploadUrl, fileUrl } = await preSignedUrlService({
            fileType: req.body.fileType
        });

        return successResponse({
            message: 'Fetched preSignedUrl successfully',
            success: true,
            status: 200,
            res: res,
            data: { uploadUrl, fileUrl }
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const saveProfileImg = async (req, res) => {
    try {
        const user = await saveProfileImgService({
            fileUrl: req.body.fileUrl,
            userId: req.user.userId
        });

        return successResponse({
            message: 'ProfileImg updated successfully',
            success: true,
            res: res,
            status: 201,
            data: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateLogin = async (req, res) => {
    try {
        const updateAccessToken = await updateLoginService({
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password.trim()
        });

        return successResponse({
            message: 'Fetched updateAccessToken successfully',
            success: true,
            status: 200,
            res: res,
            data: { updateAccessToken }
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const updateUser = async (req, res) => {
    try {
        const user = await updateUserService({
            newEmail: req.body.newEmail.trim().toLowerCase(),
            newPassword: req.body.newPassword.trim(),
            newUserName: req.body.newUserName.trim().toLowerCase(),
            userId: req.user.userId,
            bio: req.body.bio.trim().toLowerCase()
        });

        return successResponse({
            message: 'User updated successfully',
            success: true,
            status: 201,
            res: res,
            data: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteLogin = async (req, res) => {
    try {
        const deleteToken = await deleteLoginService({
            email: req.body.email.trim().toLowerCase(),
            password: req.body.password.trim()
        });

        return successResponse({
            message: 'Fetched deleteToken successfully',
            success: true,
            status: 200,
            res: res,
            data: { deleteToken }
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await deleteUserService({
            userId: req.user.userId
        });

        return successResponse({
            message: 'User deleted successfully',
            success: true,
            status: 200,
            res: res,
            data: { deletedUser }
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const delProfileImg = async (req, res) => {
    try {
        const user = await delProfileImgService({
            userId: req.user.userId
        });

        return successResponse({
            message: 'Profile image deleted successfully',
            success: true,
            status: 200,
            res: res,
            data: user
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}

export const toggleFollow = async(req, res) => {
    try {
        const followList = await toggleFollowService({
            userId: req.user.userId,
            followUserId: req.params.id
        });

        return successResponse({
            message: 'Toggled follow successfully',
            success: true,
            status: 200,
            res: res,
            data: { followList }
        });
    } catch (error) {
        return errorResponse({ error, res });
    }
}