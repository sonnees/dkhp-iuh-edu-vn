package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Semester2;
import edu.iuh.administratorservice.entity.Student;
import edu.iuh.administratorservice.entity.Subject2;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Mono;

import java.util.UUID;

@Repository
public interface StudentRepository extends ReactiveMongoRepository<Student, String> {
    @Query(value = "{'_id': ?0, 'semesters.id': ?1}")
    @Update(update = "{$push: {'semesters.$.subjects': ?2}}")
    Mono<Long> appendSubject(String id, UUID semesterID, Subject2 subject);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$push: {'semesters': ?1}}")
    Mono<Long> appendSubjectNotExistSemesterID(String id, Semester2 semester2);

    @Query(value = "{'_id': ?0, 'semesters.id': ?1}")
    @Update(update = "{$pull: {'semesters.$.subjects': {id: ?2}}}")
    Mono<Long> removeSubject(String id, UUID semesterID, UUID subjectID);

    @Query(value = "{'semesters.id': ?1}")
    @Update(update = "{$pull: {'semesters.$.subjects': {id: ?2}}}")
    Mono<Long> removeSubjectBySemestersAndSubjectIDs(UUID semesterID, UUID subjectID);

    @Query(value = "{'_id': ?0, 'semesters.id': ?1}")
    Mono<Student> findBySemesterID(String id, UUID semesterID);
}
