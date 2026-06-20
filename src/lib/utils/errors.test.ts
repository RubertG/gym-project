import { describe, it, expect } from 'vitest'
import { AppError, ValidationError, AuthError, NotFoundError } from './errors'

describe('AppError', () => {
    it('should create error with default values', () => {
        const error = new AppError('Test error')

        expect(error.message).toBe('Test error')
        expect(error.statusCode).toBe(500)
        expect(error.isOperational).toBe(true)
        expect(error).toBeInstanceOf(Error)
        expect(error).toBeInstanceOf(AppError)
    })

    it('should create error with custom status code', () => {
        const error = new AppError('Custom error', 418)

        expect(error.statusCode).toBe(418)
    })

    it('should create non-operational error', () => {
        const error = new AppError('System error', 500, false)

        expect(error.isOperational).toBe(false)
    })
})

describe('ValidationError', () => {
    it('should create validation error with 400 status', () => {
        const error = new ValidationError('Invalid input')

        expect(error.message).toBe('Invalid input')
        expect(error.statusCode).toBe(400)
        expect(error.isOperational).toBe(true)
        expect(error).toBeInstanceOf(AppError)
    })
})

describe('AuthError', () => {
    it('should create auth error with default message', () => {
        const error = new AuthError()

        expect(error.message).toBe('Unauthorized')
        expect(error.statusCode).toBe(401)
        expect(error.isOperational).toBe(true)
    })

    it('should create auth error with custom message', () => {
        const error = new AuthError('Token expired')

        expect(error.message).toBe('Token expired')
        expect(error.statusCode).toBe(401)
    })
})

describe('NotFoundError', () => {
    it('should create not found error with default resource', () => {
        const error = new NotFoundError()

        expect(error.message).toBe('Resource not found')
        expect(error.statusCode).toBe(404)
        expect(error.isOperational).toBe(true)
    })

    it('should create not found error with custom resource', () => {
        const error = new NotFoundError('Routine')

        expect(error.message).toBe('Routine not found')
        expect(error.statusCode).toBe(404)
    })
})
