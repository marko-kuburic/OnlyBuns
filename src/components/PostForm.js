import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../App.css';
import mapIcon from '../static/map_icon.png';
import jwt_decode from "jwt-decode";

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState([45.2671, 19.8335]); // Default position

  const defaultIcon = new L.Icon({
    iconUrl: mapIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng, 'Selected Address'); // Placeholder address
    },
  });

  return <Marker position={position} icon={defaultIcon}></Marker>;
}

function PostForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Only .jpg files are allowed.');
        e.target.value = null;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!content || !image || !latitude || !longitude || !address) {
      alert('Please fill in all fields.');
      return;
    }

    const formData = new FormData();
    const token = localStorage.getItem('authToken');
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.userId;
      formData.append('userId', userId);
    }

    formData.append('content', content);
    formData.append('image', image);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('address', address);

    // Send POST request to the backend
    fetch('http://localhost:8080/api/posts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`, // If needed for authentication
      },
      body: formData,
    })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to create post');
          }
          return response.json();
        })
        .then((data) => {
          // Handle successful post creation (optional)
          console.log('Post created:', data);
          onSubmit(formData, () => {
            setContent('');
            setImage(null);
            setImagePreview(null);
            setLatitude('');
            setLongitude('');
            setAddress('');
          });
        })
        .catch((error) => {
          console.error('Error creating post:', error);
          alert('Failed to create post.');
        });
  };

  const handleLocationSelect = (lat, lng, selectedAddress) => {
    setLatitude(lat);
    setLongitude(lng);
    setAddress(selectedAddress);
  };

  return (
      <form onSubmit={handleSubmit} className="post-form">
        <div className="form-group">
          <label>Description:</label>
          <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter a description for your post"
              required
          />
        </div>

        <div className="form-group">
          <label>Select location:</label>
          <MapContainer
              center={[45.2671, 19.8335]}
              zoom={15}
              style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
          >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
          </MapContainer>

        </div>

        <div className="form-group">
          <label>Upload Rabbit Image:</label>
          <input
              type="file"
              accept=".jpg"
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
