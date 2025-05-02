import mongoose from 'mongoose';
import { MONGO_URL } from './serverConfig.js';

export async function connectDB() {
    try {
        await mongoose.connect(MONGO_URL);
        await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
        console.log('Connected to MongoDB');
    } catch (error) {
        console.log('Failed to connect to MongoDB');
        console.log(error);
    }
}