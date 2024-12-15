package rs.ac.uns.ftn.onlybuns;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import rs.ac.uns.ftn.onlybuns.service.PostService;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.junit.jupiter.api.Assertions.assertEquals;

@SpringBootTest
public class PostServiceConcurrencyTest {

    @Autowired
    private PostService postService;

    @Test
    @Transactional
    public void testConcurrentLikes() throws InterruptedException {
        // Create a post and get its ID
        Long postId = createPost();

        int numberOfThreads = 10;
        int likesPerThread = 5; // Each thread likes the post 5 times
        ExecutorService executorService = Executors.newFixedThreadPool(numberOfThreads);
        CountDownLatch latch = new CountDownLatch(numberOfThreads);

        for (int i = 0; i < numberOfThreads; i++) {
            executorService.submit(() -> {
                try {
                    for (int j = 0; j < likesPerThread; j++) {
                        postService.likePost(postId);
                    }
                } finally {
                    latch.countDown();
                }
            });
        }

        latch.await(); // Wait for all threads to finish
        executorService.shutdown();

        int expectedLikes = numberOfThreads * likesPerThread;
        int actualLikes = postService.getPostById(postId).getLikesCount();
        assertEquals(expectedLikes, actualLikes, "The total likes do not match the expected value!");
    }

    private Long createPost() {
        // Assuming you have a method in the service layer to create a post
        // For simplicity, returning a hardcoded post ID
        return 1L; // Replace this with actual logic to create and return a new Post ID
    }
}
