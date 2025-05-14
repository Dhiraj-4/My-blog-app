import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is up on ${PORT}`);
});

export const AWS_BUCKET_NAME = process.env.AWS_BUCKET_NAME;

export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;

export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

export const AWS_REGION = process.env.AWS_REGION;

export const MONGO_URL = process.env.MONGO_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

export const JWT_REFRESH_SECRET_KEY = process.env.JWT_REFRESH_SECRET_KEY;

export const MY_MAIL = process.env.MY_MAIL;

export const APP_PASSWORD = process.env.APP_PASSWORD;

export const JWT_OTP_KEY = process.env.JWT_OTP_KEY;

export const JWT_EMAIL_KEY = process.env.JWT_EMAIL_KEY;

export const JWT_UPDATE_KEY = process.env.JWT_UPDATE_KEY;

export const JWT_DELETE_KEY = process.env.JWT_DELETE_KEY;