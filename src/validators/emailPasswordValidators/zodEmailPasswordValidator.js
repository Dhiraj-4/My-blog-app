export const emailPasswordValidate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({ 
                email: req.body.email, 
                password: req.body.password , 
                newPassword: req.body.newPassword,
                newEmail: req.body.newEmail,
                userName: req.body.userName,
                bio: req.body.bio
            });
            next();
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                message: 'Validation failed',
                success: false,
                data: error
            })
        }
    }
}