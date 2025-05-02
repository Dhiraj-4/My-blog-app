export const fileTypeValidator = async (req, res, next) => {
    
    const fileType = req.body.fileType;
    if (fileType !== 'image/png' && fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
        return res.status(400).json({
            message: 'File type is invalid',
            success: false
        });
    }

    next();
};
