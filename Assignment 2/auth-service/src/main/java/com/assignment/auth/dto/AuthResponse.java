package com.assignment.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ===================================================================
 * Component: Auth Response Data Transfer Object (DTO)
 * 
 * Why it exists:
 * Wraps the security tokens and core user properties returned to the client 
 * upon successful registration or authentication.
 * 
 * Responsibility:
 * - Return the generated JWT access token.
 * - Return user profile metadata (like email, roles) so the client's UI
 *   can configure menus/views without parsing the JWT claims manually.
 * 
 * Interactions:
 * - Constructed by AuthService and returned by AuthController.
 * - Read by clients (frontend, Postman) to attach authorization headers for subsequent requests.
 * ===================================================================
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;
    private String email;
    private String role;
}
