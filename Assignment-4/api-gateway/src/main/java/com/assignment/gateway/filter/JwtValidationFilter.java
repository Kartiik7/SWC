package com.assignment.gateway.filter;

import com.assignment.gateway.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilter;
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.http.server.reactive.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * Route-specific filter to intercept incoming requests and validate JWT tokens.
 * Apply this filter to routes that require authentication (like Movie and Booking services).
 */
@Component
public class JwtValidationFilter extends AbstractGatewayFilterFactory<JwtValidationFilter.Config> {

    @Autowired
    private JwtUtil jwtUtil;

    public JwtValidationFilter() {
        super(Config.class);
    }

    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            ServerHttpRequest request = exchange.getRequest();

            // 1. Check if Authorization header is present
            if (!request.getHeaders().containsKey(HttpHeaders.AUTHORIZATION)) {
                return onError(exchange, "Missing Authorization Header", HttpStatus.UNAUTHORIZED);
            }

            // 2. Extract Bearer Token
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return onError(exchange, "Invalid Authorization Header Format", HttpStatus.UNAUTHORIZED);
            }

            String token = authHeader.substring(7);

            // 3. Validate Token
            if (!jwtUtil.validateToken(token)) {
                return onError(exchange, "Invalid or Expired JWT Token", HttpStatus.UNAUTHORIZED);
            }

            // 4. Token is valid. Extract subject/claims and enrich headers.
            // Downstream microservices can read these headers instead of parsing the JWT again!
            Claims claims = jwtUtil.getClaims(token);
            ServerHttpRequest mutatedRequest = request.mutate()
                    .header("X-Auth-User", claims.getSubject())
                    .header("X-Auth-Roles", claims.get("roles", String.class))
                    .build();

            // 5. Forward the request with the mutated headers down the pipeline
            return chain.filter(exchange.mutate().request(mutatedRequest).build());
        };
    }

    /**
     * Standard reactive error handler helper to return JSON responses instead of generic HTML.
     */
    private Mono<Void> onError(ServerWebExchange exchange, String errMessage, HttpStatus httpStatus) {
        ServerHttpResponse response = exchange.getResponse();
        response.setStatusCode(httpStatus);
        response.getHeaders().setContentType(MediaType.APPLICATION_JSON);

        // Standard JSON Error Body
        String body = String.format(
                "{\"status\": %d, \"error\": \"%s\", \"message\": \"%s\", \"timestamp\": \"%s\"}",
                httpStatus.value(),
                httpStatus.getReasonPhrase(),
                errMessage,
                new java.util.Date()
        );

        byte[] bytes = body.getBytes(java.nio.charset.StandardCharsets.UTF_8);
        return response.writeWith(Mono.just(response.bufferFactory().wrap(bytes)));
    }

    // Config class to support any runtime filter configuration arguments if needed
    public static class Config {
        // Can add fields like role requirement validation (e.g. String requiredRole) if needed.
    }
}
