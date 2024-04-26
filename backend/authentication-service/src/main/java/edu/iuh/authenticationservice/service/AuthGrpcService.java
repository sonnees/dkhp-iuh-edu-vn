package edu.iuh.authenticationservice.service;

import edu.iuh.*;
import edu.iuh.authenticationservice.AuthRepository;
import edu.iuh.authenticationservice.entity.Auth;
import edu.iuh.authenticationservice.jwt.JwtAuthProvider;
import io.grpc.Status;
import io.grpc.stub.StreamObserver;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.Optional;
import java.util.stream.Collectors;

@GrpcService
@Slf4j
public class AuthGrpcService extends AuthServiceGrpc.AuthServiceImplBase {

    @Value("${jwt.secret.key}")
    String jwtSecretKey;

    final JwtAuthProvider jwtAuthProvider;
    private final AuthRepository authRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthGrpcService(JwtAuthProvider jwtAuthProvider, AuthRepository authRepository, PasswordEncoder passwordEncoder) {
        this.jwtAuthProvider = jwtAuthProvider;
        this.authRepository = authRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void authorize(AuthRequest request, StreamObserver<JwtToken> responseObserver) {
        log.info("@@@ enter authorize @@@");
        log.info("@ request: {} @", request);

        Authentication authenticate = jwtAuthProvider.authenticate(
                new UsernamePasswordAuthenticationToken(request.getId(), request.getPassword()));

        Instant now = Instant.now();
        Instant expiration = now.plus(24, ChronoUnit.HOURS);

        String authorities = authenticate.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.joining(","));

        responseObserver.onNext(
                JwtToken.newBuilder()
                        .setToken(Jwts.builder()
                                .setSubject((String) authenticate.getPrincipal())
                                .claim("role", authorities)
                                .setIssuedAt(Date.from(now))
                                .setExpiration(Date.from(expiration))
                                .signWith(JwtAuthProvider.getSignInKey(jwtSecretKey), SignatureAlgorithm.HS256)
                                .compact()).build()
        );

        responseObserver.onCompleted();
    }

    @Override
    public void changePassword(ChangePasswordRequest request, StreamObserver<ChangePassword> responseObserver) {
        log.info("@@@ enter change password @@@");
        log.info("@ request: {} @", request);
        Optional<Auth> byId = authRepository.findById(request.getId());
        if(byId.isEmpty()) {
            responseObserver.onError(Status.NOT_FOUND.withDescription("Auth not found").asException());
            responseObserver.onCompleted();
        }

        Auth auth = byId.get();
        if(!passwordEncoder.matches(request.getOldPass(),auth.getPassword())) {
            responseObserver.onError(Status.UNAUTHENTICATED.withDescription("Password not correct").asException());
            responseObserver.onCompleted();
        }

        auth.setPassword(passwordEncoder.encode(request.getNewPass()));
        Auth save = authRepository.save(auth);
        if(!passwordEncoder.matches(request.getNewPass(),save.getPassword())) {
            responseObserver.onError(Status.INTERNAL.withDescription("Password not correct").asException());
            responseObserver.onCompleted();
        }

        responseObserver.onNext(
                ChangePassword.newBuilder().build()
        );

        responseObserver.onCompleted();
    }
}
