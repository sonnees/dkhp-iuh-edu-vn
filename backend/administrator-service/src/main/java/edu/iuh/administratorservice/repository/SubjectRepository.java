package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Subject;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface SubjectRepository extends ReactiveMongoRepository<Subject, UUID> {
}
