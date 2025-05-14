
import jwt from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '../../config/serverConfig.js';
import { Users } from '../../schema/users.js';

export const accessTokenValidator = async (req, res, next) => {

    const authHeader = req.headers['authorization'];
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            message: 'Access token missing or malformed',
            success: false
        });
    }
    const accessToken = authHeader.split(' ')[1];

    jwt.verify(accessToken, JWT_SECRET_KEY, async (err, decoded) => {
        if(err) {
            return res.status(403).json({
                message: 'Invalid or expired access token',
                success: false
            });
        }
        const user = await Users.findById(decoded.userId);
        if (!user) {
            return res.status(403).json({
                message: 'Invalid token. User not found.',
                success: false
            })
        }
        req.user = decoded;
        next();
    })
}