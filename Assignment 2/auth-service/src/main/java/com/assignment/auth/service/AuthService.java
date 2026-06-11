package com.assignment.auth.service;

import com.assignment.auth.dto.AuthResponse;
import com.assignment.auth.dto.LoginRequest;
import com.assignment.auth.dto.RegisterRequest;
import com.assignment.auth.entity.User;
import com.assignment.auth.exception.AuthenticationFailedException;
import com.assignment.auth.exception.UserAlreadyExistsException;
import com.assignment.auth.repository.UserRepository;
import com.assignment.auth.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * ===================================================================
 * Component: Authentication Service Layer
 * 
 * Why it exists:
 * Encapsulates the core business logic of user registration and login.
 * Keeps controllers thin and separates security/database orchestration from presentation.
 * 
 * Responsibility:
 * - Register a new user:
 *   - Check for email uniqueness.
 *   - Securely hash password using BCrypt.
 *   - Persist to PostgreSQL database.
 *   - Issue a JWT token instantly.
 * - Login an existing user:
 *   - Validate credentials using Spring Security's AuthenticationManager.
 *   - Generate and return JWT token on success.
 *   - Throw specific exceptions on failure (duplicate email, wrong credentials).
 * 
 * Interactions:
 * - Validated DTO inputs from AuthController.
 * - Persists and queries user records via UserRepository.
 * - Encodes passwords via PasswordEncoder.
 * - Triggers authentication checks via AuthenticationManager.
 * - Issues tokens using JwtUtil.
 * ===================================================================
 */
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Registers a new user in the system.
     * 
     * @param request the registration details
     * @return AuthResponse containing generated token and user details
     */
    public AuthResponse register(RegisterRequest request) {
        // 1. Check if username/email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email '" + request.getEmail() + "' is already registered");
        }

        // 2. Encrypt the raw password
        String hashedPassword = passwordEncoder.encode(request.getPassword());

        // 3. Map request DTO to User entity and save
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(hashedPassword)
                .role(request.getRole())
                .build();

        userRepository.save(user);

        // 4. Generate JWT Token and return response
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    /**
     * Authenticates a user login attempt.
     * 
     * @param request the login credentials
     * @return AuthResponse containing generated token and user details
     */
    public AuthResponse login(LoginRequest request) {
        try {
            // 1. Authenticate credentials using the AuthenticationManager
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new AuthenticationFailedException("Invalid email or password");
        }

        // 2. Fetch user details to get their role for token payload
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AuthenticationFailedException("User record not found post-authentication"));

        // 3. Generate JWT Token
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
