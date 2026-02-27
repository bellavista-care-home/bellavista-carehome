import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchNewsletters, subscribeToNewsletter, unsubscribeFromNewsletter } from '../services/newsletterService';
import SEO from '../components/SEO';
import '../styles/MainPage.css';
import '../styles/NewsDetail.css';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const Newsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const unsubscribeId = searchParams.get('unsubscribe');

  // Subscribe form state
  const [subEmail, setSubEmail] = useState('');
  const [subName, setSubName] = useState('');
  const [subStatus, setSubStatus] = useState(null); // 'success', 'error', 'loading'
  const [subMessage, setSubMessage] = useState('');

  // Unsubscribe state
  const [unsubDone, setUnsubDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const items = await fetchNewsletters();
      setNewsletters(items);
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

  // Available months from data for selected year
  const availableMonths = useMemo(() => {
    let filtered = newsletters;
    if (selectedYear !== 'all') {
      filtered = filtered.filter(n => n.year === parseInt(selectedYear));
    }
    const months = [...new Set(filtered.map(n => n.month))].sort((a, b) => b - a);
    return months;
  }, [newsletters, selectedYear]);

  // Filtered newsletters
  const filteredNewsletters = useMemo(() => {
    let filtered = newsletters;
    if (selectedYear !== 'all') {
      filtered = filtered.filter(n => n.year === parseInt(selectedYear));
    }
    if (selectedMonth !== 'all') {
      filtered = filtered.filter(n => n.month === parseInt(selectedMonth));
    }
    return filtered;
  }, [newsletters, selectedYear, selectedMonth]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subEmail.trim()) return;
    setSubStatus('loading');
    setSubMessage('');
    try {
      const result = await subscribeToNewsletter({ email: subEmail.trim(), name: subName.trim() });
      setSubStatus('success');
      setSubMessage(result.message || 'Successfully subscribed!');
      setSubEmail('');
      setSubName('');
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
      <div className="news-page">
        {/* Hero Section */}
        <section style={{
          background: 'linear-gradient(135deg, #1B3C78 0%, #2563eb 100%)',
          padding: '60px 20px 50px',
          textAlign: 'center',
          color: 'white'
        }}>
          <div className="container">
            <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', fontWeight: 700 }}>
              <i className="fas fa-newspaper" style={{ marginRight: '12px', opacity: 0.85 }}></i>
              Our Newsletters
            </h1>
            <p style={{ fontSize: '1.15rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>
              Stay connected with the latest updates, stories, and events from Bellavista Nursing Homes. Browse our monthly editions below.
            </p>
          </div>
        </section>

        <section className="news-main" style={{ paddingTop: '40px' }}>
          <div className="container">
            <div className="news-layout">
              {/* Sidebar */}
              <aside className="news-sidebar">
                {/* Subscribe Widget */}
                <div className="sidebar-widget" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid #bae6fd' }}>
                  <h3 className="widget-title" style={{ color: '#0369a1' }}>
                    <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
                    Subscribe
                  </h3>
                  <p style={{ fontSize: '13px', color: '#475569', marginBottom: '12px', lineHeight: 1.5 }}>
                    Get our monthly newsletter delivered to your inbox.
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
                        border: '1px solid #cbd5e1', fontSize: '14px', marginBottom: '10px',
                        boxSizing: 'border-box'
                      }}
                    />
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
                              background: 'linear-gradient(135deg, #1B3C78 0%, #2563eb 100%)',
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              color: 'white', gap: '8px'
                            }}>
                              <i className="fas fa-newspaper" style={{ fontSize: '2.5rem', opacity: 0.9 }}></i>
                              <span style={{ fontSize: '14px', fontWeight: 600, opacity: 0.85 }}>
                                {MONTH_NAMES[newsletter.month]} {newsletter.year}
                              </span>
                            </div>
                          )}
                          <div className="article-badge" style={{ background: '#1B3C78' }}>
                            {MONTH_NAMES[newsletter.month]} {newsletter.year}
                          </div>
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
                          </div>
                          <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                            <a
                              href={newsletter.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="read-more-btn"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                            >
                              <i className="fas fa-eye"></i> View Newsletter
                            </a>
                            <a
                              href={newsletter.fileUrl}
                              download
                              className="read-more-btn"
                              style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none',
                                background: 'transparent', color: '#1B3C78', border: '1px solid #1B3C78',
                                padding: '8px 16px', borderRadius: '6px', fontSize: '13px', fontWeight: 600
                              }}
                            >
                              <i className="fas fa-download"></i> Download PDF
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
                    <button className="reset-btn" onClick={() => { setSelectedYear('all'); setSelectedMonth('all'); }}>
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
