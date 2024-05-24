package edu.iuh.studentservice.repository;

import edu.iuh.studentservice.dto.StatisticScore;
import edu.iuh.studentservice.entity.AcademicResults;
import edu.iuh.studentservice.entity.Semester;
import edu.iuh.studentservice.entity.Student;
import edu.iuh.studentservice.entity.Subject;
import org.springframework.data.mongodb.repository.Aggregation;
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


    @Aggregation({
            "{$match: {_id: ?0, 'semesters._id': ?1}}",
            "{$unwind: '$semesters'}",
            "{$unwind: '$semesters.subjects'}",
            "{$addFields: {" +
                    "'semesters.subjects.theoryScore': {$avg: '$semesters.subjects.theoryScore'}," +
                    "'semesters.subjects.practicalScore': {" +
                    "$cond: {" +
                    "if: {$eq: ['$semesters.subjects.practicalScore', []]}," +
                    "then: 0," +
                    "else: {$avg: '$semesters.subjects.practicalScore'}" +
                    "}" +
                    "}" +
                    "}}",
            "{$addFields: {" +
                    "'semesters.subjects.finalScore': {" +
                    "$cond: {" +
                    "if: {$eq: ['$semesters.subjects.practicalScore', 0]}," +
                    "then: {" +
                    "$let: {" +
                    "vars: {" +
                    "theoryScore: {$multiply: ['$semesters.subjects.theoryScore', 0.2]}," +
                    "midtermScore: {$multiply: ['$semesters.subjects.midtermScore', 0.3]}," +
                    "finalScore: {$multiply: ['$semesters.subjects.finalScore', 0.5]}" +
                    "}," +
                    "in: {$sum: ['$$theoryScore', '$$midtermScore', '$$finalScore']}" +
                    "}" +
                    "}," +
                    "else: {" +
                    "$let: {" +
                    "vars: {" +
                    "theoryScore: {$multiply: ['$semesters.subjects.theoryScore', 0.12]}," +
                    "midtermScore: {$multiply: ['$semesters.subjects.midtermScore', 0.18]}," +
                    "finalScore: {$multiply: ['$semesters.subjects.finalScore', 0.42]}," +
                    "practicalScore: {$multiply: ['$semesters.subjects.practicalScore', 0.28]}" +
                    "}," +
                    "in: {$sum: ['$$theoryScore', '$$midtermScore', '$$finalScore', '$$practicalScore']}" +
                    "}" +
                    "}" +
                    "}" +
                    "}" +
                    "}}",
            "{$addFields: {'semesters.subjects.finalScore': {$round: ['$semesters.subjects.finalScore', 2]}}}",
            "{$group: {_id: null, subjectNames: {$push: '$semesters.subjects.subjectName'}, finalScores: {$push: '$semesters.subjects.finalScore'}}}",
            "{$project: {_id: 0, subjectNames: 1, finalScores: 1}}"
    })
    Mono<StatisticScore> statisticScore(String id, UUID semesterID);
}
