package rs.ac.uns.ftn.onlybuns.controller;

import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import rs.ac.uns.ftn.onlybuns.model.User;
import rs.ac.uns.ftn.onlybuns.service.EmailService;
import rs.ac.uns.ftn.onlybuns.service.UserService;
import rs.ac.uns.ftn.onlybuns.util.JwtUtil;

import java.util.HashMap;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    public UserController(UserService userService, EmailService emailService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.emailService = emailService;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@RequestBody User user) {
        Map<String, String> response = new HashMap<>();

        // Check if username or email already exists
        if (userService.getUserByUsername(user.getUsername()) != null) {
            response.put("message", "Username already exists");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }
        if (userService.getUserByEmail(user.getEmail()) != null) {
            response.put("message", "Email already exists");
            return new ResponseEntity<>(response, HttpStatus.CONFLICT);
        }

        // Set additional fields and encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setFollowersCount(0);  // Set initial follower count if applicable
        user.setActivated(false);
        user.setActivationToken(UUID.randomUUID().toString());
        user.setActivationExpiresAt(LocalDateTime.now().plusHours(24));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        // Save user
        userService.registerUser(user);

        // Send activation email with error handling
        try {
            // Include both token and email in the activation link
            String activationLink = "http://localhost:3000/activate/" + user.getActivationToken() + "?email=" + user.getEmail();

            emailService.sendActivationEmail(user.getEmail(), activationLink);
        } catch (Exception e) {
            response.put("message", "User registered successfully, but activation email could not be sent.");
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        response.put("message", "User registered successfully. Check your email to activate your account.");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/activate/{token}")
    public ResponseEntity<Map<String, String>> activateUser(
            @PathVariable("token") String token,
            @RequestParam("email") String email) {

        Map<String, String> response = new HashMap<>();
        User user = userService.getUserByEmail(email);  // Find user by email


        if (user == null) {
            response.put("message", "Invalid activation link, no user with this email.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }

        if(user.isActivated()){
            response.put("message", "Account activated successfully");
            return ResponseEntity.ok(response);
        }

        if (!token.equals(user.getActivationToken()) || user.getActivationExpiresAt().isBefore(LocalDateTime.now())) {
            response.put("message", "Invalid or expired activation token");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
        // Activate user account
        user.setActivated(true);
        user.setActivationToken(null);
        user.setActivationExpiresAt(null);
        userService.saveUser(user);

        response.put("message", "Account activated successfully");
        return ResponseEntity.ok(response); // Return success response
    }


    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@RequestBody Map<String, String> credentials) {
        Map<String, String> response = new HashMap<>();
        String username = credentials.get("username");
        String password = credentials.get("password");

        User existingUser = userService.getUserByUsername(username);

        // Check if user exists
        if (existingUser == null) {
            response.put("message", "Login failed. User with the provided username does not exist.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Verify password
        if (!passwordEncoder.matches(password, existingUser.getPassword())) {
            response.put("message", "Login failed. Please reenter your password.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Check if account is activated
        if (!existingUser.isActivated()) {
            response.put("message", "Account not activated. Check your email for activation instructions.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }

        // Generate JWT token upon successful login
        String jwtToken = JwtUtil.generateToken(existingUser.getId());

        // Set success message and token in response
        response.put("message", "Login successful");
        response.put("token", jwtToken);

        return ResponseEntity.ok(response);
    }


    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, String>> getUserInfo(@PathVariable Long userId) {
       // logger.info("Received request to get user info for userId: {}", userId);

        User user = userService.findById(userId);

        if (user == null) {
            //logger.warn("User with userId {} not found", userId);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Map<String, String> response = new HashMap<>();
        response.put("username", user.getUsername());
       // logger.info("Successfully retrieved username for userId {}: {}", userId, user.getUsername());

        return new ResponseEntity<>(response, HttpStatus.OK);
    }



    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        System.out.println("Fetching all users...");
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
