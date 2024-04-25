package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Classes;
import org.springframework.data.mongodb.repository.Aggregation;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;
import reactor.core.publisher.Flux;

import java.util.UUID;

@Repository
public interface ClassesRepository extends ReactiveMongoRepository<Classes, UUID> {

//    @Aggregation({
//            "{$match: {'name':{$regex:?0, $options:'i'}}}",
//            "{$sort:{name:1}}"
//    })
//    Flux<Classes> searchByKeyWord(String key);
}
