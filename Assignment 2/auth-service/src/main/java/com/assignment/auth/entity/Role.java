package com.assignment.auth.entity;

/**
 * ===================================================================
 * Component: Role Enumeration
 * 
 * Why it exists:
 * Restricts the user roles to a pre-defined set of values (USER, THEATRE_OWNER, ADMIN),
 * ensuring data integrity and type safety across the database and security layers.
 * 
 * Responsibility:
 * - Define the valid roles permitted in the system.
 * - Map to the database as strings/ordinals and map to Spring Security's GrantedAuthority.
 * 
 * Interactions:
 * - Declared inside the User entity to enforce DB constraints.
 * - Inspected by DTO validators (RegisterRequest) during registration.
 * - Used by CustomUserDetailsService and SecurityConfig to enforce RBAC rules.
 * ===================================================================
 */
public enum Role {
    USER,
    THEATRE_OWNER,
    ADMIN
}
