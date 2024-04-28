package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.RegistrationForm;
import edu.iuh.administratorservice.enums.Status;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface RegistrationFormRepository extends ReactiveMongoRepository<RegistrationForm, UUID> {
    @Query("{'course.id': ?0}")
    @Update(update = "{$set:{course: {status: ?1}}}")
    Mono<Long> changeStatusByID(UUID id, Status status);
}
