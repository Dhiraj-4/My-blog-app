import mongoose from "mongoose";


const emailVerificationSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    otp: {
        type: String,
        default: null
    },
    expiresAt: {
        type: String,
        default: null
    }
});

export const emailVerification = mongoose.model('emailVerification', emailVerificationSchema);