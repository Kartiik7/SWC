package com.assignment.gateway.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

/**
 * Security configuration for the API Gateway in a reactive (WebFlux) environment.
 * In Spring Cloud Gateway, traditional servlet-based Spring Security config does not work.
 * Instead, WebFlux-specific ServerHttpSecurity must be used.
 */
@Configuration
@EnableWebFluxSecurity
public class WebSecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {
        return http
                // Disable CSRF (Cross-Site Request Forgery) since microservices use stateless JWT tokens
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                
                // Configure request authorization
                .authorizeExchange(exchanges -> exchanges
                        // Public endpoints (Auth service login, registration, etc.)
                        .pathMatchers("/auth/**").permitAll()
                        
                        // All other service routes (/movies/**, /booking/**) will require authentication.
                        // In this demo, we delegate JWT token validation directly to our custom 'JwtValidationFilter'
                        // which is applied at the route level in the gateway configuration.
                        .pathMatchers("/movies/**", "/booking/**").permitAll() 
                        
                        // Fallback security matchers
                        .anyExchange().authenticated()
                )
                .build();
    }
}
