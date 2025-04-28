export const validate = (schema) => {
    return async (req, res, next) => {
        try {
            console.log(req.body);
            schema.parse({ email: req.body.email, password: req.body.password });
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