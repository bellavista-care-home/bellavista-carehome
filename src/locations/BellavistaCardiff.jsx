import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Helmet } from 'react-helmet-async';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import SlideMedia from '../components/SlideMedia';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import { fetchReviews } from '../services/reviewService';
import '../styles/MainPage.css';
import SEO from '../components/SEO';

const BellavistaCardiff = () => {
  const navigate = useNavigate();


  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [cardiffNews, setCardiffNews] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const defaultTeamMembers = [
    { name: "Ceri A Evans", role: "Home Manager" },
    { name: "Titty Raj", role: "Lead Nurse in Charge" },
    { name: "Zsuzsanna Karkosak", role: "Accounts Assistant" },
    { name: "Cerry Davies", role: "Kitchen In charge" },
    { name: "Karen Thomas", role: "RMN in Charge" },
    { name: "Tania", role: "Housekeeping In charge" }
  ];

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

  const [teamMembers, setTeamMembers] = useState(defaultTeamMembers);
  const [activitiesGalleryImages, setActivitiesGalleryImages] = useState(defaultActivitiesImages);
  const [facilitiesGalleryImages, setFacilitiesGalleryImages] = useState(defaultFacilitiesImages);
  const [teamGalleryImages, setTeamGalleryImages] = useState(defaultTeamImages);

  useEffect(() => {
    const loadData = async () => {
      // Load News
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('cardiff') || 
        news.location === 'All Locations'
      );
      setCardiffNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('bellavista-cardiff');
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
        const reviewData = await fetchReviews({ location: 'Cardiff' });
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
              text: "The care and attention my father receives is outstanding. The staff are so friendly and the home is always clean.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "Bellavista Cardiff has a wonderful homely atmosphere. The view of the bay is beautiful and the staff go above and beyond.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
            {
              text: "The care and attention my father receives is outstanding. The staff are so friendly and the home is always clean.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "Bellavista Cardiff has a wonderful homely atmosphere. The view of the bay is beautiful and the staff go above and beyond.",
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

  const servicesList = [
    "High-Level Dementia Nursing",
    "Dementia Residential Care",
    "General Nursing",
    "Respite Care",
    "CHC Nursing",
    "End of Life Care"
  ];

  const whyChooseList = [
    "A safe and secure environment for residents and peace of mind for families",
    "Specialist dementia and nursing care, with staff trained to the highest standards",
    "A homely yet professional atmosphere, with a focus on dignity and individuality",
    "Personalised activity programmes promoting independence, wellbeing, and engagement",
    "Stunning location overlooking Cardiff Bay, with access to local amenities and transport"
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

  const cardiffSchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "@id": "https://www.bellavistanursinghomes.com/bellavista-cardiff#nursing-home",
    "name": "Bellavista Nursing Home Cardiff - Rated Best in Cardiff",
    "url": "https://www.bellavistanursinghomes.com/bellavista-cardiff",
    "description": "Bellavista Cardiff is a top-rated, award-winning care home in Cardiff Bay. Offering exceptional dementia and nursing care in a modern, luxury environment with stunning views.",
    "slogan": "Luxury Care in the Heart of Cardiff Bay",
    "telephone": "+44 29 2070 5282",
    "priceRange": "£££",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Near Techniquest, Cardiff Bay",
      "addressLocality": "Cardiff",
      "postalCode": "CF10 5BW",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.464",
      "longitude": "-3.165"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "92",
      "bestRating": "5"
    },
    "image": [
      "https://www.bellavistanursinghomes.com/FrontPageBanner/banner-second.png"
    ],
    "logo": "https://www.bellavistanursinghomes.com/bellalogo1.png",
    "sameAs": [
      "https://www.facebook.com/bellavistanursinghome/",
      "https://x.com/home_bellavista?lang=en"
    ]
  };

  const slides = [
    '/FrontPageBanner/banner-first.jpg',
    '/FrontPageBanner/banner-second.png',
    '/FrontPageBanner/banner-third.png',
    '/FrontPageBanner/banner-fourth.jpg',
    '/FrontPageBanner/banner-fifth.jpg'
  ];

  return (
    <div className="location-page theme-cardiff">
      <style>{`
        .theme-cardiff {
          /* Core Brand Colors - Main Page Palette */
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
        .theme-cardiff .hero-title {
          width: 100%;
        }
        .theme-cardiff .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-cardiff .hero-title .title-sub {
          color: var(--color-secondary);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-cardiff .hero-description {
          color: rgba(255, 251, 244, 0.9);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-cardiff .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-cardiff .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-cardiff .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-cardiff .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-bg-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-cardiff .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(86, 84, 73, 0.3);
        }
        .theme-cardiff .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-cardiff .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--color-bg-light);
        }

        /* 3. QUICK STATS */
        .theme-cardiff .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-cardiff .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-cardiff .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-cardiff .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-cardiff .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-cardiff .detailed-facility-card {
          border-color: var(--color-secondary);
        }
        .theme-cardiff .detailed-facility-card:hover {
          border-color: var(--color-primary);
        }
        .theme-cardiff .detailed-facility-card i {
          color: var(--color-primary) !important;
        }
        .theme-cardiff .detailed-facility-card span {
          color: var(--color-primary) !important;
        }
        .theme-cardiff .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-cardiff .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-cardiff .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-cardiff .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-cardiff .news-card {
          border-color: var(--color-secondary);
        }
        .theme-cardiff .news-card__link {
          color: var(--color-primary);
        }
        .theme-cardiff .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-cardiff .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-cardiff .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-cardiff .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-cardiff .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-cardiff .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-cardiff .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-cardiff .fact-value[style*="color: #0066cc"] {
          color: var(--color-primary) !important;
        }
        .theme-cardiff .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        /* 8. WHY CHOOSE SECTION */
        .theme-cardiff .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-cardiff .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-cardiff .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-cardiff .why-choose-item i {
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
        title="Bellavista Cardiff | Best Nursing Home in Cardiff Bay"
        description="Bellavista Cardiff is a top-rated, award-winning nursing home in Cardiff Bay. Recognized as one of the best care homes in South Wales for dementia and nursing care."
        url="/bellavista-cardiff"
        schema={cardiffSchema}
      />
      
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/home-images/cardiff.jpg" alt="Bellavista Cardiff" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Welcome to Bellavista Nursing Home Cardiff</span>
              <span className="title-sub">A secure, welcoming, and homely environment</span>
            </h1>
            <p className="hero-description">
              At Bellavista Nursing Home Cardiff, we provide a secure, welcoming, and homely environment where the care, well-being, and comfort of our residents are our highest priorities.
            </p>
            
            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> 62 Bedrooms
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Cardiff+Bay', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-map-marker-alt"></i> Cardiff Bay
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

      {/* Intro & Location Section */}
      <section className="about-group-intro">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">About Bellavista Cardiff</span>
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
                At Bellavista Nursing Home Cardiff, we provide a secure, welcoming, and homely 
                environment where the care, well-being, and comfort of our residents are our highest 
                priorities. Our home offers a professional, dementia-friendly, and nursing-led 
                environment for individuals who wish to maintain independence but require support to 
                live safely. We are committed to ensuring that our residents enjoy life to the fullest, with 
                families encouraged to provide feedback and participate in care planning.
              </p>
              <p>
                We take pride in preserving dignity, privacy, and individuality, supporting every 
                resident to live with confidence, comfort, and respect.
              </p>

              <h3 className="section-header__title" style={{ marginTop: '40px' }}>Our Location</h3>
              <p>
                Nestled in the heart of Cardiff Bay, our home combines convenience with tranquillity. 
                Residents enjoy easy access to local amenities and transport links while benefiting from 
                the charm of a purpose-built facility overlooking the Cardiff Bay waterfront. Our 
                location offers a chic, cosmopolitan atmosphere, creating a perfect balance of 
                relaxation, privacy, and social engagement. Residents are encouraged to participate in 
                outings to local places of interest and pursue activities that support an active and 
                independent lifestyle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bellavista Cardiff (Moved Up) */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose Bellavista Cardiff</h2>
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginBottom: '30px' }}>
                At Bellavista Cardiff, we combine:
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
                Bellavista Nursing Home Cardiff is registered to provide a wide range of care services, including:
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
                <span className="section-header__subtitle">Life at Bellavista</span>
                <h2 className="section-header__title">Activities Cardiff</h2>
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
                We also have a dedicated activities team, which designs and delivers tailored 
                programmes to meet the individual interests and needs of our residents, encouraging 
                engagement, independence, and quality of life.
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
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Bellavista Nursing Home Cardiff.
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
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (r.rating || 5), 0) / reviews.length).toFixed(1) : '4.9'}
                </div>
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <p className="review-count">Based on verified reviews</p>
                <a href="https://www.google.com/search?q=Bellavista+Nursing+Home+Cardiff" target="_blank" rel="noopener noreferrer" className="btn-google">
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
                      : '9.8'}
                  </span>
                  <span className="carehome-max">/ 10</span>
                </div>
                <p className="carehome-text">Review Score on carehome.co.uk</p>
                <a href="https://www.carehome.co.uk/carehome.cfm/searchazref/20006005BELLB" target="_blank" rel="noopener noreferrer" className="btn-carehome">
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
      {cardiffNews.length > 0 && (
        <section className="loc-section loc-section--white">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Cardiff</h2>
            </div>
            <div className="news-grid modern">
              {cardiffNews.map((news) => (
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
                  <span>Near Techniquest,<br/>Cardiff Bay, CF10 5BW</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:admin@bellavistanursinghome.com">admin@bellavistanursinghome.com</a>
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
                  <span className="fact-label">Registered Beds:</span>
                  <span className="fact-value">62</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Cardiff', '_blank')}
                  >
                    Cardiff Bay
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: 'var(--color-primary)', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Dementia Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Parking:</span>
                  <span className="fact-value">Available</span>
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
                  "The care and attention my father receives is outstanding. The staff are so friendly and the home is always clean."
                </p>
                <a 
                  href="https://www.google.com/search?q=Bellavista+Nursing+Home+Cardiff+Reviews" 
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

export default BellavistaCardiff;
