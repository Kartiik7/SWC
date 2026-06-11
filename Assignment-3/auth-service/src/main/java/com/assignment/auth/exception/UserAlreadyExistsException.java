package com.assignment.auth.exception;

/**
 * ===================================================================
 * Component: User Already Exists Exception
 * 
 * Why it exists:
 * Provides a semantic, domain-specific exception to indicate registration conflicts.
 * Rather than generic exceptions, custom exceptions clarify error sources.
 * 
 * Responsibility:
 * - Carry the error message when a client attempts registration with a taken email.
 * 
 * Interactions:
 * - Instantiated and thrown in the Service Layer (AuthService) during signup validation.
 * - Caught and resolved into a 409 Conflict status by GlobalExceptionHandler.
 * ===================================================================
 */
public class UserAlreadyExistsException extends RuntimeException {
    
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}
