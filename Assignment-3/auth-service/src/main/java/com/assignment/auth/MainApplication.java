package com.assignment.auth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * ===================================================================
 * Component: Main Application Bootstrap Class
 * 
 * Why it exists: 
 * Every Spring Boot application requires an entry point annotated with @SpringBootApplication.
 * This annotation combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.
 * 
 * Responsibility:
 * - Bootstraps the application using SpringApplication.run().
 * - Triggers component scanning to find services, controllers, repositories, and configurations.
 * - Starts the embedded Tomcat web server.
 * 
 * Interactions:
 * - Boots up all other layers (Controller, Service, Repository, Security) by scanning packages under 'com.assignment.auth'.
 * ===================================================================
 */
@SpringBootApplication
public class MainApplication {

    public static void main(String[] args) {
        SpringApplication.run(MainApplication.class, args);
    }
}
