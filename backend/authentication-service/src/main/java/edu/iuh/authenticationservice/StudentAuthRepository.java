package edu.iuh.authenticationservice;

import edu.iuh.authenticationservice.entity.StudentAuth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAuthRepository extends JpaRepository<StudentAuth, Long> {
}
