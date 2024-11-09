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
    public User registerUser(User user) {
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
}
