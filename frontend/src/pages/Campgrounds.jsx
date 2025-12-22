import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Campgrounds() {
  const [campgrounds, setCampgrounds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/campgrounds')
      .then(res => {
        setCampgrounds(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching campgrounds:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>All Campgrounds</h1>
      <div className="campgrounds-list">
        {campgrounds.map(camp => (
          <div key={camp._id} className="campground-card">
            <div className="campground-image-wrapper">
              <img
                src={camp.images[Math.floor(Math.random() * (camp.images.length))].url}
                alt={camp.title}
                className="campground-image"
              />
            </div>
            <div className="campground-info">
              <h3>{camp.title}</h3>
              <h4>{camp.description}</h4>
              <button>
                <Link to={`/campgrounds/${camp._id}`}>View Details</Link>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Campgrounds;
