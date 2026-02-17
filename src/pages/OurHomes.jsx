import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHomes } from '../services/homeService';
import { decodeHtmlEntities } from '../utils/htmlUtils';
import '../styles/OurHomes.css';
import SEO from '../components/SEO';

const getLinkFromName = (name) => {
  const normalized = (name || '').toLowerCase().trim();
  if (normalized.includes('cardiff')) return '/bellavista-cardiff';
  if (normalized.includes('barry')) return '/bellavista-barry';
  if (normalized.includes('waverley')) return '/waverley-care-center';
  if (normalized.includes('college fields')) return '/college-fields-nursing-home';
  if (normalized.includes('baltimore')) return '/baltimore-care-home';
  if (normalized.includes('meadow vale')) return '/meadow-vale-cwtch';
  if (normalized.includes('pontypridd')) return '/bellavista-pontypridd';
  return '#';
};

const OurHomes = ({ isStandalone = false }) => {
  const [homes, setHomes] = useState([]);
  const [imageIndices, setImageIndices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHomes = async () => {
      let cached = null;
      try {
        // 1. Try to load from cache first for instant render
        const cachedRaw = sessionStorage.getItem('bellavista_homes_data');
        if (cachedRaw) {
          cached = cachedRaw;
          const parsed = JSON.parse(cachedRaw);
          setHomes(parsed);
          setImageIndices(parsed.map(() => 0));
          setLoading(false); // Stop loading immediately if cache exists
        }

        // 2. Fetch fresh data from database (always required, no fallback)
        const data = await fetchHomes();
        if (data && data.length > 0) {
           const mappedHomes = data.map(h => {
             const activityImgs = (h.activityImages || []).map(img => 
               typeof img === 'object' ? img.url : img
             );
             
             // Use main image + cardImage2 (or fallback to first activity image for backward compatibility)
             let secondCardImage = h.cardImage2;
             if (!secondCardImage && activityImgs.length > 0) {
                secondCardImage = activityImgs[0];
             }

             const cardImages = [h.homeImage, secondCardImage].filter(Boolean);
             
             return {
               id: h.id,
               name: h.homeName,
               location: h.homeLocation,
               description: h.homeDesc,
               features: h.facilitiesList || [],
               images: cardImages.length > 0 ? cardImages : ['https://placehold.co/400x300?text=No+Image'],
               link: getLinkFromName(h.homeName)
             };
           });
           
           // Update state and cache
           setHomes(mappedHomes);
           sessionStorage.setItem('bellavista_homes_data', JSON.stringify(mappedHomes));
           
           // Only reset indices if we didn't have cache (to avoid jumping images)
           if (!cached) {
             setImageIndices(mappedHomes.map(() => 0));
           }
        }
      } catch (err) {
        console.error("Error loading homes:", err);
        // Use cache if available, otherwise empty state (no fallback)
        if (cached) {
          const parsed = JSON.parse(cached);
          setHomes(parsed);
          setImageIndices(parsed.map(() => 0));
        } else {
          setHomes([]);
          setImageIndices([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadHomes();
  }, []);

  useEffect(() => {
    if (homes.length === 0) return;

    const interval = setInterval(() => {
      setImageIndices(prev => prev.map((currentIndex, homeIndex) => {
        const home = homes[homeIndex];
        if (!home || !home.images || home.images.length === 0) return 0;
        return (currentIndex + 1) % home.images.length;
      }));
    }, 4000); // Slower rotation

    return () => clearInterval(interval);
  }, [homes]);

  const handleImageChange = (homeIndex, imageIndex) => {
    setImageIndices(prev => {
      const newIndices = [...prev];
      newIndices[homeIndex] = imageIndex;
      return newIndices;
    });
  };

  if (loading && homes.length === 0) {
    return (
        <div className={`our-homes-page ${isStandalone ? 'standalone' : ''}`}>
             <div className="container" style={{textAlign:'center', padding:'50px'}}>
                 <i className="fas fa-spinner fa-spin" style={{fontSize:'2rem'}}></i> Loading homes...
             </div>
        </div>
    );
  }

  return (
    <div className={`our-homes-page ${isStandalone ? 'standalone' : ''}`}>
      {isStandalone && (
        <SEO 
          title="Our Care Homes | Bellavista Nursing Homes"
          description="Browse the Bellavista group of nursing homes across South Wales and discover high-quality, homely care environments in Barry, Cardiff and the Vale of Glamorgan."
          url="/our-homes"
        />
      )}
      {isStandalone && (
        <div className="homes-header">
          <div className="container">
            <h1>Our Care Homes</h1>
            <p>Discover our network of exceptional care homes across South Wales</p>
          </div>
        </div>
      )}

      <div className="container">
        {!isStandalone && (
          <div className="section-header">
            <h2 className="section-title">Our Care Homes</h2>
            <p className="section-subtitle">
              Discover our modern care homes across South Wales, each designed with comfort, safety & wellbeing in mind.
            </p>
          </div>
        )}
        
        <div className={`homes-grid ${!isStandalone ? 'scrollable' : ''}`}>
          {homes.map((home, index) => (
            <div key={home.id} className="home-card" onClick={() => navigate(home.link)}>
              <div className="home-image-container">
                <img 
                  src={home.images[imageIndices[index] || 0]} 
                  alt={home.name} 
                  className="home-main-image"
                  onError={(e) => {e.target.src = 'https://placehold.co/400x300?text=Bellavista+Home'}}
                />
                <div className="image-indicators">
                  {home.images.map((_, imgIndex) => (
                    <button
                      key={imgIndex}
                      className={`indicator-dot ${imageIndices[index] === imgIndex ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImageChange(index, imgIndex);
                      }}
                      aria-label={`View image ${imgIndex + 1}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="home-content">
                <h3>{home.name}</h3>
                <p className="home-description" dangerouslySetInnerHTML={{ __html: decodeHtmlEntities(home.description) }} />

                <button className="view-home-btn">
                  View Home <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurHomes;
