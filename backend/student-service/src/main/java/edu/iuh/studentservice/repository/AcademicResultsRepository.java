package edu.iuh.studentservice.repository;

import edu.iuh.studentservice.entity.AcademicResults;
import edu.iuh.studentservice.entity.Semester;
import edu.iuh.studentservice.entity.Student;
import edu.iuh.studentservice.entity.Subject;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.data.mongodb.repository.Update;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.List;
import java.util.UUID;

@Repository
public interface AcademicResultsRepository extends ReactiveMongoRepository<AcademicResults, String> {

    @Query(value = "{'_id': ?0, 'semesters.id': ?1}")
    Mono<AcademicResults> findBySemesterID(String id, UUID semesterID);

    @Query(value = "{'_id': ?0, 'semesters.id': ?1, 'semesters.subjects.id': ?2}")
    Mono<AcademicResults> findBySemesterIDAndSubjectID(String id, UUID semesterID, UUID subjectID);

    @Query(value = "{'_id': ?0}")
    @Update(update = "{$push: {'semesters': ?1}}")
    Mono<Long> appendSubjectNotExistSemesterID(String id, Semester semester);

    @Query(value = "{'_id': ?0, 'semesters.id': ?1}")
    @Update(update = "{$push: {'semesters.$.subjects': ?2}}")
    Mono<Long> appendSubject(String id, UUID semesterID, Subject subject);

//    @Query(value = "{'_id': ?0}")
//    @Update(pipeline = {
//            "{ $set: { " +
//                    "semesters: { " +
//                    "$cond: { " +
//                    "if: { $gt: [ { $size: { $filter: { input: '$semesters', as: 'semester', cond: { $eq: ['$$semester._id', ?1] } } } }, 0 ] }, " +
//                    "then: { $map: { input: '$semesters', as: 'semester', in: { $cond: { if: { $eq: ['$$semester._id', ?1] }, then: { $mergeObjects: ['$$semester', { subjects: { $concatArrays: ['$$semester.subjects', [?2]] } } ] }, else: '$$semester' } } } }, " +
//                    "else: { $concatArrays: ['$semesters', [?3]] } " +
//                    "} } } }"
//    })
//    Mono<Long> appendSubjectOrSemester(String id, UUID semesterId, Subject subject, Semester semester);

    @Query(value = "{'_id': ?0, 'semesters.id': ?1, 'semesters.subjects.id':?2}")
    @Update(update = "{$set: {'semesters.$.subjects': ?3}}")
    Mono<Long> updateScore(String id, UUID semesterID, UUID subjectID, List<Subject> subjects);
}
