export const zodBlogValidator =(schema) => {
    return (req, res, next) => {
        try {
            schema.parse({ 
                title: req.body.title, 
                content: req.body.content,
                authorName: req.body.authorName,
                tags: req.body.tags
            });
            next();
        } catch (error) {
            console.log("Validation error: ", error);
            return res.status(400).json({
                message: 'Validation failed',
                success: false,
                error: error
            });
        }
    }
}