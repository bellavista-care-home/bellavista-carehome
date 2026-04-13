import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import '../styles/UnifiedHero.css';

const UnifiedHero = ({
  title = 'A Home from Home',
  subtitle = '',
  description = 'Award-winning residential, nursing, and dementia care in South Wales. We provide a warm, safe, and enriching environment where every resident is treated with dignity and compassion.',
  imageSrc = '/main-page-banner.jpg',
  imageAlt = 'Bellavista Nursing Home resident in comfortable room',
  badges = [],
  actions = null,
  galleryAltPrefix = 'Bellavista gallery',
  showGallery = true,
  galleryImages = [],
  className = '',
  titleRef = null,
  descriptionRef = null,
  actionsRef = null
}) => {
  const previewImages = (galleryImages || []).filter(Boolean);
  const normalizedBadges = (badges || [])
    .map((badge) => (typeof badge === 'string' ? { label: badge } : badge))
    .filter((badge) => badge && badge.label);
  const swiperRef = useRef(null);
  const pauseGalleryAutoplay = () => {
    if (swiperRef.current?.autoplay?.running) {
      swiperRef.current.autoplay.stop();
    }
  };

  const resumeGalleryAutoplay = () => {
    if (swiperRef.current?.params?.autoplay) {
      swiperRef.current.autoplay.start();
    }
  };

  return (
    <section className={`unified-hero ${className}`.trim()} id="hero-section">
      <div className="unified-hero__split-bg" />

      <div className="unified-hero__container">
        <div className="unified-hero__content">
          <h1 className="unified-hero__title" ref={titleRef}>{title}</h1>
          {subtitle && <p className="unified-hero__subtitle">{subtitle}</p>}
          <p className="unified-hero__description" ref={descriptionRef}>{description}</p>

          {normalizedBadges.length > 0 && (
            <div className="unified-hero__badges">
              {normalizedBadges.map((badge, index) => {
                const key = `${badge.label}-${index}`;
                const content = (
                  <>
                    {badge.icon && <i className={badge.icon} aria-hidden="true"></i>}
                    <span>{badge.label}</span>
                  </>
                );

                if (badge.to) {
                  return (
                    <Link key={key} to={badge.to} className="unified-hero__badge unified-hero__badge--interactive">
                      {content}
                    </Link>
                  );
                }

                if (badge.href) {
                  return (
                    <a
                      key={key}
                      href={badge.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="unified-hero__badge unified-hero__badge--interactive"
                    >
                      {content}
                    </a>
                  );
                }

                if (badge.onClick) {
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={badge.onClick}
                      className="unified-hero__badge unified-hero__badge--interactive"
                    >
                      {content}
                    </button>
                  );
                }

                return (
                  <span key={key} className="unified-hero__badge">
                    {content}
                  </span>
                );
              })}
            </div>
          )}

          {actions && (
            <div className="unified-hero__actions" ref={actionsRef}>
              {actions}
            </div>
          )}
        </div>

        <div className="unified-hero__image-col gs-reveal">
          <div className="unified-hero__image-card">
            {imageSrc?.toLowerCase().includes('.mp4') ? (
              <video
                src={imageSrc}
                autoPlay
                muted
                loop
                playsInline
                aria-label={imageAlt}
              />
            ) : (
              <img src={imageSrc} alt={imageAlt} />
            )}
          </div>
        </div>
      </div>

      {showGallery && previewImages.length > 0 && (
        <div className="unified-hero__gallery">
          <Swiper
            className="unified-hero__gallery-swiper"
            modules={[Autoplay, Pagination]}
            loop={previewImages.length > 1}
            autoplay={{
              delay: 2800,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            speed={650}
            spaceBetween={24}
            slidesPerView={1.5}
            breakpoints={{
              560: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              992: { slidesPerView: 4.2 },
              1280: { slidesPerView: 5.0 }
            }}
            pagination={{
              el: '.unified-hero__gallery-pagination',
              clickable: true
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onTouchStart={pauseGalleryAutoplay}
            onTouchEnd={resumeGalleryAutoplay}
          >
            {previewImages.map((src, index) => (
              <SwiperSlide key={`${src}-${index}`}>
                <div
                  className="unified-hero__thumb"
                  onMouseEnter={pauseGalleryAutoplay}
                  onMouseLeave={resumeGalleryAutoplay}
                  onFocus={pauseGalleryAutoplay}
                  onBlur={resumeGalleryAutoplay}
                >
                  <img src={src} alt={`${galleryAltPrefix} ${index + 1}`} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="unified-hero__gallery-controls">
            <button
              type="button"
              className="unified-hero__gallery-nav unified-hero__gallery-nav--prev"
              aria-label="Previous gallery image"
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <i className="fas fa-chevron-left" aria-hidden="true"></i>
            </button>

            <div className="unified-hero__gallery-pagination"></div>

            <button
              type="button"
              className="unified-hero__gallery-nav unified-hero__gallery-nav--next"
              aria-label="Next gallery image"
              onClick={() => swiperRef.current?.slideNext()}
            >
              <i className="fas fa-chevron-right" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default UnifiedHero;
