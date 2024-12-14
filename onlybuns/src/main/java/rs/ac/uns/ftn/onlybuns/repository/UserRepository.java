package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    // Finds a user by username
    User findByUsername(String username);

    // Checks if a user with the given username exists
    boolean existsByUsername(String username);

    // Checks if a user with the given email exists
    boolean existsByEmail(String email);

    // Finds a user by email
    User findByEmail(String email);

    // Finds a user by activation token
    User findByActivationToken(String activationToken);

    User findUserById(Long id);

    @Query("SELECT u FROM User u WHERE u.lastLogin < :date")
    List<User> findAllUnactive(LocalDateTime date);

    @Query(value = "SELECT COUNT(*) " +
            "FROM likes l " +
            "JOIN posts p ON l.post_id = p.id " +
            "WHERE p.user_id = :userId " +
            "AND l.created_at > :date",
            nativeQuery = true)
    int getNewLikes(@Param("userId") Long userId, @Param("date") LocalDateTime date);

    @Query(value = "SELECT COUNT(*) " +
            "FROM comments c " +
            "JOIN posts p ON c.post_id = p.id " +
            "WHERE p.user_id = :userId " +
            "AND c.created_at > :date",
            nativeQuery = true)
    int getNewComments(@Param("userId") Long userId, @Param("date") LocalDateTime date);

    @Query(value = "SELECT COUNT(*) " +
            "FROM user_followers uf " +
            "WHERE uf.user_id = :userId " +
            "AND uf.since > :date",
            nativeQuery = true)
    int getNewFollowers(@Param("userId") Long userId, @Param("date") LocalDateTime date);

    @Query(value = "SELECT COUNT(*) " +
            "FROM posts p " +
            "WHERE p.user_id IN (SELECT uf.user_id " +
            "FROM user_followers uf " +
            "WHERE uf.follower_id = :userId) " +
            "AND p.created_at > :date",
            nativeQuery = true)
    int getNewPosts(@Param("userId") Long userId, @Param("date") LocalDateTime date);

}
