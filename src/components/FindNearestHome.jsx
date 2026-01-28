import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/FindNearestHome.css';

const HOMES = [
  {
    id: 'bellavista-barry',
    name: 'Bellavista Nursing Home Barry',
    address: '106-108 Tynewydd Road, Barry, CF62 8BB',
    lat: 51.405,
    lng: -3.268,
    image: '/home-images/barry.jpg',
    url: '/bellavista-barry'
  },
  {
    id: 'bellavista-cardiff',
    name: 'Bellavista Nursing Home Cardiff',
    address: 'Near Techniquest, Cardiff Bay, CF10 5BW',
    lat: 51.464,
    lng: -3.165,
    image: '/home-images/cardiff.jpg',
    url: '/bellavista-cardiff'
  },
  {
    id: 'baltimore-care-home',
    name: 'Baltimore House Care Home',
    address: '1 & 2 Park Road, Barry, CF62 6NU',
    lat: 51.398,
    lng: -3.285,
    image: '/home-images/baltimore.jpg',
    url: '/baltimore-care-home'
  },
  {
    id: 'college-fields-nursing-home',
    name: 'College Fields Nursing Home',
    address: 'College Fields, College Road, Barry, CF62 8LE',
    lat: 51.408,
    lng: -3.282,
    image: '/home-images/college-fields.jpg',
    url: '/college-fields-nursing-home'
  },
  {
    id: 'meadow-vale-cwtch',
    name: 'Meadow Vale Cwtch',
    address: 'Near Cardiff Airport, Rhoose, Vale of Glamorgan',
    lat: 51.390,
    lng: -3.345,
    image: '/home-images/meadow-vale-cwtch.jpg',
    url: '/meadow-vale-cwtch'
  },
  {
    id: 'waverley-care-center',
    name: 'Waverley Care Centre',
    address: '122-124 Plymouth Road, Penarth, CF64 5DN',
    lat: 51.432,
    lng: -3.175,
    image: '/home-images/waverley.jpg',
    url: '/waverley-care-center'
  }
];

const FindNearestHome = () => {
  const [postcode, setPostcode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [nearestHome, setNearestHome] = useState(null);
  const [userLocation, setUserLocation] = useState(null); // { lat, lng }

  // Haversine formula to calculate distance in miles
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3959; // Radius of Earth in miles
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearest = (lat, lng) => {
    let minDistance = Infinity;
    let closest = null;

    HOMES.forEach(home => {
      const distance = calculateDistance(lat, lng, home.lat, home.lng);
      if (distance < minDistance) {
        minDistance = distance;
        closest = { ...home, distance: distance.toFixed(1) };
      }
    });

    setNearestHome(closest);
    setUserLocation({ lat, lng });
  };

  const handleUseLocation = () => {
    setLoading(true);
    setError('');
    setNearestHome(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        findNearest(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        console.error(err);
        setError('Unable to retrieve your location. Please try entering your postcode.');
        setLoading(false);
      }
    );
  };

  const handlePostcodeSearch = async (e) => {
    e.preventDefault();
    if (!postcode.trim()) return;

    setLoading(true);
    setError('');
    setNearestHome(null);

    try {
      // Use postcodes.io API for UK postcodes
      const response = await fetch(`https://api.postcodes.io/postcodes/${postcode.trim()}`);
      const data = await response.json();

      if (data.status === 200 && data.result) {
        const { latitude, longitude } = data.result;
        findNearest(latitude, longitude);
      } else {
        setError('Invalid postcode. Please check and try again.');
      }
    } catch (err) {
      console.error(err);
      setError('Unable to search postcode. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openGoogleMaps = () => {
    if (!nearestHome || !userLocation) return;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${nearestHome.lat},${nearestHome.lng}`;
    window.open(url, '_blank');
  };

  return (
    <section className="find-nearest-section">
      <div className="container">
        <div className="find-nearest-wrapper">
          <div className="find-nearest-content">
            <h2 className="section-title">Find Your Nearest Home</h2>
            <p className="section-subtitle">
              Discover the closest Bellavista care home to you and your loved ones.
            </p>

            <div className="search-controls">
              <form onSubmit={handlePostcodeSearch} className="postcode-form">
                <div className="input-group">
                  <input
                    type="text"
                    placeholder="Enter Your Postcode..."
                    value={postcode}
                    onChange={(e) => setPostcode(e.target.value)}
                    className="postcode-input"
                  />
                  <button type="submit" className="btn btn-search" disabled={loading} aria-label="Search">
                    {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-arrow-right"></i>}
                  </button>
                </div>
              </form>

              <div className="divider-elegant">
                <span>or</span>
              </div>

              <button 
                onClick={handleUseLocation} 
                className="btn-location-ghost"
                disabled={loading}
              >
                <i className="fas fa-location-arrow"></i> Use my current location
              </button>
            </div>

            {error && <div className="error-message"><i className="fas fa-exclamation-circle"></i> {error}</div>}
          </div>

          {nearestHome && (
            <div className="nearest-result-card fade-in">
              <button 
                className="close-result-btn" 
                onClick={() => setNearestHome(null)}
                aria-label="Close result"
              >
                <i className="fas fa-times"></i>
              </button>
              <div className="result-image">
                <img src={nearestHome.image} alt={nearestHome.name} />
                <div className="distance-badge">
                  <i className="fas fa-route"></i> {nearestHome.distance} miles away
                </div>
              </div>
              <div className="result-details">
                <h3>{nearestHome.name}</h3>
                <p className="result-address"><i className="fas fa-map-marker-alt"></i> {nearestHome.address}</p>
                <div className="result-actions">
                  <button onClick={openGoogleMaps} className="btn btn-primary map-btn">
                    <i className="fas fa-directions"></i> Get Directions
                  </button>
                  <Link to={nearestHome.url} className="btn btn-outline view-home-btn">
                    View Home Details
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FindNearestHome;
