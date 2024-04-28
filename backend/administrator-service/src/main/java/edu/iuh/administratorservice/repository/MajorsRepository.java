package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Majors;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface MajorsRepository extends ReactiveMongoRepository<Majors, UUID> {
    @Query(value = "{departmentID: ?0}", sort = "{name: 1}")
    Flux<Majors> searchByDepartmentID(UUID departmentID);

}
