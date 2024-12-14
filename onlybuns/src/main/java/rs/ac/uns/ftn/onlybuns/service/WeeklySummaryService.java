package rs.ac.uns.ftn.onlybuns.service;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.model.User;
import rs.ac.uns.ftn.onlybuns.repository.PostRepository;
import rs.ac.uns.ftn.onlybuns.repository.UserRepository;
import rs.ac.uns.ftn.onlybuns.utils.ImageCompression;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class WeeklySummaryService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public WeeklySummaryService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    // Scheduled task that runs daily at midnight (cron expression)
    @Scheduled(cron = "00 00 09 * * ?")  // Runs daily at midnight
    public void compressOldImages() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);

        // Retrieve posts older than a month that have non-compressed images
        List<User> unactiveUsers = userRepository.findAllUnactive(oneWeekAgo);

        for (User user : unactiveUsers) {
            long userId = user.getId();
            int newFollowers = userRepository.getNewFollowers(userId, oneWeekAgo);
            int newLikes = userRepository.getNewLikes(userId, oneWeekAgo);
            int newComments = userRepository.getNewComments(userId, oneWeekAgo);
            int newPosts = userRepository.getNewPosts(userId, oneWeekAgo);
            emailService.sendWeeklyUpdate(user.getEmail(), newFollowers, newLikes, newComments, newPosts);
        }
    }
}

