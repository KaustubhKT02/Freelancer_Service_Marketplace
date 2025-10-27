// Custom API Error class to standardize error handling across the application
class apiError extends Error {
    constructor(statusCode,
        message= 'Something went wrong',
        error = [],
        stack = ''

    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.error = error;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constroctor);

        }
}
}

export {apiError};