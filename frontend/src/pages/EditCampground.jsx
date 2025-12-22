import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditCampground() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true })
      .then(res => {
        setTitle(res.data.title || '');
        setLocation(res.data.location || '');
        setImage(res.data.image || '');
        setDescription(res.data.description || '');
        setPrice(res.data.price ?? '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campground:', err);
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await axios.put(`http://localhost:3000/campgrounds/${id}`, {
        title,
        location,
        image,
        description,
        price,
      }, { withCredentials: true });
      navigate(`/campgrounds/${id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to update campground';
      console.error('Error updating campground:', errorMessage);
      alert(errorMessage);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Edit Campground</h1>
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
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="image">Image URL:</label>
          <br />
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
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
            style={{ width: '100%', padding: '0.5rem' }}
          />
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
            style={{ width: '100%', padding: '0.5rem', resize: 'vertical' }}
          />
        </div>
        
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Update Campground
        </button>
      </form>
    </div>
  );
}

export default EditCampground;
