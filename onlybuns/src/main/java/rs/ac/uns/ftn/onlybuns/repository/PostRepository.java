package rs.ac.uns.ftn.onlybuns.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import rs.ac.uns.ftn.onlybuns.model.Post;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // You can define custom query methods here if needed
    List<Post> findByUserId(Long userId);
    List<Post> findByLatitudeAndLongitude(Double lattitude, Double longitude);
}