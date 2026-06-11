package com.assignment.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

/**
 * A Global Filter that executes for EVERY request passing through the gateway.
 * Demonstrates centralized logging and request profiling.
 */
@Component
public class GlobalLoggingFilter implements GlobalFilter, Ordered {

    private static final Logger logger = LoggerFactory.getLogger(GlobalLoggingFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        long startTime = System.currentTimeMillis();
        String path = exchange.getRequest().getPath().toString();
        String method = exchange.getRequest().getMethod().name();
        
        // Retrieve and check authorization headers status
        boolean hasAuthHeader = exchange.getRequest().getHeaders().containsKey(HttpHeaders.AUTHORIZATION);

        // Pre-routing Logging
        logger.info("=== GLOBAL PRE-FILTER LOG ===");
        logger.info("Incoming Request: [Method: {}] | [Path: {}]", method, path);
        logger.info("Headers - Contains Authorization: {}", hasAuthHeader);

        // Continue filter chain and register a post-routing log callback
        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long duration = System.currentTimeMillis() - startTime;
            int statusCode = 200; // default/fallback if null
            if (exchange.getResponse().getStatusCode() != null) {
                statusCode = exchange.getResponse().getStatusCode().value();
            }
            // Post-routing Logging
            logger.info("=== GLOBAL POST-FILTER LOG ===");
            logger.info("Outgoing Response: [Path: {}] | [Status: {}] | [Latency: {}ms]", path, statusCode, duration);
        }));
    }

    /**
     * Determines the execution order.
     * Lower values execute first in the pre-phase and last in the post-phase.
     */
    @Override
    public int getOrder() {
        return Ordered.HIGHEST_PRECEDENCE;
    }
}
