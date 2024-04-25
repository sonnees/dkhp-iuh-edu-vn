package edu.iuh.authenticationservice;

import edu.iuh.authenticationservice.entity.Auth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentAuthRepository extends JpaRepository<Auth, Long> {
}
