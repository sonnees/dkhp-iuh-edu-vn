package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Semester;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface SemesterRepository extends ReactiveMongoRepository<Semester, UUID> {
    @Query(value = "{year: ?0}", sort = "{semesterNumber: 1}")
    Flux<Semester> searchByYear(int year);
}
