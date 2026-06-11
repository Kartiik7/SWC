package com.assignment.auth.exception;

/**
 * ===================================================================
 * Component: Authentication Failed Exception
 * 
 * Why it exists:
 * Provides a semantic, domain-specific exception to represent login failures, 
 * shielding the client from internal Spring Security exceptions.
 * 
 * Responsibility:
 * - Carry the error message when authentication fails (bad credentials).
 * 
 * Interactions:
 * - Thrown in the Service Layer (AuthService) during login credential checks.
 * - Caught and resolved into a 401 Unauthorized status by GlobalExceptionHandler.
 * ===================================================================
 */
public class AuthenticationFailedException extends RuntimeException {

    public AuthenticationFailedException(String message) {
        super(message);
    }
}
