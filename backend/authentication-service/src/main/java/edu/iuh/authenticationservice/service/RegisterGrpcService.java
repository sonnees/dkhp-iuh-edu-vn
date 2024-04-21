package edu.iuh.authenticationservice.service;

import edu.iuh.*;
import edu.iuh.authenticationservice.StudentAuthRepository;
import edu.iuh.authenticationservice.entity.StudentAuth;
import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;
import io.grpc.stub.StreamObserver;
import lombok.extern.slf4j.Slf4j;
import net.devh.boot.grpc.server.service.GrpcService;
import org.springframework.dao.DataAccessException;
import org.springframework.security.crypto.password.PasswordEncoder;

@GrpcService
@Slf4j
public class RegisterGrpcService extends RegisterServiceGrpc.RegisterServiceImplBase {
    private final StudentAuthRepository repository;
    private final PasswordEncoder passwordEncoder;

    public RegisterGrpcService(StudentAuthRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void register(RegisterRequest request, StreamObserver<JwtToken> responseObserver) {
        log.info("### register ###");
        StudentAuth save = repository.save(new StudentAuth(request, passwordEncoder.encode(request.getPassword())));
        ManagedChannel channel = ManagedChannelBuilder.forAddress("localhost", 9090)
                .usePlaintext()
                .build();
        AuthServiceGrpc.AuthServiceBlockingStub stub = AuthServiceGrpc.newBlockingStub(channel);
        AuthRequest authRequest = AuthRequest.newBuilder()
                .setMssv(save.getMssv())
                .setPassword(request.getPassword())
                .build();
        try {
            responseObserver.onNext(
                    stub.authorize(authRequest)
            );
            channel.shutdown();
        } catch (Exception e) {
            throw new DataAccessException("Failed to save user"){};
        }
        responseObserver.onCompleted();
    }
}
