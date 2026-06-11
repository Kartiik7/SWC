package com.assignment.gateway.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

/**
 * Fallback Controller for handling downstream service failures gracefully.
 * In microservices, when a downstream service is slow or offline,
 * the gateway can trigger a circuit breaker fallback to return a friendly response.
 */
@RestController
@RequestMapping("/fallback")
public class GatewayFallbackController {

    @GetMapping("/auth")
    public Mono<ResponseEntity<Map<String, Object>>> authServiceFallback() {
        return Mono.just(createFallbackResponse("Auth Service"));
    }

    @GetMapping("/movies")
    public Mono<ResponseEntity<Map<String, Object>>> movieServiceFallback() {
        return Mono.just(createFallbackResponse("Movie Service"));
    }

    @GetMapping("/booking")
    public Mono<ResponseEntity<Map<String, Object>>> bookingServiceFallback() {
        return Mono.just(createFallbackResponse("Booking Service"));
    }

    private ResponseEntity<Map<String, Object>> createFallbackResponse(String serviceName) {
        Map<String, Object> body = new HashMap<>();
        body.put("status", HttpStatus.SERVICE_UNAVAILABLE.value());
        body.put("error", "Service Unavailable");
        body.put("message", serviceName + " is currently unavailable. Please try again later.");
        body.put("timestamp", new java.util.Date());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }
}
