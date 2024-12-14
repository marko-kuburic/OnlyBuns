package rs.ac.uns.ftn.onlybuns.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import rs.ac.uns.ftn.onlybuns.model.User;
import rs.ac.uns.ftn.onlybuns.repository.UserRepository;
import rs.ac.uns.ftn.onlybuns.service.UserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Isolation;


@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }


    public void updatePassword(Long userId, String newPassword) {
        User user = getUserById(userId);
        if (user != null) {
            user.setPassword(newPassword);
            userRepository.save(user);
        }
    }

    public void updateAddress(Long userId, String newAddress) {
        User user = getUserById(userId);
        if (user != null) {
            user.setAddress(newAddress);
            userRepository.save(user);
        }
    }

    public void updateName(Long userId, String newName) {
        User user = getUserById(userId);
        if (user != null) {
            user.setName(newName);
            userRepository.save(user);
        }
    }

    public void updateSurname(Long userId, String newSurname) {
        User user = getUserById(userId);
        if (user != null) {
            user.setSurname(newSurname);
            userRepository.save(user);
        }
    }





    @Override
    public User getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    public User getUserByActivationToken(String token) {
        return userRepository.findByActivationToken(token);
    }

    public User getUserById(Long id){ return userRepository.findUserById(id);}

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();
            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));  // Re-encode password on update
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setUpdatedAt(LocalDateTime.now());
            return userRepository.save(existingUser);
        }
        return null;
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    @Transactional(isolation = Isolation.SERIALIZABLE)
    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        try {
            // Simulate a long operation (for testing purposes)
            Thread.sleep(10000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("Unexpected error occurred during registration");
        }

        return userRepository.save(user);
    }


    @Override
    public boolean loginUser(String rawPassword, String storedPassword) {
        return passwordEncoder.matches(rawPassword, storedPassword); // Match password on login
    }

    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElse(null);
    }

    public void updateLastLogin(Long userId) {
        User user = getUserById(userId);
        if (user != null) {
            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);
        }
    }
}
