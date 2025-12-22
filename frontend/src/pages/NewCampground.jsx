import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function NewCampground() {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('location', location);
      formData.append('description', description);
      formData.append('price', price);
      
      // Append all images to formData
      images.forEach((image) => {
        formData.append('images', image);
      });

      await axios.post('http://localhost:3000/campgrounds', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate('/campgrounds');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create campground';
      console.error('Error creating campground:', errorMessage);
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1>New Campground</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title">Campground Name:</label>
          <br />
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="location">Location:</label>
          <br />
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="price">Price:</label>
          <br />
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="images">Images (multiple):</label>
          <br />
          <input
            type="file"
            id="images"
            onChange={handleImageChange}
            required
            multiple
            accept="image/*"
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {images.length > 0 && (
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              {images.length} file(s) selected
            </p>
          )}
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description">Description:</label>
          <br />
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows="4"
            disabled={uploading}
            style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={uploading}
          style={{ padding: '0.5rem 1rem' }}
        >
          {uploading ? 'Creating...' : 'Create Campground'}
        </button>
      </form>
    </div>
  );
}

export default NewCampground;