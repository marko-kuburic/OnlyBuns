import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';  // Import Leaflet
import 'leaflet/dist/leaflet.css';
import '../App.css';
import mapIcon from '../static/map_icon.png';

function LocationMarker({ onLocationSelect }) {
  const [position, setPosition] = useState([45.2671, 19.8335]); // Default position

  const defaultIcon = new L.Icon({
    iconUrl: mapIcon, // Custom marker image
    iconSize: [32, 32], // Size of the marker
    iconAnchor: [16, 32], // Anchor point of the icon
    popupAnchor: [0, -32], // Popup position when clicked on marker
  });

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return <Marker position={position} icon={defaultIcon}></Marker>; // Apply the custom icon to the marker
}

function PostForm({ onSubmit }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('Temp');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type;
      if (fileType === 'image/jpeg' || fileType === 'image/jpg') {
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert('Only .jpg files are allowed.');
        e.target.value = null; // Reset the file input if an invalid file is selected
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
    formData.append('userId', 1);
    formData.append('content', content);
    formData.append('image', image);
    formData.append('latitude', latitude);
    formData.append('longitude', longitude);
    formData.append('address', address);

    onSubmit(formData, () => {
      setContent('');
      setImage(null);
      setImagePreview(null);
      setLatitude('');
      setLongitude('');
      setAddress('');
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setLatitude(lat);
    setLongitude(lng);
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
          <label>Select location:</label>
          <MapContainer
              center={[45.2671, 19.8335]} // Center map on Novi Sad or desired location
              zoom={15} // Higher zoom level for more details
              style={{ height: '300px', width: '100%', marginBottom: '1rem' }}
          >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker onLocationSelect={handleLocationSelect} />
          </MapContainer>
        </div>

        <div>
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
