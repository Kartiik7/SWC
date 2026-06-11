# Spring Boot API Gateway & Microservices Communication Project

This repository contains a structured, educational-focused implementation of an **API Gateway** and **Microservices Communication** model. It is designed as an academic submission project demonstrating key architectural patterns in microservices development.

---

## Project Overview

In a monolithic architecture, client applications communicate with a single backend. In a microservices architecture, backend functionalities are divided into multiple distinct services (e.g., Auth, Movies, Booking). 

This project demonstrates how to place a **Spring Cloud API Gateway** at the edge of our infrastructure to:
1. Provide a single endpoint for all clients.
2. Route traffic dynamically using route definitions.
3. Centrally validate security tokens (JWT) to protect downstream services.
4. Enable internal service-to-service communication.

---

## Architecture Diagram

Here is a conceptual flow diagram of the system showing the request pipeline:

```text
       [ Client Applications (Web/Mobile/Postman) ]
                           │
                           │ HTTP Request
                           ▼
                  +──────────────────+
                  │   API Gateway    │ (Runs on Port 8080)
                  │                  │
                  │  - Global Filter │
                  │  - JWT Filter    │
                  +────────┬─────────+
                           │
         ┌─────────────────┼─────────────────┐
         │ (Public Route)  │ (Secure Route)  │ (Secure Route)
         ▼                 ▼                 ▼
+────────────────+ +────────────────+ +────────────────+
│  Auth Service  │ │ Movie Service  │ │Booking Service │
│  (Port 8081)   │ │  (Port 8082)   │ │  (Port 8083)   │
+────────────────+ +────────────────+ +───────┬────────+
                                              │
                                              │ (Internal HTTP Call)
                                              │ - RestTemplate
                                              │ - WebClient
                                              ▼
                                     +────────────────+
                                     │ Movie Service  │
                                     +────────────────+
```

### Role of Each Service:
1. **API Gateway (Port 8080)**: Serves as the single entry point. It intercepts all requests, logs request metadata via a global logging filter, validates JWT credentials via a routing filter, and forwards requests to the target service.
2. **Auth Service (Port 8081)**: Manages user login, signup, and issues JWT tokens upon successful authentication. (Publicly accessible).
3. **Movie Service (Port 8082)**: Manages movie catalogs, details, and pricing. (Protected behind Gateway JWT authorization).
4. **Booking Service (Port 8083)**: Manages ticket reservations. When booking a movie, it communicates internally with the Movie Service to fetch ticket prices and verify availability. (Protected behind Gateway JWT authorization).

---

## Folder Structure

The project code is divided into two distinct components for academic evaluation:

### 1. API Gateway (`api-gateway/`)
```text
api-gateway/
├── pom.xml
└── src/main/java/com/assignment/gateway/
    ├── ApiGatewayApplication.java     # Bootstraps the Gateway application
    ├── config/
    │   └── GatewayConfig.java         # Programmatic (Java DSL) Route configurations
    ├── filter/
    │   ├── GlobalLoggingFilter.java   # Global filter for pre- and post-processing logs
    │   └── JwtValidationFilter.java   # Custom filter verifying JWT and injecting headers
    ├── security/
    │   └── WebSecurityConfig.java     # Reactive Spring Security (ServerHttpSecurity) rules
    ├── util/
    │   └── JwtUtil.java               # JWT Helper (parsing, validation, subject extraction)
    └── controller/
        └── GatewayFallbackController.java # Graceful fallback controller for circuit breakers
```
* **`config/`**: Contains route definition classes.
* **`filter/`**: Contains filters that execute when requests flow in or out.
* **`security/`**: Defines security settings, allowing certain public pages (like login) while enforcing filters on others.
* **`util/`**: Holds utilities like JWT parsers.
* **`controller/`**: Contains fallback endpoints.

### 2. Microservice Communication Demo (`microservice-communication-demo/`)
This module demonstrates how independent services communicate internally with one another.
```text
microservice-communication-demo/
└── src/main/java/com/assignment/demo/
    ├── BookingController.java         # Rest API endpoint for making a booking
    ├── BookingService.java            # Business logic invoking internal Movie client
    ├── MovieClient.java               # Inter-service client (WebClient & RestTemplate)
    └── dto/
        ├── BookingResponse.java       # Outgoing booking response DTO
        └── MovieDTO.java              # Ingoing movie response DTO
```

---

## How Routing Works in Spring Cloud Gateway

Spring Cloud Gateway uses three core concepts to route traffic:
1. **Route**: The basic building block of the gateway. It is defined by an ID, a destination URI, a collection of predicates, and a collection of filters.
2. **Predicate**: This is a Java 8 Predicate. It evaluates HTTP elements like headers, parameters, or paths. If the predicate evaluates to `true`, the route is matched.
3. **Filter**: Gateway filters allow you to modify the incoming HTTP request or outgoing HTTP response before or after sending it to the downstream service.

### Configured Routes:
* `/auth/**` matches and routes to **Auth Service** (`http://localhost:8081`).
* `/movies/**` matches, applies the custom JWT filter, and routes to **Movie Service** (`http://localhost:8082`).
* `/booking/**` matches, applies the custom JWT filter, and routes to **Booking Service** (`http://localhost:8083`).

---

## JWT Validation Flow

When a client requests a protected route (e.g. Booking Service), the gateway interceptor follows this sequence:

```text
[Client]                         [Gateway Filter]                  [Downstream Service]
   │                                     │                                   │
   │ 1. Request with Bearer Token        │                                   │
   ├────────────────────────────────────>│                                   │
   │                                     │ 2. Extracts JWT                   │
   │                                     │ 3. Verifies Signature & Expiry    │
   │                                     │                                   │
   │                                     │── [Valid JWT?] ──────────────────┐│
   │                                     │                                  ││
   │                                     │◄─────────────────────────────────┘│
   │                                     │                                   │
   │                                     │ 4. Mutates Request:               │
   │                                     │    Injects header:                │
   │                                     │    X-Auth-User: user@email.com    │
   │                                     │ 5. Routes downstream              │
   │                                     ├──────────────────────────────────>│
   │                                     │                                   │ 6. Reads X-Auth-User
   │                                     │                                   │    completes booking
   │                                     │                                   │    and responds.
```

---

## Inter-Service (Microservice-to-Microservice) Communication

In a microservices system, services often need to call each other. This project demonstrates two standard mechanisms in [MovieClient.java](file:///d:/SWC/FSD/Assignment-4/microservice-communication-demo/src/main/java/com/assignment/demo/MovieClient.java):

### 1. RestTemplate (Synchronous / Blocking)
The thread making the service request is blocked, waiting for the HTTP call to return from the Movie Service.
```java
// Synchronous call
MovieDTO movie = restTemplate.getForObject(url, MovieDTO.class);
```

### 2. WebClient (Asynchronous / Non-Blocking)
The calling thread initiates the request, registers a callback, and is immediately freed to process other incoming tasks. When the response returns, WebClient completes the operation reactive-style.
```java
// Reactive, non-blocking call
Mono<MovieDTO> movieMono = webClientBuilder.build()
        .get()
        .uri(url)
        .retrieve()
        .bodyToMono(MovieDTO.class);
```

---

## Request & Response Flow Examples

### Example 1: Fetching Movies with a Valid JWT Token (Success Case)

**HTTP Request:**
```http
GET /movies/123 HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzdHVkZW50QGFjYWRlbXkuZWR1Iiwicm9sZXMiOiJVU0VSIiwiaWF0IjoxNTE2MjM5MDIyfQ.xxxxxx
```

**Gateway Actions:**
1. Global Filter prints: `Incoming Request: [Method: GET] | [Path: /movies/123]`.
2. `JwtValidationFilter` extracts the Bearer token.
3. `JwtUtil` validates the token's validity, signatures, and dates.
4. Gateway mutates headers: appends `X-Auth-User: student@academy.edu`.
5. Forwards request to Movie Service at `http://localhost:8082/movies/123`.

**HTTP Response:**
```json
{
  "id": 123,
  "title": "Inception",
  "genre": "Sci-Fi",
  "price": 250.0,
  "isAvailable": true
}
```

---

### Example 2: Creating a Booking without a Token (Unauthorized Case)

**HTTP Request:**
```http
POST /booking/create?movieId=123&seats=2 HTTP/1.1
Host: localhost:8080
```

**Gateway Actions:**
1. Global Filter prints: `Incoming Request: [Method: POST] | [Path: /booking/create]`.
2. `JwtValidationFilter` detects the missing `Authorization` header.
3. Request is rejected immediately. Downstream Booking service is never contacted.

**HTTP Response (401 Unauthorized):**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Missing Authorization Header",
  "timestamp": "Thu Jun 11 16:10:00 IST 2026"
}
```

---

### Example 3: Handling Token Expired or Tampered Token

**HTTP Request:**
```http
GET /movies/123 HTTP/1.1
Host: localhost:8080
Authorization: Bearer invalid-or-expired-token-string
```

**HTTP Response (401 Unauthorized):**
```json
{
  "status": 401,
  "error": "Unauthorized",
  "message": "Invalid or Expired JWT Token",
  "timestamp": "Thu Jun 11 16:10:00 IST 2026"
}
```

---

### Example 4: Routing to a Downstream Service that is Down (Fallback Case)

**HTTP Request:**
```http
POST /booking/create?movieId=123&seats=2 HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyQHRlc3QuY29tIn0.xxxx
```

**Gateway Actions:**
1. Token is verified successfully.
2. Gateway attempts to forward request to Booking Service (`http://localhost:8083`).
3. Connection fails (Booking Service is offline).
4. Circuit Breaker catches the failure and routes request to `/fallback/booking`.

**HTTP Response (503 Service Unavailable):**
```json
{
  "status": 503,
  "error": "Service Unavailable",
  "message": "Booking Service is currently unavailable. Please try again later.",
  "timestamp": "Thu Jun 11 16:10:00 IST 2026"
}
```

---

## Postman Testing Guide

To test this configuration using Postman:

1. **Test Authentication Endpoint (Public)**:
   - Create a `POST` request to `http://localhost:8080/auth/login`.
   - Send credentials in request body. It should return a JWT Token.
2. **Access Protected Route Without Token**:
   - Create a `GET` request to `http://localhost:8080/movies/list`.
   - Leave Auth headers empty. You will receive a `401 Unauthorized` JSON payload.
3. **Access Protected Route With Token**:
   - Create a `GET` request to `http://localhost:8080/movies/list`.
   - Under the **Headers** tab, add `Authorization` key with value `Bearer <YOUR_JWT_TOKEN>`.
   - The gateway will authenticate, strip authorization, attach headers, and fetch the movies.
4. **Create Booking (Inter-service Verification)**:
   - Create a `POST` request to `http://localhost:8080/booking/create?movieId=1&seats=3`.
   - Pass the JWT in headers.
   - The Booking service will fetch the movie details from the Movie service, calculate pricing, and return a confirmed booking DTO.

---

## Future Improvements
- **Service Discovery Integration**: Integrate with Spring Cloud Netflix Eureka to discover microservices dynamically (routing via `lb://auth-service` instead of hardcoded `http://localhost:8081`).
- **Resilience**: Implement rate limiting using Redis Rate Limiter and circuit breakers using Resilience4j.
- **Config Management**: Centralize application configurations using Spring Cloud Config Server.
- **Distributed Tracing**: Implement Spring Cloud Sleuth/Micrometer Tracing and Zipkin to trace requests across microservices.

---

## Academic Viva Resource
For quick-reference study guides, diagrams, and interview questions, check out the [VIVA_PREPARATION.md](file:///d:/SWC/FSD/Assignment-4/VIVA_PREPARATION.md) document in this workspace directory.
