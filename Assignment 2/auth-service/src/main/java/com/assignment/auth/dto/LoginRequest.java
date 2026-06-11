package com.assignment.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ===================================================================
 * Component: Login Request Data Transfer Object (DTO)
 * 
 * Why it exists:
 * Enforces the structure and validation of the login payload sent by clients.
 * Protects internal services from receiving malformed credentials.
 * 
 * Responsibility:
 * - Capture user email and password for authentication.
 * - Verify the credentials conform to basic format constraints prior to authentication.
 * 
 * Interactions:
 * - Received by AuthController's login endpoint.
 * - Validated by Spring Web using @Valid.
 * - Passed to AuthService to attempt authentication and generate a JWT token.
 * ===================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginRequest {

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email format")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;
}
