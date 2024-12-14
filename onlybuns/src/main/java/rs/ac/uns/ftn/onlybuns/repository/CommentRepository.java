package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rs.ac.uns.ftn.onlybuns.model.Comment;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT COUNT(c) FROM Comment c WHERE c.userId = :userId AND c.createdAt >= :startTime")
    long countCommentsByUserInLastHour(Long userId, LocalDateTime startTime);

    List<Comment> findByUserId(Long userId);

    List<Comment> findByPostId(Long userId);
}
