import Map from '../components/Map'

function Home() {
  return (
    <div style={{
      backgroundImage: 'url("https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      width: '100%',
      boxSizing: 'border-box',
      padding: '80px 20px 20px 20px' /* Top padding for navbar, other sides for spacing */
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <h1 style={{
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontSize: '2.5rem',
          marginBottom: '10px'
        }}>Welcome to YelpCamp</h1>
        <p style={{
          color: 'white',
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          fontSize: '1.2rem',
          marginBottom: '30px'
        }}>View our campgrounds from all over the world</p>
        <div style={{
          border: '2px solid #8B4513',
          width: '100%',
          height: '400px',
          position: 'relative',
          backgroundColor: 'white'
        }}>
          <Map style={{ width: '100%', height: '100%' }}></Map>
        </div>
      </div>
    </div>
  );
}

export default Home;
