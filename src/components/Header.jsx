import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const [sideMenuOpen, setSideMenuOpen] = useState(false);

  const toggleSideMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  const closeSideMenu = () => {
    setSideMenuOpen(false);
  };

  useEffect(() => {
    if (sideMenuOpen) {
      document.body.style.overflow = 'hidden';
      if (window.lenis) window.lenis.stop();
    } else {
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    }
    const handleClickOutside = (event) => {
      if (sideMenuOpen && !event.target.closest('.left-menu-wrapper')) {
        setSideMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = '';
      if (window.lenis) window.lenis.start();
    };
  }, [sideMenuOpen]);

  return (
    <header>
      <div className="header-container">
        <div className="left-menu-wrapper">
          <button
            type="button"
            className="left-menu-toggle"
            onClick={toggleSideMenu}
            aria-label={sideMenuOpen ? "Close main navigation" : "Open main navigation"}
            aria-expanded={sideMenuOpen}
            aria-controls="mobile-main-navigation"
          >
            <i className="fas fa-bars" aria-hidden="true"></i>
          </button>
          <div className={`side-dropdown-menu ${sideMenuOpen ? 'active' : ''}`}>
            <div className="nav-header">
              <div className="nav-logo">
                <i className="fas fa-home" aria-hidden="true"></i>
                <span>Bellavista</span>
              </div>
            </div>
            <button
              type="button"
              className="close-menu"
              onClick={closeSideMenu}
              aria-label="Close main navigation"
            >
              <i className="fas fa-times" aria-hidden="true"></i>
            </button>
            <div
              id="mobile-main-navigation"
              className="nav-scrollable"
              data-lenis-prevent="true"
            >
              <ul>
                <div className="nav-category">Main</div>
                <li><Link to="/" onClick={closeSideMenu}>Home</Link></li>
                <li><Link to="/our-homes" onClick={closeSideMenu}>Our Homes</Link></li>
                <div className="nav-category">Services</div>
                <li><Link to="/events" onClick={closeSideMenu}>Calendar Events</Link></li>
                <li><Link to="/activities" onClick={closeSideMenu}>Activities & Events</Link></li>
                <li><Link to="/facilities" onClick={closeSideMenu}>Facilities</Link></li>
                <li><Link to="/services" onClick={closeSideMenu}>Care Services</Link></li>
                <div className="nav-category">Get Started</div>
                <li><Link to="/enquiry" onClick={closeSideMenu}>Care Enquiry</Link></li>
                <li><Link to="/schedule-tour" onClick={closeSideMenu}>Schedule a Tour</Link></li>
                <div className="nav-category">Information</div>
                <li><Link to="/testimonials" onClick={closeSideMenu}>Reviews</Link></li>
                <li><Link to="/news" onClick={closeSideMenu}>News & Updates</Link></li>
                <li><Link to="/faq" onClick={closeSideMenu}>FAQ</Link></li>
                <div className="nav-category">Support</div>
                <li><Link to="/contact" onClick={closeSideMenu}>Contact Us</Link></li>
                <li><Link to="/career" onClick={closeSideMenu}>Careers</Link></li>
              </ul>
            </div>
          </div>
          <div className={`menu-overlay ${sideMenuOpen ? 'active' : ''}`} onClick={closeSideMenu} />
        </div>
        
        <Link to="/" className="logo">
          <div className="logo-image" style={{ marginRight: '12px', display: 'flex', alignItems: 'center' }}>
            <img src="/bellavista_logo_final.png" alt="Bellavista Logo" style={{ height: '75px', width: '75px', objectFit: 'fill', borderRadius: '50%' }} />
          </div>
          <div className="logo-text-group">
            <div className="logo-text">Bellavista <span>Nursing Homes</span></div>
            <div className="tagline">A Home From Home</div>
          </div>
        </Link>
        <nav>
          <ul>
            <li className="has-dropdown">
              <Link to="/our-homes">Our Homes <i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                <li><Link to="/bellavista-barry">Bellavista Barry</Link></li>
                <li><Link to="/bellavista-cardiff">Bellavista Cardiff</Link></li>
                <li><Link to="/waverley-care-center">Waverley Care Center</Link></li>
                <li><Link to="/college-fields-nursing-home">College Fields Nursing Home</Link></li>
                <li><Link to="/baltimore-care-home">Baltimore Care Home</Link></li>
                <li><Link to="/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
                <li><Link to="/bellavista-pontypridd">Bellavista Pontypridd</Link></li>
              </ul>
            </li>
            <li className="has-dropdown">
              <Link>Services <i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                
                {/* Activities with Nested Dropdown */}
                <li className="has-submenu">
                  <span className="submenu-trigger" style={{ cursor: 'pointer' }}>
                    Activities <i className="fas fa-chevron-right"></i>
                  </span>
                  <ul className="submenu">
                    <li><Link to="/activities/bellavista-barry">Bellavista Barry</Link></li>
                    <li><Link to="/activities/bellavista-cardiff">Bellavista Cardiff</Link></li>
                    <li><Link to="/activities/waverley-care-center">Waverley Care Center</Link></li>
                    <li><Link to="/activities/college-fields-nursing-home">College Fields</Link></li>
                    <li><Link to="/activities/baltimore-care-home">Baltimore Care Home</Link></li>
                    <li><Link to="/activities/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
                    <li><Link to="/activities/bellavista-pontypridd">Bellavista Pontypridd</Link></li>
                  </ul>
                </li>

                {/* Facilities with Nested Dropdown */}
                <li className="has-submenu">
                  <span className="submenu-trigger" style={{ cursor: 'pointer' }}>
                    Facilities <i className="fas fa-chevron-right"></i>
                  </span>
                  <ul className="submenu">
                    <li><Link to="/facilities/bellavista-barry">Bellavista Barry</Link></li>
                    <li><Link to="/facilities/bellavista-cardiff">Bellavista Cardiff</Link></li>
                    <li><Link to="/facilities/waverley-care-center">Waverley Care Center</Link></li>
                    <li><Link to="/facilities/college-fields-nursing-home">College Fields</Link></li>
                    <li><Link to="/facilities/baltimore-care-home">Baltimore Care Home</Link></li>
                    <li><Link to="/facilities/meadow-vale-cwtch">Meadow Vale Cwtch</Link></li>
                    <li><Link to="/facilities/bellavista-pontypridd">Bellavista Pontypridd</Link></li>
                  </ul>
                </li>

                <li><Link to="/events">Calendar Events</Link></li>
                <li><Link to="/services">Care Services</Link></li>
                <li><Link to="/dementia-friendly-environment">Dementia Environment</Link></li>
                <li><Link to="/dining-and-nutrition">Dining & Nutrition</Link></li>
                <li><Link to="/visitor-policy">Visitor Policy</Link></li>
              </ul>
            </li>
            <li className="has-dropdown">
              <Link>About us<i className="fas fa-chevron-down"></i></Link>
              <ul className="dropdown-menu">
                <li><Link to="/our-vision">Our Vision</Link></li>
                <li><Link to="/our-values">Our Values</Link></li>
                <li><Link to="/our-care">Our Care</Link></li>
                <li><Link to="/management-team">Management Team</Link></li>
              </ul>
            </li>
            <li><Link to="/testimonials">Reviews</Link></li>
            <li className='has-dropdown'>
                <Link to="/career">Career <i className="fas fa-chevron-down"></i></Link>
                <ul className="dropdown-menu">
                  <li><Link to="/current-jobs">Current Jobs</Link></li>
                  <li><Link to="/training-and-development">Training and Development</Link></li>
                  <li><Link to="/staff-portal">Staff Portal</Link></li>
                </ul>
            </li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
