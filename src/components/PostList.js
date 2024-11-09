import React, { useEffect, useState } from 'react';

function PostList({ posts }) {
  const [usernames, setUsernames] = useState({});

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueUserIds = [...new Set(posts.map((post) => post.userId))];
      const usernamePromises = uniqueUserIds.map((userId) => {
        return fetch(`http://localhost:8080/api/users/id/${userId}`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch user ${userId}`);
            }
            return response.json();
          })
          .then((userData) => {
            setUsernames((prev) => ({
              ...prev,
              [userId]: userData.username
            }));
          })
          .catch((error) => {
            console.error('Error fetching user:', error);
          });
      });

      await Promise.all(usernamePromises);
    };

    fetchUsernames();
  }, [posts]); // Re-run when `posts` change

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="post" style={{ marginBottom: '2rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <div style={{ marginLeft: '0.5rem' }}>
            <h3>{usernames[post.userId] || 'Loading...'}</h3>
            {/*<p>Location: {post.locationId}</p>*/}
            <p>
              Posted: {new Date(post.createdAt).toLocaleDateString('en-GB', {
                dateStyle: 'full'
              })}
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <img src={`data:image/jpeg;base64,${post.imageData}`} alt="Rabbit" style={{ maxWidth: '100%', borderRadius: '8px' }} />
          </div>
          <div style={{ marginLeft: '0.5rem' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{post.content}</p>
          </div>
          <div style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', color: '#6a1b9a' }}>
              <i className="fas fa-thumbs-up" style={{ fontSize: '2rem', marginRight: '0.5rem' }}></i>
              <span style={{ fontSize: '1.25rem' }}>{post.likesCount}</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '1.5rem', color: '#6a1b9a' }}>
              <i className="fas fa-comment" style={{ fontSize: '2rem', marginRight: '0.5rem' }}></i>
              <span style={{ fontSize: '1.25rem' }}>{post.commentsCount}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default PostList;
