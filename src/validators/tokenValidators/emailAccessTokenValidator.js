
import jwt from 'jsonwebtoken';
import { JWT_EMAIL_KEY } from '../../config/serverConfig.js';

export const emailAccessTokenValidator = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, JWT_EMAIL_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).json({
                message: 'Invalid or expired access token',
                success: false
            });
        }
        req.user = decoded;
        next();
    })
}