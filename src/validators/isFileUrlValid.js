import axios from "axios"

export const isFileUrlValid = async (req, res, next) => {
    try {
        const response = await axios.head(req.body.fileUrl);

        console.log('this is what response from isFileUrlValid holds: ', response)
        if(response.status == 200) {
            next();
        } else {
            return res.status(400).json({
                message: 'Invalid file url',
                success: false,
                fileUrl: req.body.fileUrl
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: 'something went wrong',
            success: false,
            fileUrl: req.body.fileUrl
        })
    }
}