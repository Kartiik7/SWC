package com.assignment.auth.config;

import com.assignment.auth.security.JwtAuthenticationFilter;
import com.assignment.auth.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * ===================================================================
 * Component: Security Configuration
 * 
 * Why it exists:
 * Centralizes authentication and authorization rules for the entire application.
 * Disables default security settings and sets up stateless, JWT-based security.
 * 
 * Responsibility:
 * - Define PasswordEncoder (BCrypt) bean for secure password hashing.
 * - Configure AuthenticationManager bean to validate user login requests.
 * - Establish a custom SecurityFilterChain:
 *   - Disable CSRF (Cross-Site Request Forgery) since JWT handles security and requests are stateless.
 *   - Configure REST endpoints: permit public access to /auth/** (register/login) and require auth for everything else.
 *   - Enforce Stateless Session Policy (no HTTP Sessions are created/stored).
 *   - Bind the JwtAuthenticationFilter before Spring's UsernamePasswordAuthenticationFilter.
 * - Enable @EnableMethodSecurity to allow role-based checks via annotations (@PreAuthorize).
 * 
 * Interactions:
 * - Wired with CustomUserDetailsService for database credentials querying.
 * - Injects the JwtAuthenticationFilter to intercept and authorize incoming HTTP requests.
 * ===================================================================
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Activates method-level security for RBAC using @PreAuthorize
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, 
                          CustomUserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Configures the main HTTP security filter chain.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF since we do not use cookie-based sessions
            .csrf(AbstractHttpConfigurer::disable)
            
            // 2. Configure endpoint authorization rules
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/auth/**").permitAll() // Public routes (Signup, Login)
                    .anyRequest().authenticated()           // All other routes require a valid JWT
            )
            
            // 3. Set sessions to stateless
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // 4. Inject DAO authentication provider
            .authenticationProvider(authenticationProvider())
            
            // 5. Add custom JWT filter prior to standard username/password authentication filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configures the AuthenticationProvider containing details on how to
     * retrieve credentials from the database and verify them with password hashing.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Declares the BCrypt Password Encoder bean.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Exposes the AuthenticationManager bean to be utilized in AuthService.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }
}
