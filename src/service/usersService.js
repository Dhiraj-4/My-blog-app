import {
    createUser as createUserRepository,
    getAllUsers as getAllUsersRepository,
    loginUser as loginUserRepository
} from '../repository/usersRepository.js';

export const createUser = async ({ email, password }) => {
    try {
        const response = await createUserRepository({ email, password });

        return response;
    } catch (error) {
        throw error;
    }
}

export const loginUser = async ({ email, password }) => {
    try {
        const tokens = await loginUserRepository({ email, password });
        return tokens;
    } catch (error) {
        throw error;
    }
}

export const getAllUsers = async () => {
    try {
        const users = await getAllUsersRepository();

        return users;
    } catch (error) {
        throw error;
    }
}