package rs.ac.uns.ftn.onlybuns.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rs.ac.uns.ftn.onlybuns.model.User;
import rs.ac.uns.ftn.onlybuns.service.EmailService;
import rs.ac.uns.ftn.onlybuns.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;

    @Autowired
    public UserController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user) {
        // Check if username or email already exists
        if (userService.getUserByUsername(user.getUsername()) != null) {
            return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
        }
        if (userService.getUserByEmail(user.getEmail()) != null) {
            return new ResponseEntity<>("Email already exists", HttpStatus.CONFLICT);
        }

        // Generate activation token and set expiration
        String activationToken = UUID.randomUUID().toString();
        user.setActivationToken(activationToken);
        user.setActivationExpiresAt(LocalDateTime.now().plusHours(24));
        user.setActivated(false);
        user.setCreatedAt(LocalDateTime.now());

        // Save user and send activation email
        userService.saveUser(user);
        String activationLink = "http://localhost:3000/api/users/activate/" + activationToken;
        emailService.sendActivationEmail(user.getEmail(), activationLink);

        return new ResponseEntity<>("User registered successfully. Check your email to activate your account.", HttpStatus.CREATED);
    }

    @GetMapping("/activate/{token}")
    public ResponseEntity<String> activateUser(@PathVariable String token) {
        User user = userService.getUserByActivationToken(token);
        if (user == null || user.getActivationExpiresAt().isBefore(LocalDateTime.now())) {
            return new ResponseEntity<>("Invalid or expired activation token", HttpStatus.BAD_REQUEST);
        }

        user.setActivated(true);
        user.setActivationToken(null); // Clear the token once activated
        user.setActivationExpiresAt(null); // Clear expiration time
        userService.saveUser(user);

        return new ResponseEntity<>("Account activated successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@RequestBody User user) {
        User existingUser = userService.getUserByUsername(user.getUsername());
        if (existingUser != null && existingUser.getPassword().equals(user.getPassword()) && existingUser.isActivated()) {
            return new ResponseEntity<>("Login successful", HttpStatus.OK);
        } else if (existingUser != null && !existingUser.isActivated()) {
            return new ResponseEntity<>("Account not activated. Check your email for activation instructions.", HttpStatus.UNAUTHORIZED);
        } else {
            return new ResponseEntity<>("Invalid username or password", HttpStatus.UNAUTHORIZED);
        }
    }

    @GetMapping("/{username}")
    public ResponseEntity<User> getUserByUsername(@PathVariable String username) {
        User user = userService.getUserByUsername(username);
        return user != null ? new ResponseEntity<>(user, HttpStatus.OK) : new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }
}
