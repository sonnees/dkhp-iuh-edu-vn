package edu.iuh.authenticationservice.service;

import edu.iuh.*;
import edu.iuh.authenticationservice.AuthRepository;
import edu.iuh.authenticationservice.entity.Auth;
import edu.iuh.authenticationservice.entity.UserRole;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;

@GrpcService
@Slf4j
public class RegisterGrpcService extends RegisterServiceGrpc.RegisterServiceImplBase {
    private final AuthRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Value("${default.password}")
    String defaultPassword;

    public RegisterGrpcService(AuthRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void registerStudent(RegisterRequest request, StreamObserver<AuthInfo> responseObserver) {
        log.info("### register student ###");
        Auth save = repository.save(new Auth(passwordEncoder.encode(defaultPassword),UserRole.STUDENT));

        responseObserver.onNext(
                AuthInfo.newBuilder()
                        .setId(save.getId())
                        .setPassword(defaultPassword)
                        .setRole(save.getRole().name())
                        .build()
        );

        responseObserver.onCompleted();
    }

    @Override
    public void registerAdministrator(RegisterRequest request, StreamObserver<AuthInfo> responseObserver) {
        log.info("### register administrator ###");
        Auth save = repository.save(new Auth(passwordEncoder.encode(defaultPassword), UserRole.ADMINISTRATOR));

        responseObserver.onNext(
                AuthInfo.newBuilder()
                        .setId(save.getId())
                        .setPassword(defaultPassword)
                        .setRole(save.getRole().name())
                        .build()
        );

        responseObserver.onCompleted();
    }

    @Override
    public void registerStaff(RegisterRequest request, StreamObserver<AuthInfo> responseObserver) {
        log.info("### register staff ###");
        Auth save = repository.save(new Auth(passwordEncoder.encode(defaultPassword), UserRole.STAFF));

        responseObserver.onNext(
                AuthInfo.newBuilder()
                        .setId(save.getId())
                        .setPassword(defaultPassword)
                        .setRole(save.getRole().name())
                        .build()
        );

        responseObserver.onCompleted();
    }
}
