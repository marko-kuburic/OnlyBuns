package rs.ac.uns.ftn.onlybuns.service;

import rs.ac.uns.ftn.onlybuns.model.User;

import java.util.List;

public interface UserService {
    User saveUser(User user); // Method for saving a new user
    User getUserByUsername(String username); // Method for retrieving a user by username
    User getUserById(Long id);
    List<User> getAllUsers(); // Method for retrieving all users
    User updateUser(Long id, User updatedUser); // Method for updating a user
    void deleteUser(Long id); // Method for deleting a user
}
