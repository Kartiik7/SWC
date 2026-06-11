# Microservices & API Gateway Viva Study Guide

This document contains concise, high-yield answers to help you prepare for your academic viva presentation.

---

## 1. What is an API Gateway?
An **API Gateway** is a single entry point for all client requests in a microservices architecture. It acts as a reverse proxy, routing client requests to the appropriate downstream microservices. 

### Key Responsibilities:
- **Routing**: Mapping request paths to specific microservice endpoints.
- **Security**: Centralized authentication, JWT validation, and CORS management.
- **Resilience**: Rate limiting, load balancing, and circuit breaker fallbacks.
- **Aggregation**: Combining data from multiple microservices into a single response.

---

## 2. Why use Spring Cloud Gateway?
**Spring Cloud Gateway** is the modern framework built on top of Spring Boot, Spring WebFlux, and Project Reactor to build API Gateways. It replaces the older, blocking Spring Cloud Netflix Zuul.

### Why choose it:
- **Non-blocking & Reactive**: It runs on an asynchronous Netty server, utilizing fewer system resources under high concurrency compared to servlet-based systems.
- **First-class Spring Integration**: Integrates seamlessly with Spring Boot configuration, Spring Security, and Spring Cloud Discovery Clients (like Eureka).
- **Flexible Extensions**: Offers easy creation of custom route Predicates and Filters.

---

## 3. What are Global Filters?
In Spring Cloud Gateway, **Global Filters** are filter components that execute for **every** request passing through the gateway. They do not require explicit configuration in individual route definitions.

```text
Incoming Request -> [Global Pre-Filter 1] -> [Global Pre-Filter 2] -> Microservice
                                                                          ↓
Outgoing Response <- [Global Post-Filter 1] <- [Global Post-Filter 2] <- Microservice
```

### Use Cases:
- Log incoming request URIs, HTTP methods, and response latencies.
- Append custom tracking IDs (e.g. Correlation IDs) for tracing request paths.
- Setup default response headers (like Security and CORS headers).

---

## 4. Why validate JWT at the Gateway?
Validating JSON Web Tokens (JWT) at the API Gateway level provides **centralized request authorization** and decouples authentication logic from business services.

### Advantages:
- **Reduces Overhead**: Downstream services (like Movie or Booking Service) do not need to implement repetitive JWT parsing, database lookups, or validation logic.
- **Security Zone**: Prevents unauthorized traffic from ever entering the internal network.
- **Stateless propagation**: The Gateway validates the signature, extracts user claims, and injects simple HTTP headers (e.g., `X-Auth-User: user@email.com`) to downstream services.

---

## 5. What is Centralized Authentication?
**Centralized Authentication** is a design pattern where a single dedicated service (like `Auth Service`) is responsible for authenticating users, generating access tokens (JWT), and managing passwords.

### Authentication Flow:
```text
[Client]                      [API Gateway]                 [Auth Service]
   |                                |                              |
   |---- 1. Login (/auth/login) ---->                              |
   |----------------------------- Forward to Auth ---------------->|
   |<==================== 2. Returns Signed JWT ===================|
   |                                |                              |
   |---- 3. Call Protected Movie --->                              |
   |      (Authorization Header)    |                              |
   |                                |-- 4. Validate signature -----|
   |                                |-- 5. Inject user details ----|
   |                                |      in headers and Route    |
   |                                |----------------------------> [Movie Service]
```

---

## 6. What is the difference between an API Gateway and a Load Balancer?
While both handle routing and sit in front of backend servers, they serve different layers of the networking stack and architectural roles:

| Feature | API Gateway | Load Balancer |
| :--- | :--- | :--- |
| **Layer** | Application Layer (Layer 7). | Network/Transport Layer (Layer 4) or HTTP (Layer 7). |
| **Routing Criteria** | Complex application paths, HTTP headers, request body content. | Simple IP address, port, round-robin algorithms. |
| **Features** | JWT validation, rate-limiting, circuit breakers, header mutation. | Traffic distribution and health check monitoring. |
| **Primary Goal** | Single entry point and security coordinator for microservices. | High availability and horizontal scaling of server instances. |

---

## 7. What is Service-to-Service Communication?
**Service-to-Service Communication** (Inter-service Communication) is the process by which microservices request and exchange data with other microservices to complete a business flow.

### Why it's needed:
In a database-per-service architecture, data is isolated. For example:
- The **Booking Service** needs to know if a Movie exists and what its price is from the **Movie Service** before saving a booking.
- Downstream communication occurs internally (within the secure network) without routing requests back out to the client.

---

## 8. RestTemplate vs WebClient?
Spring Boot provides two primary client utilities for making HTTP calls:

| Feature | RestTemplate | WebClient |
| :--- | :--- | :--- |
| **Type** | Synchronous and Blocking. | Asynchronous, Non-blocking, and Reactive. |
| **Programming Model** | Classic Imperative. | Reactive Streams (using `Mono` and `Flux`). |
| **Thread Model** | **One-thread-per-request**. The thread blocks and waits for a response. | **Event-driven loop**. Threads are released to do other work while waiting. |
| **Status in Spring** | Maintenance Mode (Legacy). | Recommended for all new projects. |

---

## 9. Why should internal services not be exposed directly?
Exposing internal microservices (like Movie or Booking services) directly to the public internet creates significant architectural vulnerabilities:
- **Large Attack Surface**: Every microservice requires public IP routing, port exposures, and dedicated firewall configurations.
- **Repetitive Boilerplate**: Each service must implement redundant authentication, CORS, SSL certificates, and logging.
- **Client Coupling**: Clients must know the exact IP and port configurations of all microservices, making service updates or port relocations extremely difficult.
- **Security Risk**: If an internal service contains vulnerabilities, attackers can directly exploit it without gateway interception.

---

## 10. What are the advantages of a Microservices Architecture?
A microservices architecture breaks an application down into small, loosely coupled, independently deployable services.

### Advantages:
1. **Independent Scalability**: High-traffic services (like booking) can be scaled horizontally without wasting resources scaling low-traffic services.
2. **Technological Diversity**: Different services can use different languages, frameworks, or database engines depending on their requirements.
3. **Fault Isolation**: If one service crashes (e.g. Movie service), other services (e.g. Auth service) can continue running.
4. **Faster Time-to-Market**: Multiple developers or teams can work on, deploy, and upgrade separate services concurrently.
