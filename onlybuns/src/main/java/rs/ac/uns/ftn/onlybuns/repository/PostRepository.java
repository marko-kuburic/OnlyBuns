package rs.ac.uns.ftn.onlybuns.repository;

import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import rs.ac.uns.ftn.onlybuns.model.Post;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // You can define custom query methods here if needed
    List<Post> findByUserId(Long userId);
    List<Post> findByLatitudeAndLongitude(Double lattitude, Double longitude);
    @Query("SELECT p FROM Post p WHERE p.createdAt < :date")
    List<Post> findPostsOlderThan(LocalDateTime date);
    List<Post> findAllByOrderByCreatedAtDesc();
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT p FROM Post p WHERE p.id = :postId")
    Post findByIdWithLock(@Param("postId") Long postId);
    @Modifying
    @Query("UPDATE Post p SET p.likesCount = p.likesCount + 1 WHERE p.id = :postId")
    void incrementLikes(Long postId);
}