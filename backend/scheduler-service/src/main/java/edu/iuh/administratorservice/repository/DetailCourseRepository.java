package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.DetailCourse;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface DetailCourseRepository extends ReactiveMongoRepository<DetailCourse, UUID> {

    @Query("{courseID: ?0}")
    Flux<DetailCourse> searchByCourseID(UUID courseID);

}
