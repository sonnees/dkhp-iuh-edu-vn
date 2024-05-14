package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Classes;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ClassesRepository extends ReactiveMongoRepository<Classes, UUID> {

}
