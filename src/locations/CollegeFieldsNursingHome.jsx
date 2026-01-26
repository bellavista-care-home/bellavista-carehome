import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import SlideMedia from '../components/SlideMedia';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import { fetchReviews } from '../services/reviewService';
import '../styles/Testimonials.css';
import SEO from '../components/SEO';

const CollegeFieldsNursingHome = () => {
  const navigate = useNavigate();
  const [collegeFieldsNews, setCollegeFieldsNews] = useState([]);
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
        news.location.toLowerCase().includes('college') || 
        news.location === 'All Locations'
      );
      setCollegeFieldsNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('college-fields');
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
        const reviewData = await fetchReviews({ location: 'College Fields' });
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
              text: "Residents enjoy home comforts in a warm, spacious, and delightful environment.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "The staff go above and beyond to provide care that is both attentive and empathetic.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
            {
              text: "Residents enjoy home comforts in a warm, spacious, and delightful environment.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "The staff go above and beyond to provide care that is both attentive and empathetic.",
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
    { icon: "fas fa-utensils", title: "Home-Cooked Meals" },
    { icon: "fas fa-coffee", title: "Kitchenettes on Floors" },
    { icon: "fas fa-tshirt", title: "In-House Laundry" },
    { icon: "fas fa-user-friends", title: "Spacious Lounges" },
    { icon: "fas fa-hand-holding-heart", title: "Compassionate Staff" },
    { icon: "fas fa-user-nurse", title: "24/7 Nursing Care" },
    { icon: "fas fa-bed", title: "Respite Services" },
    { icon: "fas fa-notes-medical", title: "Palliative Care" }
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

  const collegeFieldsSchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "@id": "https://www.bellavistanursinghomes.com/college-fields-nursing-home#nursing-home",
    "name": "College Fields Nursing Home - Rated Best in Barry",
    "url": "https://www.bellavistanursinghomes.com/college-fields-nursing-home",
    "description": "College Fields Nursing Home is a top-rated care home in Barry, UK, offering exceptional nursing and dementia care in a warm, homely environment.",
    "slogan": "Compassionate, Person-Centred Care",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "College Fields, College Road",
      "addressLocality": "Barry",
      "postalCode": "CF62 8LE",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "image": "https://www.bellavistanursinghomes.com/home-images/college-fields.jpg",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "24",
      "bestRating": "5"
    },
    "priceRange": "$$$",
    "areaServed": ["Barry", "Vale of Glamorgan", "South Wales", "Cardiff"],
    "amenityFeature": [
      { "@type": "LocationFeatureSpecification", "name": "24/7 Nursing Care", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Dementia Care", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Home-Cooked Meals", "value": "true" },
      { "@type": "LocationFeatureSpecification", "name": "Activities Coordinator", "value": "true" }
    ]
  };

  return (
    <div className="location-page theme-college-fields">
      <style>{`
        .theme-college-fields {
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
        .theme-college-fields .hero-title {
          width: 100%;
        }
        .theme-college-fields .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-college-fields .hero-title .title-sub {
          color: var(--color-secondary);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-college-fields .hero-description {
          color: rgba(255, 251, 244, 0.9);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-college-fields .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-college-fields .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-college-fields .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-college-fields .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-bg-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-college-fields .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(86, 84, 73, 0.3);
        }
        .theme-college-fields .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-college-fields .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--color-bg-light);
        }

        /* 3. QUICK STATS */
        .theme-college-fields .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-college-fields .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-college-fields .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-college-fields .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-college-fields .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-college-fields .detailed-facility-card {
          border-color: var(--color-secondary);
        }
        .theme-college-fields .detailed-facility-card:hover {
          border-color: var(--color-primary);
        }
        .theme-college-fields .detailed-facility-card i {
          color: var(--color-primary) !important;
        }
        .theme-college-fields .detailed-facility-card span {
          color: var(--color-primary) !important;
        }
        .theme-college-fields .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-college-fields .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-college-fields .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-college-fields .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-college-fields .news-card {
          border-color: var(--color-secondary);
        }
        .theme-college-fields .news-card__link {
          color: var(--color-primary);
        }
        .theme-college-fields .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-college-fields .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-college-fields .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-college-fields .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-college-fields .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-college-fields .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-college-fields .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-college-fields .fact-value[style*="color: blue"] {
          color: var(--color-primary) !important;
        }
        .theme-college-fields .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        /* 8. WHY CHOOSE SECTION */
        .theme-college-fields .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-college-fields .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-college-fields .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-college-fields .why-choose-item i {
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
        title="College Fields Nursing Home | Best Nursing Home in Barry"
        description="College Fields Nursing Home is a top-rated care home in Barry, UK. Award-winning nursing and dementia care in a warm, homely environment."
        url="/college-fields-nursing-home"
        schema={collegeFieldsSchema}
      />
      {/* 1. HERO SECTION */}
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/home-images/college-fields.jpg" alt="College Fields Nursing Home" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Welcome to College Fields Nursing Home</span>
              <span className="title-sub">Compassionate, Person-Centred Care</span>
            </h1>
            <p className="hero-description">
              At College Fields Nursing Home, we are dedicated to providing exceptional care in a 
              warm, welcoming, and homely environment. Our team takes pride not only in delivering 
              technically excellent nursing care but also in creating a space where residents feel 
              valued, respected, and truly at home.
            </p>
            
            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> 68 Bedrooms
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=College+Fields+Nursing+Home+Barry', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
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
              <span className="group-name">Welcome to College Fields</span>
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
                At College Fields Nursing Home, we are dedicated to providing exceptional care in a 
                warm, welcoming, and homely environment. Our team takes pride not only in 
                delivering technically excellent nursing care but also in creating a space where 
                residents feel valued, respected, and truly at home. We believe that every resident 
                matters and strive to make life fulfilling through personal interaction, meaningful 
                engagement, and activities tailored to individual interests.
              </p>
              <p>
                We understand that support extends beyond our residents – families often need 
                reassurance, guidance, and comfort. Our reputation for excellence has been built on 
                the dedication, professionalism, and compassion of our staff, who go above and 
                beyond to provide care that is both attentive and empathetic.
              </p>

              <h3 className="section-header__title" style={{ marginTop: '40px' }}>Our Environment</h3>
              <p>
                College Fields Nursing Home offers a warm, spacious, and comfortable environment 
                where residents can enjoy the familiarity of home while receiving professional support. 
                Our home promotes companionship, social engagement, and a sense of community, 
                ensuring that every resident feels connected and supported.
              </p>
              <p>
                Relatives can take comfort in knowing that their loved ones are cared for by highly 
                trained, professional nursing staff available 24 hours a day, providing both medical 
                support and emotional reassurance.
              </p>

              <div className="location-highlight" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', borderLeft: '4px solid var(--color-secondary)' }}>
                <h3 className="section-header__title" style={{ marginTop: '0', marginBottom: '15px' }}>Visiting College Fields</h3>
                <p style={{ marginBottom: '0' }}>
                  We warmly welcome visitors at any time. Whether you are looking to see your loved 
                  ones, explore our facilities, or determine if College Fields Nursing Home is the right 
                  choice for yourself, your relatives, or friends, we encourage you to visit and experience 
                  our home firsthand.
                </p>
                <p style={{ marginTop: '15px', marginBottom: '0' }}>
                  Our team is committed to creating a safe, supportive, and inclusive environment 
                  where residents, families, and staff feel valued, respected, and confident in the quality 
                  of care provided.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose College Fields Nursing Home */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose College Fields Nursing Home</h2>
              </div>
              <div className="why-choose-grid">
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Person-centred care tailored to individual needs, interests, and preferences</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Highly trained nursing staff, available 24 hours a day</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>A warm, spacious, and homely environment promoting comfort and companionship</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Meaningful activities and engagement to enhance quality of life</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>A supportive approach for families, ensuring peace of mind</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>A reputation for compassionate, professional, and consistent care</span>
                </div>
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginTop: '30px' }}>
                At College Fields, we are committed to enhancing the lives of our residents, providing 
                an environment where they feel safe, valued, and empowered to enjoy life to the fullest.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACILITIES SECTION */}
      <section className="loc-section loc-section--light">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Comfort & Care</span>
                <h2 className="section-header__title">Facilities & Services</h2>
              </div>
              <div className="facilities-content">
                <p className="loc-text">
                  Certain facilities are available to every resident, such as overhead hoists in every 
                  bedroom and bathroom to enable safe and comfortable transfers. Each room is equipped 
                  with a three-way profiling bed and specialist mattress to ensure comfort and care.
                </p>
                
                <div style={{ marginTop: '30px' }}>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '10px' }}>Community Spaces</h3>
                  <p className="loc-text">
                    There are several rooms where residents can get together. The main lounge is the usual 
                    place where events are held, from art classes to professional entertainment.
                  </p>
                  <p className="loc-text">
                    Other communal areas include the quiet conservatory, the dining room, and a sensory 
                    room that provides a calming environment for residents.
                  </p>
                </div>
              </div>
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

      {/* 4. ACTIVITIES SECTION */}
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
                <span className="section-header__subtitle">Life at College Fields</span>
                <h2 className="section-header__title">Activities</h2>
              </div>
              <p className="loc-text">
                We believe that every resident matters and strive to make life fulfilling 
                through personal interaction, meaningful engagement, and activities tailored 
                to individual interests.
              </p>
              <p className="loc-text" style={{ marginTop: '15px' }}>
                Our home promotes companionship, social engagement, and a sense of community, 
                ensuring that every resident feels connected and supported.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEAM & CARE */}
      {(teamMembers.length > 0 || teamGalleryImages.length > 0) && (
        <section id="team-section" className="loc-section loc-section--light">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <div className="team-content">
                  <p className="loc-text">
                    Our reputation for excellence has been built on the dedication, professionalism, 
                    and compassion of our staff, who go above and beyond to provide care that is both 
                    attentive and empathetic.
                  </p>
                  <p className="loc-text" style={{ marginTop: '15px' }}>
                    Relatives can take comfort in knowing that their loved ones are cared for by 
                    highly trained, professional nursing staff available 24 hours a day, providing 
                    both medical support and emotional reassurance.
                  </p>
                  <p className="loc-text" style={{ marginTop: '15px' }}>
                    We have a full compliment of trained, qualified nurses supported by nurse 
                    auxiliaries and care practitioners. Our team is committed to creating a safe, 
                    supportive, and inclusive environment where residents feel valued and respected.
                  </p>
                </div>
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
                <div className="section-header" style={{ marginBottom: '32px' }}>
                  <h3 className="section-header__title" style={{ fontSize: '1.8rem' }}>Key Staff Members</h3>
                </div>
                <div className="team-scroll-wrapper" style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '24px',
                  paddingBottom: '24px',
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'var(--color-primary) #f0f0f0',
                  WebkitOverflowScrolling: 'touch'
                }}>
                  {teamMembers.map((member, index) => (
                    <div key={index} className="team-member-card" style={{
                      flex: '0 0 300px',
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'transform 0.3s ease',
                      border: '1px solid #eee'
                    }}>
                      <div className="team-member-image" style={{ height: '320px', background: '#f5f5f5', position: 'relative' }}>
                        {member.image ? (
                          <img src={member.image} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ccc',
                            fontSize: '4rem'
                          }}>
                            <i className="fas fa-user"></i>
                          </div>
                        )}
                        <div style={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                          padding: '24px 20px 16px',
                          color: 'white'
                        }}>
                          <h4 style={{ fontSize: '1.25rem', marginBottom: '4px', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>{member.name}</h4>
                          <p style={{ fontSize: '0.9rem', opacity: 0.9, fontWeight: 500 }}>{member.role}</p>
                        </div>
                      </div>
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
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at College Fields Nursing Home.
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
              <a href="https://www.google.com/search?q=College+Fields+Nursing+Home+Barry" target="_blank" rel="noopener noreferrer" className="btn-google">
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

      {/* 5. NEWS SECTION */}
      <section className="loc-section loc-section--white" style={{ textAlign: 'center' }}>
        <div className="container">
          <h2 className="section-header__title" style={{ marginBottom: '20px' }}>Discover Our Care</h2>
          <p className="loc-text" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            We invite families, healthcare professionals, and prospective residents to learn more 
            about our person-centred approach, specialist services, and exceptional facilities. 
            College Fields is committed to delivering the highest standards of care within 
            a compassionate, professional, and inspiring environment.
          </p>
          <Link to="/our-care" className="btn btn-primary btn-lg">
            Click here to explore OUR CARE
          </Link>
        </div>
      </section>

      {collegeFieldsNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News</h2>
            </div>
            <div className="news-grid modern">
              {collegeFieldsNews.map((news) => (
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
                  <span>College Fields Close,<br/>Barry, CF62 8LE</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446747778">01446 747778</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:reception@cfnh.wales">reception@cfnh.wales</a>
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
                  <span className="fact-label">Atmosphere:</span>
                  <span className="fact-value">Home-from-Home</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=College+Fields+Nursing+Home+Barry', '_blank')}
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
                    Nursing Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Dining:</span>
                  <span className="fact-value">4 Meals Daily</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Visiting:</span>
                  <span className="fact-value">Open Policy</span>
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
                  "Residents enjoy home comforts in a warm, spacious, and delightful environment."
                </p>
                <a 
                  href="https://www.google.com/search?q=College+Fields+Nursing+Home+Barry+Reviews" 
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

export default CollegeFieldsNursingHome;
