import React from 'react';
import PostForm from './components/PostForm';
import PostList from './components/PostList';

function App() {
  const handlePostSubmit = (formData) => {
    const requestBody = new FormData();
    
    // Append the other fields from formData
    for (const [key, value] of formData.entries()) {
      requestBody.append(key, value);
    }
  
    // Append additional fields directly
    requestBody.append('userId', 1); // Assuming user ID is 1; update as necessary
    requestBody.append('locationId', 1); // Assuming location ID is 1; update as necessary
  
    fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      body: requestBody, // Directly send the FormData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Post created:', data);
      })
      .catch((error) => console.error('Error creating post:', error));
  };
  

  return (
    <div className="App">
      <h1>Post Your Rabbit</h1>
      <PostForm onSubmit={handlePostSubmit} />
      <PostList />
    </div>
  );
}

export default App;
