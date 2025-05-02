import {
    createUser as createUserRepository,
    getAllUsers as getAllUsersRepository,
    loginUser as loginUserRepository,
    getUserById as getUserByIdRepository,
    preSignedUrl as preSignedUrlRepository,
    forgetPassword as forgetPasswordRepository,
    otpVerification as otpVerificationRepository,
    resetPassword as resetPasswordRepository,
    verifyEmail as verifyEmailRepository,
    emailVerifyOtp as emailVerifyOtpRepository,
    saveProfileImg as saveProfileImgRepository,
    updateLogin as updateLoginRepository,
    updateUser as updateUserRepository,
    deleteLogin as deleteLoginRepository,
    deleteUser as deleteUserRepository,
    delProfileImg as delProfileImgRepository
} from '../repository/usersRepository.js';

export const createUser = async ({ email, password, userEmail }) => {
    try {
        const response = await createUserRepository({ email, password, userEmail });

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

export const getUserById = async (userId) => {
    const user = await getUserByIdRepository(userId);
    return user;
}

export const forgetPassword = async ({ email }) => {
    const user = await forgetPasswordRepository({ email });
    return user;
}

export const otpVerification = async ({ email, otp }) => {
    const { updatedUser, otpAccessToken } = await otpVerificationRepository({ email, otp });
    return { updatedUser, otpAccessToken };
}

export const resetPassword = async({ newPassword, userId }) => {
    const user = await resetPasswordRepository({ newPassword, userId });
    return user;
}

export const verifyEmail = async ({ email }) => {
    const emailDb = await verifyEmailRepository({ email });
    return emailDb;
}

export const emailVerifyOtp = async ({ otp, email }) => {
    const { delEmailDb, emailAccessToken } = await emailVerifyOtpRepository({ otp, email });
    return { delEmailDb, emailAccessToken };
}

export const preSignedUrl = async ({ fileType }) => {
    const { uploadUrl, fileUrl } = await preSignedUrlRepository({ fileType });
    return { uploadUrl, fileUrl };
}

export const saveProfileImg = async ({ fileUrl, userId }) => {
    const user = await saveProfileImgRepository({ fileUrl, userId });
    return user;
}

export const updateLogin = async ({ email, password }) => {
    const updateAccessToken = await updateLoginRepository({ email, password });
    return updateAccessToken;
}

export const updateUser = async ({ newEmail, newPassword, userId }) => {
    const user = await updateUserRepository({ newEmail, newPassword, userId });
    return user;
}

export const deleteLogin = async ({ email, password }) => {
    const deleteToken = await deleteLoginRepository({ email, password });
    return deleteToken;
}

export const deleteUser = async ({ userId }) => {
    const deleteUser = await deleteUserRepository({ userId });
    return deleteUser;
}

export const delProfileImg = async ({ userId }) => {
    const user = await delProfileImgRepository({ userId });
    return user;
}