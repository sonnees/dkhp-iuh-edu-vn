package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Course;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface CourseRepository extends ReactiveMongoRepository<Course, UUID> {

    @Query("{'semester._id': ?0}")
    Flux<Course> searchBySemesterID(UUID semesterID);

    @Query("{'semester._id': ?0}")
    @Update(update = "{$set:{status: ?1}}")
    Mono<Long> changeStatusBySemesterID(UUID semesterID, boolean status);
}
