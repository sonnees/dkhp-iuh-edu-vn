package edu.iuh.studentservice.repository;

import edu.iuh.studentservice.entity.Student;
import edu.iuh.studentservice.entity.Timetable;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.Date;
import java.util.UUID;

@Repository
public interface TimetableRepository extends ReactiveMongoRepository<Timetable, String> {
    @Query(value = "{studentID:?0, date:{$gte:?1, $lte: ?2}}", sort = "{date: 1}")
    Flux<Timetable> searchByClassesID(String studentID, Date start, Date end);
}
