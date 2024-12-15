package rs.ac.uns.ftn.onlybuns.service;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.repository.PostRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostServiceImpl(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @Override
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    @Override
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public Post getPostById(Long id) {
        return postRepository.findById(id).orElse(null);
    }

    @Override
    public Post updatePost(Long id, Post postDetails) {
        Post post = getPostById(id);
        if (post != null) {
            post.setContent(postDetails.getContent());
            post.setImagePath(postDetails.getImagePath());
            post.setUpdatedAt(LocalDateTime.now());
            return postRepository.save(post);
        }
        return null;
    }

    @Override
    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }

    @Override
    public List<Post> getPostsByUserId(Long userId) {
        return postRepository.findByUserId(userId);
    }

    @Override
    public List<Post> getPostsByLatLong(Double lat, Double lon) {
        return postRepository.findByLatitudeAndLongitude(lat, lon);
    }

    @Override
    public long getTotalPosts() {
        return postRepository.count();
    }

    @Transactional
    public void likePost(Long postId) {

        // Simulacija vremenskog kašnjenja za testiranje konkurencije
        try {
            Thread.sleep(2000); // Dodajte kašnjenje za simulaciju konflikta
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        postRepository.incrementLikes(postId);

    }

}
