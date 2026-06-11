package com.assignment.gateway.config;

import com.assignment.gateway.filter.JwtValidationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Programmatic Route Configuration using Spring Cloud Gateway's Fluent Java API.
 * This class serves as an alternative to configuration in application.yml.
 * In a real-world system, developers use either YAML or Java config.
 * Including this demonstrates an understanding of Java DSL routing.
 */
@Configuration
public class GatewayConfig {

    @Autowired
    private JwtValidationFilter jwtFilter;

    @Bean
    public RouteLocator routes(RouteLocatorBuilder builder) {
        return builder.routes()
                // 1. Auth Service Route: Public access
                .route("auth-service-route", r -> r.path("/auth/**")
                        .uri("http://localhost:8081"))
                
                // 2. Movie Service Route: Requires JWT Validation
                .route("movie-service-route", r -> r.path("/movies/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtValidationFilter.Config())))
                        .uri("http://localhost:8082"))
                
                // 3. Booking Service Route: Requires JWT Validation
                .route("booking-service-route", r -> r.path("/booking/**")
                        .filters(f -> f.filter(jwtFilter.apply(new JwtValidationFilter.Config())))
                        .uri("http://localhost:8083"))
                
                .build();
    }
}
