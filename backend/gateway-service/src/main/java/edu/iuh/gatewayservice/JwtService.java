package edu.iuh.gatewayservice;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.function.Function;

@Service
public class JwtService {
    public String extractUsername(String token){
        return extractClaim(token, Claims::getSubject);
    }

    @Value("${jwt.secret.key}")
    String jwtSecretKey;

    public <T> T extractClaim(String token, Function<Claims, T > claimsTFunction){
        final Claims claims;
        try {
            claims = extractAllClaims(token);
        } catch (Exception e) {
            return null;
        }
        return claimsTFunction.apply(claims);
    }


    public boolean isTokenExpired(String token) {
        Date expiration = extractClaim(token, Claims::getExpiration);
        return expiration!= null && expiration.after(new Date(System.currentTimeMillis()));
    }

    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
