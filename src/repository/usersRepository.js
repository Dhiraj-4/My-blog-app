import { Users } from "../schema/users.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from "../config/serverConfig.js";

export const createUser = async ({ email, password }) => {
    try {
        const hashPassword = await bcrypt.hash(password, 12);
        const response = await Users.create({ email, password: hashPassword });

        return response;
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
        const user = await Users.findOne({ email: email });

        
        if(!user) {
            throw {
                message: 'User does not exist',
                success: false,
                status: 404
            }
        }

        console.log(user, "Hey i am the user, this is my password", user.password);

        const isPassword = await bcrypt.compare(password, user.password);

        if(!isPassword) {
            throw {
                message: 'Incorrect Password',
                success: false,
                status: 401
            }
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
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

        return users;
    } catch (error) {
        throw error;
    }
}
