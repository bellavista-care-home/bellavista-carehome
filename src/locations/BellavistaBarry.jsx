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
import '../styles/MainPage.css';
import '../styles/Testimonials.css';
import SEO from '../components/SEO';

import DynamicContentSection from '../components/DynamicContentSection';

const BellavistaBarry = () => {
  const navigate = useNavigate();
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [barryNews, setBarryNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Dynamic Data for Cards
  const [activitiesCards, setActivitiesCards] = useState([]);
  const [facilitiesCards, setFacilitiesCards] = useState([]);

  // Default Static Data (Fallbacks)
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
        news.location.toLowerCase().includes('barry') || 
        news.location === 'All Locations'
      );
      setBarryNews(filtered);

      // Load Home Data from Backend
      const home = await fetchHome('bellavista-barry');
      if (home) {
        setHomeData(home);
        if (home.teamMembers && home.teamMembers.length > 0) {
          setTeamMembers(home.teamMembers);
        }
        if (home.activityImages && home.activityImages.length > 0) {
          setActivitiesGalleryImages(home.activityImages);
          // Process Activities for Cards
          const visibleActivities = home.activityImages
            .filter(img => typeof img === 'object' && img.showOnPage)
            .map(img => ({
              title: img.title || 'Activity',
              description: img.shortDescription || '',
              image: img.url,
              details: img.fullDescription || img.shortDescription || '',
              type: 'activity'
            }));
          setActivitiesCards(visibleActivities);
        }
        if (home.facilitiesGalleryImages && home.facilitiesGalleryImages.length > 0) {
          setFacilitiesGalleryImages(home.facilitiesGalleryImages);
          // Process Facilities for Cards
          const visibleFacilities = home.facilitiesGalleryImages
            .filter(img => typeof img === 'object' && img.showOnPage)
            .map(img => ({
              title: img.title || 'Facility',
              description: img.shortDescription || '',
              image: img.url,
              details: img.fullDescription || img.shortDescription || '',
              type: 'facility'
            }));
          setFacilitiesCards(visibleFacilities);
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
        const reviewData = await fetchReviews({ location: 'Barry' });
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
              text: "Bellavista Barry provided exceptional care for my mother. The staff were always kind, attentive, and professional.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "The views over the Bristol Channel are stunning, and the home has such a warm, welcoming atmosphere.",
              author: "Visitor",
              role: "Verified Review"
            }
          ]);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        setReviews([
            {
              text: "Bellavista Barry provided exceptional care for my mother. The staff were always kind, attentive, and professional.",
              author: "Family of Resident",
              role: "Verified Review"
            },
            {
              text: "The views over the Bristol Channel are stunning, and the home has such a warm, welcoming atmosphere.",
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





  const activitiesList = [
    "Flower arranging",
    "Arts and Crafts",
    "Bingo",
    "Meals Out",
    "Sensory therapy",
    "Playing Cards",
    "Sing a long/ Karaoke",
    "Board Games",
    "Painting Competition",
    "Trips out",
    "Baking & cooking",
    "Massage",
    "Gardening",
    "Sewing",
    "Singers and Musicians Performing",
    "Local School’s Visiting",
    "Church Service",
    "Armchair Exercises",
    "Garden Activities",
    "Newspaper Reading",
    "Seasonal Activities",
    "Film Days",
    "1-2-1 Reminiscing"
  ];

  const facilitiesList = [
    { icon: "fas fa-bed", title: "26 Bedrooms" },
    { icon: "fas fa-wheelchair", title: "Dementia Care" },
    { icon: "fas fa-utensils", title: "Dementia Dining" },
    { icon: "fas fa-wifi", title: "Free Wifi" },
    { icon: "fas fa-tree", title: "Sensory Garden" },
    { icon: "fas fa-car", title: "On-site Parking" },
    { icon: "fas fa-user-nurse", title: "24/7 Nursing" },
    { icon: "fas fa-elevator", title: "Lift Access" }
  ];

  const servicesList = [
    "High-Level Dementia Nursing",
    "Dementia Residential Care",
    "General Nursing",
    "Respite Care",
    "CHC Nursing",
    "End of Life Care"
  ];

  const whyChooseList = [
    "Exceptional, person-centred care for older adults",
    "Specialist nursing and dementia care, delivered by highly trained staff",
    "Continuum of care supporting independence and evolving needs",
    "Safe, secure, and welcoming environment with modern, dementia-friendly facilities",
    "Tailored activities and social engagement promoting quality of life and wellbeing",
    "Prime seaside location with stunning views over the Bristol Channel"
  ];

  // Swiper settings
  const sliderSettings = {
    modules: [Navigation, Pagination, Autoplay],
    spaceBetween: 20,
    slidesPerView: 1,
    navigation: true,
    pagination: { 
      clickable: true,
      dynamicBullets: true, // Reduces the number of visible dots
    },
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    }
  };

  const barrySchema = {
    "@context": "https://schema.org",
    "@type": "NursingHome",
    "@id": "https://www.bellavistanursinghomes.com/bellavista-barry#nursing-home",
    "name": "Bellavista Nursing Home Barry - Rated Best in UK",
    "url": "https://www.bellavistanursinghomes.com/bellavista-barry",
    "description": "Bellavista Barry is a top-rated, award-winning nursing home in Barry. Recognized as one of the best care homes in South Wales, offering exceptional dementia, nursing, and respite care with stunning views.",
    "slogan": "Award-Winning Care by the Sea",
    "telephone": "+44 1446 743893",
    "priceRange": "£££",
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
    "hasMap": "https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Barry",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "106-108 Tynewydd Road",
      "addressLocality": "Barry",
      "postalCode": "CF62 8BB",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "51.405",
      "longitude": "-3.270"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "85",
      "bestRating": "5"
    },
    "image": [
      "https://www.bellavistanursinghomes.com/FrontPageBanner/banner-first.jpg"
    ],
    "logo": "https://www.bellavistanursinghomes.com/bellalogo1.png",
    "sameAs": [
      "https://www.facebook.com/bellavistanursinghome/",
      "https://x.com/home_bellavista?lang=en",
      "https://digital.careinspectorate.wales/backend/directory/service/SIN-00010669-KLMD/LatestInspectionReport",
      "https://www.carehome.co.uk/carehome.cfm/searchazref/20001005BELA"
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
        "reviewBody": "Bellavista Barry provided exceptional care for my mother. The staff were always kind, attentive, and professional."
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
        "reviewBody": "The views over the Bristol Channel are stunning, and the home has such a warm, welcoming atmosphere."
      }
    ],
    "parentOrganization": {
      "@id": "https://www.bellavistanursinghomes.com/#organization"
    }
  };

  return (
    <div className="location-page theme-barry home">
      <style>{`
        .theme-barry {
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
        .theme-barry .hero-title {
          width: 100%;
        }
        .theme-barry .hero-title .title-main {
          white-space: normal;
          line-height: 1.1;
          font-family: var(--font-heading);
        }
        .theme-barry .hero-title .title-sub {
          color: var(--soft-blue);
          font-style: italic;
          opacity: 0.95;
          margin-top: 16px;
          font-family: var(--font-heading);
        }
        .theme-barry .hero-description {
          color: rgba(255, 251, 244, 0.9);
          font-family: var(--font-body);
        }
        
        /* 2. ABOUT / INTRO SECTION */
        .theme-barry .group-intro-title .group-name {
          color: var(--color-primary-dark);
          border-bottom: 3px solid var(--color-secondary);
          padding-bottom: 10px;
          display: inline-block;
          font-family: var(--font-heading);
        }
        .theme-barry .group-intro-text p {
          color: var(--color-text-main);
          line-height: 1.8;
        }
        .theme-barry .group-intro-text h3 {
          color: var(--color-primary);
          border-left: 4px solid var(--color-secondary);
          padding-left: 15px;
          margin-top: 30px;
          margin-bottom: 15px;
          font-family: var(--font-heading);
        }
        .theme-barry .btn-primary {
          background-color: var(--color-primary);
          border-color: var(--color-primary);
          color: var(--color-bg-light);
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-barry .btn-primary:hover {
          background-color: var(--color-primary-dark);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(86, 84, 73, 0.3);
        }
        .theme-barry .btn-outline {
          color: var(--color-primary);
          border-color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 1px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .theme-barry .btn-outline:hover {
          background-color: var(--color-primary);
          color: var(--color-bg-light);
        }

        /* 3. QUICK STATS */
        .theme-barry .loc-stats__item {
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid var(--color-secondary);
          color: var(--color-primary-dark);
        }
        .theme-barry .loc-stats__item i {
          color: var(--color-primary);
        }
        .theme-barry .loc-stats__item:hover {
          background: var(--color-bg-light);
          border-color: var(--color-primary);
        }

        /* 4. ACTIVITIES & FACILITIES SECTIONS */
        .theme-barry .section-header__subtitle {
          color: var(--color-primary);
          font-family: var(--font-body);
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .theme-barry .section-header__title {
          color: var(--color-primary-dark);
          font-family: var(--font-heading);
        }
        .theme-barry .detailed-facility-card {
          border-color: var(--color-secondary);
        }
        .theme-barry .detailed-facility-card:hover {
          border-color: var(--color-primary);
        }
        .theme-barry .detailed-facility-card i {
          color: var(--color-primary) !important;
        }
        .theme-barry .detailed-facility-card span {
          color: var(--color-primary) !important;
        }
        .theme-barry .facility-card {
          border-color: var(--color-secondary);
        }
        .theme-barry .facility-card__icon {
          color: var(--color-primary);
          background-color: var(--color-bg-light);
        }

        /* 5. TEAM SECTION */
        .theme-barry .team-member-card {
          border-color: var(--color-secondary);
        }
        .theme-barry .team-member-card span {
          color: var(--color-primary);
        }

        /* 6. NEWS SECTION */
        .theme-barry .news-card {
          border-color: var(--color-secondary);
        }
        .theme-barry .news-card__link {
          color: var(--color-primary);
        }
        .theme-barry .news-card__link::after {
          background-color: var(--color-primary);
        }

        /* 7. BOTTOM CARDS (Contact, Facts, Reviews) */
        .theme-barry .bottom-card {
          border-color: var(--color-secondary);
        }
        .theme-barry .bottom-card__title {
          color: var(--color-primary-dark);
          border-bottom: 2px solid var(--color-secondary);
          padding-bottom: 10px;
          margin-bottom: 20px;
          font-family: var(--font-heading);
        }
        .theme-barry .contact-mini-item i {
          color: var(--color-primary);
        }
        .theme-barry .fact-label {
          color: var(--color-primary);
          font-weight: 700;
        }
        .theme-barry .fact-row {
          border-bottom-color: var(--color-secondary);
        }
        .theme-barry .fact-value {
          color: var(--color-text-main);
        }
        /* Override inline styles for links in facts */
        .theme-barry .fact-value[style*="color: #0066cc"] {
          color: var(--color-primary) !important;
        }
        .theme-barry .review-mini-text {
          font-style: italic;
          color: var(--text-light);
        }
        /* 8. WHY CHOOSE SECTION */
        .theme-barry .why-choose-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 15px;
          text-align: left;
          margin: 20px 0;
        }
        .theme-barry .why-choose-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          padding: 15px;
          border-radius: 8px;
          border-left: 3px solid var(--color-secondary);
          transition: transform 0.2s ease;
        }
        .theme-barry .why-choose-item:hover {
          transform: translateX(5px);
          border-left-color: var(--color-primary);
        }
        .theme-barry .why-choose-item i {
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
      `}</style>
      <SEO 
        title="Bellavista Barry | Best Nursing Home in Barry & South Wales"
        description="Bellavista Barry is a top-rated, award-winning nursing home overlooking the Bristol Channel. Recognized as one of the best care homes in the UK for dementia and nursing care."
        url="/bellavista-barry"
        schema={barrySchema}
      />
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/home-images/barry.jpg" alt="Bellavista Nursing Home Barry" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Nursing Home in Barry</span>
              <span className="title-sub">Bellavista Nursing Home Barry - stunning views over the Bristol Channel.</span>
            </h1>
            <p className="hero-description">
              Bellavista Barry is a long-established, high-quality nursing home located in the seaside 
              town of Barry, offering stunning views over the Bristol Channel. Since opening in 
              2007, we have been dedicated to enabling older adults to continue living as 
              independently as possible, with personalised care and support tailored to their 
              individual needs.
            </p>
            
            <div className="hero-cta-buttons hero-buttons-row">
              <div className="btn btn-primary" style={{ cursor: 'default', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-bed"></i> {homeData?.statsBedrooms || "39 Bedrooms"}
              </div>
              <div className="btn btn-primary" onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Barry', '_blank')} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
                <i className="fas fa-map-marker-alt"></i> Barry Seaside
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

      <section className="about-group-intro">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">Welcome to Bellavista Barry</span>
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
                Bellavista Barry is a long-established, high-quality nursing home located in the seaside 
                town of Barry, offering stunning views over the Bristol Channel. Since opening in 
                2007, we have been dedicated to enabling older adults to continue living as 
                independently as possible, with personalised care and support tailored to their 
                individual needs.
              </p>
              <p>
                Our 39-bedded, fully registered care home provides accommodation, nursing, and 
                specialist dementia care, with a focus on supporting residents at every stage of 
                ageing. We provide a continuum of care that adapts to increasing frailty and evolving 
                needs, ensuring the privacy, dignity, independence, rights, and choices of each resident 
                are central to their stay at Bellavista Barry.
              </p>

              <h3 className="section-header__title" style={{ marginTop: '40px' }}>Our Care Philosophy</h3>
              <p>
                At Bellavista Barry, every resident’s care is person-centred and carefully tailored. 
                Individual needs are assessed, and a personalised care plan is created to ensure the 
                highest standards of support and quality of life. We nurture social connections, 
                promote engagement with the local community, and strive to maintain a relaxed, 
                happy, and homely environment for everyone in our care.
              </p>
              
              <div className="location-highlight" style={{ marginTop: '40px', padding: '20px', background: 'rgba(255, 255, 255, 0.5)', borderRadius: '8px', borderLeft: '4px solid var(--color-secondary)' }}>
                <h3 className="section-header__title" style={{ marginTop: '0', marginBottom: '15px' }}>Our Location</h3>
                <p style={{ marginBottom: '0' }}>
                  Our home combines high standards of care with a welcoming atmosphere, ensuring 
                  residents feel secure, valued, and at home at all times. We are proud to offer a homely yet professional environment, with facilities designed 
                  to support the needs of all residents, including those living with dementia.
                  Residents benefit from modern, safe, and comfortable surroundings, including our brand new 
                  dining area, which provides a Dementia-Friendly Dining Experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Bellavista Barry */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content" style={{ width: '100%' }}>
              <div className="section-header section-header--center">
                <span className="section-header__subtitle">Why Choose Us</span>
                <h2 className="section-header__title">Why Choose Bellavista Barry</h2>
              </div>
              <div className="why-choose-grid">
                {whyChooseList.map((item, index) => (
                  <div key={index} className="why-choose-item">
                    <i className="fas fa-check-circle"></i>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <p className="loc-text" style={{ textAlign: 'center', marginTop: '30px' }}>
                At Bellavista Barry, we are committed to delivering the highest standards of nursing 
                care in a homely, professional setting, ensuring that residents enjoy a fulfilling, 
                comfortable, and dignified life.
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
                Our team delivers professional social care and nursing services for older adults, including:
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
                This comprehensive approach ensures residents enjoy the perfect balance of peace, 
                tranquillity, privacy, companionship, and safety, all within a secure and supportive 
                environment.
              </p>
          <Link to="/facilities/bellavista-barry" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
             <i className="fas fa-eye"></i> View All Facilities
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

      {/* 2. ACTIVITIES SECTION */}
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
                <h2 className="section-header__title">Activities Barry</h2>
              </div>
              <p className="loc-text">
                Our dedicated activities team designs and delivers person-centred programmes, 
                tailored to the interests, abilities, and wellbeing of each resident. From social activities 
                to cognitive engagement, we encourage residents to remain active, independent, and 
                fulfilled throughout their stay.
              </p>
              <Link to="/activities/bellavista-barry" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-calendar-alt"></i> View All Activities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FACILITIES SECTION */}
      {/* 
         NOTE: This content was moved/integrated into the "Services" and "Intro" sections
         to match the Cardiff layout structure requested by the user. 
         Keeping the specific "Facilities & Services" section code commented out or removed 
         if we want strictly Cardiff structure.
         
         For now, I will remove the old redundant "Facilities & Services" block that was here
         since its content (gallery) is now in the Services section above, and text in Intro.
      */}

      {/* 4. TEAM & CARE */}
      <section className="loc-section loc-section--light" id="team-section">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Dedicated Staff</span>
                <h2 className="section-header__title">Our Team</h2>
              </div>
              <p className="loc-text">
                All staff at Bellavista Barry are highly trained and appropriately qualified to deliver 
                exceptional care. We invest in continuous professional development, with regular 
                training programmes to ensure compliance with legislation, regulations, and the Care 
                Inspectorate for Wales (CIW) standards.
              </p>
              <p className="loc-text">
                Our dedicated activities team designs and delivers person-centred programmes, 
                tailored to the interests, abilities, and wellbeing of each resident. From social activities 
                to cognitive engagement, we encourage residents to remain active, independent, and 
                fulfilled throughout their stay.
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
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Bellavista Barry.
            </p>
          </div>

          <div className="testimonials-layout">
            <div className="rating-cards-container">
              {/* Google Rating Card */}
              <div className="google-rating-card">
                <div className="google-logo">
                  <img src="/google-logo.svg" alt="Google" style={{ height: '30px', maxWidth: '100%' }} />
                </div>
                <div className="google-rating-circle">
                  <span className="google-score">4.8</span>
                  <span className="google-max">/ 5</span>
                </div>
                <div className="google-stars">
                  ★★★★★
                </div>
                <p className="google-text">Based on 12 reviews</p>
                <a href="https://www.google.com/search?q=Bellavista+Nursing+Home+Barry#lrd=0x486e09597f7e580b:0x22f8a99287879acd,1,,," target="_blank" rel="noopener noreferrer" className="btn-google">
                  Read Reviews
                </a>
              </div>

              {/* Carehome.co.uk Rating Card */}
              <div className="carehome-rating-card">
                <div className="carehome-logo">
                  <img src="/carehome-logo.svg" alt="carehome.co.uk" style={{ height: '30px', maxWidth: '100%' }} />
                </div>
                <div className="carehome-rating-circle">
                  <span className="carehome-score">9.3</span>
                  <span className="carehome-max">/ 10</span>
                </div>
                <p className="carehome-text">Review Score on carehome.co.uk</p>
                <a href="https://www.carehome.co.uk/carehome.cfm/searchazref/20005022BELA" target="_blank" rel="noopener noreferrer" className="btn-carehome">
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
          <h2 className="section-header__title" style={{ marginBottom: '20px' }}>Discover More About Our Care</h2>
          <p className="loc-text" style={{ maxWidth: '800px', margin: '0 auto 30px auto' }}>
            We invite families, healthcare professionals, and prospective residents to explore our 
            approach to care, see how our team supports residents, and experience the warmth 
            and professionalism that define Bellavista Barry.
          </p>
          <Link to="/care/bellavista-barry" className="btn btn-primary btn-lg">
            Find out more about OUR CARE
          </Link>
        </div>
      </section>

      {barryNews.length > 0 && (
        <section className="loc-section loc-section--light">
          <div className="container">
            <div className="section-header section-header--center">
              <span className="section-header__subtitle">Updates</span>
              <h2 className="section-header__title">Latest News from Barry</h2>
            </div>
            <div className="news-grid modern">
              {barryNews.map((news) => (
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
                  <span>106-108 Tynewydd Road,<br/>Barry, CF62 8BB</span>
                </div>
                <div className="contact-mini-item">
                  <i className="fas fa-phone"></i>
                  <a href="tel:01446743893">01446 743893</a>
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
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Bellavista+Nursing+Home+Barry', '_blank')}
                  >
                    Barry
                  </span>
                </div>
                <div className="fact-row">
                  <span className="fact-label">Our Care:</span>
                  <Link 
                    to="/our-care" 
                    className="fact-value" 
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
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
                  We value your feedback. Please let us know about your experience at Bellavista Barry.
                </p>
                <a 
                  href="https://www.google.com/search?q=Bellavista+Nursing+Home+Barry+Reviews" 
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

export default BellavistaBarry;
