package rs.ac.uns.ftn.onlybuns.util;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
    private static final long EXPIRATION_MS = 86400000L; // 1 day in milliseconds

    // Generate a token with only user ID
    public static String generateToken(Long userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);  // Store user ID in token payload

        return Jwts.builder()
                .setClaims(claims) // Add only user ID to claims
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_MS)) // Set expiration
                .signWith(key) // Sign with generated key
                .compact();
    }

    // Validate the token and retrieve claims
    public static Claims validateToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    // Extract user ID from token
    public static Long getUserIdFromJwtToken(String token) {
        Claims claims = validateToken(token);
        return claims.get("userId", Long.class); // Retrieve userId as Long
    }
}
