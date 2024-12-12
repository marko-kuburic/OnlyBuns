package rs.ac.uns.ftn.onlybuns.service;

import rs.ac.uns.ftn.onlybuns.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user); // Method for saving a new user
    User getUserByUsername(String username); // Method for retrieving a user by username
    User getUserByEmail(String email); // Method for retrieving a user by email
    User getUserByActivationToken(String token); // Method for retrieving a user by activation token
    User getUserById(Long id);
    List<User> getAllUsers(); // Method for retrieving all users
    User updateUser(Long id, User updatedUser); // Method for updating a user
    void deleteUser(Long id); // Method for deleting a user
    User registerUser(User user);
    boolean loginUser(String rawPassword, String storedPassword);
    User findById(Long id);
    public void updatePassword(Long userId, String newPassword);
    public void updateAddress(Long userId, String newAddress);
    public void updateName(Long userId, String newName);
    public void updateSurname(Long userId, String newSurname);
    public void updateLastLogin(Long userId);
}
