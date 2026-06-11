package com.assignment.demo;

import com.assignment.demo.dto.BookingResponse;
import com.assignment.demo.dto.MovieDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service demonstrating the business logic that requires communication with another service.
 * When booking a ticket, the Booking Service needs information (existence, availability, price)
 * from the Movie Service to complete the operation.
 */
@Service
public class BookingService {

    @Autowired
    private MovieClient movieClient;

    /**
     * Creates a movie booking by fetching movie details from the Movie Service.
     * Uses the RestTemplate (blocking) approach for simplicity in standard business flow.
     */
    public BookingResponse createBooking(Long movieId, Integer seats, String userEmail) {
        // 1. Fetch movie details from Movie Service using RestTemplate
        MovieDTO movie = movieClient.getMovieDetailsUsingRestTemplate(movieId);

        // 2. Perform business validations
        if (movie == null) {
            throw new IllegalArgumentException("Movie details could not be retrieved. Booking failed.");
        }
        if (!movie.getIsAvailable()) {
            throw new IllegalStateException("Movie is not currently available for booking.");
        }

        // 3. Compute total price
        double totalAmount = movie.getPrice() * seats;

        // 4. Simulate saving to the Booking Database
        String bookingId = UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        // 5. Construct and return final Response
        return BookingResponse.builder()
                .bookingId(bookingId)
                .movieId(movieId)
                .movieTitle(movie.getTitle())
                .seats(seats)
                .totalAmount(totalAmount)
                .bookingStatus("CONFIRMED")
                .bookingTime(LocalDateTime.now())
                .userEmail(userEmail)
                .build();
    }
}
