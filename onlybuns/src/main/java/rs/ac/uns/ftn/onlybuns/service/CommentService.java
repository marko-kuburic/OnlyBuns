package rs.ac.uns.ftn.onlybuns.service;

import rs.ac.uns.ftn.onlybuns.model.Comment;

import java.util.List;

public interface CommentService {

    Comment createComment(Comment comment);

    boolean hasUserExceededComments(Long userId);

    Comment saveComment(Comment comment);

    List<Comment> findAllCommentsByPost(Long postId);
}
