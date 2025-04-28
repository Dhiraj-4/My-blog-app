import {
    createUser as createUserService,
    getAllUsers as getAllUsersService,
    loginUser as loginUserService
} from '../service/usersService.js';
import { errorResponse, successResponse } from '../utils/response.js';

export const createUser = async (req, res) => {
    try {
        const response = await createUserService({
            email: req.body.email,
            password: req.body.password
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
            email: req.body.email,
            password: req.body.password
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true, 
            sameSite: 'strict'
        });

        return successResponse({
            message: 'Loged in successfully',
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
            message: 'Fecthed all users successfully',
            success: true,
            data: users,
            res: res,
            status: 200
        })
    } catch (error) {
        return errorResponse({ error, res });
    }
}