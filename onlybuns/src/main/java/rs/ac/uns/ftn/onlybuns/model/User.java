package rs.ac.uns.ftn.onlybuns.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String surname;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "address") // New field for address
    private String address;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "activated", nullable = false)
    private boolean activated = false;

    @Column(name = "activation_token", unique = true)
    private String activationToken;

    @Column(name = "activation_expires_at")
    private LocalDateTime activationExpiresAt;

    @Column(name = "followers_count", nullable = false)
    private int followersCount = 0;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "user_followers",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "follower_id")
    )
    private Set<User> followers;

    @JsonIdentityInfo(
            generator = ObjectIdGenerators.PropertyGenerator.class,
            property = "id"
    )
    @ManyToMany(mappedBy = "followers")
    private Set<User> following;

    // Default constructor
    public User() {}

    // Constructor with address
    public User(String username, String password, String name, String surname, String email, String address, LocalDateTime createdAt) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.address = address; // Initialize address
        this.createdAt = createdAt;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address; // New getter for address
    }

    public void setAddress(String address) {
        this.address = address; // New setter for address
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public boolean isActivated() {
        return activated;
    }

    public void setActivated(boolean activated) {
        this.activated = activated;
    }

    public String getActivationToken() {
        return activationToken;
    }

    public void setActivationToken(String activationToken) {
        this.activationToken = activationToken;
    }

    public LocalDateTime getActivationExpiresAt() {
        return activationExpiresAt;
    }

    public void setActivationExpiresAt(LocalDateTime activationExpiresAt) {
        this.activationExpiresAt = activationExpiresAt;
    }

    public int getFollowersCount() {
        return followersCount;
    }

    public void setFollowersCount(int followersCount) {
        this.followersCount = followersCount;
    }

    // Getter for followers
    public Set<User> getFollowers() {
        return followers;
    }

    // Setter for followers
    public void setFollowers(Set<User> followers) {
        this.followers = followers;
    }

    // Getter for following
    public Set<User> getFollowing() {
        return following;
    }

    // Setter for following
    public void setFollowing(Set<User> following) {
        this.following = following;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", name='" + name + '\'' +
                ", surname='" + surname + '\'' +
                ", email='" + email + '\'' +
                ", address='" + address + '\'' + // Include address in toString
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", activated=" + activated +
                ", activationToken='" + activationToken + '\'' +
                ", activationExpiresAt=" + activationExpiresAt +
                ", followersCount=" + followersCount +
                '}';
    }
}
