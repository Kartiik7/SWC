package com.assignment.auth.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * ===================================================================
 * Component: Global Exception Handler (Controller Advice)
 * 
 * Why it exists:
 * Keeps controllers clean by extracting error-handling logic out of API endpoints.
 * Intercepts any thrown exceptions application-wide and standardizes response payloads.
 * 
 * Responsibility:
 * - Handle custom exceptions: UserAlreadyExistsException (409 Conflict) and AuthenticationFailedException (401 Unauthorized).
 * - Handle input validation exceptions (MethodArgumentNotValidException) to return a map of validation errors (400 Bad Request).
 * - Handle all unhandled system exceptions (500 Internal Server Error) to hide internal server details.
 * 
 * Interactions:
 * - Wraps errors thrown in any Controller, Service, or Repository layer.
 * - Formulates the HTTP response entity sent back to the API client.
 * ===================================================================
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * Handle UserAlreadyExistsException (Conflict - 409).
     */
    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<ErrorDetails> handleUserAlreadyExistsException(UserAlreadyExistsException ex, WebRequest request) {
        ErrorDetails errorDetails = ErrorDetails.builder()
                .timestamp(new Date())
                .message(ex.getMessage())
                .details(request.getDescription(false))
                .build();
        return new ResponseEntity<>(errorDetails, HttpStatus.CONFLICT);
    }

    /**
     * Handle AuthenticationFailedException (Unauthorized - 401).
     */
    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ErrorDetails> handleAuthenticationFailedException(AuthenticationFailedException ex, WebRequest request) {
        ErrorDetails errorDetails = ErrorDetails.builder()
                .timestamp(new Date())
                .message(ex.getMessage())
                .details(request.getDescription(false))
                .build();
        return new ResponseEntity<>(errorDetails, HttpStatus.UNAUTHORIZED);
    }

    /**
     * Handle Validation Failures (@Valid annotation checks - Bad Request - 400).
     * Compiles all validation errors from RegisterRequest or LoginRequest.
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    /**
     * Fallback for any other internal server errors (Internal Server Error - 500).
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorDetails> handleGlobalException(Exception ex, WebRequest request) {
        ErrorDetails errorDetails = ErrorDetails.builder()
                .timestamp(new Date())
                .message("An unexpected error occurred: " + ex.getMessage())
                .details(request.getDescription(false))
                .build();
        return new ResponseEntity<>(errorDetails, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
