import mongoose from "mongoose"

export const mongoIdValidator = (req, res, next) => {

    const isValid = mongoose.isValidObjectId(req.params.id);

    if(!isValid) {
        return res.status(400).json({
            message: 'Invalid id',
            success: false
        });
    }

    next();
}