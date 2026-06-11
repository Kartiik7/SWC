package com.assignment.auth.controller;

import com.assignment.auth.dto.AuthResponse;
import com.assignment.auth.dto.LoginRequest;
import com.assignment.auth.dto.RegisterRequest;
import com.assignment.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * ===================================================================
 * Component: Authentication Controller Layer
 * 
 * Why it exists:
 * Exposes the public REST endpoints for user authentication. It acts as the 
 * entry point for client requests related to account management (sign up & login).
 * 
 * Responsibility:
 * - Define request pathways and HTTP verbs (POST /auth/register, POST /auth/login).
 * - Enforce validation checking using @Valid prior to executing controller logic.
 * - Map client requests to service executions and formulate response entities.
 * 
 * Interactions:
 * - Receives requests from clients (Postman, Frontend).
 * - Delegates validation errors to GlobalExceptionHandler if validation fails.
 * - Invokes AuthService to execute registration and credential verification.
 * - Returns the JWT Token enclosed inside AuthResponse back to the client.
 * ===================================================================
 */
@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * Endpoint for user registration.
     * Accessible by anyone (permitAll in SecurityConfig).
     * 
     * @param request the signup information, validated using annotations
     * @return the token response and HTTP 201 Created status
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Endpoint for user authentication.
     * Accessible by anyone (permitAll in SecurityConfig).
     * 
     * @param request the login credentials, validated using annotations
     * @return the token response and HTTP 200 OK status
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
}
