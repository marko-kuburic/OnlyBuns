package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import rs.ac.uns.ftn.onlybuns.model.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by username
    User findByUsername(String username);

    // Checks if a user with the given username exists
    boolean existsByUsername(String username);

    // Checks if a user with the given email exists
    boolean existsByEmail(String email);
}
