package com.assignment.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * Utility class to handle JWT token validation and parsing.
 * In a real-world system, this class works with the same signing key as the Auth Service
 * to verify that the token was signed by our trusted authorization server.
 */
@Component
public class JwtUtil {

    // A sample secret key. In production, this should be stored securely (e.g., Spring Cloud Config, vault, env vars)
    // The key length must be at least 256 bits (32 bytes) for HS256 algorithm.
    @Value("${jwt.secret:default-secret-key-must-be-at-least-32-bytes-long-for-hs256-verification}")
    private String secret;

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Validates whether the token is correctly structured, signed, and not expired.
     *
     * @param token JWT token string
     * @return true if valid, false if invalid/expired/malformed
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (SignatureException e) {
            System.err.println("Invalid JWT signature: " + e.getMessage());
        } catch (MalformedJwtException e) {
            System.err.println("Invalid JWT token format: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("JWT token is expired: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("JWT token is unsupported: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("JWT claims string is empty: " + e.getMessage());
        }
        return false;
    }

    /**
     * Extracts all claims (payload metadata) from the token.
     *
     * @param token JWT token string
     * @return Claims object containing token attributes
     */
    public Claims getClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Helper to retrieve the subject (typically username/userId) from the token.
     */
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }
}
