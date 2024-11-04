import React, { useState } from 'react';

function PostForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [locationId, setLocationId] = useState('');

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content || !image || !locationId) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('userId', 1);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('locationId', locationId); // Add locationId to formData

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Description:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter a description for your post"
          required
        />
      </div>

      <div>
        <label>Upload Rabbit Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </div>

      <div>
        <label>Location ID:</label>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Enter location ID"
          required
        />
      </div>

      <button type="submit">Create Post</button>
    </form>
  );
}

export default PostForm;
