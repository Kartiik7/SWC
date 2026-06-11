package com.assignment.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * ===================================================================
 * Component: Dashboard Controller (Protected Routes)
 * 
 * Why it exists:
 * Demonstrates Role-Based Access Control (RBAC) across different REST endpoints.
 * It showcases how Spring Security restricts API access depending on the logged-in user's roles.
 * 
 * Responsibility:
 * - Define paths for protected admin, owner, and user operations.
 * - Restrict access using method-level security annotations (@PreAuthorize).
 * - Retrieve details about the authenticated principal directly from the security context.
 * 
 * Interactions:
 * - Intercepted by JwtAuthenticationFilter to set the SecurityContext.
 * - Authorized by SecurityConfig and method security interceptors.
 * - Access is denied (returning 403 Forbidden) if the user's role is insufficient.
 * ===================================================================
 */
@RestController
public class DashboardController {

    /**
     * Endpoint restricted to ADMIN role.
     * Route: GET /admin/dashboard
     */
    @GetMapping("/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> getAdminDashboard(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Welcome to the ADMIN Dashboard!");
        response.put("authorizedUser", authentication.getName());
        response.put("grantedAuthorities", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint restricted to THEATRE_OWNER role.
     * Route: GET /owner/dashboard
     */
    @GetMapping("/owner/dashboard")
    @PreAuthorize("hasRole('THEATRE_OWNER')")
    public ResponseEntity<Map<String, Object>> getOwnerDashboard(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Welcome to the THEATRE OWNER Dashboard!");
        response.put("authorizedUser", authentication.getName());
        response.put("grantedAuthorities", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }

    /**
     * Endpoint accessible by any authenticated user (USER, THEATRE_OWNER, or ADMIN).
     * Route: GET /user/profile
     */
    @GetMapping("/user/profile")
    @PreAuthorize("hasAnyRole('USER', 'THEATRE_OWNER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getUserProfile(Authentication authentication) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Profile retrieved successfully");
        response.put("email", authentication.getName());
        response.put("role", authentication.getAuthorities());
        return ResponseEntity.ok(response);
    }
}
