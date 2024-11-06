import React, { useState } from 'react';
import '../App.css';

function PostForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [locationId, setLocationId] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
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
    formData.append('locationId', locationId);

    onSubmit(formData, () => {
      // Reset form fields after successful submission
      setContent('');
      setImage(null);
      setImagePreview(null);
      setLocationId('');
    });
  };

  return (
    <form onSubmit={handleSubmit} className="post-form">
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
        <label>Location ID:</label>
        <input
          type="text"
          value={locationId}
          onChange={(e) => setLocationId(e.target.value)}
          placeholder="Enter location ID"
          required
        />
      </div>

      <div>
        <label>Upload Rabbit Image:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          id="file-input"
          style={{ display: 'none' }}
        />
        <button
          type="button"
          className="upload-button"
          onClick={() => document.getElementById('file-input').click()}
        >
          Browse...
        </button>
      </div>

      {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}

      <button type="submit" className="submit-button">Create Post</button>
    </form>
  );
}

export default PostForm;
