package rs.ac.uns.ftn.onlybuns.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Arrays;

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId; // Changed to store user ID directly

    @Column(name = "latitude")
    private Double latitude;

    @Column(name = "longitude")
    private Double longitude;

    @Column(name = "address", length = 255)
    private String address;

    //@Lob
    @Column(name = "image_data", nullable = false)
    private byte[] imageData;

    @Column(nullable = false, length = 1000)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "likes_count", nullable = false)
    private int likesCount;

    @Column(name = "comments_count", nullable = false)
    private int commentsCount;

    // Constructors
    public Post() {}

    public Post(Long id, Long userId, Double latitude, Double longitude, String address, String content, byte[] imageData, LocalDateTime createdAt, LocalDateTime updatedAt, int likesCount, int commentsCount) {
        this.id = id;
        this.userId = userId;
        this.latitude = latitude;
        this.longitude = longitude;
        this.address = address;
        this.content = content;
        this.imageData = imageData;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.likesCount = likesCount;
        this.commentsCount = commentsCount;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public byte[] getImageData() {
        return imageData;
    }

    public void setImageData(byte[] imageData) {
        this.imageData = imageData;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public int getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(int likesCount) {
        this.likesCount = likesCount;
    }

    public int getCommentsCount() {
        return commentsCount;
    }

    public void setCommentsCount(int commentsCount) {
        this.commentsCount = commentsCount;
    }

    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", userId=" + userId +
                ", latitude=" + latitude +
                ", longitude=" + longitude +
                ", address='" + address + '\'' +
                ", imageData=" + Arrays.toString(imageData) +
                ", content='" + content + '\'' +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                ", likesCount=" + likesCount +
                ", commentsCount=" + commentsCount +
                '}';
    }
}
