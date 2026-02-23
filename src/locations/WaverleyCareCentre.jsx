import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

import '../styles/CareHome.css';
import '../styles/MainPage.css';
import '../styles/Testimonials.css';
import SlideMedia from '../components/SlideMedia';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import { fetchReviews } from '../services/reviewService';
import SEO from '../components/SEO';

const WaverleyCareCentre = () => {
  const navigate = useNavigate();
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [teamExpanded, setTeamExpanded] = useState(false);
  const [waverleyNews, setWaverleyNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Using Barry's images as placeholders
  const defaultActivitiesImages = [];
  
  const defaultFacilitiesImages = [];
  
  const defaultTeamImages = [];

  const [activitiesGalleryImages, setActivitiesGalleryImages] = useState(defaultActivitiesImages);
  const [facilitiesGalleryImages, setFacilitiesGalleryImages] = useState(defaultFacilitiesImages);
  const [teamGalleryImages, setTeamGalleryImages] = useState(defaultTeamImages);

  useEffect(() => {
    const loadData = async () => {
      // Load News
      const allNews = await fetchNewsItems();
      const filtered = allNews.filter(news => 
        news.location.toLowerCase().includes('waverley') || 
        news.location === 'All Locations'
      );
      setWaverleyNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('waverley-care-centre');
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
        const reviewData = await fetchReviews({ location: 'Waverley' });
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
              text: "The Waverley staff go the extra mile to ensure the comfort and happiness of our residents.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "A wonderful home with stunning views and a warm, friendly atmosphere.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
            {
              text: "The Waverley staff go the extra mile to ensure the comfort and happiness of our residents.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "A wonderful home with stunning views and a warm, friendly atmosphere.",
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

  const waverleySchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "@id": "https://www.bellavistanursinghomes.com/waverley-care-center#nursing-home",
    "name": "Waverley Care Centre - Best waverly care home penarth",
    "url": "https://www.bellavistanursinghomes.com/waverley-care-center",
    "description": "Waverley Care Centre is a top-rated nursing home in Penarth, UK, offering exceptional care with stunning coastal views.",
    "slogan": "Warm, Friendly, and Professional Care",
    "telephone": "+44 29 2070 5282",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Waverley+Care+Centre+Penarth",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "122-124 Plymouth Road",
      "addressLocality": "Penarth",
      "postalCode": "CF64 5DN",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "image": "https://www.bellavistanursinghomes.com/home-images/waverley.jpg",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "32",
      "bestRating": "5"
    },
    "priceRange": "$$$",
    "areaServed": ["Penarth", "Cardiff", "Vale of Glamorgan", "South Wales"],
    "sameAs": [
      "https://digital.careinspectorate.wales/backend/directory/service/SIN-00009857-GNWK/LatestInspectionReport",
      "https://www.carehome.co.uk/carehome.cfm/searchazref/20001005WAVZ"
    ],
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Family of Resident"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "The Waverley staff go the extra mile to ensure the comfort and happiness of our residents."
      },
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Visitor"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "A wonderful home with stunning views and a warm, friendly atmosphere."
      }
    ],
    "parentOrganization": {
      "@id": "https://www.bellavistanursinghomes.com/#organization"
    }
  };

  return (
    <div className="location-page theme-waverley home">
      <style>{`
        .theme-waverley {
          /* Core Brand Colors - Blue Palette */
          --color-primary: var(--primary-blue);
          --color-primary-dark: #0d2650; /* Darker Navy */
          --color-accent: var(--cta-default);
          --color-secondary: var(--secondary-blue);
          --color-text-main: #333333;
          --color-bg-light: var(--soft-blue);
          --color-bg-white: var(--surface-blue);
          
          /* Gradients matching MainPage */
          --hero-gradient-start: rgba(27, 60, 120, 0.95);
          --hero-gradient-end: rgba(49, 93, 168, 0.85);
          
          /* Typography */
          --font-heading: 'Playfair Display', serif;
          --font-body: 'Lato', sans-serif;
          
          /* Mappings for consistency */
          --white: var(--color-bg-white);
          --smoky-black: var(--color-primary-dark);
          --text-light: #555555;
          --olive-drab: var(--color-primary);
          --bone: var(--soft-blue);
          --floral-white: var(--color-bg-light);
          
          --font-display: var(--font-heading);
          --font-primary: var(--font-body);
        }

        /* 1. HERO SECTION */
        .theme-waverley .hero-title {
          width: 100%;
        }
        .theme-waverley .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-waverley .hero-title .title-sub {
          color: var(--soft-blue);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-waverley .hero-description {
          color: rgba(255, 251, 244, 0.9);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-waverley .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-waverley .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-waverley .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-waverley .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-bg-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-waverley .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(86, 84, 73, 0.3);
        }
        .theme-waverley .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-waverley .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--color-bg-light);
        }

        /* 3. QUICK STATS */
        .theme-waverley .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-waverley .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-waverley .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-waverley .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-waverley .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-waverley .detailed-facility-card {
          border-color: var(--color-secondary);
        }
        .theme-waverley .detailed-facility-card:hover {
          border-color: var(--color-primary);
        }
        .theme-waverley .detailed-facility-card i {
          color: var(--color-primary) !important;
        }
        .theme-waverley .detailed-facility-card span {
          color: var(--color-primary) !important;
        }
        .theme-waverley .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-waverley .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-waverley .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-waverley .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-waverley .news-card {
          border-color: var(--color-secondary);
        }
        .theme-waverley .news-card__link {
          color: var(--color-primary);
        }
        .theme-waverley .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-waverley .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-waverley .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-waverley .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-waverley .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-waverley .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-waverley .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-waverley .fact-value[style*="color: #0066cc"] {
          color: var(--color-primary) !important;
        }
        .theme-waverley .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        /* 8. WHY CHOOSE SECTION */
        .theme-waverley .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-waverley .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-waverley .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-waverley .why-choose-item i {
          color: var(--color-primary);
          margin-top: 4px;
        }
        /* 9. CUSTOM LAYOUT OVERRIDES */
        .hero-buttons-row {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          width: 100%;
          justify-content: center;
        }
        
        /* Fix button width and overflow */
        .hero-buttons-row .btn {
          min-width: 160px;
          flex: 1;
          white-space: normal !important; /* Allow wrapping */
          text-align: center;
          justify-content: center;
          padding: 10px 15px;
          height: auto;
          min-height: 48px;
          line-height: 1.2;
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

        /* Fix brown/black background on refresh */
        .home .hero-image-wrap {
          background-color: var(--color-primary) !important;
        }
      `}</style>
      <SEO 
        title="Waverley Care Centre | Best Nursing Home in Penarth"
        description="Waverley Care Centre is a top-rated nursing home in Penarth, UK. Offering award-winning dementia and nursing care with stunning coastal views."
        url="/waverley-care-center"
        schema={waverleySchema}
      />
      {/* 1. HERO SECTION */}
      <section className="hero" id="hero-section">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <Swiper
              modules={[Autoplay, EffectFade]}
              effect="fade"
              autoplay={{
                delay: 6000,
                disableOnInteraction: false,
              }}
              loop={true}
              speed={1500}
              className="hero-swiper"
            >
              {bannerImages.length > 0 ? (
                bannerImages.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <img src={slide} alt={`Waverley Banner ${index + 1}`} />
                  </SwiperSlide>
                ))
              ) : (
                <SwiperSlide>
                  <img src="/home-images/waverley.jpg" alt="Waverley Care Centre" />
                </SwiperSlide>
              )}
            </Swiper>
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">waverly care home penarth</span>
              <span className="title-sub">Waverley Care Centre - Warm, Friendly, and Professional Care</span>
            </h1>
            <p className="hero-description">
              At Waverley Care Centre, we believe that it’s the little things that make all the 
              difference – a friendly smile in the morning, time spent chatting with our residents, a 
              sunny walk outdoors, or a personalised activity that brings joy.
            </p>

            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> {homeData?.statsBedrooms || "129 Bedrooms"}
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Waverley+Care+Centre+Penarth', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-map-marker-alt"></i> Penarth
              </div>
              <div className="btn btn-primary" onClick={() => navigate('/our-care')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-star"></i> Quality Care
              </div>
              <div className="btn btn-primary" onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-users"></i> Expert Team
              </div>
              {homeData?.ciwReportUrl && (
                <div className="btn btn-primary" onClick={() => window.open(homeData.ciwReportUrl, '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                  <i className="fas fa-file-pdf"></i> CIW Report
                </div>
              )}
              {homeData?.newsletterUrl && (
                <div className="btn btn-primary" onClick={() => window.open(homeData.newsletterUrl, '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                  <i className="fas fa-newspaper"></i> Newsletter
                </div>
              )}
            </div>
          </div>
        </div>

        {bannerImages.length > 0 && (
          <div className="hero-bottom-carousel">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={bannerImages.length > 3}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                480: { slidesPerView: 2.2, spaceBetween: 20 },
                768: { slidesPerView: 3.2, spaceBetween: 25 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
                1400: { slidesPerView: 5, spaceBetween: 30 }
              }}
              className="bottom-swiper"
            >
              {[...bannerImages, ...bannerImages, ...bannerImages].slice(0, 12).map((slide, index) => (
                <SwiperSlide key={`bottom-slide-${index}`}>
                  <div className="carousel-item-card">
                    <img src={slide} alt={`Bellavista highlight ${index + 1}`} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </section>

      <section className="about-group-intro" id="about-section">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">Welcome to Waverley Care Centre</span>
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
                At Waverley Care Centre, we believe that it’s the little things that make all
                the difference – a friendly smile in the morning, time spent chatting with our
                residents, a sunny walk outdoors, or a personalised activity that brings joy.
                Our mission is to create a home where residents feel valued, comfortable, and
                truly cared for, where every detail is thoughtfully considered to support
                happiness, wellbeing, and independence.
              </p>
              <p>
                As a family-owned nursing home, our directors are fully involved in the
                day-to-day management of the home. This hands-on approach ensures that care
                quality, safety, and resident satisfaction are consistently at the forefront of
                everything we do.
              </p>

              <h3 className="section-header__title" style={{ marginTop: '40px' }}>Our Environment</h3>
              <p>
                Waverley Care Centre offers a safe, secure, and welcoming environment where
                residents can feel at home while receiving professional support. The home is
                situated in a scenic location, overlooking the coastline, the Bristol Channel,
                and surrounding countryside, creating a serene and inspiring backdrop for daily
                life.
              </p>
              
              <div className="location-highlight" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', borderLeft: '4px solid var(--color-secondary)' }}>
                <h3 className="section-header__title" style={{ marginTop: '0', marginBottom: '15px' }}>Location and Accessibility</h3>
                <p style={{ marginBottom: '0' }}>
                  Conveniently located within walking distance of Penarth town centre, residents
                  have easy access to shops, cafés, and local amenities. The home is also just a
                  few miles from Cardiff, with excellent transport links via the M4 motorway,
                  making visits from family and friends straightforward and stress-free.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Waverley Care Centre */}
      <section className="loc-section loc-section--white" id="whyChoose-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose Waverley Care Centre</h2>
              </div>
              <div className="why-choose-grid">
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Personalised, person-centred care tailored to each resident’s needs</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Specialist nursing, dementia, and mental health care delivered by highly trained staff</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Family-owned management with hands-on oversight ensuring quality and safety</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Large, scenic site with stunning coastal and countryside views</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Homely and welcoming environment combined with professional standards of care</span>
                </div>
                <div className="why-choose-item">
                  <i className="fas fa-check-circle"></i>
                  <span>Low staff turnover and highly experienced team, offering continuity of care and reassurance to families</span>
                </div>
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginTop: '30px' }}>
                At Waverley, we go beyond providing care – we create a community where residents thrive, 
                families feel confident, and staff are supported to deliver excellence every day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="loc-section loc-section--white" id="services-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">High Quality Care</span>
                <h2 className="section-header__title">Our Services</h2>
              </div>
              <p className="loc-text">
                Waverley Care Centre is designed to provide exceptional, person-centred care for 
                up to 129 residents, with plans for additional capacity through recent 
                developments. The home is thoughtfully organised into four specialist units—Cliff Haven-1, 
                Cliff Haven-2, Seaview, and Glan-y-Mor—each with dedicated management and staff to 
                ensure tailored support for every resident.
              </p>
              
              <div style={{ marginTop: '20px' }}>
                <h4 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>General Nursing Care</h4>
                <p className="loc-text" style={{ marginBottom: '15px' }}>
                  Offers comprehensive support for residents with a wide range of healthcare needs, 
                  delivering expert nursing and personalised care plans.
                </p>

                <h4 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>EMI (Elderly Mentally Infirm) Care</h4>
                <p className="loc-text" style={{ marginBottom: '15px' }}>
                  Provides specialist support for individuals living with dementia or cognitive 
                  impairments, focusing on safety, engagement, and quality of life.
                </p>

                <h4 style={{ color: 'var(--color-primary)', marginBottom: '10px' }}>FMI (Functional Mental Infirmity) Care</h4>
                <p className="loc-text" style={{ marginBottom: '15px' }}>
                  Offers focused, compassionate support tailored to the functional needs of residents 
                  with specific mental health challenges.
                </p>
              </div>
              
              <p className="loc-text" style={{ marginTop: '15px' }}>
                Through ongoing redevelopment, the home includes modernised accommodation, 
                improved communal spaces, and additional beds, offering a comfortable, home-like 
                environment in each unit.
              </p>
              <Link to="/care/waverley-care-center" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-heart"></i> Find Out More About Our Care
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section - Content Left, Images Right */}
      <section className="loc-section loc-section--white" id="facilities-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Facilities</span>
                <h2 className="section-header__title">Modern & Safe Environment</h2>
              </div>
              <p className="loc-text">
                Our state-of-the-art facilities have been designed with care and comfort in mind. 
                We provide a secure, welcoming environment with modern amenities that support the wellbeing 
                and independence of our residents.
              </p>
              <Link to="/facilities/waverley-care-centre" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-building"></i> View All Facilities
              </Link>
            </div>
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {facilitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
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

      {/* Activities Section - Images Left, Content Right */}
      <section className="loc-section loc-section--white" id="activities-section">
        <div className="container">
          <div className="loc-grid">
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
                <span className="section-header__subtitle">Life at Waverley</span>
                <h2 className="section-header__title">Activities & Social Life</h2>
              </div>
              <p className="loc-text">
                We combine modern facilities with a homely atmosphere, encouraging residents to 
                engage in activities, social interaction, and outdoor experiences.
              </p>
              <p className="loc-text" style={{ marginTop: '15px' }}>
                Our care environment is designed to meet the needs of all residents, including those 
                requiring specialised dementia or mental health support, while promoting 
                independence, dignity, and quality of life.
              </p>
              <p className="loc-text" style={{ marginTop: '15px' }}>
                Our holistic approach ensures that every resident receives personalised, person-centred 
                care tailored to their individual preferences, abilities, and wellbeing.
              </p>
              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/activities/waverley-care-center" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-calendar-alt"></i> View All Activities
                </Link>
                <Link to="/events" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-calendar"></i> Calendar Events
                </Link>
              </div>
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
                With a team of over 200 highly trained and experienced staff, we pride ourselves on 
                exceptionally low staff turnover, reflecting a stable, knowledgeable, and committed 
                workforce dedicated to delivering the highest standards of care.
              </p>
              <p className="loc-text" style={{ marginTop: '15px' }}>
                As a family-owned nursing home, our directors are fully involved in the day-to-day 
                management of the home, ensuring that care quality, safety, and resident satisfaction 
                are consistently at the forefront of everything we do.
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
            <div className="rating-badges">
              <a href="https://www.google.com/search?q=Waverley+Care+Centre+Penarth#lrd=0x486e033990ab96b5:0x98e2601744a2d23b,1,,," target="_blank" rel="noopener noreferrer" className="rating-badge google-badge">
                <img src="/google-logo.svg" alt="Google" />
                <span className="badge-score">4.6</span>
                <span className="badge-stars">★★★★★</span>
              </a>
              <a href="https://www.carehome.co.uk/carehome.cfm/searchazref/20005022WAVA" target="_blank" rel="noopener noreferrer" className="rating-badge carehome-badge">
                <img src="/carehome-logo.svg" alt="carehome.co.uk" />
                <span className="badge-score">9.0<small>/10</small></span>
              </a>
            </div>
            <p className="section-subtitle">
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Waverley Care Centre.
            </p>
          </div>

          <div className="testimonials-carousel-wrapper">
            <button 
              className="carousel-nav-btn carousel-prev" 
              onClick={() => setCurrentReviewIndex((prev) => (prev - 1 + reviews.length) % reviews.length)}
              aria-label="Previous testimonial"
            >
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="testimonials-carousel">
              <div 
                className="testimonials-track" 
                style={{ transform: `translateX(-${currentReviewIndex * 100}%)` }}
              >
                {reviews.map((review, index) => (
                  <div key={index} className="testimonial-card">
                    <div className="testimonial-quote-icon"><i className="fas fa-quote-left"></i></div>
                    <p className="testimonial-text">"{review.text}"</p>
                    <div className="testimonial-author">
                      <h4>{review.author}</h4>
                      <span>{review.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button 
              className="carousel-nav-btn carousel-next" 
              onClick={() => setCurrentReviewIndex((prev) => (prev + 1) % reviews.length)}
              aria-label="Next testimonial"
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="carousel-dots">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentReviewIndex ? 'active' : ''}`}
                onClick={() => setCurrentReviewIndex(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      {waverleyNews.length > 0 && (
        <section className="loc-section loc-section--white" id="news-section">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Waverley</h2>
            </div>
            <div className="news-grid modern">
              {waverleyNews.map((news) => (
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
      <section className="loc-section loc-section--white" id="contact-section">
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
                  <span>122-124 Plymouth Road,<br/>Penarth, CF64 5DN</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:02920705282">029 2070 5282</a>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-envelope"></i>
                  <a href="mailto:reception@waverleycarecentre.com">reception@waverleycarecentre.com</a>
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
                  <span className="fact-value">129 Residents</span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Location:</span>
                  <span 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Waverley+Care+Centre+Penarth', '_blank')}
                  >
                    Penarth
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Our Care
                  </Link>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Setting:</span>
                  <span className="fact-value">Coastal</span>
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
                  "The staff at Waverley Care Centre are exceptional. They treat my mother with such dignity and kindness."
                </p>
                <a 
                  href="https://www.google.com/search?q=Waverley+Care+Centre+Penarth+Reviews" 
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

export default WaverleyCareCentre;
