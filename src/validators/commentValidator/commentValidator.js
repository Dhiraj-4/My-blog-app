export const commentValidator = (req, res, next) => {
    
    if(req.body.text.trim() <= 1) {
        return res.status(400).json({
            message: 'Requires comment',
            success: false
        })
    }

    next();
}