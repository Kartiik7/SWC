package com.assignment.demo;

import com.assignment.demo.dto.MovieDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Service client demonstrating inter-service communication (Booking Service -> Movie Service).
 * In microservices, services often need to call each other to fetch relative data.
 * This class implements both WebClient (Reactive) and RestTemplate (Blocking) approaches.
 */
@Component
public class MovieClient {

    private final String MOVIE_SERVICE_URL = "http://localhost:8082/movies/";

    // 1. Classical Way: RestTemplate (Blocking, Synchronous HTTP Client)
    @Autowired
    private RestTemplate restTemplate;

    // 2. Modern Way: WebClient (Reactive, Non-Blocking HTTP Client)
    @Autowired
    private WebClient.Builder webClientBuilder;

    /**
     * Method using REST TEMPLATE (Blocking).
     * The thread blocks and waits until the response arrives from Movie Service.
     * Use case: Legacy applications or non-reactive servlet-based services.
     */
    public MovieDTO getMovieDetailsUsingRestTemplate(Long movieId) {
        String url = MOVIE_SERVICE_URL + movieId;
        try {
            // Synchronous call
            return restTemplate.getForObject(url, MovieDTO.class);
        } catch (Exception e) {
            System.err.println("Error calling Movie Service via RestTemplate: " + e.getMessage());
            return null; // or throw custom exception
        }
    }

    /**
     * Method using WEBCLIENT (Reactive/Non-blocking).
     * The executing thread does not block; it registers a callback and continues work.
     * Returns a Mono publisher which will emit the MovieDTO asynchronously.
     * Use case: High-performance, reactive systems (WebFlux).
     */
    public Mono<MovieDTO> getMovieDetailsUsingWebClient(Long movieId) {
        String url = MOVIE_SERVICE_URL + movieId;
        
        return webClientBuilder.build()
                .get()
                .uri(url)
                .retrieve()
                // Handle 4xx or 5xx status codes gracefully
                .onStatus(status -> status.isError(), clientResponse -> {
                    System.err.println("Movie Service returned error: " + clientResponse.statusCode());
                    return Mono.empty();
                })
                .bodyToMono(MovieDTO.class)
                .onErrorResume(e -> {
                    System.err.println("WebClient error connecting to Movie Service: " + e.getMessage());
                    return Mono.empty(); // return empty Mono fallback on connection failure
                });
    }
}
