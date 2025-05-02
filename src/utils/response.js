export const successResponse = ({ status, message, success, res, data }) => {
    return res.status(status).json({
        message: message,
        success: success,
        data: data
    })
}

export const errorResponse = ({ error, res }) => {
    console.log(error);
    if(error.status) {
        return res.status(error.status).json({
            message: error.message,
            success: error.success,
            error: error
        })
    }

    return res.status(500).json({
        message: 'Internal server error',
        success: false,
        error: error
    });
}