import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import LoginPromptModal from './LoginPromptModal';
import './PostList.css';

function PostList({ posts = [], userId }) {
  const [usernames, setUsernames] = useState({});
  const [likes, setLikes] = useState({});
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginPromptAction, setLoginPromptAction] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
          setIsLoggedIn(false);
          localStorage.removeItem('authToken');
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        setIsLoggedIn(false);
        localStorage.removeItem('authToken');
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Filter posts by userId if provided
  useEffect(() => {
    if (userId) {
      setFilteredPosts(posts.filter((post) => post.userId === userId));
    } else {
      setFilteredPosts(posts);
    }
  }, [posts, userId]);

  useEffect(() => {
    if (filteredPosts.length === 0) return;

    const fetchUsernames = async () => {
      const uniqueUserIds = [...new Set(filteredPosts.map((post) => post.userId))];
      const usernamePromises = uniqueUserIds.map((userId) =>
          fetch(`http://localhost:8080/api/users/${userId}`)
              .then((response) => {
                if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);
                return response.json();
              })
              .then((userData) => {
                setUsernames((prev) => ({ ...prev, [userId]: userData.username }));
              })
              .catch((error) => {
                console.error('Error fetching user:', error);
              })
      );

      await Promise.all(usernamePromises);
    };

    fetchUsernames();
  }, [filteredPosts]);

  const handleUsernameClick = (userId) => {
    navigate(`/myprofile/${userId}`);
  };

  const handleLikeClick = async (postId) => {
    if (!isLoggedIn) {
      setLoginPromptAction(() => () => handleLikeClick(postId));
      setShowLoginPrompt(true);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to like post');

      setLikes((prevLikes) => ({
        ...prevLikes,
        [postId]: (prevLikes[postId] || 0) + 1,
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }

    alert(`Liking is still in development.`);
  };

  const handleCommentClick = (postId) => {
    if (!isLoggedIn) {
      setLoginPromptAction(() => () => handleCommentClick(postId));
      setShowLoginPrompt(true);
      return;
    }
    alert(`Commenting is still in development.`);
  };

  return (
      <div className="post-list-container">
        {filteredPosts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <h3 onClick={() => handleUsernameClick(post.userId)}>
                  {usernames[post.userId] || 'Loading...'}
                </h3>
                <p>Posted: {new Date(post.createdAt).toLocaleDateString('en-GB', { dateStyle: 'full' })}</p>
              </div>

              <div className="post-body">
                <div className="post-image-container">
                  <img src={`${window.location.origin}/${post.imagePath}`} alt="Rabbit" className="post-image" />
                </div>

                <div className="post-content">
                  <p>{post.content}</p>
                </div>
              </div>

              <div className="post-stats">
            <span className="post-likes" onClick={() => handleLikeClick(post.id)}>
              <i className="fas fa-thumbs-up"></i>
              <span>{post.likesCount + (likes[post.id] || 0)}</span>
            </span>
                <span className="post-comments" onClick={() => handleCommentClick(post.id)}>
              <i className="fas fa-comment"></i>
              <span>{post.commentsCount}</span>
            </span>
              </div>
            </div>
        ))}

        {/* Display LoginPromptModal if user is not logged in and tried to like/comment */}
        {showLoginPrompt && !isLoggedIn && (
            <LoginPromptModal
                onClose={() => setShowLoginPrompt(false)}
                onLogin={() => {
                  setShowLoginPrompt(false);
                  if (loginPromptAction) loginPromptAction();
                }}
            />
        )}
      </div>
  );
}

export default PostList;
