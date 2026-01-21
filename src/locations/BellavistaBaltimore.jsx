import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/CareHome.css';
import ReviewForm from '../components/ReviewForm';
import { fetchNewsItems } from '../services/newsService';
import { fetchHome } from '../services/homeService';
import SlideMedia from '../components/SlideMedia';
import SEO from '../components/SEO';

const BellavistaBaltimore = () => {
  const navigate = useNavigate();
  const [showActivitiesModal, setShowActivitiesModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [facilitiesExpanded, setFacilitiesExpanded] = useState(false);
  const [baltimoreNews, setBaltimoreNews] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [homeData, setHomeData] = useState(null);

  // Using Barry's images as placeholders
  const defaultActivitiesImages = [
    "Bingo-Activity-150x150.jpg",
    "IMG-20180716-WA0005-150x150.jpg",
    "IMG-20180716-WA0013-150x150.jpg",
    "IMG-20180716-WA0016-150x150.jpg",
    "IMG-20180716-WA0017-150x150.jpg",
    "IMG-20180809-WA0001-150x150.jpg",
    "IMG-20180809-WA0006-150x150.jpg",
    "IMG-20180809-WA0011-1-150x150.jpg",
    "IMG-20180809-WA0016-150x150.jpg",
    "IMG-20180809-WA0017-150x150.jpg",
    "IMG-20180809-WA0019-150x150.jpg",
    "IMG_8298-150x150.jpg",
    "IMG_8332-150x150.jpg",
    "IMG_8340-150x150.jpg"
  ];

  const defaultFacilitiesImages = [
    "98000815_933014320502979_5416674318329315328_n-150x150.jpg",
    "98005368_933014173836327_3282387137734901760_n-150x150.jpg",
    "98185714_933014203836324_2891158467958013952_n-150x150.jpg",
    "98204419_933014370502974_7682212452494213120_n-150x150.jpg",
    "98316881_933014347169643_7230616531313360896_n-150x150.jpg",
    "Copy-of-lounge-150x150.jpg",
    "IMG9-150x150.jpg",
    "IMG_0344-150x150.jpg",
    "IMG_0357-150x150.jpg",
    "IMG_4114-150x150.jpg",
    "IMG_4115-150x150.jpg",
    "IMG_4121-Copy-150x150.jpg",
    "IMG_4137-150x150.jpg",
    "IMG_4187-150x150.jpg",
    "IMG_4199-150x150.jpg",
    "IMG_4241-150x150.jpg",
    "IMG_4280-150x150.jpg",
    "IMG_4282-150x150.jpg",
    "IMG_4301R-150x150.jpg",
    "IMG_4325-150x150.jpg",
    "IMG_4363-150x150.jpg",
    "IMG_4379-150x150.jpg",
    "IMG_4385-150x150.jpg",
    "IMG_4414-150x150.jpg",
    "IMG_4441-150x150.jpg",
    "IMG_4446-150x150.jpg",
    "IMG_4455-150x150.jpg",
    "IMG_4473-150x150.jpg",
    "IMG_4528-150x150.jpg",
    "IMG_4587-150x150.jpg",
    "IMG_4600-150x150.jpg",
    "IMG_4610-150x150.jpg",
    "IMG_8313-150x150.jpg"
  ];

  const defaultTeamImages = [
    "Barry-Teamn-150x150.png",
    "IMG-20180816-WA0019-150x150.jpg",
    "IMG_0324-150x150.jpg",
    "IMG_0367-Copy-150x150.jpg",
    "IMG_0400-150x150.jpg",
    "IMG_0586-150x150.jpg",
    "IMG_46181-547x364-150x150.jpg",
    "IMG_8885-150x150.jpg",
    "b2-150x150.jpg"
  ];

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
      }
    };
    loadData();
  }, []);






  const facilitiesList = [
    { icon: "fas fa-bed", title: "Total 26 Rooms" },
    { icon: "fas fa-bath", title: "7 Ensuite Rooms" },
    { icon: "fas fa-wheelchair", title: "Wheelchair Access" },
    { icon: "fas fa-arrow-up", title: "Lift Available" },
    { icon: "fas fa-bus", title: "Transport Access" },
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

  const slides = [
    '/FrontPageBanner/banner-first.jpg',
    '/FrontPageBanner/banner-second.png',
    '/FrontPageBanner/banner-third.png',
    '/FrontPageBanner/banner-fourth.jpg',
    '/FrontPageBanner/banner-fifth.jpg'
  ];

  return (
    <div className="location-page theme-baltimore">
      <SEO 
        title="Baltimore House Care Home"
        description="Baltimore House in Barry provides residential care for older people, including specialist support for dementia and mental health in a warm, homely setting."
        url="/baltimore-care-home"
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
              <span className="title-main">Baltimore House Care Home</span>
              <span className="title-sub">A Warm, Homely Environment with Professional Care</span>
            </h1>
            <p className="hero-description">
              Baltimore House Care Home is a well-established residential facility located in the scenic and tranquil surroundings of Barry, offering the perfect balance of rural charm and professional care.
            </p>
          </div>
        </div>

        <div className="hero-marquee-full-width">
          <div className="hero-marquee-track">
            {slides.concat(slides).map((slide, index) => (
              <img key={`${slide}-${index}`} src={slide} alt={`Bellavista highlight ${index + 1}`} />
            ))}
          </div>
        </div>
      </section>

      <section className="about-group-intro">
        <div className="container">
          <div className="about-group-content">
            <h2 className="group-intro-title">
              <span className="group-name">Welcome to Baltimore House Care Home</span>
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
                Baltimore House Care Home is a well-established residential home located in the
                scenic and tranquil surroundings of Barry, offering the perfect balance of rural
                charm and professional care.
              </p>
              <p>
                Situated opposite the historic All Saints Church, and just a short distance from
                Porthkerry Country Park with its 220 acres of woods and meadows, our location
                provides residents with a serene and inspiring environment, ideal for
                relaxation, outdoor enjoyment, and community engagement.
              </p>
              <p>
                Our directors and management team are actively involved in the day-to-day
                operations, ensuring the highest standards of care and a personal approach that
                makes every resident feel valued and supported.
              </p>
              <p>
                Baltimore House provides support for up to 26 residents, including those living
                with cognitive impairments, dementia, Alzheimer’s disease, and functional mental
                health conditions such as bipolar disorder and depression. Each speciality is
                overseen by a dedicated manager and trained staff team, ensuring that every
                resident receives care tailored to their individual needs.
              </p>
              <p>
                Our home focuses on person-centred care, creating a homely environment where
                residents can continue to live safely, comfortably, and independently wherever
                possible.
              </p>
              <p>Services include:</p>
              <ul>
                <li>General residential care for older adults</li>
                <li>Dementia and Alzheimer’s care</li>
                <li>Support for functional mental illness (bipolar disorder and depression)</li>
              </ul>
              <p>
                Residents benefit from prompt access to GP services and community healthcare
                support, including dietetics, occupational therapy, and mental health teams.
                Visiting specialists such as chiropodists are available, and families are
                encouraged to arrange personal therapists or hairdressing visits if desired.
              </p>
              <p>
                Baltimore House combines the charm of a traditional home with the modern
                amenities required for contemporary residential care. The property features
                wheelchair access throughout, lift access to upper floors, spacious lounges, and
                a large conservatory with garden views.
              </p>
              <p>
                Rooms are tastefully decorated, with high ceilings and original character
                features enhanced by modern care facilities. Social spaces host regular
                gatherings, entertainment, and community activities, helping residents feel
                engaged and connected.
              </p>
              <p>
                Additional amenities include the option for residents to bring their own
                furniture, pet-friendly policies, phone and television points in rooms, and
                internet access for residents.
              </p>
              <p>
                Baltimore House is ideally situated within walking distance of Barry town
                centre, with shops, facilities, and services close at hand. Residents also
                benefit from proximity to Barry Dock and Barry Island, with excellent public
                transport links and road access to surrounding areas.
              </p>
              <p>
                Our location combines peaceful surroundings with convenience and connectivity,
                making it easy for families and friends to visit.
              </p>
              <p>Why choose Baltimore House:</p>
              <ul>
                <li>Small, homely environment with personalised, person-centred care</li>
                <li>
                  Specialist support for dementia, Alzheimer’s, and functional mental health
                  conditions
                </li>
                <li>
                  Experienced and long-standing staff, creating a true home-from-home atmosphere
                </li>
                <li>
                  Spacious, bright, and characterful environment, including conservatory and
                  garden spaces
                </li>
                <li>
                  Modern facilities and accessibility, including wheelchair access and lift
                  service
                </li>
                <li>
                  Pet-friendly policies and support for personalising rooms
                </li>
                <li>
                  Strong links with community and healthcare services for holistic support
                </li>
              </ul>
              <p>
                At Baltimore House, our goal is to create a safe, welcoming, and professional
                environment where residents feel secure, valued, and supported, while enjoying
                quality of life, independence, and dignity every day. To learn more about our
                approach, you can also visit the{' '}
                <Link to="/our-care">Our Care</Link> page.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats Row (Floating) */}
        <div className="loc-stats">
          <div className="loc-stats__item">
            <i className="fas fa-bed"></i>
            <span>26 Bedrooms</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => window.open('https://www.google.com/maps/search/?api=1&query=Baltimore+House+Care+Home+Barry', '_blank')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-map-marker-alt"></i>
            <span>Barry</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => navigate('/our-care')}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-star"></i>
            <span>Quality Care</span>
          </div>
          <div 
            className="loc-stats__item"
            onClick={() => document.getElementById('team-section')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ cursor: 'pointer' }}
          >
            <i className="fas fa-users"></i>
            <span>Expert Team</span>
          </div>
        </div>
      </section>

      {/* 2. ACTIVITIES SECTION */}
      <section className="loc-section loc-section--white">
        <div className="container">
          <div className="loc-grid">
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {activitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <SlideMedia item={img} folder="BarryActivitiesGallery" />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
            <div className="loc-grid__content">
              <div className="section-header">
                <span className="section-header__subtitle">Life at Baltimore House</span>
                <h2 className="section-header__title">Activities Baltimore</h2>
              </div>
              <p className="loc-text">
                At Baltimore House, we believe encouraging our residents to be as active as possible is a key part of maintaining good physical and mental well being. We offer a varied activity program designed to be stimulating, fun, and promote socialisation.
              </p>
              <button className="btn btn--outline" onClick={() => setShowActivitiesModal(true)}>
                See More Activities
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Activities Modal */}
      {showActivitiesModal && (
        <div className="modal-overlay" onClick={() => setShowActivitiesModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowActivitiesModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-title">Activities at Baltimore House</h2>
            <div className="modal-body">
              <p>
                We create a homely environment where residents can enjoy their hobbies and interests. Our activities are tailored to individual needs and preferences.
              </p>

            </div>
          </div>
        </div>
      )}

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
                  We cater services primarily for general and dementia registered clients. This includes Old Age/Elderly Care and Dementia/Alzheimer’s Care for those assessed as needing residential care.
                </p>
                
                <div className={`facilities-content__more ${facilitiesExpanded ? 'facilities-content__more--expanded' : ''}`}>
                  <p className="loc-text">
                    There is provision for functional mental illness such as Bipolar Disorder/Depression also categorised as requiring residential rather than nursing care provision.
                  </p>
                  
                  <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--color-primary)', marginBottom: '15px' }}>Key Features</h3>
                    <ul className="loc-text" style={{ listStyleType: 'none', padding: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Total 26 Rooms</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>7 Rooms have ensuite facilities</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Wheelchair Access to all areas</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Lift Available</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Good access to public transport</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Own furniture if required</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Pet Friendly</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Phone Point in own room/Mobile</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Television point in own room</li>
                      <li><i className="fas fa-check" style={{ color: 'var(--color-primary)', marginRight: '10px' }}></i>Residents Internet Access</li>
                    </ul>
                  </div>
                </div>

                <button 
                  className="btn btn--outline" 
                  onClick={() => setFacilitiesExpanded(!facilitiesExpanded)}
                  style={{ marginTop: '20px' }}
                >
                  {facilitiesExpanded ? 'Read Less' : 'Read More'}
                </button>
              </div>
            </div>
            <div className="loc-grid__media">
              <div className="loc-slider">
                <Swiper {...sliderSettings} className="custom-swiper">
                  {facilitiesGalleryImages.map((img, index) => (
                    <SwiperSlide key={index}>
                      <div className="loc-slider__item">
                        <SlideMedia item={img} folder="BarryFacilitiesGalley" />
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

      {/* 4. TEAM & CARE */}
      {(teamMembers.length > 0 || teamGalleryImages.length > 0) && (
        <section className="loc-section loc-section--white" id="team-section">
          <div className="container">
            <div className="loc-grid">
              <div className="loc-grid__content">
                <div className="section-header">
                  <span className="section-header__subtitle">Dedicated Staff</span>
                  <h2 className="section-header__title">Meet Our Team</h2>
                </div>
                <p className="loc-text">
                  Our directors are fully involved in the management of the home, ensuring a personal touch. Our dedicated staff provide high-quality care tailored to the needs of each resident.
                </p>
              </div>
              <div className="loc-grid__media">
                <div className="loc-slider">
                  <Swiper {...sliderSettings} className="custom-swiper">
                    {teamGalleryImages.map((img, index) => (
                      <SwiperSlide key={index}>
                        <div className="loc-slider__item">
                          <SlideMedia item={img} folder="BarryTeam" />
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

      {/* 5. NEWS SECTION */}
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
                <button className="btn btn--primary" style={{width: '100%', marginTop: '24px'}} onClick={() => window.location.href='/schedule-tour'}>
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
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
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
                    style={{ color: '#0066cc', textDecoration: 'underline', cursor: 'pointer' }}
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
                <button className="btn btn--outline" style={{width: '100%'}} onClick={() => setShowReviewModal(true)}>
                  Write a Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="modal-overlay" onClick={() => setShowReviewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowReviewModal(false)}>
              <i className="fas fa-times"></i>
            </button>
            <h2 className="modal-title">Write a Review</h2>
            <ReviewForm 
              locationName="Baltimore Care Home" 
              googleReviewUrl="https://www.google.com/maps/search/?api=1&query=Baltimore+House+Care+Home+Barry"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BellavistaBaltimore;
