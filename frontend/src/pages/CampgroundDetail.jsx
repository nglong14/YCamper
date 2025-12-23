import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ImageCarousel from './ImageCarousel'
import axios from 'axios';

function CampgroundDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [campground, setCampground] = useState(null);
  const [loading, setLoading] = useState(true);
  const [review, setReview] = useState({ rating: 5, body: '' });
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [guide, setGuide] = useState(null);
  const [guideLoading, setGuideLoading] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const campgroundRes = await axios.get(`http://localhost:3000/campgrounds/${id}`);
        setCampground(campgroundRes.data);
      } catch (err) {
        console.error('Error fetching campground:', err);
      } finally {
        setLoading(false);
      }
      try {
        const userRes = await axios.get('http://localhost:3000/users/current', { withCredentials: true });
        setUser(userRes.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setUserLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const fetchGuide = async () => {
    setGuideLoading(true);
    try{
      const response = await axios.get(`http://localhost:3000/guides/campgrounds/${id}`);
      setGuide(response.data.guide);
    } catch (error){
      console.log('Error fetching guide: ', error);
      setGuide('Failed to get guide');
    } finally {
      setGuideLoading(false);
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this campground?')) {
      try {
        await axios.delete(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true });
        navigate('/campgrounds');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete campground';
        console.error('Error deleting campground:', errorMessage);
        alert(errorMessage);
      }
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:3000/campgrounds/${id}/reviews`, review, { withCredentials: true });
      setReview({ rating: 5, body: '' });
      // Refresh campground data to show new review
      const res = await axios.get(`http://localhost:3000/campgrounds/${id}`);
      setCampground(res.data);
      alert('Review added successfully!');
    } catch (err) {
      console.error('Error adding review:', err);
      alert('Failed to add review');
    }
  };

  const handleReviewDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await axios.delete(`http://localhost:3000/campgrounds/${id}/reviews/${reviewId}`, { withCredentials: true });
        // Refresh campground data to remove deleted review
        const res = await axios.get(`http://localhost:3000/campgrounds/${id}`, { withCredentials: true });
        setCampground(res.data);
        alert('Review deleted successfully!');
      } catch (err) {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to delete review';
        console.error('Error deleting review:', errorMessage);
        alert(errorMessage);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!campground) return <div>Campground not found</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{campground.title}</h1>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
        {/* Left Column - Campground Info */}
        <div style={{ flex: '1', maxWidth: '500px' }}>
          {/* {
            campground.images && campground.images.map((img, index) => (
              <img 
                key={index}
                src={img.url} 
                alt={campground.title} 
                style={{ width: '100%', height: 'auto', borderRadius: '8px' }} 
              />
            ))
          } */}
          <ImageCarousel images={campground.images} title={campground.title}/>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem', color: '#666' }}>{campground.location}</p>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem', color: '#666' }}>Submitted by: {campground.author.username}</p>
          <div style={{ marginTop: '1rem' }}>
            {!userLoading && user && (
              <>
                <Link to={`/campgrounds/${id}/edit`}>
              <button style={{ padding: '0.5rem 1rem' }}>
                Edit Campground
              </button>
                </Link>
            <button 
              onClick={handleDelete} 
              style={{ padding: '0.5rem 1rem', marginLeft: '1rem', backgroundColor: '#dc3545', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
            >
              Delete Campground
            </button>
              </>
            )}
          </div>
        </div>

        {/* Right Column - Reviews and Guide */}
        <div style={{ flex: '1' }}>
          {/*Tour guide*/ }
          <div style = {{marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px', backgroundColor:'#f9f9f9'}}>
            <h2>Tour guide for {campground.location}</h2>
            <button
              onClick={fetchGuide}
              style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px', marginBottom: '1rem' }}
            >
              {guideLoading ? 'Loading...' : 'Fetch Tour Guide'}
            </button>
            {guideLoading ? (<p>Loading tour guide information...</p>) : (
              <div style={{ whiteSpace: 'pre-line' }}>
                {guide ? (
                  guide.split('\n').map((line, index) => (
                    <p key = {index} style={{margin: '0.5rem 0'}}>{line}</p>
                  ))
                ) : (
                  <p>No tour guide</p>
                )}
              </div>
            )}
          </div>
          {/* Add Review Form - only show if logged in */}
          {!userLoading && user && (
            <div style={{ marginBottom: '2rem' }}>
              <h2>Leave a Review</h2>
              <form onSubmit={handleReviewSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="rating" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Rating:
                  </label>
                  <select 
                    id="rating"
                    value={review.rating} 
                    onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}
                    style={{ padding: '0.5rem', width: '100%' }}
                    required
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label htmlFor="reviewBody" style={{ display: 'block', marginBottom: '0.5rem' }}>
                    Review:
                  </label>
                  <textarea 
                    id="reviewBody"
                    value={review.body} 
                    onChange={(e) => setReview({ ...review, body: e.target.value })}
                    style={{ padding: '0.5rem', width: '100%', minHeight: '100px' }}
                    required
                    placeholder="Write your review here..."
                  />
                </div>
                <button 
                  type="submit"
                  style={{ padding: '0.5rem 1rem', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '4px' }}
                >
                  Submit Review
                </button>
              </form>
            </div>
          )}
          {/* Optionally, show a message if not logged in */}
          {!userLoading && !user && (
            <div style={{ marginBottom: '2rem', color: '#888' }}>
              <h2>Leave a Review</h2>
              <p>You must be logged in to leave a review.</p>
            </div>
          )}

          {/* Display Reviews */}
          {campground.reviews && campground.reviews.length > 0 && (
            <div>
              <h2>Reviews</h2>
              {campground.reviews.map((rev) => {
                console.log('Review:', rev);
                console.log('Review Author:', rev.author);
                console.log('Review Author Username:', rev.author?.username);
                return (
                <div key={rev._id} style={{ 
                  border: '1px solid #ddd', 
                  padding: '1rem', 
                  marginBottom: '1rem', 
                  borderRadius: '8px',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold', color: '#ffa500' }}>
                    {'⭐'.repeat(rev.rating)} ({rev.rating}/5)
                    </div>
                    {rev.author && (
                      <p style={{ margin: '0', color: '#555', fontSize: '0.9rem', fontWeight: '500' }}>
                        — {rev.author.username}
                      </p>
                    )}
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{rev.body}</p>
                  {!userLoading && user && <button
                    onClick={() => handleReviewDelete(rev._id)}
                    style={{
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '4px',
                      fontSize: '0.9rem'
                    }}
                  >
                    Delete Review
                  </button>}
                </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CampgroundDetail;
