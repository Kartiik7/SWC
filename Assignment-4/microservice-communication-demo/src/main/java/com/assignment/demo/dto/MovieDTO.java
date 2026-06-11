package com.assignment.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object representing Movie details.
 * This class is used to map responses received from the Movie Microservice.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MovieDTO {
    private Long id;
    private String title;
    private String genre;
    private Double price;
    private Boolean isAvailable;
}
