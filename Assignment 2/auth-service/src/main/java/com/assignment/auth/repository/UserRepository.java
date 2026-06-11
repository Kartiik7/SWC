package com.assignment.auth.repository;

import com.assignment.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * ===================================================================
 * Component: User Repository Layer
 * 
 * Why it exists:
 * Abstracts direct database communications (SQL syntax) and provides an 
 * object-oriented interface for querying and saving User objects.
 * 
 * Responsibility:
 * - Handle SQL queries and database CRUD operations for the User entity.
 * - Provide built-in Spring Data JPA methods like save(), findById(), and delete().
 * - Expose custom query methods (like findByEmail) that are parsed into SQL queries automatically.
 * 
 * Interactions:
 * - Communicates directly with the PostgreSQL database.
 * - Injected into and called by the Service Layer (AuthService, CustomUserDetailsService).
 * ===================================================================
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find a user by their email address.
     * Used during authentication and to check for duplicate accounts during registration.
     * 
     * @param email user's email
     * @return an Optional user object
     */
    Optional<User> findByEmail(String email);
}
