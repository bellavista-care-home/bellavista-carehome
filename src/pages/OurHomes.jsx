import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchHomes } from '../services/homeService';
import '../styles/OurHomes.css';

const FALLBACK_HOMES_DATA = [
  {
    id: 'cardiff',
    name: 'Bellavista Cardiff',
    location: 'Cardiff Bay',
    description: 'A homely and friendly purpose-built Nursing Home with overlooking views of Cardiff Bay waterfront. Situated in a sought-after area, it offers a chic, cosmopolitan atmosphere where residents can enjoy the vibrant surroundings.',
    features: ['62 Bedrooms', 'Ensuite Facilities', 'Cinema/Sensory Room', 'Dementia Friendly Areas', 'Views of Cardiff Bay'],
    images: [
      'https://placehold.co/400x300?text=Bellavista+Cardiff',
      'https://placehold.co/400x300?text=Cardiff+View'
    ],
    link: '/bellavista-cardiff'
  },
  {
    id: 'barry',
    name: 'Bellavista Barry',
    location: 'Barry',
    description: 'A long-established quality Nursing Home situated in the seaside town of Barry with spectacular views over the Bristol Channel. Running since 2007, we enable elderly people to live as independently as possible.',
    features: ['39 Bedded Home', 'Seaside Views', 'Cinema Lounge', 'Landscaped Gardens', 'Dementia Friendly Dining'],
    images: [
      'https://placehold.co/400x300?text=Bellavista+Barry',
      'https://placehold.co/400x300?text=Barry+View'
    ],
    link: '/bellavista-barry'
  },
  {
    id: 'waverley',
    name: 'Waverley Care Centre',
    location: 'Penarth',
    description: 'A family-owned nursing home overlooking the sea and open countryside. We offer a warm, friendly, and professional environment where "little things make all the difference".',
    features: ['129 Registered Places', 'General Nursing', 'EMI & FMI Care', 'Stunning Coast Views', 'Walking Distance to Penarth'],
    images: [
      'https://placehold.co/400x300?text=Waverley+Care',
      'https://placehold.co/400x300?text=Penarth+View'
    ],
    link: '/waverley-care-center'
  },
  {
    id: 'college-fields',
    name: 'College Fields Nursing Home',
    location: 'Barry',
    description: 'Priding ourselves on creating an environment where residents truly feel at home. We focus on technically correct care combined with personal interaction and fulfilling activities.',
    features: ['Home-cooked Meals', 'Personalized Care', 'In-house Laundry', 'Warm & Spacious Environment', 'Dedicated Staff'],
    images: [
      'https://placehold.co/400x300?text=College+Fields',
      'https://placehold.co/400x300?text=Barry+View'
    ],
    link: '/college-fields-nursing-home'
  },
  {
    id: 'baltimore',
    name: 'Baltimore Care Home',
    location: 'Barry',
    description: 'A welcoming residential care home providing a safe and comfortable environment. We focus on individual needs and creating a supportive community for all our residents.',
    features: ['Residential Care', 'Comfortable Rooms', 'Community Atmosphere', 'Daily Activities', 'Pastoral Area'],
    images: [
      'https://placehold.co/400x300?text=Baltimore+Care',
      'https://placehold.co/400x300?text=Barry+View'
    ],
    link: '/baltimore-care-home'
  },
  {
    id: 'meadow-vale',
    name: 'Meadow Vale Cwtch',
    location: 'Barry',
    description: 'A "home from home" style Young Onset Dementia Nursing 24-hour Care provision. Designed for younger dementia registered persons with stunning views of the Vale of Glamorgan.',
    features: ['Young Onset Dementia', '9 Bed Capacity', 'Nurse-Led Service', 'Rural Country Setting', 'Respite Service'],
    images: [
      'https://placehold.co/400x300?text=Meadow+Vale',
      'https://placehold.co/400x300?text=Barry+View'
    ],
    link: '/meadow-vale-cwtch'
  },
  {
    id: 'pontypridd',
    name: 'Bellavista Pontypridd',
    location: 'Pontypridd',
    description: 'Our newest location coming soon to Pontypridd. We are excited to bring our high standards of care to this community.',
    features: ['Coming Soon', 'Nursing Care', 'Dementia Care'],
    images: [
      'https://placehold.co/400x300?text=Bellavista+Pontypridd',
      'https://placehold.co/400x300?text=Coming+Soon'
    ],
    link: '/bellavista-pontypridd'
  }
];

// Export for backward compatibility if needed, though mostly internal use now
export const HOMES_DATA = FALLBACK_HOMES_DATA;

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
      try {
        const data = await fetchHomes();
        if (data && data.length > 0) {
           const mappedHomes = data.map(h => {
             const activityImgs = (h.activityImages || []).map(img => 
               typeof img === 'object' ? img.url : img
             );
             // Use main image + first activity image (as second card image)
             const cardImages = [h.homeImage, activityImgs[0]].filter(Boolean);
             
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
           setHomes(mappedHomes);
           setImageIndices(mappedHomes.map(() => 0));
        } else {
           setHomes(FALLBACK_HOMES_DATA);
           setImageIndices(FALLBACK_HOMES_DATA.map(() => 0));
        }
      } catch (err) {
        console.error("Error loading homes:", err);
        setHomes(FALLBACK_HOMES_DATA);
        setImageIndices(FALLBACK_HOMES_DATA.map(() => 0));
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
                <div className="location-badge">
                  <i className="fas fa-map-marker-alt"></i> {home.location}
                </div>
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
                <p className="home-description">{home.description}</p>
                
                <div className="home-features">
                  {home.features.slice(0, 3).map((feature, i) => (
                    <span key={i} className="feature-tag">
                      <i className="fas fa-check"></i> {feature}
                    </span>
                  ))}
                </div>

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
