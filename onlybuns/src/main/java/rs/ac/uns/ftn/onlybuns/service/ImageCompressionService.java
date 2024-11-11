package rs.ac.uns.ftn.onlybuns.service;

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
    @Scheduled(cron = "30 24 14 * * ?")  // Runs daily at midnight
    public void compressOldImages() {
        LocalDateTime oneMonthAgo = LocalDateTime.now().minusMinutes(1);

        // Retrieve posts older than a month that have non-compressed images
        List<Post> oldPosts = postRepository.findPostsOlderThan(oneMonthAgo);

        for (Post post : oldPosts) {
            try {
                // Skip if the image has already been compressed
                if (post.getImagePath().contains("_compressed")) {
                    continue;
                }

                // Compress the image and get the path of the compressed file
                String compressedImagePath = imageCompression.compressImage(post.getImagePath(), 0.5f); // 50% quality

                // Update the post to use the new compressed image path
                post.setImagePath(compressedImagePath);
                post.setUpdatedAt(LocalDateTime.now());

                // Save the updated post
                postRepository.save(post);
            } catch (Exception e) {
                System.err.println("Error compressing image for post ID: " + post.getId());
                e.printStackTrace();
            }
        }
    }
}
