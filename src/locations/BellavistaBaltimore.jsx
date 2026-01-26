import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import '../styles/Testimonials.css';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import { fetchReviews } from '../services/reviewService';
import SlideMedia from '../components/SlideMedia';
import SEO from '../components/SEO';

const BellavistaBaltimore = () => {
  const navigate = useNavigate();
  const [baltimoreNews, setBaltimoreNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Using Barry's images as placeholders where specific Baltimore images might be missing
  const defaultActivitiesImages = [
    "arts-and-musical-gatherings.jpg",
    "community-events.jpg",
    "holiday-celebrations.jpg",
    "themed-days.jpg",
    "trips-and-outings.jpg"
  ];

  const defaultFacilitiesImages = [
    "activity-room.jpg",
    "dining-room.jpg",
    "lounge-area.jpg",
    "garden-facility.jpeg",
    "reception-facility.jpeg"
  ];

  const defaultTeamImages = [];

  const [activitiesGalleryImages, setActivitiesGalleryImages] = useState(defaultActivitiesImages);
  const [facilitiesGalleryImages, setFacilitiesGalleryImages] = useState(defaultFacilitiesImages);
  const [teamGalleryImages, setTeamGalleryImages] = useState(defaultTeamImages);

  useEffect(() => {
    const loadData = async () => {
      // Load News
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('baltimore') || 
        news.location === 'All Locations'
      );
      setBaltimoreNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('baltimore-care-home');
      if (home) {
        setHomeData(home);
        if (home.teamMembers && home.teamMembers.length > 0) {
          setTeamMembers(home.teamMembers);
        }
        if (home.activityImages && home.activityImages.length > 0) {
          setActivitiesGalleryImages(home.activityImages);
        }
        if (home.facilitiesGalleryImages && home.facilitiesGalleryImages.length > 0) {
          setFacilitiesGalleryImages(home.facilitiesGalleryImages);
        }
        if (home.teamGalleryImages && home.teamGalleryImages.length > 0) {
          setTeamGalleryImages(home.teamGalleryImages);
        }
        if (home.bannerImages && Array.isArray(home.bannerImages)) {
          setBannerImages(home.bannerImages.map(img => img.url));
        }
      }

      // Load Reviews
      try {
        const reviewData = await fetchReviews({ location: 'Baltimore' });
        if (reviewData && reviewData.length > 0) {
          const mappedReviews = reviewData.slice(0, 5).map(r => ({
            text: r.review,
            author: r.name || "Verified Resident",
            role: "Verified Review"
          }));
          setReviews(mappedReviews);
        } else {
          // Fallback
          setReviews([
            {
              text: "A wonderful home with a true family feel. The staff are incredibly supportive and kind.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "The environment is so peaceful and homely. It really feels like a proper home.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
          {
            text: "A wonderful home with a true family feel. The staff are incredibly supportive and kind.",
            author: "Family of Resident",
            role: "Verified Review"
          },
          {
            text: "The environment is so peaceful and homely. It really feels like a proper home.",
            author: "Visitor",
            role: "Verified Review"
          }
        ]);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (reviews.length > 0) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [reviews.length]);

  const facilitiesList = [
    { icon: "fas fa-bed", title: "26 Rooms" },
    { icon: "fas fa-bath", title: "Ensuite Available" },
    { icon: "fas fa-wheelchair", title: "Wheelchair Access" },
    { icon: "fas fa-arrow-up", title: "Lift Access" },
    { icon: "fas fa-tree", title: "Garden Views" },
    { icon: "fas fa-couch", title: "Own Furniture" },
    { icon: "fas fa-paw", title: "Pet Friendly" },
    { icon: "fas fa-wifi", title: "Internet Access" }
  ];

  // Swiper settings
  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: true,
    pagination: { 
      clickable: true,
      dynamicBullets: true,
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    }
  };

  const baltimoreSchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "name": "Baltimore House Care Home",
    "image": "https://www.bellavistanursinghomes.com/home-images/baltimore.jpg",
    "url": "https://www.bellavistanursinghomes.com/bellavista-baltimore",
    "telephone": "01446 420 714",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "1 & 2 Park Road",
      "addressLocality": "Barry",
      "postalCode": "CF62 6NU",
      "addressCountry": "UK"
    },
    "description": "Baltimore House Care Home is a well-established residential facility located in the scenic and tranquil surroundings of Barry.",
    "priceRange": "££"
  };

  return (
    <div className="location-page theme-baltimore">
      <style>{`
        .theme-baltimore {
          /* Core Brand Colors - Standard Bellavista Palette */
          --color-primary: #565449;       /* Olive Drab */
          --color-primary-dark: #11120D;  /* Smoky Black */
          --color-accent: #565449;        /* Olive Drab */
          --color-secondary: #D8CFBC;     /* Bone */
          --color-text-main: #11120D;     /* Smoky Black */
          --color-bg-light: #FFFBF4;      /* Floral White */
          --color-bg-white: #FFFFFF;
          
          /* Gradients matching MainPage */
          --hero-gradient-start: rgba(17, 18, 13, 0.9);
          --hero-gradient-end: rgba(86, 84, 73, 0.8);
          
          /* Typography */
          --font-heading: 'Playfair Display', serif;
          --font-body: 'Lato', sans-serif;
          
          /* Mappings for consistency */
          --white: var(--color-bg-white);
          --smoky-black: var(--color-primary-dark);
          --text-light: #5a574d; /* Muted Olive Drab */
          --olive-drab: var(--color-primary);
          --bone: var(--color-secondary);
          --floral-white: var(--color-bg-light);
          
          --font-display: var(--font-heading);
          --font-primary: var(--font-body);
        }

        /* 1. HERO SECTION */
        .theme-baltimore .hero-title {
          width: 100%;
        }
        .theme-baltimore .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-baltimore .hero-title .title-sub {
          color: var(--color-secondary);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-baltimore .hero-description {
          color: rgba(255, 251, 244, 0.9);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-baltimore .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-baltimore .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-baltimore .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-baltimore .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-bg-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-baltimore .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(86, 84, 73, 0.3);
        }
        .theme-baltimore .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-baltimore .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--color-bg-light);
        }

        /* 3. QUICK STATS */
        .theme-baltimore .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-baltimore .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-baltimore .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-baltimore .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-baltimore .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-baltimore .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-baltimore .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-baltimore .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-baltimore .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-baltimore .news-card {
          border-color: var(--color-secondary);
        }
        .theme-baltimore .news-card__link {
          color: var(--color-primary);
        }
        .theme-baltimore .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-baltimore .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-baltimore .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-baltimore .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-baltimore .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-baltimore .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-baltimore .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-baltimore .fact-value[style*="color: #0066cc"] {
          color: var(--color-primary) !important;
        }
        .theme-baltimore .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        
        /* 8. WHY CHOOSE SECTION */
        .theme-baltimore .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-baltimore .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-baltimore .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-baltimore .why-choose-item i {
          color: var(--color-primary);
          margin-top: 4px;
        }
        
        /* 9. CUSTOM LAYOUT OVERRIDES */
        .hero-buttons-row {
          margin-top: 30px;
          display: flex;
          flex-wrap: nowrap;
          gap: 15px;
          overflow-x: auto;
          padding-bottom: 5px;
          -webkit-overflow-scrolling: touch;
          justify-content: flex-start;
        }
        .hero-buttons-row::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        @media (max-width: 768px) {
          .hero-buttons-row {
            display: none !important;
          }
        }
        @media (max-width: 900px) {
          .activities-mobile-reverse {
            flex-direction: column-reverse !important;
            display: flex;
          }
        }
      `}</style>
      <SEO 
        title="Bellavista Baltimore | Best Care Home in Barry"
        description="Bellavista Baltimore is a top-rated care home in Barry, UK. Award-winning nursing and residential care in a warm, family-like environment."
        url="/bellavista-baltimore"
        schema={baltimoreSchema}
      />
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/home-images/baltimore.jpg" alt="Baltimore House Care Home" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Welcome to Baltimore House</span>
              <span className="title-sub">A Warm, Homely Environment with Professional Care</span>
            </h1>
            <p className="hero-description">
              Baltimore House Care Home is a well-established residential facility located in the 
              scenic and tranquil surroundings of Barry, offering the perfect balance of rural charm 
              and professional care.
            </p>
            
            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> 26 Rooms
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Baltimore+House+Care+Home+Barry', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-map-marker-alt"></i> Barry
              </div>
              <div className="btn btn-primary" onClick={() => navigate('/our-care')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-star"></i> Quality Care
              </div>
              <div className="btn btn-primary" onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-users"></i> Expert Team
              </div>
            </div>
          </div>
        </div>

        {bannerImages.length > 0 && (
          <div className="hero-netflix-slider">
            <div className="hero-netflix-track">
              {/* Duplicate slides for infinite seamless scroll effect */}
              {bannerImages.concat(bannerImages).map((slide, index) => (
                <div key={`${slide}-${index}`} className="hero-netflix-item">
                  <img src={slide} alt={`Bellavista highlight ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="about-group-intro">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">Welcome to Baltimore House</span>
            </h2>

            <div className="hero-actions" style={{ justifyContent: 'center', marginBottom: '40px' }}>
              <Link className="btn btn-primary" to="/schedule-tour">
                <i className="fas fa-calendar-check"></i> Book a Tour
              </Link>
              <Link className="btn btn-outline" to="/enquiry">
                <i className="fas fa-heart"></i> Care Enquiry
              </Link>
            </div>

            <div className="group-intro-text">
              <p>
                Baltimore House Care Home is a well-established residential facility located in the 
                scenic and tranquil surroundings of Barry, offering the perfect balance of rural charm 
                and professional care. Situated opposite the historic All Saints Church, and just a 
                short distance from Porthkerry Country Park with its 220 acres of woods and 
                meadows, our location provides residents with a serene and inspiring environment, 
                ideal for relaxation, outdoor enjoyment, and community engagement.
              </p>
              <p>
                Our directors and management team are actively involved in the day-to-day 
                operations, ensuring the highest standards of care and a personal approach that 
                makes every resident feel valued and supported.
              </p>

              <div className="location-highlight" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', borderLeft: '4px solid var(--color-secondary)' }}>
                <h3 className="section-header__title" style={{ marginTop: '0', marginBottom: '15px' }}>Location and Accessibility</h3>
                <p style={{ marginBottom: '0' }}>
                  Baltimore House is ideally situated within walking distance of Barry town centre, with 
                  shops, facilities, and services close at hand. Residents also benefit from proximity to 
                  Barry Dock and Barry Island, with excellent public transport links and road access to 
                  surrounding areas. Our location combines peaceful, rural surroundings with 
                  convenience and connectivity, making it easy for families and friends to visit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Baltimore House */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose Baltimore House</h2>
              </div>
              <div className="why-choose-grid">
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Small, homely environment with personalised, person-centred care</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Specialist support for dementia, Alzheimer’s, and functional mental health conditions</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Experienced and long-standing staff, creating a true home-from-home atmosphere</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Spacious, bright, and characterful environment, including conservatory and garden spaces</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Modern facilities and accessibility, including wheelchair access and lift service</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Pet-friendly policies and support for personalisation of rooms</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Integration with community and healthcare services for holistic support</span>
                </div>
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginTop: '30px' }}>
                At Baltimore House, our goal is to create a safe, welcoming, and professional 
                environment where residents feel secure, valued, and supported, while enjoying 
                quality of life, independence, and dignity every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="loc-section loc-section--light">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Our Care and Services</span>
                <h2 className="section-header__title">Services</h2>
              </div>
              <p className="loc-text">
                Baltimore House provides support for up to 26 residents, including those living with 
                cognitive impairments, dementia, Alzheimer’s disease, and functional mental health 
                conditions such as Bipolar Disorder and Depression. Each speciality is overseen by a 
                dedicated manager and trained staff team, ensuring that every resident receives care 
                that is tailored to their individual needs.
              </p>
              <p className="loc-text">
                Our home focuses on person-centred care, creating a homely environment where 
                residents can continue to live safely, comfortably, and independently wherever 
                possible. Services include:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                    General Residential Care for older adults
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                    Dementia and Alzheimer’s Care
                </li>
                <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                    Support for Functional Mental Illness (Bipolar/Depression)
                </li>
              </ul>
              <p className="loc-text">
                Residents benefit from prompt access to GP services, community healthcare support 
                including dietetics, occupational therapy, and mental health teams. Visiting specialists 
                such as chiropodists are available, and families are encouraged to arrange personal 
                therapists or hairdressing visits if desired.
              </p>
            </div>
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {facilitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <SlideMedia item={img} folder="facilities" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Comfort & Care</span>
                <h2 className="section-header__title">Our Facilities</h2>
              </div>
              <div className="facilities-content">
                <p className="loc-text">
                  Baltimore House combines the charm of a traditional home with the modern 
                  amenities required for contemporary residential care. The property features:
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                        Wheelchair access throughout the home
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                        Lift access to upper floors
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                        Spacious lounges and a large conservatory with garden views
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                        Tastefully decorated rooms and high ceilings that retain original features, enhanced with modern care facilities
                    </li>
                    <li style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                        <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                        Social spaces hosting regular gatherings, entertainment, and community activities
                    </li>
                </ul>
                <p className="loc-text">
                    Additional amenities include the option for residents to bring their own furniture, pet 
                    friendly policies, phone and television points in rooms, and internet access for 
                    residents.
                </p>
              </div>
            </div>
          </div>
          
          {/* Facilities Cards */}
          <div className="facilities-grid">
            {facilitiesList.map((item, index) => (
              <div className="facility-card" key={index}>
                <div className="facility-card__icon">
                  <i className={item.icon}></i>
                </div>
                <h4 className="facility-card__title">{item.title}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="loc-section loc-section--light">
        <div className="container">
          <div className="loc-grid activities-mobile-reverse">
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {activitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <SlideMedia item={img} folder="activities" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Baltimore House</span>
                <h2 className="section-header__title">Activities</h2>
              </div>
              <p className="loc-text">
                Social spaces host regular gatherings, entertainment, and community activities, helping residents feel engaged and connected.
              </p>
              <p className="loc-text" style={{ marginTop: '15px' }}>
                We believe that every resident matters and strive to make life fulfilling through personal interaction, meaningful engagement, and activities tailored to individual interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {(teamMembers.length > 0 || teamGalleryImages.length > 0) && (
        <section id="team-section" className="loc-section loc-section--white">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <p className="loc-text">
                  Our directors and management team are actively involved in the day-to-day operations, ensuring the highest standards of care and a personal approach that makes every resident feel valued and supported.
                </p>
                <p className="loc-text" style={{ marginTop: '15px' }}>
                   Experienced and long-standing staff create a true home-from-home atmosphere, ensuring residents receive care that is both attentive and empathetic.
                </p>
              </div>
              <div className="loc-grid__media">
                <div className="loc-slider">
                  <Swiper {...sliderSettings} className="custom-swiper">
                    {teamGalleryImages.map((img, index) => (
                      <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <SlideMedia item={img} folder="facilities" />
                      </div>
                    </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </div>

            {/* Key Staff Members Scrollable List */}
            {teamMembers.length > 0 && (
              <div className="team-scroll-container" style={{ marginTop: '64px' }}>
                <h3 style={{ 
                  marginBottom: '32px', 
                  fontFamily: 'var(--font-heading)', 
                  fontSize: '2rem', 
                  color: 'var(--color-primary)',
                  textAlign: 'center'
                }}>
                  Key Staff Members
                </h3>
                <div className="team-horizontal-list" style={{ 
                  display: 'flex', 
                  overflowX: 'auto', 
                  gap: '24px', 
                  padding: '10px 4px 30px 4px', 
                  scrollSnapType: 'x mandatory',
                  scrollbarWidth: 'thin'
                }}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card" style={{ 
                      minWidth: '260px', 
                      scrollSnapAlign: 'start', 
                      background: 'var(--color-bg-light)', 
                      padding: '32px 24px', 
                      borderRadius: '16px', 
                      textAlign: 'center',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                      border: '1px solid var(--color-border)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      transition: 'transform 0.2s'
                    }}>
                      <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                        color: 'var(--color-primary)',
                        fontSize: '2.5rem',
                        overflow: 'hidden'
                      }}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <i className="fas fa-user"></i>
                        )}
                      </div>
                      <h4 style={{ 
                        fontSize: '1.25rem', 
                        marginBottom: '8px', 
                        color: 'var(--color-text-dark)',
                        fontFamily: 'var(--font-heading)'
                      }}>
                        {member.name}
                      </h4>
                      <span style={{ 
                        color: 'var(--color-accent)', 
                        fontWeight: '600', 
                        fontSize: '0.9rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                      }}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Reviews Section */}
      <section className="home-testimonials" id="testimonials">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Trusted by Residents. Valued by Families.</h2>
            <p className="section-subtitle">
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Baltimore House Care Home.
            </p>
          </div>
          <div className="testimonials-layout">
            <div className="rating-cards-container">
              {/* Google Rating Card */}
              <div className="google-rating-card">
                <div className="google-logo">
                  <img src="/google-logo.png" alt="Google" style={{ height: '30px' }} />
                  <span>Reviews</span>
                </div>
                <div className="rating-number">
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) : '4.8'}
                </div>
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="review-count">Based on verified reviews</p>
                <a href="https://www.google.com/search?q=Baltimore+House+Care+Home+Barry" target="_blank" rel="noopener noreferrer" className="btn-google">
                  See our reviews
                </a>
              </div>

              {/* Carehome.co.uk Rating Card */}
              <div className="carehome-rating-card">
                <div className="carehome-logo">
                  <img src="/carehome-logo.png" alt="carehome.co.uk" style={{ height: '30px', maxWidth: '100%' }} />
                </div>
                <div className="carehome-rating-circle">
                  <span className="carehome-score">
                    {reviews.filter(r => r.source === 'carehome.co.uk').length > 0 
                      ? (reviews.filter(r => r.source === 'carehome.co.uk').reduce((acc, r) => acc + r.rating, 0) / reviews.filter(r => r.source === 'carehome.co.uk').length).toFixed(1)
                      : '9.6'}
                  </span>
                  <span className="carehome-max">/ 10</span>
                </div>
                <p className="carehome-text">Review Score on carehome.co.uk</p>
                <a href="https://www.carehome.co.uk/carehome.cfm/searchazref/20006005BALTB" target="_blank" rel="noopener noreferrer" className="btn-carehome">
                  Read Reviews
                </a>
              </div>
            </div>

            <div className="vertical-testimonials-container">
              {reviews.map((review, index) => {
                 let className = 'testimonial-slide';
                 if (index === currentReviewIndex) {
                     className += ' active';
                 } else if (index === (currentReviewIndex - 1 + reviews.length) % reviews.length) {
                     className += ' prev';
                 }
                 
                 return (
                    <div key={index} className={className}>
                      <div className="testimonial-quote-icon"><i className="fas fa-quote-left"></i></div>
                      <p className="testimonial-text">"{review.text}"</p>
                      <div className="testimonial-author">
                        <h4>{review.author}</h4>
                        <span>{review.role}</span>
                      </div>
                    </div>
                 );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 5. NEWS SECTION */}
      <section className="loc-section loc-section--white" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-header__title" style={{ marginBottom: '20px' }}>Discover Our Care</h2>
          <p className="loc-text" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            We invite families, healthcare professionals, and prospective residents to learn more 
            about our person-centred approach, specialist services, and exceptional facilities. 
            Baltimore House is committed to delivering the highest standards of care within 
            a compassionate, professional, and inspiring environment.
          </p>
          <Link to="/our-care" className="btn btn-primary btn-lg">
            Click here to explore OUR CARE
          </Link>
        </div>
      </section>

      {baltimoreNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Baltimore</h2>
            </div>
            <div className="news-grid modern">
              {baltimoreNews.map((news) => (
                <div key={news.id} className="news-card modern">
                  <div className="news-card__image">
                    {news.image ? (
                      <img src={news.image} alt={news.title} />
                    ) : (
                      <div className="news-placeholder-image"><i className="fas fa-newspaper"></i></div>
                    )}
                  </div>
                  <div className="news-card__content">
                    <h4 className="news-card__title">{news.title}</h4>
                    <Link to={`/news/${news.id}`} className="news-card__link">Read More</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. CONTACT & INFO GRID */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="section-header section-header--center">
            <span className="section-header__subtitle">Get in Touch</span>
            <h2 className="section-header__title">Contact & Information</h2>
          </div>

          <div className="bottom-grid">
            {/* Card 1: Contact Us */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Contact Us</h3>
              </div>
              <div className="bottom-card__content">
                <div className="contact-mini-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>1 & 2 Park Road,<br/>Barry, CF62 6NU</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446420714">01446 420 714</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:manager@baltimorecarehome.com">manager@baltimorecarehome.com</a>
                </div>
                <button className="btn btn-primary" style={{width: '100%', marginTop: '24px'}} onClick={() => window.location.href='/schedule-tour'}>
                  Book a Visit
                </button>
              </div>
            </div>

            {/* Card 2: Quick Facts */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Quick Facts</h3>
              </div>
              <div className="bottom-card__content">
                <div className="fact-row">
                  <span className="fact-label">Capacity:</span>
                  <span className="fact-value">26 Residents</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Baltimore+House+Care+Home+Barry', '_blank')}
                  >
                    Barry
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Our Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Pastoral</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Feature:</span>
                  <span className="fact-value">Conservatory</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Pets:</span>
                  <span className="fact-value">Allowed</span>
                </div>
              </div>
            </div>

            {/* Card 3: Reviews */}
            <div className="bottom-card">
              <div className="bottom-card__header">
                <h3 className="bottom-card__title">Reviews</h3>
              </div>
              <div className="bottom-card__content review-mini-form">
                <div style={{fontSize: '3rem', color: '#ffc107', marginBottom: '16px'}}>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="review-mini-text">
                  "A wonderful home with a true family feel. The staff are incredibly supportive and kind."
                </p>
                <a 
                  href="https://www.google.com/search?q=Baltimore+House+Care+Home+Barry+Reviews" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline" 
                  style={{width: '100%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}
                >
                  <i className="fab fa-google"></i> Review on Google
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BellavistaBaltimore;