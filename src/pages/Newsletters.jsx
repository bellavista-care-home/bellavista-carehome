import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchNewsletters, subscribeToNewsletter, unsubscribeFromNewsletter } from '../services/newsletterService';
import { fetchHomes } from '../services/homeService';
import SEO from '../components/SEO';
import '../styles/MainPage.css';
import '../styles/NewsDetail.css';
import '../styles/Newsletters.css';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Newsletters = () => {
  const navigate = useNavigate();
  const [newsletters, setNewsletters] = useState([]);
  const [homes, setHomes] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedHome, setSelectedHome] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const unsubscribeId = searchParams.get('unsubscribe');

  // Subscribe form state
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subHomeId, setSubHomeId] = useState('');
  const [subStatus, setSubStatus] = useState(null); // 'success', 'error', 'loading'
  const [subMessage, setSubMessage] = useState('');

  // Unsubscribe state
  const [unsubDone, setUnsubDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [items, homeList] = await Promise.all([fetchNewsletters(), fetchHomes()]);
      setNewsletters(items);
      setHomes(homeList || []);
      // Pre-select home from URL param if present
      const homeIdParam = searchParams.get('homeId');
      if (homeIdParam) {
        setSelectedHome(homeIdParam);
        setSubHomeId(homeIdParam);
      }
      setLoading(false);
    };
    load();
  }, []);

  // Handle unsubscribe from URL param
  useEffect(() => {
    if (unsubscribeId && !unsubDone) {
      unsubscribeFromNewsletter(unsubscribeId)
        .then(() => {
          setUnsubDone(true);
          setSubStatus('success');
          setSubMessage('You have been successfully unsubscribed.');
        })
        .catch(() => {
          setUnsubDone(true);
          setSubStatus('error');
          setSubMessage('Could not process unsubscribe request.');
        });
    }
  }, [unsubscribeId, unsubDone]);

  // Available years from data
  const availableYears = useMemo(() => {
    const years = [...new Set(newsletters.map(n => n.year))].sort((a, b) => b - a);
    return years;
  }, [newsletters]);

  // Available months from data for selected year/home
  const availableMonths = useMemo(() => {
    let filtered = newsletters;
    if (selectedHome !== 'all') {
      filtered = filtered.filter(n => n.homeId === selectedHome || !n.homeId);
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(n => n.year === parseInt(selectedYear));
    }
    const months = [...new Set(filtered.map(n => n.month))].sort((a, b) => b - a);
    return months;
  }, [newsletters, selectedYear, selectedHome]);

  // Filtered newsletters
  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters;
    if (selectedHome !== 'all') {
      filtered = filtered.filter(n => n.homeId === selectedHome || !n.homeId);
    }
    if (selectedYear !== 'all') {
      filtered = filtered.filter(n => n.year === parseInt(selectedYear));
    }
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(n => n.month === parseInt(selectedMonth));
    }
    return filtered;
  }, [newsletters, selectedHome, selectedYear, selectedMonth]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubStatus('loading');
    setSubMessage('');
    try {
      await subscribeToNewsletter({ email: subEmail.trim(), name: subName.trim(), homeId: subHomeId || null });
      navigate('/newsletter-subscribed');
    } catch (err) {
      setSubStatus('error');
      setSubMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <SEO
        title="Newsletters | Bellavista Nursing Homes"
        description="Browse our monthly newsletters with updates, stories, and news from Bellavista Nursing Homes across South Wales."
        url="/newsletters"
      />
      <div className="news-page newsletters-page">
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1B3C78 0%, #1d4ed8 60%, #2563eb 100%)',
          padding: '64px 20px 0',
          textAlign: 'center',
          color: 'white',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '30px', right: '-70px', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: '20px', right: '12%', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', pointerEvents: 'none' }} />
          <div className="container" style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', background: 'rgba(255,255,255,0.15)', padding: '5px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, marginBottom: '18px', backdropFilter: 'blur(10px)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              <i className="fas fa-newspaper"></i> Monthly Editions
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginBottom: '14px', fontWeight: 800, letterSpacing: '-0.5px', lineHeight: 1.2 }}>
              Our Newsletters
            </h1>
            <p style={{ fontSize: '1.05rem', opacity: 0.88, maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              Stay connected with updates, stories, and events from Bellavista Nursing Homes across South Wales.
            </p>
            {/* Stats bar */}
            {!loading && newsletters.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginBottom: '36px', flexWrap: 'wrap' }}>
                {[
                  { icon: 'fa-book-open', value: newsletters.length, label: 'Editions' },
                  { icon: 'fa-home', value: homes.length, label: 'Care Homes' },
                  { icon: 'fa-calendar-alt', value: availableYears.length, label: availableYears.length === 1 ? 'Year' : 'Years' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <i className={`fas ${stat.icon}`} style={{ fontSize: '1.25rem', marginBottom: '6px', display: 'block', opacity: 0.8 }}></i>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1 }}>{stat.value}</div>
                    <div style={{ fontSize: '11px', opacity: 0.72, textTransform: 'uppercase', letterSpacing: '0.7px', marginTop: '3px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Wave divider */}
          <svg style={{ display: 'block', marginBottom: '-2px' }} viewBox="0 0 1440 52" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0 52L80 44C160 36 320 20 480 16C640 12 800 20 960 24C1120 28 1280 28 1360 28L1440 28V52H0Z" fill="#F7FAFF"/>
          </svg>
        </section>

        {/* Active home filter banner */}
        {selectedHome !== 'all' && homes.find(h => h.id === selectedHome) && (
          <div style={{ background: '#eff6ff', borderBottom: '1px solid #bfdbfe', padding: '10px 20px' }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <i className="fas fa-filter" style={{ color: '#1B3C78', fontSize: '12px' }}></i>
              <span style={{ fontSize: '13px', color: '#1e40af', fontWeight: 500 }}>
                Filtering by: <strong>{homes.find(h => h.id === selectedHome)?.homeName}</strong>
              </span>
              <button
                onClick={() => { setSelectedHome('all'); setSelectedYear('all'); setSelectedMonth('all'); }}
                style={{ marginLeft: 'auto', background: 'none', border: '1px solid #93c5fd', borderRadius: '6px', color: '#1B3C78', cursor: 'pointer', fontSize: '12px', padding: '3px 10px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              >
                <i className="fas fa-times"></i> Clear filter
              </button>
            </div>
          </div>
        )}

        <section className="news-main" style={{ paddingTop: '40px' }}>
          <div className="container">
            <div className="news-layout">
              {/* Sidebar */}
              <aside className="news-sidebar">
                {/* Subscribe Widget */}
                <div className="sidebar-widget" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #eff6ff 100%)', border: '1px solid #bfdbfe', borderTop: 'none' }}>
                  <h3 className="widget-title" style={{ color: '#1B3C78' }}>
                    <i className="fas fa-envelope"></i>
                    Subscribe
                  </h3>
                  <p style={{ fontSize: '12.5px', color: '#475569', marginBottom: '12px', lineHeight: 1.6 }}>
                    Get our newsletter delivered to your inbox each month.
                  </p>
                  <form onSubmit={handleSubscribe}>
                    <input
                      type="text"
                      placeholder="Your name (optional)"
                      value={subName}
                      onChange={(e) => setSubName(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <input
                      type="email"
                      placeholder="Your email address *"
                      value={subEmail}
                      onChange={(e) => setSubEmail(e.target.value)}
                      required
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '8px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <select
                      value={subHomeId}
                      onChange={(e) => setSubHomeId(e.target.value)}
                      style={{
                        width: '100%', padding: '10px 14px', borderRadius: '8px',
                        border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '10px',
                        boxSizing: 'border-box', background: 'white', color: subHomeId ? '#1e293b' : '#94a3b8'
                      }}
                    >
                      <option value="">All homes (general)</option>
                      {homes.map(home => (
                          <option key={home.id} value={home.id}>{home.homeName}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={subStatus === 'loading'}
                      style={{
                        width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                        background: '#1B3C78', color: 'white', fontSize: '14px', fontWeight: 600,
                        cursor: subStatus === 'loading' ? 'wait' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                      }}
                    >
                      {subStatus === 'loading' ? (
                        <><i className="fas fa-spinner fa-spin"></i> Subscribing...</>
                      ) : (
                        <><i className="fas fa-paper-plane"></i> Subscribe</>
                      )}
                    </button>
                  </form>
                  {subMessage && (
                    <div style={{
                      marginTop: '10px', padding: '8px 12px', borderRadius: '6px',
                      fontSize: '13px', lineHeight: 1.4,
                      background: subStatus === 'success' ? '#dcfce7' : '#fef2f2',
                      color: subStatus === 'success' ? '#166534' : '#991b1b',
                      border: `1px solid ${subStatus === 'success' ? '#bbf7d0' : '#fecaca'}`
                    }}>
                      <i className={`fas ${subStatus === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ marginRight: '6px' }}></i>
                      {subMessage}
                    </div>
                  )}
                </div>

                {/* Filter by Home */}
                {homes.length > 0 && (
                <div className="sidebar-widget">
                  <h3 className="widget-title">Filter by Home</h3>
                  <div className="category-list">
                    <button
                      className={`category-btn ${selectedHome === 'all' ? 'active' : ''}`}
                      onClick={() => { setSelectedHome('all'); setSelectedYear('all'); setSelectedMonth('all'); }}
                    >
                      All Homes
                      <span className="category-count">({newsletters.length})</span>
                    </button>
                    {homes.map(home => (
                      <button
                        key={home.id}
                        className={`category-btn ${selectedHome === home.id ? 'active' : ''}`}
                        onClick={() => { setSelectedHome(home.id); setSelectedYear('all'); setSelectedMonth('all'); }}
                      >
                        {home.homeName}
                        <span className="category-count">
                          ({newsletters.filter(n => n.homeId === home.id || !n.homeId).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                )}

                {/* Filter by Year */}
                <div className="sidebar-widget">
                  <h3 className="widget-title">Filter by Year</h3>
                  <div className="category-list">
                    <button
                      className={`category-btn ${selectedYear === 'all' ? 'active' : ''}`}
                      onClick={() => { setSelectedYear('all'); setSelectedMonth('all'); }}
                    >
                      All Years
                    </button>
                    {availableYears.map(year => (
                      <button
                        key={year}
                        className={`category-btn ${selectedYear === String(year) ? 'active' : ''}`}
                        onClick={() => { setSelectedYear(String(year)); setSelectedMonth('all'); }}
                      >
                        {year}
                        <span className="category-count">
                          ({newsletters.filter(n => n.year === year).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filter by Month */}
                <div className="sidebar-widget">
                  <h3 className="widget-title">Filter by Month</h3>
                  <div className="category-list">
                    <button
                      className={`category-btn ${selectedMonth === 'all' ? 'active' : ''}`}
                      onClick={() => setSelectedMonth('all')}
                    >
                      All Months
                    </button>
                    {availableMonths.map(month => (
                      <button
                        key={month}
                        className={`category-btn ${selectedMonth === String(month) ? 'active' : ''}`}
                        onClick={() => setSelectedMonth(String(month))}
                      >
                        {MONTH_NAMES[month]}
                        <span className="category-count">
                          ({(selectedYear !== 'all'
                            ? newsletters.filter(n => n.year === parseInt(selectedYear) && n.month === month)
                            : newsletters.filter(n => n.month === month)
                          ).length})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="sidebar-widget">
                  <h3 className="widget-title">Newsletter Stats</h3>
                  <div className="stats-widget">
                    <div className="stat-item">
                      <span className="stat-number">{newsletters.length}</span>
                      <span className="stat-label">Total Editions</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-number">{filteredNewsletters.length}</span>
                      <span className="stat-label">Showing Now</span>
                    </div>
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="news-content">
                <div className="content-header">
                  <h2 className="section-heading">
                    {selectedYear !== 'all' && selectedMonth !== 'all'
                      ? `${MONTH_NAMES[parseInt(selectedMonth)]} ${selectedYear}`
                      : selectedYear !== 'all'
                        ? `Newsletters - ${selectedYear}`
                        : selectedHome !== 'all'
                          ? `${homes.find(h => h.id === selectedHome)?.homeName || ''} Newsletters`
                          : 'All Newsletters'}
                    <span className="result-count">({filteredNewsletters.length} editions)</span>
                  </h2>
                </div>

                {loading ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#1B3C78' }}></i>
                    <p style={{ marginTop: '15px', color: '#6B7280' }}>Loading newsletters...</p>
                  </div>
                ) : filteredNewsletters.length > 0 ? (
                  <div className="news-grid">
                    {filteredNewsletters.map(newsletter => (
                      <article key={newsletter.id} className="news-article-card">
                        <div className="article-image">
                          {newsletter.coverImage ? (
                            <img src={newsletter.coverImage} alt={newsletter.title} />
                          ) : (
                            <div className="article-placeholder-image" style={{
                              background: 'linear-gradient(135deg, #1e3a8a 0%, #1B3C78 40%, #2563eb 100%)',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              color: 'white', gap: '10px', height: '100%', position: 'relative', overflow: 'hidden'
                            }}>
                              {/* Decorative lines */}
                              <div style={{ position: 'absolute', inset: 0, opacity: 0.07, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.8) 18px, rgba(255,255,255,0.8) 19px)', pointerEvents: 'none' }} />
                              <i className="fas fa-newspaper" style={{ fontSize: '2.8rem', opacity: 0.9, position: 'relative' }}></i>
                              <div style={{ textAlign: 'center', position: 'relative' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, opacity: 0.95, letterSpacing: '0.3px' }}>
                                  {MONTH_NAMES[newsletter.month]} {newsletter.year}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '1px', marginTop: '3px' }}>Newsletter</div>
                              </div>
                            </div>
                          )}
                          <div className="article-badge">
                            {MONTH_NAMES[newsletter.month]} {newsletter.year}
                          </div>
                          {(() => {
                            const now = new Date();
                            const isNew = newsletter.year === now.getFullYear() && newsletter.month >= now.getMonth();
                            return isNew ? (
                              <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#10b981', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
                                New
                              </div>
                            ) : null;
                          })()}
                        </div>
                        <div className="article-content">
                          <h3 className="article-title">{newsletter.title}</h3>
                          {newsletter.description && (
                            <p className="article-excerpt">{newsletter.description}</p>
                          )}
                          <div className="article-meta">
                            <span className="meta-date">
                              <i className="fas fa-calendar"></i> {MONTH_NAMES[newsletter.month]} {newsletter.year}
                            </span>
                            {newsletter.homeId && homes.find(h => h.id === newsletter.homeId) && (
                              <span style={{ fontSize: '12px', color: '#1B3C78', background: '#eff6ff', padding: '2px 8px', borderRadius: '12px', fontWeight: 500 }}>
                                <i className="fas fa-home" style={{ marginRight: '4px' }}></i>
                                {homes.find(h => h.id === newsletter.homeId)?.homeName}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '16px', flexWrap: 'wrap' }}>
                            <a
                              href={newsletter.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="read-more-btn"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', padding: '9px 16px', fontSize: '13px', marginTop: 0, flex: 1, justifyContent: 'center', minWidth: '110px' }}
                            >
                              <i className="fas fa-eye"></i> View
                            </a>
                            <a
                              href={newsletter.fileUrl}
                              download
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                                background: 'white', color: '#1B3C78', border: '1.5px solid #bfdbfe',
                                padding: '9px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: 600,
                                flex: 1, justifyContent: 'center', minWidth: '110px',
                                transition: 'all 0.2s ease'
                              }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.borderColor = '#1B3C78'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#bfdbfe'; }}
                            >
                              <i className="fas fa-download"></i> PDF
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="no-news">
                    <div className="no-news-icon">
                      <i className="fas fa-newspaper"></i>
                    </div>
                    <h3>No newsletters found</h3>
                    <p>Try selecting a different month or year, or check back soon for new editions.</p>
                    <button className="reset-btn" onClick={() => { setSelectedYear('all'); setSelectedMonth('all'); setSelectedHome('all'); }}>
                      Show All Newsletters
                    </button>
                  </div>
                )}
              </main>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Newsletters;
