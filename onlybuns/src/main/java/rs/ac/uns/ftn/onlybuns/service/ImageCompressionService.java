package rs.ac.uns.ftn.onlybuns.service;

// src/main/java/com/yourapp/service/ImageCompressionService.java

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.repository.PostRepository;
import rs.ac.uns.ftn.onlybuns.utils.ImageCompression;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ImageCompressionService {

    private final PostRepository postRepository;
    private final ImageCompression imageCompression;

    public ImageCompressionService(PostRepository postRepository, ImageCompression imageCompression) {
        this.postRepository = postRepository;
        this.imageCompression = imageCompression;
    }

    // Scheduled task that runs daily at midnight (cron expression)
    @Scheduled(cron = "0 39 13 * * ?")// Runs daily at midnight
    public void compressOldImages() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMonths(1);

        // Retrieve posts older than a month that have non-compressed images
        List<Post> oldPosts = postRepository.findPostsOlderThan(oneMonthAgo);

        for (Post post : oldPosts) {
            try {
                // Compress the image and update the post
                byte[] compressedImage = imageCompression.compressImage(post.getImageData(), 0.5f); // 70% quality
                post.setImageData(compressedImage);  // Update the image with compressed data
                post.setUpdatedAt(LocalDateTime.now());  // Update the timestamp

                // Save the updated post
                postRepository.save(post);
            } catch (Exception e) {
                System.err.println("Error compressing image for post ID: " + post.getId());
                e.printStackTrace();
            }
        }
    }
}
