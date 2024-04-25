package edu.iuh.administratorservice.repository;

import edu.iuh.administratorservice.entity.Staff;
import org.springframework.data.mongodb.repository.ReactiveMongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StaffRepository extends ReactiveMongoRepository<Staff, String> {
}
