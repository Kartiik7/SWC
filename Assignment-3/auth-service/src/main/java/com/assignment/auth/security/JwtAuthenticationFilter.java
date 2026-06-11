package com.assignment.auth.security;

import com.assignment.auth.service.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * ===================================================================
 * Component: JWT Authentication Filter
 * 
 * Why it exists:
 * Inspects incoming HTTP requests to locate a Bearer JWT token in the
 * Authorization header. If present and valid, it establishes authentication
 * for the request context, avoiding database checks on every subsequent endpoint request.
 * 
 * Responsibility:
 * - Intercept incoming requests (runs once per request).
 * - Read the 'Authorization' header and extract the 'Bearer ' token.
 * - Parse the token to retrieve the username.
 * - If user is not yet authenticated, load the user via UserDetailsService,
 *   verify token integrity, and load their authorities.
 * - Set the UsernamePasswordAuthenticationToken in Spring's SecurityContextHolder.
 * 
 * Interactions:
 * - Intercepts requests prior to hitting controllers.
 * - Uses JwtUtil to parse and validate tokens.
 * - Loads user details via CustomUserDetailsService.
 * - Updates the SecurityContextHolder, allowing downstream SecurityFilterChains to authorize the request.
 * ===================================================================
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // 1. Verify Authorization Header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract JWT token (starts after index 7: "Bearer ")
        jwt = authHeader.substring(7);
        
        try {
            userEmail = jwtUtil.extractUsername(jwt);
        } catch (Exception e) {
            // Token parsing failed (expired or invalid signature)
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If email is valid and SecurityContext is not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

            // 4. Validate token against username
            if (jwtUtil.isTokenValid(jwt, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 5. Store authentication in context
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 6. Forward the request down the filter chain
        filterChain.doFilter(request, response);
    }
}
