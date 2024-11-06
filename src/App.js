import React, { useState, useEffect } from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = () => {
    fetch('http://localhost:8080/api/posts')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched posts:', data); // Debugging line
        setPosts(data);
      })
      .catch((error) => console.error('Error fetching posts:', error));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePostSubmit = (formData, resetFormCallback) => {
    fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Post created:', data);
        fetchPosts(); // Refresh posts after new post submission
        if (resetFormCallback) resetFormCallback(); // Optionally clear form fields
      })
      .catch((error) => console.error('Error creating post:', error));
  };

  return (
    <div className="App">
      <h1>Share Your Rabbit Story</h1>
      <PostForm onSubmit={handlePostSubmit} />
      <PostList posts={posts} />
    </div>
  );
}

export default App;
