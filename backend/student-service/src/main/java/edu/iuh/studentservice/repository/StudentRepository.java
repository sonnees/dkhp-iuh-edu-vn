package edu.iuh.studentservice.repository;

import edu.iuh.studentservice.entity.Student;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface StudentRepository extends ReactiveMongoRepository<Student, String> {
    @Query(value = "{'classes._id': ?0}", sort = "{fullName: 1}")
    Flux<Student> searchByClassesID(UUID classesID);
}
