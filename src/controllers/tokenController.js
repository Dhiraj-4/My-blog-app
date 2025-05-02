import jwt from 'jsonwebtoken';
import { JWT_REFRESH_SECRET_KEY, JWT_SECRET_KEY } from '../config/serverConfig.js';

export const tokenRefreshing = async (req, res) => {

    const refreshToken = req.headers['authorization'].split(' ')[1];

    if(!refreshToken) {
        return res.status(401).json({
            message: 'FefreshToken not found',
            success: false
        });
    }

    jwt.verify(refreshToken, JWT_REFRESH_SECRET_KEY, (err, decoded) => {
        if(err) {
            return res.status(403).json({
            message: 'Invalid refresh token',
            success: false
        })};

        const newAccessToken = jwt.sign(
            {
                userId: decoded.userId,
                email: decoded.email,
                profileImg: decoded.profileImg
            },
            JWT_SECRET_KEY,
            { expiresIn: '15m' }
        );

        res.json({
            accessToken: newAccessToken
        });
    });
}