package rs.ac.uns.ftn.onlybuns.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.Comment;
import rs.ac.uns.ftn.onlybuns.repository.CommentRepository;
import rs.ac.uns.ftn.onlybuns.service.CommentService;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;

    @Autowired
    public CommentServiceImpl(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    @Override
    public Comment createComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now());
        return commentRepository.save(comment);
    }

    @Override
    public Comment saveComment(Comment comment) {
        comment.setCreatedAt(LocalDateTime.now()); // Set the creation timestamp
        return commentRepository.save(comment); // Save the comment and return it
    }

    @Override
    public boolean hasUserExceededComments(Long userId) {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long commentCount = commentRepository.countCommentsByUserInLastHour(userId, oneHourAgo);
        return commentCount > 15;
    }

    @Override
    public List<Comment> findAllCommentsByPost(Long postId) {
        return commentRepository.findByPostId(postId); // Fetch comments for the given post ID
    }



}
