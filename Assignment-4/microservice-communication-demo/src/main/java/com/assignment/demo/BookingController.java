package com.assignment.demo;

import com.assignment.demo.dto.BookingResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller exposing endpoints for the Booking Service.
 * Demonstrates reading headers injected by the API Gateway.
 */
@RestController
@RequestMapping("/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    /**
     * Creates a ticket booking.
     * 
     * @param movieId ID of the movie
     * @param seats Number of seats to book
     * @param authenticatedUser Email/Username of the user. 
     *                          This header is injected by the Gateway's JwtValidationFilter!
     */
    @PostMapping("/create")
    public ResponseEntity<BookingResponse> createBooking(
            @RequestParam Long movieId,
            @RequestParam Integer seats,
            @RequestHeader(value = "X-Auth-User", defaultValue = "unknown-user@test.com") String authenticatedUser) {

        System.out.println("Processing booking request for user: " + authenticatedUser);
        
        BookingResponse response = bookingService.createBooking(movieId, seats, authenticatedUser);
        return ResponseEntity.ok(response);
    }
}
