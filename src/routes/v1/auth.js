import express from 'express';
import { createUser, deleteLogin, deleteUser, delProfileImg, emailVerifyOtp, 
    forgetPassword, getAllUsers,getUserById, loginUser, otpVerification, preSignedUrl, 
    resetPassword,saveProfileImg, updateLogin, updateUser, verifyEmail 
    } from '../../controllers/usersController.js';
import { registerSchema } from '../../validators/emailPasswordValidators/zodEmailPasswordSchema.js';
import { emailPasswordValidate } from '../../validators/emailPasswordValidators/zodEmailPasswordValidator.js';
import { tokenRefreshing } from '../../controllers/tokenController.js';
import { accessTokenValidator } from '../../validators/tokenValidators/accessTokenValidator.js';
import { zodEmailSchema } from '../../validators/emailPasswordValidators/zodEmailSchema.js';
import { otpAccessTokenValidator } from './../../validators/tokenValidators/otpAccessTokenValidator.js';
import { zodPasswordSchema } from '../../validators/emailPasswordValidators/zodPasswordSchema.js';
import { emailAccessTokenValidator } from '../../validators/tokenValidators/emailAccessTokenValidator.js';
import { fileTypeValidator } from '../../validators/fileTypeValidator.js';
import { isFileUrlValid } from '../../validators/isFileUrlValid.js';
import { updateAccessTokenValidator } from '../../validators/tokenValidators/updateAccessTokenValidator.js';
import { newEmailPasswordSchema } from '../../validators/emailPasswordValidators/newEmailPasswordSchema.js';
import { deleteTokenValidator } from './../../validators/tokenValidators/deleteTokenValidator.js';

const router = express.Router();

//expects email and sends a otp for verification, cleared
router.get('/email-verify', emailPasswordValidate(zodEmailSchema), verifyEmail);

//expects email and otp, verifies the otp and returns emailAccessToken, cleared
router.put('/email-verify-otp', emailPasswordValidate(zodEmailSchema), emailVerifyOtp);

//expects email, password and emailAccessToken for signing up, cleared
router.post(
    '/signup', 
    emailAccessTokenValidator, 
    emailPasswordValidate(registerSchema), 
    createUser
);

//expects email and password, verifies email and password,
//returns refreshToken and accessToken, cleared
router.post('/login', emailPasswordValidate(registerSchema), loginUser);

//expects email, sends otp to email, cleared
router.get(
    '/forgetpassword', 
    emailPasswordValidate(zodEmailSchema), 
    forgetPassword
);

//expects email and otp, verifies otp, returns otpAccessToken, cleared
router.post(
    '/otp-verification', 
    emailPasswordValidate(zodEmailSchema), 
    otpVerification
);

//expects otpAccessToken and newPassword, resets the password to newPassword, cleared
router.post(
    '/resetPassword', 
    otpAccessTokenValidator, 
    emailPasswordValidate(zodPasswordSchema), 
    resetPassword
);

//expects refreshToken, returns accessToken, cleared
router.post('/refresh', tokenRefreshing);

//expects accessToken, returns all users, cleared
router.get('/users', accessTokenValidator, getAllUsers);

//expects accessToken, fileType, returns pre-signed URL, cleared
router.post(
    '/users/profileImg-upload-url',
    accessTokenValidator, 
    fileTypeValidator, 
    preSignedUrl);

//expects accessToken, fileUrl, save the fileUrl in db user => profileImg, cleared
router.put('/users/profileImg', accessTokenValidator, isFileUrlValid, saveProfileImg);

//expects accessToken(for access and userId),
//deletes the profileImg of the user, cleared
router.delete(
    '/users/profileImg',
    accessTokenValidator,
    delProfileImg
)

//expects email, password and accessToken, 
//returns updateAccessToken that allows user
//to update user, email and password, cleared
router.post(
    '/users/updateLogin', 
    accessTokenValidator, 
    emailPasswordValidate(registerSchema),
    updateLogin
);

//expects newEmail, newPassword and updateAccessToken,
//updates the user with given details, cleared
router.put(
    '/users/updateUser',
    updateAccessTokenValidator,
    emailPasswordValidate(newEmailPasswordSchema),
    updateUser
);

//expects accessToken, for user, cleared
router.get('/users/me', accessTokenValidator, getUserById);

//expects accessToken, email and password to verify user, returns deleteToken
router.post(
    '/delLogin',
    accessTokenValidator, 
    emailPasswordValidate(registerSchema),
    deleteLogin
);

//expects deleteToken(for access and fetch blogs),
//deletes all user's blogs and then user
router.delete(
    '/delUser',
    deleteTokenValidator,
    deleteUser
) 

export default router;