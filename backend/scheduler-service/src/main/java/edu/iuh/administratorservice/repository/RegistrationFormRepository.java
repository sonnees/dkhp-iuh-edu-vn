package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.dto.RegistrationSearch3FieldDTO;
import edu.iuh.administratorservice.dto.RegistrationSearchByCourseIDDTO;
import edu.iuh.administratorservice.entity.Course;
import edu.iuh.administratorservice.entity.RegistrationForm;
import edu.iuh.administratorservice.enums.Status;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface RegistrationFormRepository extends ReactiveMongoRepository<RegistrationForm, UUID> {
    @Query("{'course.id': ?0}")
    @Update(update = "{$set:{course: ?1}}")
    Mono<Long> changeStatusByID(UUID id, Course course);

    @Aggregation({
            "{$match:{'course.semester._id':?0, 'course.status': 'ACCEPTANCE_TO_OPEN'}}",
            "{$group:{'_id':{courseId:'$course._id',groupNumber:'$groupNumber'},'studentID': { $addToSet: '$studentID' }}}",
            "{$project:{idCourse:'$_id.courseId',groupNumber:'$_id.groupNumber',studentID:1,'_id': 0}}"
    })
    Flux<RegistrationSearch3FieldDTO> search3FieldDTO(UUID semesterID);

    @Aggregation({
            "{$match:{'course._id':?0}}",
            "{$group:{'_id':{id:'$course._id'}, 'studentIDs':{$addToSet:'$studentID'}}}",
            " {$project:{_id:0, studentIDs:1}}"
    })
    Mono<RegistrationSearchByCourseIDDTO> searchByCourseID(UUID courseID);
}
