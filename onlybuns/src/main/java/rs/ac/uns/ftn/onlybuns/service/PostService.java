package rs.ac.uns.ftn.onlybuns.service;

import rs.ac.uns.ftn.onlybuns.model.Post;

import java.util.List;

public interface PostService {
    Post createPost(Post post);
    List<Post> getAllPosts();
    Post getPostById(Long id);
    Post updatePost(Long id, Post postDetails);
    void deletePost(Long id);
    List<Post> getPostsByUserId(Long userId);
    List<Post> getPostsByLatLong(Double latitude, Double longitude);
    long getTotalPosts();
    public void likePost(Long postId);
}

