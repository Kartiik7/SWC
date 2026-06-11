package com.assignment.auth.exception;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

/**
 * ===================================================================
 * Component: Error Details Response Schema
 * 
 * Why it exists:
 * Restructures error responses into a clean, uniform JSON model. Instead
 * of showing ugly default servlet stack traces, the client receives
 * readable timestamped error details.
 * 
 * Responsibility:
 * - Define the fields representing an API error (timestamp, main message, request path/details).
 * 
 * Interactions:
 * - Created by GlobalExceptionHandler and returned inside the body of ResponseEntity.
 * ===================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorDetails {
    private Date timestamp;
    private String message;
    private String details;
}
