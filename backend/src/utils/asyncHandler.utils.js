// Utility function to handle asynchronous route handlers
const asyncHandler = (fn) => async ()=> {
    try {
        await fn(eq, res, next)
    }
    catch (error) {
        res.status(err.status || 500).json({
            success: false,
            message: err.message || 'Server Error'
        })
    }

}

export {asyncHandler};



/* const asyncHandler = (requestHandler) => {
    (req, res, next) => {
        promise.resolve(requestHandler(req, res, next))
        .catch((err) => next(err));
    }
} */
