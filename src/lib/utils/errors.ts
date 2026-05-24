export class AppError extends Error {
    public readonly statusCode: number;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        const ErrorConstructor = Error as unknown as {
            captureStackTrace?: (error: Error, constructor: unknown) => void;
        };

        if (typeof ErrorConstructor.captureStackTrace === 'function') {
            ErrorConstructor.captureStackTrace(this, this.constructor);
        }
    }
}

export class ValidationError extends AppError {
    constructor(message: string) {
        super(message, 400, true);
    }
}

export class AuthError extends AppError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401, true);
    }
}

export class NotFoundError extends AppError {
    constructor(resource: string = 'Resource') {
        super(`${resource} not found`, 404, true);
    }
}
