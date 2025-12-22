import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './Navbar.css';

function Navbar() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data } = await axios.get('http://localhost:3000/users/current', { withCredentials: true });
        console.log('Current user data:', data);
        setUser(data.user);
      } catch (err) {
        console.error('Error fetching current user:', err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCurrentUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
      setUser(null);
      window.location.href = '/';
    } catch (err) {
      console.error('Error logging out:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">YelpCamp</Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/campgrounds">Campgrounds</Link>
        <Link to="/campgrounds/new">New Campground</Link>
      </div>
      <div className="navbar-actions">
        {!loading && (
          <>
            {/* {console.log('Rendering navbar - user:', user, 'loading:', loading)} */}
            {user ? (
              <>
                <span style={{ color: 'white', marginRight: '1rem' }}>Welcome, {user.username}!</span>
                <button onClick={handleLogout} style={{
                  padding: '0.5rem 1rem',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/users/login">Login</Link>
                <Link to="/users/register">Register</Link>
              </>
            )}
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
