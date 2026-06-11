package com.assignment.auth.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ===================================================================
 * Component: User Entity
 * 
 * Why it exists:
 * Serves as the Object-Relational Mapping (ORM) layer representing the 'users' table in PostgreSQL.
 * Enables the application to interact with database records as structured Java objects.
 * 
 * Responsibility:
 * - Define the schema columns: id, name, email, password, and role.
 * - Set database constraints (e.g., unique email, non-null fields, role mapped as Enum String).
 * 
 * Interactions:
 * - Created/Updated by the Service Layer (AuthService) using input DTOs.
 * - Queried and persisted by the Repository Layer (UserRepository).
 * - Loaded by UserDetailsService to build the Spring Security UserDetails representation.
 * ===================================================================
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
}
