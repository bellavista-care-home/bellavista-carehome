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
    } else {
      document.body.style.overflow = '';
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
    };
  }, [sideMenuOpen]);

  const homeLinks = [
    { to: '/bellavista-barry', label: 'Bellavista Barry' },
    { to: '/bellavista-cardiff', label: 'Bellavista Cardiff' },
    { to: '/waverley-care-center', label: 'Waverley Care Center' },
    { to: '/college-fields-nursing-home', label: 'College Fields' },
    { to: '/baltimore-care-home', label: 'Baltimore Care Home' },
    { to: '/meadow-vale-cwtch', label: 'Meadow Vale Cwtch' },
    { to: '/bellavista-pontypridd', label: 'Bellavista Pontypridd' }
  ];

  const activityLinks = [
    { to: '/activities/bellavista-barry', label: 'Bellavista Barry' },
    { to: '/activities/bellavista-cardiff', label: 'Bellavista Cardiff' },
    { to: '/activities/waverley-care-center', label: 'Waverley Care Center' },
    { to: '/activities/college-fields-nursing-home', label: 'College Fields' },
    { to: '/activities/baltimore-care-home', label: 'Baltimore Care Home' },
    { to: '/activities/meadow-vale-cwtch', label: 'Meadow Vale Cwtch' },
    { to: '/activities/bellavista-pontypridd', label: 'Bellavista Pontypridd' }
  ];

  const facilityLinks = [
    { to: '/facilities/bellavista-barry', label: 'Bellavista Barry' },
    { to: '/facilities/bellavista-cardiff', label: 'Bellavista Cardiff' },
    { to: '/facilities/waverley-care-center', label: 'Waverley Care Center' },
    { to: '/facilities/college-fields-nursing-home', label: 'College Fields' },
    { to: '/facilities/baltimore-care-home', label: 'Baltimore Care Home' },
    { to: '/facilities/meadow-vale-cwtch', label: 'Meadow Vale Cwtch' },
    { to: '/facilities/bellavista-pontypridd', label: 'Bellavista Pontypridd' }
  ];

  const navLinks = [
    {
      to: '/our-homes',
      label: 'Our Homes',
      children: homeLinks
    },
    {
      to: '/services',
      label: 'Services',
      children: [
        { label: 'Activities', children: activityLinks },
        { label: 'Facilities', children: facilityLinks },
        { to: '/events', label: 'Calendar Events' },
        { to: '/services', label: 'Care Services' },
        { to: '/dementia-friendly-environment', label: 'Dementia Environment' },
        { to: '/dining-and-nutrition', label: 'Dining & Nutrition' },
        { to: '/visitor-policy', label: 'Visitor Policy' }
      ]
    },
    {
      to: '/about',
      label: 'About us',
      children: [
        { to: '/our-vision', label: 'Our Vision' },
        { to: '/our-values', label: 'Our Values' },
        { to: '/our-care', label: 'Our Care' },
        { to: '/management-team', label: 'Management Team' }
      ]
    },
    { to: '/testimonials', label: 'Reviews' },
    {
      to: '/career',
      label: 'Career',
      children: [
        { to: '/current-jobs', label: 'Current Jobs' },
        { to: '/training-and-development', label: 'Training and Development' },
        { to: '/staff-portal', label: 'Staff Portal' }
      ]
    },
    { to: '/contact', label: 'Contact' }
  ];

  const sideMenuSections = [
    {
      title: 'Main',
      links: [
        { to: '/', label: 'Home' },
        { to: '/our-homes', label: 'Our Homes' }
      ]
    },
    {
      title: 'Our Homes',
      links: homeLinks
    },
    {
      title: 'Services',
      links: [
        { to: '/services', label: 'Care Services' },
        { to: '/events', label: 'Calendar Events' },
        { to: '/dementia-friendly-environment', label: 'Dementia Environment' },
        { to: '/dining-and-nutrition', label: 'Dining & Nutrition' },
        { to: '/visitor-policy', label: 'Visitor Policy' }
      ]
    },
    {
      title: 'About Us',
      links: [
        { to: '/about', label: 'About Us' },
        { to: '/our-vision', label: 'Our Vision' },
        { to: '/our-values', label: 'Our Values' },
        { to: '/our-care', label: 'Our Care' },
        { to: '/management-team', label: 'Management Team' }
      ]
    },
    {
      title: 'Get Started',
      links: [
        { to: '/enquiry', label: 'Care Enquiry' },
        { to: '/schedule-tour', label: 'Schedule a Tour' }
      ]
    },
    {
      title: 'Information',
      links: [
        { to: '/testimonials', label: 'Reviews' },
        { to: '/news', label: 'News & Updates' },
        { to: '/newsletters', label: 'Newsletters' },
        { to: '/faq', label: 'FAQ' }
      ]
    },
    {
      title: 'Career',
      links: [
        { to: '/career', label: 'Careers' },
        { to: '/current-jobs', label: 'Current Jobs' },
        { to: '/training-and-development', label: 'Training & Development' },
        { to: '/staff-portal', label: 'Staff Portal' }
      ]
    },
    {
      title: 'Support',
      links: [
        { to: '/contact', label: 'Contact Us' }
      ]
    }
  ];

  const handleDropdownMouseLeave = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  return (
    <header>
      <div className="header-shell">
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
            <div id="mobile-main-navigation" className="nav-scrollable">
              {sideMenuSections.map((section) => (
                <div key={section.title} className="side-menu-section">
                  <div className="side-section-title">{section.title}</div>
                  <ul className="side-links side-section-links">
                    {section.links.map((link) => (
                      <li key={`${section.title}-${link.to}-${link.label}`}>
                        <Link to={link.to} onClick={closeSideMenu}>{link.label}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className={`menu-overlay ${sideMenuOpen ? 'active' : ''}`} onClick={closeSideMenu} />
        </div>

        <Link to="/" className="logo">
          <div className="logo-image">
            <img src="/bellavista_logo_final.png" alt="Bellavista Logo" />
          </div>
          <div className="logo-text-group">
            <div className="logo-text">Bellavista Nursing Homes</div>
            <div className="logo-subtext">A Home From Home</div>
          </div>
        </Link>
        <nav className="desktop-nav">
          <ul>
            {navLinks.map((link) => (
              <li
                key={link.to}
                className={link.children ? 'has-dropdown' : ''}
                onMouseLeave={link.children ? handleDropdownMouseLeave : undefined}
              >
                <Link to={link.to}>
                  {link.label}
                  {link.children && <i className="fas fa-chevron-down nav-chevron" aria-hidden="true"></i>}
                </Link>
                {link.children && (
                  <ul className="desktop-dropdown">
                    {link.children.map((child) => (
                      <li key={child.to || child.label} className={child.children ? 'has-submenu' : ''}>
                        {child.children ? (
                          <>
                            <span className="submenu-trigger">
                              {child.label}
                              <i className="fas fa-chevron-right" aria-hidden="true"></i>
                            </span>
                            <ul className="submenu">
                              {child.children.map((subItem) => (
                                <li key={subItem.to}>
                                  <Link to={subItem.to}>{subItem.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Link to={child.to}>{child.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
