import { sendError } from '../utils/response.js';

/**
 * Global Error Handling Middleware
 */
export const globalErrorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return sendError(res, err.statusCode, err.message, err.stack);
    } else {
        // Operational, trusted error: send message to client
        if (err.isOperational) {
            return sendError(res, err.statusCode, err.message);
        }
        
        // Programming or other unknown error: don't leak error details
        console.error('ERROR 💥', err);
        return sendError(res, 500, 'Something went very wrong!');
    }
};
