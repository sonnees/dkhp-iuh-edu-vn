package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.DetailCourse;
import edu.iuh.administratorservice.enums.Status;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface DetailCourseRepository extends ReactiveMongoRepository<DetailCourse, UUID> {

    @Query(value = "{courseID: ?0}", sort = "{groupNumber: 1}" )
    Flux<DetailCourse> searchByCourseID(UUID courseID);

    @Query("{_id: ?0, classSizeAvailable: {$gt: 0}}")
    @Update(update = "{$inc: {classSizeAvailable: -1}}")
    Mono<Long> decreaseClassSizeAvailable(UUID id);

    @Query("{_id: ?0}")
    @Update(update = "{$inc: {classSizeAvailable: 1}}")
    Mono<Long> increaseClassSizeAvailable(UUID id);

}
