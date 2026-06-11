package com.assignment.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Data Transfer Object representing the completed Booking confirmation details.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private String bookingId;
    private Long movieId;
    private String movieTitle;
    private Integer seats;
    private Double totalAmount;
    private String bookingStatus;
    private LocalDateTime bookingTime;
    private String userEmail;
}
