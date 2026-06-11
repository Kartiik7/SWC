package com.assignment.auth.dto;

import com.assignment.auth.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ===================================================================
 * Component: Register Request Data Transfer Object (DTO)
 * 
 * Why it exists:
 * Decouples the API request payload from the internal database entity.
 * It ensures we only expose required fields for signup and provides a place
 * to define request validation constraints without polluting the User entity.
 * 
 * Responsibility:
 * - Capture incoming registration payload (name, email, password, role).
 * - Enforce validation constraints (non-blank fields, email format, minimum password length).
 * 
 * Interactions:
 * - Passed into AuthController's register endpoint.
 * - Validated by Spring Web's validation filter using @Valid.
 * - Read by AuthService to build a User entity for persistence.
 * ===================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be a valid email format")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotNull(message = "Role is required (USER, THEATRE_OWNER, ADMIN)")
    private Role role;
}
