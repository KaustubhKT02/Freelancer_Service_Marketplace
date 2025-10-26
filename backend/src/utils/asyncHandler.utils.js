// Utility function to handle asynchronous route handlers
const asyncHandler = (fn) => async (req, res, next)=> {
    try {
        await fn(req, res, next)
    }
    catch (err) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message || 'Server Error'
        })
    }

}

export {asyncHandler};



/* const asyncHandler = (requestHandler) => {
    (req, res, next) => {
       return Promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
} */
