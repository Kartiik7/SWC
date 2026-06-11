# Spring Boot Authentication & Authorization Service

An academic assignment project demonstrating a secure **Authentication Service** built on **Spring Boot**, **Spring Security 6**, and **JSON Web Tokens (JWT)**, integrated with **PostgreSQL**.

---

## 1. Project Overview

The objective of this project is to implement a secure, stateless authentication and authorization system using a layered architectural design. It demonstrates:
* **User Registration** with input validation and password hashing.
* **User Login** with credential verification and JWT generation.
* **Stateless Token Authentication** using a custom filter interceptor.
* **Role-Based Access Control (RBAC)** restricting endpoints based on roles (`USER`, `THEATRE_OWNER`, `ADMIN`).
* **Global Exception Handling** to provide consistent REST error payloads.
* **PostgreSQL Schema Configuration** mapping entities to database tables.

---

## 2. Directory & Folder Structure

The project conforms to the standard Maven directory structure, separating resources from source code and logical layers:

```text
auth-service/
│
├── pom.xml                                 # Maven dependencies and project configuration
│
└── src/
    └── main/
        ├── java/
        │   └── com/
        │       └── assignment/
        │           └── auth/
        │               │
        │               ├── MainApplication.java  # Bootstrap class
        │               │
        │               ├── config/
        │               │   └── SecurityConfig.java         # Spring Security and PasswordEncoder configuration
        │               │
        │               ├── controller/
        │               │   ├── AuthController.java         # Public registration and login controllers
        │               │   └── DashboardController.java    # Protected RBAC routes
        │               │
        │               ├── dto/
        │               │   ├── RegisterRequest.java        # Registration request payload schema
        │               │   ├── LoginRequest.java           # Login request payload schema
        │               │   └── AuthResponse.java           # Authentication response schema containing JWT
        │               │
        │               ├── entity/
        │               │   ├── User.java                   # User entity with JPA mappings
        │               │   └── Role.java                   # Enum for roles (USER, THEATRE_OWNER, ADMIN)
        │               │
        │               ├── exception/
        │               │   ├── UserAlreadyExistsException.java
        │               │   ├── AuthenticationFailedException.java
        │               │   ├── ErrorDetails.java           # Structured error schema
        │               │   └── GlobalExceptionHandler.java # Global advice for exceptions
        │               │
        │               ├── repository/
        │               │   └── UserRepository.java         # Database access layer interface
        │               │
        │               └── security/
        │                   ├── JwtUtil.java                # JWT operations class
        │                   └── JwtAuthenticationFilter.java# Interceptor for JWT checking
        │
        └── resources/
            └── application.properties       # Database settings and application parameters
```

---

## 3. Database Configuration

The application connects to **PostgreSQL**. Connection properties are stored in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5422/auth_assignment_db
spring.datasource.username=postgres
spring.datasource.password=admin123
spring.datasource.driver-class-name=org.postgresql.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```
* **ddl-auto=update**: Automatically runs DDL scripts to update the database table schemas to match the entity objects at startup, avoiding manual SQL scripts.
* **Dialect**: Configures Hibernate to compile queries matching PostgreSQL standard syntax.

---

## 4. API Documentation

### Public Endpoints

#### 1. User Registration
* **Endpoint**: `POST /auth/register`
* **Headers**: `Content-Type: application/json`
* **Request Payload (Example)**:
```json
{
  "name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "securePassword123",
  "role": "THEATRE_OWNER"
}
```
* **Response Payload (Example - 201 Created)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImNvbGUiOiJUSEVBVFJFX09XTkVSIiwiaWF0IjoxNzE4MTE5MjAwLCJleHAiOjE3MTgyMDU2MDB9.xyz...",
  "email": "jane.doe@example.com",
  "role": "THEATRE_OWNER"
}
```

#### 2. User Login
* **Endpoint**: `POST /auth/login`
* **Headers**: `Content-Type: application/json`
* **Request Payload (Example)**:
```json
{
  "email": "jane.doe@example.com",
  "password": "securePassword123"
}
```
* **Response Payload (Example - 200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqYW5lLmRvZUBleGFtcGxlLmNvbSIsImNvbGUiOiJUSEVBVFJFX09XTkVSIiwiaWF0IjoxNzE4MTE5MjAwLCJleHAiOjE3MTgyMDU2MDB9.xyz...",
  "email": "jane.doe@example.com",
  "role": "THEATRE_OWNER"
}
```

---

### Protected Endpoints (Requires JWT in Authorization Header)

All protected requests must attach the header: `Authorization: Bearer <JWT_TOKEN>`

#### 1. Admin Dashboard
* **Endpoint**: `GET /admin/dashboard`
* **Access Restricted to**: Users with `ADMIN` role.
* **Response (Example - 200 OK)**:
```json
{
  "status": "success",
  "message": "Welcome to the ADMIN Dashboard!",
  "authorizedUser": "admin@example.com",
  "grantedAuthorities": [
    "ROLE_ADMIN"
  ]
}
```

#### 2. Owner Dashboard
* **Endpoint**: `GET /owner/dashboard`
* **Access Restricted to**: Users with `THEATRE_OWNER` role.
* **Response (Example - 200 OK)**:
```json
{
  "status": "success",
  "message": "Welcome to the THEATRE OWNER Dashboard!",
  "authorizedUser": "jane.doe@example.com",
  "grantedAuthorities": [
    "ROLE_THEATRE_OWNER"
  ]
}
```

#### 3. User Profile
* **Endpoint**: `GET /user/profile`
* **Access Restricted to**: Any authenticated user (`USER`, `THEATRE_OWNER`, `ADMIN`).
* **Response (Example - 200 OK)**:
```json
{
  "status": "success",
  "message": "Profile retrieved successfully",
  "email": "user@example.com",
  "role": [
    "ROLE_USER"
  ]
}
```

---

### Exception Responses

#### 1. User Already Registered (409 Conflict)
* **Trigger**: Trying to register an email already in database.
* **Response**:
```json
{
  "timestamp": "2026-06-11T10:15:30.123+00:00",
  "message": "Email 'jane.doe@example.com' is already registered",
  "details": "uri=/auth/register"
}
```

#### 2. Input Validation Failure (400 Bad Request)
* **Trigger**: Password shorter than 6 characters, invalid email syntax, etc.
* **Response**:
```json
{
  "email": "Email must be a valid email format",
  "password": "Password must be at least 6 characters long"
}
```

#### 3. Access Denied (403 Forbidden)
* **Trigger**: A user with `USER` role trying to call `GET /admin/dashboard`.
* **Response**: Standard Spring Security access denied response or handled custom response depending on security config.

---

## 5. Security & RBAC Concepts

### 1. Password Security
Raw passwords are never stored. The system registers a `@Bean PasswordEncoder` implementing `BCryptPasswordEncoder`. During registration, the raw string is hashed with a random salt. During login, the matcher compares the input password against the stored hash.

### 2. Stateless Session
By specifying `SessionCreationPolicy.STATELESS` in the security filter chain, Spring Security stops generating session IDs (`JSESSIONID`) or storing user states in memory. Every request must be authenticated independently via a token.

### 3. Role-Based Access Control (RBAC)
Method-level security is enabled using `@EnableMethodSecurity`. The controllers are protected using `@PreAuthorize`:
* `@PreAuthorize("hasRole('ADMIN')")`: Only users whose authorities include `ROLE_ADMIN` can access.
* **Role Naming**: The authorities must start with `ROLE_` prefix inside the `UserDetails` object, but the annotation only requires the name (`ADMIN`). The system automatically handles this mapping inside `CustomUserDetailsService` by adding the `"ROLE_"` prefix.

---

## 6. How the System Works (Request Lifecycle)

### A. User Registration Flow
1. **Controller Layer**: A client calls `POST /auth/register` with validation inputs.
2. **DTO & Validation**: Spring checks the `@Valid` constraints. If validation fails, `GlobalExceptionHandler` intercepts and returns `400 Bad Request`.
3. **Service Layer**: If valid, `AuthService` queries `UserRepository` to check if email is unique. If it exists, throws `UserAlreadyExistsException`.
4. **Encryption**: `AuthService` hashes the password using `PasswordEncoder`.
5. **Persistence**: The user is saved to PostgreSQL using `UserRepository.save()`.
6. **Token Issuance**: `AuthService` requests a token from `JwtUtil` using the email and role.
7. **Response**: Token, email, and role are returned in `AuthResponse`.

### B. User Login Flow
1. **Controller Layer**: Client calls `POST /auth/login`.
2. **Service Layer**: `AuthService` delegates authentication to the `AuthenticationManager`.
3. **Spring Security Engine**: The manager invokes `CustomUserDetailsService.loadUserByUsername()` to pull user credentials and roles from the database and verify the hashed password.
4. **Token Generation**: On success, `AuthService` requests a JWT from `JwtUtil` and returns the `AuthResponse`.

### C. Accessing Protected Resource Flow
1. **Filter Interception**: The client requests a protected endpoint (e.g., `GET /admin/dashboard`), adding `Authorization: Bearer <token>`.
2. **JwtAuthenticationFilter**:
   * Reads header. Extracts token.
   * Calls `JwtUtil` to parse token and extract username.
   * If token is valid, loads user details from `CustomUserDetailsService`.
   * Builds an `Authentication` context containing the user's role authority.
   * Stores context inside `SecurityContextHolder`.
3. **Spring Method Security Check**:
   * The request arrives at `DashboardController`.
   * Before entering the method, Spring Security intercepts the request to verify the annotations.
   * For `/admin/dashboard`, it checks if the context has authority `ROLE_ADMIN`.
   * If yes, controller method runs. If no, returns `403 Forbidden`.
