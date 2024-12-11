package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.model.User;
@Repository
public interface TrendsRepository extends JpaRepository<Post, Long> {

    // Count total number of posts
    @Query("SELECT COUNT(p) FROM Post p")
    long countTotalPosts();

    // Count posts created in the last 30 days
    @Query("SELECT COUNT(p) FROM Post p WHERE p.createdAt >= :date")
    long countByCreatedAtAfter(@Param("date") LocalDateTime date);

    // Find top 5 weekly posts based on likes
    @Query(value = """
    SELECT p.id AS postId, p.content, COUNT(l.id) AS likesCount 
    FROM posts p 
    LEFT JOIN likes l ON p.id = l.post_id 
    WHERE p.created_at >= CURRENT_DATE - INTERVAL '7 DAY' 
    GROUP BY p.id, p.content 
    ORDER BY likesCount DESC 
    LIMIT 5
    """, nativeQuery = true)
    List<Map<String, Object>> findTopWeeklyPosts();

    // Find top 10 all-time posts based on likes
    @Query(value = """
        SELECT p.id AS postId, p.content, COUNT(l.id) AS likesCount 
        FROM posts p 
        LEFT JOIN likes l ON p.id = l.post_id 
        GROUP BY p.id, p.content 
        ORDER BY likesCount DESC 
        LIMIT 10
        """, nativeQuery = true)
    List<Map<String, Object>> findTopAllTimePosts();

    // Find top 10 users who gave the most likes in the last 7 days
    @Query(value = """
        SELECT u.id AS userId, u.username, COUNT(l.id) AS likesGiven 
        FROM users u 
        LEFT JOIN likes l ON u.id = l.user_id
        WHERE l.created_at IS NOT NULL AND l.created_at >= CURRENT_DATE - INTERVAL '20 DAYS'
        GROUP BY u.id, u.username 
        ORDER BY likesGiven DESC 
        LIMIT 10
        """, nativeQuery = true)
    List<Map<String, Object>> findTopLikers();
}

