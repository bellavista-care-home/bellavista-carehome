import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/autoplay';

import OurHomes from './OurHomes';
import SEO from '../components/SEO';
import { fetchNewsItems } from '../services/newsService';
import { fetchReviews } from '../services/reviewService';
import { fetchHomes } from '../services/homeService';
import FindNearestHome from '../components/FindNearestHome';
import '../styles/MainPage.css';

const Home = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('living');
  const [activeFilter, setActiveFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [newsList, setNewsList] = useState([]);
  
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    let text = tmp.textContent || tmp.innerText || '';
    
    // Check if text looks like HTML (double encoded)
    if (text.match(/<[^>]*>/)) {
      tmp.innerHTML = text;
      text = tmp.textContent || tmp.innerText || '';
    }
    
    return text.replace(/&nbsp;/g, ' ').replace(/\u00A0/g, ' ');
  };

  const MAX_EXCERPT = 600; // Increased to allow more content (4-5 lines)

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [reviews, setReviews] = useState([
    {
      text: "Bellavista Nursing Home is an established and trusted Nursing Care provider in South Wales area, reputed for its friendly, warm, caring and relaxed environment 'A Home from home'.",
      author: "Bellavista Group",
      role: "Our Philosophy"
    },
    {
      text: "At the Waverley we know that little things make all the difference to our lives – a smiling face in the morning, a trip outside when the sun is shining, staff who have time to stop and chat.",
      author: "Waverley Care Centre",
      role: "Care Team"
    },
    {
      text: "Home is highly recommended by residents and relatives alike, our homes provide a safe, comfortable and stimulating environment that enable our highly trained staff to provide the best possible care.",
      author: "Relative",
      role: "Testimonial"
    },
    {
      text: "The atmosphere at Baltimore House is warm and friendly so you are more than welcome to arrange to have a look around if you or your loved one is looking for care.",
      author: "Baltimore House",
      role: "Visitor"
    }
  ]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await fetchReviews();
        if (data && data.length > 0) {
          // Map backend data to UI format
          // Backend likely returns: { review: "...", name: "...", rating: 5, ... }
          const mappedReviews = data.slice(0, 5).map(r => ({
            text: r.review,
            author: r.name || "Verified Resident",
            role: "Verified Review"
          }));
          setReviews(mappedReviews);
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
        // Fallback to default reviews (already in state)
      }
    };
    
    loadReviews();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReviewIndex((prevIndex) => (prevIndex + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const featuredNews = newsList.find(news => news.important) || newsList[0] || {};

  const [slides, setSlides] = useState([]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const homes = await fetchHomes();
        const allBanners = [];
        
        if (homes && Array.isArray(homes)) {
          homes.forEach(home => {
            let banners = home.bannerImages;
            if (banners && Array.isArray(banners)) {
              banners.forEach(img => {
                if (img.showOnMain) {
                  allBanners.push(img.url);
                }
              });
            }
          });
        }
        
        if (allBanners.length > 0) {
          setSlides(allBanners);
        }
      } catch (err) {
        console.error("Error loading banners", err);
      }
    };
    loadBanners();
  }, []);

  useEffect(() => {
    const loadNews = async () => {
      const items = await fetchNewsItems();
      setNewsList(items);
    };
    loadNews();
  }, []);

  // Handle modal body lock
  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [modalOpen]);

  const filterNews = (filter) => {
    setActiveFilter(filter);
  };

  // Filter news based on active filter
  const filteredNews = activeFilter === 'all' 
    ? newsList 
    : newsList.filter(news => news.category && news.category.toLowerCase() === activeFilter);


  const openModal = (serviceType) => {
    const serviceDetails = {
      comfort: {
        title: 'Home Comfort - A Warm, Welcoming Environment',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-home"></i> Creating a Home-Like Atmosphere</h4>
            <p>At Bellavista, we believe that comfort begins with creating an environment that truly feels like home.</p>
            <h4><i class="fas fa-couch"></i> Comfortable Living Spaces</h4>
            <ul>
              <li>Beautifully furnished communal lounges with comfortable seating</li>
              <li>Private en-suite bedrooms with personal touches encouraged</li>
              <li>Quiet reading areas and peaceful garden spaces</li>
              <li>Family-friendly visiting areas for quality time together</li>
            </ul>
          </div>
        `
      },
      safety: {
        title: 'Safety First - Advanced Protection & Emergency Response',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-shield-alt"></i> Comprehensive Safety Systems</h4>
            <p>The safety and security of our residents is our top priority.</p>
            <h4><i class="fas fa-bell"></i> Emergency Response</h4>
            <ul>
              <li>24/7 nurse call systems in every room</li>
              <li>Trained emergency response team on-site at all times</li>
              <li>Direct links to local emergency services</li>
              <li>Regular emergency drills and staff training</li>
            </ul>
          </div>
        `
      },
      community: {
        title: 'Community - Vibrant Social Life & Meaningful Connections',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-users"></i> Building Lasting Friendships</h4>
            <p>We foster a vibrant community where residents can form meaningful friendships.</p>
            <h4><i class="fas fa-calendar-alt"></i> Daily Activities & Events</h4>
            <ul>
              <li>Group exercise classes and gentle fitness programs</li>
              <li>Arts and crafts workshops with seasonal themes</li>
              <li>Music therapy sessions and sing-alongs</li>
              <li>Games nights, bingo, and quiz competitions</li>
            </ul>
          </div>
        `
      },
      wellness: {
        title: 'Wellness Focus - Holistic Health & Wellbeing',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-leaf"></i> Holistic Approach to Wellbeing</h4>
            <p>We believe in caring for the whole person - mind, body, and spirit.</p>
            <h4><i class="fas fa-dumbbell"></i> Physical Wellness</h4>
            <ul>
              <li>Physiotherapy and occupational therapy services</li>
              <li>Chair exercises and gentle movement programs</li>
              <li>Accessible garden areas for outdoor activities</li>
              <li>Nutritious, balanced meals tailored to dietary needs</li>
            </ul>
          </div>
        `
      },
      physical: {
        title: 'Physical Wellness - Movement & Vitality',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-running"></i> Active Living for All Abilities</h4>
            <p>Our dedicated activities team ensures every resident can participate in meaningful physical activity tailored to their capabilities.</p>
            <h4><i class="fas fa-heartbeat"></i> Activities Include:</h4>
            <ul>
              <li><strong>Wheelchair Zumba:</strong> Fun, rhythmic movement sessions accessible to everyone.</li>
              <li><strong>Armchair Exercises:</strong> Gentle fitness to maintain mobility and strength.</li>
              <li><strong>Garden Activities:</strong> Enjoying our accessible outdoor spaces and gardening clubs.</li>
              <li><strong>Physiotherapy Support:</strong> Personalized programs to aid recovery and mobility.</li>
            </ul>
          </div>
        `
      },
      creative: {
        title: 'Creative Arts - Expression & Joy',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-palette"></i> Unleashing Creativity</h4>
            <p>We encourage self-expression through various artistic mediums, providing a sense of accomplishment and joy.</p>
            <h4><i class="fas fa-paint-brush"></i> Creative Workshops:</h4>
            <ul>
              <li><strong>Arts & Crafts:</strong> Painting, pottery, and seasonal decoration making.</li>
              <li><strong>Textile Arts:</strong> Knitting, sewing, and embroidery groups.</li>
              <li><strong>Themed Projects:</strong> Creating calendars, cards, and decorations for holidays.</li>
              <li><strong>Flower Arranging:</strong> Engaging with nature's beauty indoors.</li>
            </ul>
          </div>
        `
      },
      social: {
        title: 'Social & Games - Fun & Friendship',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-users"></i> Building Community Connections</h4>
            <p>Social interaction is at the heart of Bellavista, with a vibrant calendar of events to foster friendships.</p>
            <h4><i class="fas fa-glass-cheers"></i> Social Highlights:</h4>
            <ul>
              <li><strong>Games & Entertainment:</strong> Bingo, quizzes, board games, and playing cards.</li>
              <li><strong>Music & Parties:</strong> Sing-alongs, karaoke, and fancy dress parties.</li>
              <li><strong>Community Outings:</strong> Trips to Cardiff Bay, Millennium Centre, and local cafes.</li>
              <li><strong>Intergenerational Events:</strong> Visits from local schools and community groups.</li>
            </ul>
          </div>
        `
      },
      therapeutic: {
        title: 'Therapeutic Care - Sensory & Soul',
        content: `
          <div class="service-detail">
            <h4><i class="fas fa-spa"></i> Specialized Therapeutic Support</h4>
            <p>Our therapeutic activities are designed to stimulate the senses, evoke memories, and provide comfort, especially for residents with dementia.</p>
            <h4><i class="fas fa-brain"></i> Therapeutic Programs:</h4>
            <ul>
              <li><strong>Animal Therapy:</strong> Visits from pets and exotic animals (Zoolab) for sensory stimulation.</li>
              <li><strong>Cinema Experience:</strong> Film days in our cinema room with popcorn and ice cream.</li>
              <li><strong>Reminiscing:</strong> 1-to-1 sessions and "memory lane" activities to connect with the past.</li>
              <li><strong>Sensory Activities:</strong> Themed areas like our "Beach" or "Victorian" corners for visual and tactile engagement.</li>
            </ul>
          </div>
        `
      }
    };

    const service = serviceDetails[serviceType];
    setModalContent(service);
    setModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = 'auto';
  };



  const mainPageSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    "@id": "https://www.bellavistanursinghomes.com/#organization",
    "name": "Bellavista Group Of Nursing Homes - Best Care Homes in UK",
    "url": "https://www.bellavistanursinghomes.com",
    "logo": "https://www.bellavistanursinghomes.com/bellavista-logo.png",
    "description": "Bellavista Group provides the best nursing and dementia care in South Wales. Award-winning, top-rated care homes in Barry, Cardiff, and Penarth.",
    "slogan": "A Home From Home - Rated One of the Best in UK",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "150",
      "bestRating": "5"
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "106-108 Tynewydd Road",
      "addressLocality": "Barry",
      "postalCode": "CF62 8BB",
      "addressRegion": "South Wales",
      "addressCountry": "UK"
    },
    "image": [
      "https://www.bellavistanursinghomes.com/theraphy-room.jpg",
      "https://www.bellavistanursinghomes.com/home-images/barry.jpg"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+44-1446-748899",
      "contactType": "customer service",
      "areaServed": "UK",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.facebook.com/bellavistanursinghome/",
      "https://x.com/home_bellavista?lang=en",
      "https://www.youtube.com/@bellavistagroupofnursinghomes",
      "https://www.instagram.com/bellavistanursinghome"
    ],
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "00:00",
        "closes": "23:59"
      }
    ]
  };

  return (
    <div className="home">
      <SEO 
        title="Bellavista Nursing Home | Award-Winning Care Homes in South Wales & Cardiff"
        description="Bellavista Nursing Home provides exceptional residential, nursing, and dementia care across South Wales. Rated best care homes in Cardiff, Barry, and Vale of Glamorgan."
        keywords="Bellavista Nursing Home, care homes South Wales, nursing home Cardiff, dementia care Barry, residential care Vale of Glamorgan, best nursing homes UK"
        image="https://www.bellavistanursinghomes.com/main-page-banner.jpg"
        schema={mainPageSchema}
      />
      <section className="hero">
        <div className="hero-right-full">
          <div className="hero-image-wrap">
            <img src="/main-page-banner.jpg" alt="Bellavista Nursing Home" />
          </div>
        </div>

        <div className="container hero-container">
          <div className="hero-content-left">
            <h1 className="hero-title">
              <span className="title-main">Bellavista Group Of Nursing Homes</span>
              <span className="title-sub">A Home from Home</span>
            </h1>
            <p className="hero-description">
              Award-winning residential, nursing, and dementia care in South Wales. 
              We provide a warm, safe, and enriching environment where every resident 
              is treated with dignity and compassion.
            </p>
            <div className="hero-actions">
              <Link to="/schedule-tour" className="btn btn-primary"><i className="fa-solid fa-calendar-check" style={{marginRight: '8px'}}></i>Book a Tour</Link>
              <Link to="/enquiry" className="btn btn-outline"><i className="fa-solid fa-heart" style={{marginRight: '8px'}}></i>Care Enquiry</Link>
            </div>
          </div>
        </div>

        {slides.length > 0 && (
          <div className="hero-bottom-carousel">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={20}
              slidesPerView={1.2}
              centeredSlides={false}
              loop={slides.length > 3} /* Only loop if enough slides */
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              }}
              breakpoints={{
                480: {
                  slidesPerView: 2.2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3.2,
                  spaceBetween: 25,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1400: {
                  slidesPerView: 5,
                  spaceBetween: 30,
                }
              }}
              className="bottom-swiper"
            >
              {/* Duplicate slides to ensure we have enough content for the carousel loop if needed */}
              {[...slides, ...slides, ...slides].slice(0, 12).map((slide, index) => (
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
              <span className="group-name">Bellavista Group Of Nursing Homes</span>
              <span className="group-motto">A Home from Home</span>
            </h2>
            <div className="group-intro-text">
              <p>
                At Bellavista Group of Nursing Homes, we redefine care. Nestled in the heart of South 
                Wales, we provide premium residential and nursing services tailored to the unique 
                needs of each resident. Our modern, thoughtfully designed facilities combine the 
                warmth and comfort of home with the highest professional standards, ensuring dignity, 
                wellbeing, and peace of mind at every stage of life. 
              </p>
              <p>
                Our team of highly trained, compassionate professionals is dedicated to delivering 
                personalized care, attention, and support—creating an environment where residents 
                feel valued, secure, and truly at home. From bespoke nursing plans to engaging 
                activities and holistic wellness programs, every aspect of our service is designed to 
                enhance quality of life. 
              </p>
              <p>
                Experience a new standard of care at Bellavista Nursing Home—where expertise meets 
                compassion, and every resident is at the heart of everything we do. 
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-bellavista">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Why Families Choose Bellavista</h2>
            <p className="section-subtitle">
              A clinically led, warm and welcoming home where quality, safety and genuine kindness come together.
            </p>
          </div>
          <div className="why-grid">
            <div className="why-card">
              <div className="why-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h3>Clinical Excellence</h3>
              <p>
                Experienced nurses and carers deliver round-the-clock support, robust care planning and close liaison with GPs and community teams.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fas fa-hand-holding-heart"></i>
              </div>
              <h3>Dementia-Friendly Support</h3>
              <p>
                Calm, familiar environments, structured routines and meaningful activities help residents living with dementia feel safe, settled and understood.
              </p>
            </div>
            <div className="why-card">
              <div className="why-icon">
                <i className="fas fa-home"></i>
              </div>
              <h3>Genuine Home-from-Home</h3>
              <p>
                Warm lounges, homely dining, landscaped gardens and open visiting create a welcoming atmosphere for residents and their families.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FindNearestHome />

      <OurHomes isStandalone={false} />

      <section className="about-pillars">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">About Us at a Glance</h2>
            <p className="section-subtitle">
              The principles that shape daily life, care and relationships at Bellavista Nursing Home.
            </p>
          </div>
          <div className="about-pillars-grid">
            <div className="about-pillar">
              <h3>Our Vision</h3>
              <p>
                Setting the benchmark for exceptional care in South Wales, where every resident enjoys unmatched dignity, comfort and personalised attention in a home that feels truly their own.
              </p>
            </div>
            <div className="about-pillar">
              <h3>Our Values</h3>
              <p>
                Compassion, integrity and excellence guide every decision and interaction, with respect, empathy and a commitment to the highest standards at the heart of all we do.
              </p>
            </div>
            <div className="about-pillar">
              <h3>Our Care</h3>
              <p>
                Holistic, tailored and attentive support that blends expert nursing with emotional and social care, so each resident can thrive in mind, body and spirit.
              </p>
            </div>
            <div className="about-pillar">
              <h3>Our Team</h3>
              <p>
                Dedicated professionals who combine clinical expertise, empathy and innovation to deliver warm, reliable and personalised care that enhances quality of life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="news" id="news">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest News & Updates</h2>
            <p className="section-subtitle">Stay connected with our community through recent developments, resident stories, events and care innovations.</p>
          </div>
          <div className="news-showcase">
            <div className="news-featured">
              <div className="news-image-large">
                {featuredNews.image ? (
                  <img src={featuredNews.image} alt={featuredNews.title}/>
                ) : (
                  <div className="featured-placeholder-image"><i className="fas fa-newspaper"></i></div>
                )}
                {featuredNews.badge && <div className="news-badge-large">{featuredNews.badge}</div>}
              </div>
              <div className="news-info-large">
                <div className="news-meta">
                  {featuredNews.category && (
                    <span className={`news-category featured ${featuredNews.category.toLowerCase()}`}>
                      {featuredNews.category.charAt(0).toUpperCase() + featuredNews.category.slice(1)}
                    </span>
                  )}
                  <span className="news-date-large">{featuredNews.date}</span>
                </div>
                <h3>{featuredNews.title}</h3>
                <p>
                  {stripHtml(featuredNews.excerpt || '')}
                </p>
                <Link to={`/news/${featuredNews.id}`} className="btn btn-primary">Read Full Update</Link>
              </div>
            </div>
          </div>
          <div className="news-filters">
            <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => filterNews('all')}>All News</button>
            <button className={`filter-btn ${activeFilter === 'health' ? 'active' : ''}`} onClick={() => filterNews('health')}>Health Updates</button>
            <button className={`filter-btn ${activeFilter === 'awards' ? 'active' : ''}`} onClick={() => filterNews('awards')}>Awards</button>
            <button className={`filter-btn ${activeFilter === 'events' ? 'active' : ''}`} onClick={() => filterNews('events')}>Events</button>
            <button className={`filter-btn ${activeFilter === 'innovation' ? 'active' : ''}`} onClick={() => filterNews('innovation')}>Innovation</button>
            <button className={`filter-btn ${activeFilter === 'community' ? 'active' : ''}`} onClick={() => filterNews('community')}>Community</button>
          </div>
          <div className="news-grid modern" key={`news-grid-${location.key}`}>
            {filteredNews.map((news, index) => (
              <div key={news.id || index} className="news-card modern news-visible" data-category={news.category}>
                <div className="news-image">
                  {news.image ? (
                    <img alt={news.title} src={news.image}/>
                  ) : (
                    <div className="news-placeholder-image-small"><i className="fas fa-newspaper"></i></div>
                  )}
                  {news.badge && <div className="news-badge">{news.badge}</div>}
                </div>
                <div className="news-content">
                  <div className={`news-category ${news.category.toLowerCase()}`}>{news.category.charAt(0).toUpperCase() + news.category.slice(1)}</div>
                  <h4>{news.title}</h4>
                  <p>
                    {stripHtml(news.excerpt || '')}
                  </p>
                  <div className="news-engagement">
                    <span><i className="fas fa-calendar"></i> {news.date}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {news.location}</span>
                  </div>
                  <Link to={`/news/${news.id}`} className="news-link modern">Read More</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="news-cta">
            <Link to="/news" className="btn btn-outline-large">
              <i className="fas fa-newspaper"></i> View All News
            </Link>
          </div>
        </div>
      </section>

      <section className="home-testimonials" id="testimonials">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Trusted by Residents. Valued by Families.</h2>
            <div className="rating-badges">
              <a href="https://www.google.com/search?q=Bellavista+Nursing+Home+Barry#lrd=0x486e09597f7e580b:0x22f8a99287879acd,1,,," target="_blank" rel="noopener noreferrer" className="rating-badge google-badge">
                <img src="/google-logo.svg" alt="Google" />
                <span className="badge-score">4.8</span>
                <span className="badge-stars">★★★★★</span>
              </a>
              <a href="https://www.carehome.co.uk/care_search_results.cfm/searchgroup/72849#reviews" target="_blank" rel="noopener noreferrer" className="rating-badge carehome-badge">
                <img src="/carehome-logo.svg" alt="carehome.co.uk" />
                <span className="badge-score">9.2<small>/10</small></span>
              </a>
            </div>
            <p className="section-subtitle">
              The experiences shared by our residents and their loved ones reflect the compassion, dedication, and exceptional standards that define life at Bellavista Nursing Home.
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

      <section className="care-promise" id="care-promise">
        <div className="container">
          <div className="section-header centered">
            <h2 className="section-title">Our Care Promise</h2>
            <p className="section-subtitle">Excellence in every aspect of care, comfort and community – every day.</p>
          </div>
          <div className="activities-layout">
            <div className="activity-featured">
              <div className="activity-image">
                <img src="/medical-suite.jpg" alt="Compassionate Care"/>
                <div className="activity-badge">💝 Our Commitment</div>
              </div>
              <div className="activity-info">
                <h3>Personalized Care Plans</h3>
                <p>Every resident receives an individually tailored care plan developed by our multidisciplinary team, ensuring their unique needs, preferences, and dignity are always respected.</p>
                <div className="activity-schedule">
                  <span><i className="fas fa-user-md"></i> Qualified Nursing Staff</span>
                  <span><i className="fas fa-clock"></i> 24/7 Care Available</span>
                  <span><i className="fas fa-heart"></i> Family-Centered Approach</span>
                </div>
              </div>
            </div>
            <div className="activity-grid">
              <div className="activity-card" role="button" tabIndex="0" aria-label="Open Home Comfort details" onClick={() => openModal('comfort')}>
                <div className="activity-icon physical"><i className="fas fa-home"></i></div>
                <h4>Home Comfort</h4>
                <p>A Warm, Welcoming Environment</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div className="activity-card" role="button" tabIndex="0" aria-label="Open Safety First details" onClick={() => openModal('safety')}>
                <div className="activity-icon creative"><i className="fas fa-shield-alt"></i></div>
                <h4>Safety First</h4>
                <p>Advanced Protection & Emergency Response</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div className="activity-card" role="button" tabIndex="0" aria-label="Open Community details" onClick={() => openModal('community')}>
                <div className="activity-icon social"><i className="fas fa-users"></i></div>
                <h4>Community</h4>
                <p>Vibrant Social Life & Connections</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div className="activity-card" role="button" tabIndex="0" aria-label="Open Wellness Focus details" onClick={() => openModal('wellness')}>
                <div className="activity-icon therapeutic"><i className="fas fa-leaf"></i></div>
                <h4>Wellness Focus</h4>
                <p>Holistic Health & Wellbeing</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="activities-section" id="activities">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Life at Bellavista – Engaging Activities for Every Interest</h2>
          </div>
          <div className="activities-intro-text">
            <p>
              At Bellavista, we believe that an active, stimulating, and fulfilling lifestyle is central to wellbeing. Residents are encouraged to pursue their passions, discover new interests, and engage meaningfully with others, so every day feels enjoyable, purposeful, and rewarding.
            </p>
            <p>
              Our individualised activity programmes are carefully designed to meet the unique needs, abilities, and preferences of each resident. Using detailed personal profiles, social wellbeing assessments, and one-to-one consultations with our highly trained Activities Coordinators, we tailor activities to support both cognitive and physical wellbeing.
            </p>
          </div>
          <div className="activities-layout">
            <div className="activities-showcase">
              <div className="activity-featured">
                <div className="activity-image">
                  <img src="/music-and-arts-therapy.jpg" alt="Music Therapy"/>
                </div>
                <div className="activity-info">
                  <div className="activity-badge">🎵 Popular</div>
                  <h3>Music & Arts Therapy</h3>
                  <p>Professional music therapy sessions, art classes, and creative workshops that stimulate memory and promote emotional wellbeing.</p>
                  <div className="activity-schedule">
                    <span><i className="fas fa-calendar"></i> Daily Sessions</span>
                    <span><i className="fas fa-users"></i> All Abilities</span>
                    <span><i className="fas fa-clock"></i> 45 mins</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="activity-grid">
              <div
                className="activity-card"
                role="button"
                tabIndex="0"
                aria-label="Open Physical Wellness activity details"
                onClick={() => openModal('physical')}
              >
                <div className="activity-icon physical">
                  <i className="fas fa-dumbbell"></i>
                </div>
                <h4>Physical Wellness</h4>
                <p>Chair exercises, physiotherapy, gentle yoga</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div
                className="activity-card"
                role="button"
                tabIndex="0"
                aria-label="Open Creative Arts activity details"
                onClick={() => openModal('creative')}
              >
                <div className="activity-icon creative">
                  <i className="fas fa-brush"></i>
                </div>
                <h4>Creative Arts</h4>
                <p>Painting, crafts, pottery, creative writing</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div
                className="activity-card"
                role="button"
                tabIndex="0"
                aria-label="Open Social and Games activity details"
                onClick={() => openModal('social')}
              >
                <div className="activity-icon social">
                  <i className="fas fa-gamepad"></i>
                </div>
                <h4>Social & Games</h4>
                <p>Bingo, quiz nights, social hours, outings</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
              <div
                className="activity-card"
                role="button"
                tabIndex="0"
                aria-label="Open Therapeutic Care activity details"
                onClick={() => openModal('therapeutic')}
              >
                <div className="activity-icon therapeutic">
                  <i className="fas fa-spa"></i>
                </div>
                <h4>Therapeutic Care</h4>
                <p>Pet therapy, aromatherapy, meditation</p>
                <span className="activity-cta-text">
                  Click here
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="facilities" id="facilities">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Our Facilities</h2>
            <p className="section-subtitle">
              Carefully designed spaces that promote comfort, wellbeing, and engagement for every resident.
            </p>
          </div>
          <div className="facilities-showcase">
            <div className="facility-tabs">
              <button className={`tab-btn ${activeTab === 'living' ? 'active' : ''}`} onClick={() => setActiveTab('living')}>Living Spaces</button>
              <button className={`tab-btn ${activeTab === 'wellness' ? 'active' : ''}`} onClick={() => setActiveTab('wellness')}>Wellness & Care</button>
              <button className={`tab-btn ${activeTab === 'activities' ? 'active' : ''}`} onClick={() => setActiveTab('activities')}>Activities & Social</button>
              <button className={`tab-btn ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>Services</button>
            </div>
            <div className={`tab-content ${activeTab === 'living' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Private Rooms" src="/personal-rooms.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-bed"></i> Private Rooms</h4>
                    <p>Comfortable en-suite rooms with personal touches</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Communal Lounges" src="/communal-longues.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-couch"></i> Communal Lounges</h4>
                    <p>Spacious social areas for relaxation & activities</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Gardens" src="/gardens.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-leaf"></i> Landscaped Gardens</h4>
                    <p>Accessible outdoor spaces for fresh air & nature</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'wellness' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Medical Suite" src="/medical-suite.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-stethoscope"></i> Medical Suite</h4>
                    <p>On-site medical care & health monitoring</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Physiotherapy" src="/theraphy-room.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-dumbbell"></i> Therapy Rooms</h4>
                    <p>Physiotherapy & occupational therapy spaces</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Spa" src="/wellness-and-spa.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-spa"></i> Wellness Spa</h4>
                    <p>Hair salon, beauty treatments & relaxation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'activities' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Cinema" src="/cinema.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-film"></i> Cinema Room</h4>
                    <p>Movie nights & entertainment screenings</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Arts Studio" src="/arts.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-palette"></i> Arts Studio</h4>
                    <p>Creative workshops & artistic expression</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Library" src="/library.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-book"></i> Library Corner</h4>
                    <p>Quiet reading & reminiscence activities</p>
                  </div>
                </div>
              </div>
            </div>
            <div className={`tab-content ${activeTab === 'services' ? 'active' : ''}`}>
              <div className="facilities-grid compact">
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Dining" src="/Dining.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-utensils"></i> Restaurant Dining</h4>
                    <p>Nutritious meals in elegant dining rooms</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Laundry" src="/laundry.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-tshirt"></i> Laundry Service</h4>
                    <p>Professional cleaning & garment care</p>
                  </div>
                </div>
                <div className="facility-card modern">
                  <div className="facility-image">
                    <img alt="Reception" src="/reception.jpg"/>
                  </div>
                  <div className="facility-info">
                    <h4><i className="fas fa-concierge-bell"></i> 24/7 Reception</h4>
                    <p>Round-the-clock support & assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalOpen && modalContent && (
        <div className="service-modal-overlay" onClick={closeModal}>
          <div className="service-modal-content" onClick={(e) => e.stopPropagation()} style={{overscrollBehavior: 'contain'}}>
            <button className="service-modal-close" onClick={closeModal}>&times;</button>
            <div className="service-modal-header">
              <h3>{modalContent.title}</h3>
            </div>
            <div className="service-modal-body" dangerouslySetInnerHTML={{ __html: modalContent.content }}>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
