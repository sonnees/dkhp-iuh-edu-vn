package edu.iuh.authenticationservice.jwt;

import edu.iuh.authenticationservice.StudentAuthRepository;
import edu.iuh.authenticationservice.entity.Auth;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.*;

@Component
public class JwtAuthProvider implements AuthenticationProvider {
    private final StudentAuthRepository repository;
    private final PasswordEncoder passwordEncoder;

    public JwtAuthProvider(StudentAuthRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public static Key getSignInKey(String jwtSecretKey) {
        byte[] keyBytes = Decoders.BASE64.decode(jwtSecretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if(!authentication.isAuthenticated()) {
            Optional<Auth> studentAuth = repository.findById(Long.parseLong(authentication.getName()));
            if(studentAuth.isEmpty())
                throw new UsernameNotFoundException("User not found with id: " + authentication.getName());

            UserDetails userDetails = studentAuth.get();
            String providedPassword = (String) authentication.getCredentials();

            if (!passwordEncoder.matches(providedPassword, userDetails.getPassword()))
                throw new BadCredentialsException("Incorrect password");

            return new UsernamePasswordAuthenticationToken(userDetails.getUsername(), userDetails.getPassword(), userDetails.getAuthorities());
        }
        return authentication;
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(UsernamePasswordAuthenticationToken.class);
    }

}
