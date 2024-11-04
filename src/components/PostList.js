import React, { useState, useEffect } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/posts', { // Corrected the URL to include the proper protocol
      method: 'GET'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching posts:', error));
  }, []);

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.userId}</h3>
          <p>{post.content}</p>
          <img src={`data:image/jpeg;base64,${post.imageData}`} alt="Rabbit" />
          <p>Location: {post.locationId}</p>
          <p>Likes: {post.likeCount}</p>
        </div>
      ))}
    </div>
  );
}

export default PostList;
