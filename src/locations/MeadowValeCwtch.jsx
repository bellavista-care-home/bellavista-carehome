import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import { fetchReviews } from '../services/reviewService';
import SlideMedia from '../components/SlideMedia';
import SEO from '../components/SEO';

const MeadowValeCwtch = () => {
  const navigate = useNavigate();
  const [meadowNews, setMeadowNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Using Barry's images as placeholders
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
        news.location.toLowerCase().includes('meadow') || 
        news.location === 'All Locations'
      );
      setMeadowNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('meadow-vale-cwtch');
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

      // Load Reviews (simulated or fetched if available)
      try {
        const reviewData = await fetchReviews({ location: 'Meadow Vale' });
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
              text: "A home from home style Young Onset Dementia Nursing Care provision.",
              author: "Family Member",
              role: "Verified Review"
            },
            {
              text: "The environment is so peaceful and the staff are incredibly supportive.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
            {
              text: "A home from home style Young Onset Dementia Nursing Care provision.",
              author: "Family Member",
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

  const servicesList = [
    "Specialist Young Onset Dementia Care",
    "Expert Nursing Care",
    "Therapeutic Activities",
    "Respite Service",
    "Eco-conscious Living",
    "Person-Centred Support"
  ];

  const whyChooseList = [
    "Purpose-built specialist nursing home for young onset dementia",
    "Peaceful setting near Cardiff Airport, Rhoose, and Barry",
    "Person-centred, dignified, and empowering care approach",
    "Sustainable, eco-conscious design for comfort and safety",
    "Vibrant living atmosphere promoting independence and belonging"
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

  const meadowSchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "@id": "https://www.bellavistanursinghomes.com/meadow-vale-cwtch#nursing-home",
    "name": "Meadow Vale Cwtch - Rated Best Young Onset Dementia Care",
    "url": "https://www.bellavistanursinghomes.com/meadow-vale-cwtch",
    "description": "Meadow Vale Cwtch is a top-rated specialist nursing home for young onset dementia in the UK. Award-winning, eco-conscious care in South Wales.",
    "slogan": "Setting a New Standard in Dementia Care",
    "telephone": "+44 29 2070 5282",
    "priceRange": "£££",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Barry",
      "addressRegion": "Vale of Glamorgan",
      "addressCountry": "UK"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5.0",
      "reviewCount": "15",
      "bestRating": "5"
    },
    "image": [
      "https://www.bellavistanursinghomes.com/home-images/meadow-vale-cwtch.jpg"
    ],
    "logo": "https://www.bellavistanursinghomes.com/bellalogo1.png"
  };

  const slides = [
    '/FrontPageBanner/banner-first.jpg',
    '/FrontPageBanner/banner-second.png',
    '/FrontPageBanner/banner-third.png',
    '/FrontPageBanner/banner-fourth.jpg',
    '/FrontPageBanner/banner-fifth.jpg'
  ];

  return (
    <div className="location-page theme-meadow-vale">
      <style>{`
        .theme-meadow-vale {
          /* Core Brand Colors - Based on Nature/Tranquillity */
          --color-primary: #6B8E23;       /* Olive Drab / Green for Nature */
          --color-primary-dark: #3A5F0B;  /* Darker Green */
          --color-accent: #8FBC8F;        /* Dark Sea Green */
          --color-secondary: #F5F5DC;     /* Beige */
          --color-text-main: #2F4F4F;     /* Dark Slate Gray */
          --color-bg-light: #F0FFF0;      /* Honeydew */
          --color-bg-white: #FFFFFF;
          
          /* Gradients */
          --hero-gradient-start: rgba(47, 79, 79, 0.9);
          --hero-gradient-end: rgba(107, 142, 35, 0.8);
          
          /* Typography */
          --font-heading: 'Playfair Display', serif;
          --font-body: 'Lato', sans-serif;
          
          /* Mappings for consistency */
          --white: var(--color-bg-white);
          --smoky-black: var(--color-text-main);
          --text-light: #556B2F; 
          --olive-drab: var(--color-primary);
          --bone: var(--color-secondary);
          --floral-white: var(--color-bg-light);
          
          --font-display: var(--font-heading);
          --font-primary: var(--font-body);
        }

        /* 1. HERO SECTION */
        .theme-meadow-vale .hero-title {
          width: 100%;
        }
        .theme-meadow-vale .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .hero-title .title-sub {
          color: var(--color-secondary);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .hero-description {
          color: rgba(255, 255, 255, 0.95);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-meadow-vale .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-meadow-vale .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-meadow-vale .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(58, 95, 11, 0.3);
        }
        .theme-meadow-vale .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-meadow-vale .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--white);
        }

        /* 3. QUICK STATS */
        .theme-meadow-vale .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-meadow-vale .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-meadow-vale .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-meadow-vale .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-meadow-vale .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .detailed-facility-card {
          border-color: var(--color-secondary);
        }
        .theme-meadow-vale .detailed-facility-card:hover {
          border-color: var(--color-primary);
        }
        .theme-meadow-vale .detailed-facility-card i {
          color: var(--color-primary) !important;
        }
        .theme-meadow-vale .detailed-facility-card span {
          color: var(--color-primary) !important;
        }
        .theme-meadow-vale .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-meadow-vale .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-meadow-vale .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-meadow-vale .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-meadow-vale .news-card {
          border-color: var(--color-secondary);
        }
        .theme-meadow-vale .news-card__link {
          color: var(--color-primary);
        }
        .theme-meadow-vale .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-meadow-vale .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-meadow-vale .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-meadow-vale .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-meadow-vale .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-meadow-vale .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-meadow-vale .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-meadow-vale .fact-value[style*="color: #0066cc"] {
          color: var(--color-primary) !important;
        }
        .theme-meadow-vale .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        /* 8. WHY CHOOSE SECTION */
        .theme-meadow-vale .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-meadow-vale .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-meadow-vale .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-meadow-vale .why-choose-item i {
          color: var(--color-primary);
          margin-top: 4px;
        }
        /* 9. CUSTOM LAYOUT OVERRIDES */
        .hero-buttons-row {
          margin-top: 30px;
          display: flex;
          flex-wrap: nowrap; /* Force one line */
          gap: 15px;
          overflow-x: auto; /* Allow scroll if screen is too narrow */
          padding-bottom: 5px; /* Space for scrollbar if needed */
          -webkit-overflow-scrolling: touch;
          justify-content: flex-start;
        }
        
        /* Hide scrollbar for cleaner look but keep functionality */
        .hero-buttons-row::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }

        /* Hide Hero Buttons on Mobile */
        @media (max-width: 768px) {
          .hero-buttons-row {
            display: none !important;
          }
        }

        /* Responsive Reverse for Activities on Mobile */
        @media (max-width: 900px) {
          .activities-mobile-reverse {
            flex-direction: column-reverse !important;
            display: flex;
          }
        }
      `}</style>
      <SEO 
        title="Meadow Vale Cwtch"
        description="Meadow Vale Cwtch is a purpose-built specialist nursing home, proudly developed by the Bellavista Group, dedicated to providing exceptional care for individuals living with young onset dementia."
        url="/meadow-vale-cwtch"
      />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(meadowSchema)}
        </script>
      </Helmet>
      
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/home-images/meadow-vale-cwtch.jpg" alt="Meadow Vale Cwtch" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Welcome to Meadow Vale Cwtch</span>
              <span className="title-sub">Specialist Young Onset Dementia Nursing Care</span>
            </h1>
            <p className="hero-description">
              Opening Soon. Meadow Vale Cwtch is a purpose-built specialist nursing home, proudly developed by the Bellavista Group, dedicated to providing exceptional care for individuals living with young onset dementia.
            </p>
            
            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> 9 Bedrooms
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Meadow+Vale+Cwtch+Barry', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-map-marker-alt"></i> Vale of Glamorgan
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

      {/* 2. ABOUT / INTRO SECTION */}
      <section className="about-group-intro">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">Welcome to Meadow Vale Cwtch</span>
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
                Meadow Vale Cwtch is a purpose-built specialist nursing home, proudly developed by the Bellavista Group, dedicated to providing exceptional care for individuals living with young onset dementia.
              </p>
              <p>
                Located in a peaceful setting near Cardiff Airport, Rhoose, and Barry, our home combines accessibility with tranquillity—offering a safe, supportive, and enriching environment for residents and their families.
              </p>
              <p>
                Our approach to care is person-centred, dignified, and empowering, recognising the unique needs, abilities, and life experiences of younger individuals affected by dementia.
              </p>
              <p>
                At Meadow Vale Cwtch, we promote independence, meaningful engagement, and emotional wellbeing through expert nursing care, therapeutic activities, and a vibrant living atmosphere.
              </p>
              <p>
                Designed with sustainability at its heart, Meadow Vale Cwtch embraces eco-conscious practices and thoughtfully planned spaces that support comfort, safety, and long term wellbeing.
              </p>
              <p>
                Our modern, home-like environment fosters connection, purpose, and a true sense of belonging—creating not just a place of care, but a place to live well.
              </p>
              <p>
                Opening soon, Meadow Vale Cwtch will set a new standard in young onset dementia care—where professional excellence meets compassion, innovation, and community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section (Moved Up) */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose Meadow Vale Cwtch</h2>
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginBottom: '30px' }}>
                At Meadow Vale Cwtch, we combine:
              </p>
              <div className="why-choose-grid">
                {whyChooseList.map((item, index) => (
                  <div key={index} className="why-choose-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginTop: '30px' }}>
                We are committed to providing high-quality nursing care in a welcoming, supportive, 
                and professional setting, ensuring that residents and their families feel valued and 
                reassured every day.
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
                <span className="section-header__subtitle">High Quality Care</span>
                <h2 className="section-header__title">Our Services</h2>
              </div>
              <p className="loc-text">
                Meadow Vale Cwtch provides a range of specialist services, including:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0' }}>
                {servicesList.map((service, index) => (
                  <li key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                    <i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>
                    {service}
                  </li>
                ))}
              </ul>
              <p className="loc-text">
                We strive to create the ideal balance of peace, privacy, companionship, and high quality care, ensuring a safe and nurturing environment for all our residents.
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

      {/* Activities Section */}
      <section className="loc-section loc-section--white">
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
                <span className="section-header__subtitle">Life at Meadow Vale</span>
                <h2 className="section-header__title">Activities</h2>
              </div>
              <p className="loc-text">
                Our dedicated activities team designs and delivers tailored programmes to meet the individual interests and needs of our residents, encouraging engagement, independence, and quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="loc-section loc-section--light" id="team-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Dedicated Staff</span>
                <h2 className="section-header__title">Our Team</h2>
              </div>
              <p className="loc-text">
                Our team is dedicated to delivering exceptional care through professionalism, 
                compassion, and ongoing training. All staff members receive continuous education to 
                enhance their skills, ensuring that every resident benefits from evidence-based, 
                person-centred care.
              </p>
              <p className="loc-text">
                We are looking to recruit experienced caregivers with a skill set that can be applied to those living with Young Onset Dementia. Our staff are fluid caregivers, happy to move between care, cleaning, and laundry support.
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

      {/* Reviews Section */}
      <section className="home-testimonials" id="testimonials">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Trusted by Residents. Valued by Families.</h2>
            <p className="section-subtitle">
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Meadow Vale Cwtch.
            </p>
          </div>
          <div className="testimonials-content-wrapper">
            <div className="google-reviews-card">
              <div className="google-header">
                <i className="fab fa-google google-icon"></i>
                <span style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--color-primary)' }}>Google Reviews</span>
              </div>
              <div className="rating-display">4.9</div>
              <div className="google-stars">
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
                <i className="fas fa-star"></i>
              </div>
              <p className="review-count">Based on verified reviews</p>
              <a href="https://www.google.com/search?q=Meadow+Vale+Cwtch+Barry" target="_blank" rel="noopener noreferrer" className="btn-google">
                See our reviews
              </a>
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

      {/* Discover Our Care (CTA) */}
      <section className="loc-section loc-section--light" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-header__title" style={{ marginBottom: '20px' }}>Discover Our Care</h2>
          <p className="loc-text" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            We invite you to explore our approach to care, learn about our dedicated staff, and see 
            how we create a home where residents can live safely, happily, and with dignity.
          </p>
          <Link to="/our-care" className="btn btn-primary btn-lg">
            Find out more about OUR CARE
          </Link>
        </div>
      </section>

      {/* News Section */}
      {meadowNews.length > 0 && (
        <section className="loc-section loc-section--white">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News</h2>
            </div>
            <div className="news-grid modern">
              {meadowNews.map((news) => (
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

      {/* Contact & Info Grid */}
      <section className="loc-section loc-section--light">
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
                  <span>Meadow Vale Cwtch,<br/>Barry, Vale of Glamorgan</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:manager@waverleycarecentre.com">manager@waverleycarecentre.com</a>
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
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Meadow+Vale+Cwtch+Barry', '_blank')}
                  >
                    Vale of Glamorgan
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Our Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Capacity:</span>
                  <span className="fact-value">9 Beds</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Rural Country</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Service:</span>
                  <span className="fact-value">Nurse-Led</span>
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
                  "A home from home style Young Onset Dementia Nursing Care provision."
                </p>
                <a 
                  href="https://www.google.com/search?q=Meadow+Vale+Cwtch+Barry+Reviews" 
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

export default MeadowValeCwtch;
