import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditCampground() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [images, setImages] = useState([]);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true })
      .then(res => {
        setTitle(res.data.title || '');
        setLocation(res.data.location || '');
        setDescription(res.data.description || '');
        setPrice(res.data.price ?? '');
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campground:', err);
        setLoading(false);
      });
  }, [id]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   try {
  //     await axios.put(`http://localhost:3000/campgrounds/${id}`, {
  //       title,
  //       location,
  //       image,
  //       description,
  //       price,
  //     }, { withCredentials: true });
  //     navigate(`/campgrounds/${id}`);
  //   } catch (err) {
  //     const errorMessage = err.response?.data?.message || err.message || 'Failed to update campground';
  //     console.error('Error updating campground:', errorMessage);
  //     alert(errorMessage);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
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

      await axios.put(`http://localhost:3000/campgrounds/${id}`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      navigate(`/campgrounds/${id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to create campground';
      console.error('Error updating campground:', errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
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
          <label htmlFor="images">Image (multiple):</label>
          <br />
          <input
            type="file"
            id="images"
            required
            multiple
            onChange={handleImageChange}
            style={{ width: '100%', padding: '0.5rem' }}
          />
          {images.length > 0 && (
            <p style={{ marginTop: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
              {images.length} file(s) selected
            </p>
          )}
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
