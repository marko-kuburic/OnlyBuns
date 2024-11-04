package rs.ac.uns.ftn.onlybuns.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.repository.PostRepository;

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
        return postRepository.findAll();
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
            post.setImageData(postDetails.getImageData());
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
    public List<Post> getPostsByLocationId(Long locationId) {
        return postRepository.findByLocationId(locationId);
    }
}
