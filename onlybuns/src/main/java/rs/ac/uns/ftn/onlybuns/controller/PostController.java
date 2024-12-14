package rs.ac.uns.ftn.onlybuns.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import rs.ac.uns.ftn.onlybuns.model.Comment;
import rs.ac.uns.ftn.onlybuns.model.Post;
import rs.ac.uns.ftn.onlybuns.service.CommentService;
import rs.ac.uns.ftn.onlybuns.service.PostService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;

    @Autowired
    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<Post> createPost(
            @RequestParam("userId") Long userId,
            @RequestParam("latitude") double latitude,
            @RequestParam("longitude") double longitude,
            @RequestParam("address") String address,
            @RequestParam("content") String content,
            @RequestParam("image") MultipartFile imageFile) throws IOException {

        // Step 1: Create and save the post without setting the image path
        Post post = new Post();
        post.setUserId(userId);
        post.setLatitude(latitude);
        post.setLongitude(longitude);
        post.setAddress(address);
        post.setContent(content);
        post.setCreatedAt(LocalDateTime.now());
        post.setUpdatedAt(LocalDateTime.now());
        post.setImagePath(imageFile.getOriginalFilename());

        // Save the post to get the generated postId
        Post createdPost = postService.createPost(post);
        Long postId = createdPost.getId();  // Retrieve the generated ID

        // Step 2: Define target directory for storing images in the public folder
        String targetDir = "../public/uploads";
        File directory = new File(targetDir);
        if (!directory.exists()) {
            directory.mkdirs();  // Create the directory if it doesn't exist
        }

        // Generate the filename based on postId
        String fileExtension = StringUtils.getFilenameExtension(imageFile.getOriginalFilename());
        String filename = postId + "." + fileExtension;
        Path targetPath = Paths.get(targetDir, filename);

        // Copy the image file to the target directory
        Files.copy(imageFile.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Step 3: Update the post with the relative path to the image
        createdPost.setImagePath("uploads/" + filename);
        postService.updatePost(postId,createdPost);  // Update the post with the image path

        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }



    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        List<Post> posts = postService.getAllPosts();
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        if (post != null) {
            return new ResponseEntity<>(post, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        Post updatedPost = postService.updatePost(id, postDetails);
        if (updatedPost != null) {
            return new ResponseEntity<>(updatedPost, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Long userId) {
        List<Post> posts = postService.getPostsByUserId(userId);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }

    @GetMapping("/location/{lat}/{lon}")
    public ResponseEntity<List<Post>> getPostsByLocationId(@PathVariable Double lat, @PathVariable Double lon) {
        List<Post> posts = postService.getPostsByLatLong(lat, lon);
        return new ResponseEntity<>(posts, HttpStatus.OK);
    }


        @PostMapping("/{postId}/like")
        public ResponseEntity<String> likePost(@PathVariable Long postId) {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null || auth.getPrincipal() == null) {
                return new ResponseEntity<>("Please log in to like posts.", HttpStatus.UNAUTHORIZED);
            }

            Long userId = (Long) auth.getPrincipal();
            // Process the like for the user with userId
            return ResponseEntity.ok("Liked successfully");
        }

    @PostMapping("/{postId}/comment")
    public ResponseEntity<String> commentPost(
            @PathVariable Long postId,
            @RequestBody Map<String, Object> requestBody) {


        Long userId = Long.valueOf(requestBody.get("userId").toString());
        String commentContent = requestBody.get("commentContent").toString();

        if (commentService.hasUserExceededComments(userId)) {
            return new ResponseEntity<>("You have exceeded the allowed number of comments for this post", HttpStatus.BAD_REQUEST);
        }

        // Create a new comment
        Comment comment = new Comment();
        comment.setUserId(userId);
        comment.setContent(commentContent);
        comment.setPostId(postId);
        comment.setCreatedAt(LocalDateTime.now());

        // Save the comment
        commentService.saveComment(comment);

        return new ResponseEntity<>("Comment saved", HttpStatus.CREATED);
    }
    
        @GetMapping("/{postId}/comments")
        public ResponseEntity<List<Comment>> getCommentsForPost(@PathVariable Long postId) {
            List<Comment> comments = commentService.findAllCommentsByPost(postId);
            if (comments.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }
            return new ResponseEntity<>(comments, HttpStatus.OK);
        }

    

}


