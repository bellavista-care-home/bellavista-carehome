import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchNewsletters,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  fetchSubscribers,
  deleteSubscriber,
} from '../../services/newsletterService';
import { fetchHomes } from '../../services/homeService';

const MONTH_NAMES = [
  '', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const NewsletterManager = ({ notify }) => {
  const [activeTab, setActiveTab] = useState('newsletters'); // 'newsletters' | 'subscribers'
  const [newsletters, setNewsletters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    homeId: '',
    sendEmails: false,
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [coverFile, setCoverFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadNewsletters = useCallback(async () => {
    setLoading(true);
    const data = await fetchNewsletters();
    setNewsletters(data);
    setLoading(false);
  }, []);

  const loadSubscribers = useCallback(async () => {
    const data = await fetchSubscribers();
    setSubscribers(data);
  }, []);

  const loadHomes = useCallback(async () => {
    try {
      const data = await fetchHomes();
      setHomes(data);
    } catch (e) {
      console.error('Failed to load homes:', e);
    }
  }, []);

  useEffect(() => {
    loadNewsletters();
    loadSubscribers();
    loadHomes();
  }, [loadNewsletters, loadSubscribers, loadHomes]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      homeId: '',
      sendEmails: false,
    });
    setPdfFile(null);
    setCoverFile(null);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (newsletter) => {
    setEditingId(newsletter.id);
    setFormData({
      title: newsletter.title || '',
      description: newsletter.description || '',
      month: newsletter.month,
      year: newsletter.year,
      homeId: newsletter.homeId || '',
      sendEmails: false,
    });
    setPdfFile(null);
    setCoverFile(null);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingId && !pdfFile) {
      notify('Please upload a PDF file', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('month', formData.month);
      fd.append('year', formData.year);
      if (formData.homeId) fd.append('homeId', formData.homeId);
      fd.append('sendEmails', formData.sendEmails ? 'true' : 'false');
      if (pdfFile) fd.append('file', pdfFile);
      if (coverFile) fd.append('coverImage', coverFile);

      if (editingId) {
        await updateNewsletter(editingId, fd);
        notify('Newsletter updated successfully!', 'success');
      } else {
        const result = await createNewsletter(fd);
        if (formData.sendEmails && result.emailResults) {
          notify(
            `Newsletter published! Emails sent: ${result.emailResults.sent}, Failed: ${result.emailResults.failed}`,
            result.emailResults.failed > 0 ? 'warning' : 'success'
          );
        } else {
          notify('Newsletter published successfully!', 'success');
        }
      }
      resetForm();
      loadNewsletters();
    } catch (err) {
      notify(err.message || 'Failed to save newsletter', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this newsletter?')) return;
    try {
      await deleteNewsletter(id);
      notify('Newsletter deleted', 'success');
      loadNewsletters();
    } catch (err) {
      notify(err.message || 'Failed to delete newsletter', 'error');
    }
  };

  const handleDeleteSubscriber = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    try {
      await deleteSubscriber(id);
      notify('Subscriber removed', 'success');
      loadSubscribers();
    } catch (err) {
      notify(err.message || 'Failed to remove subscriber', 'error');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px', borderRadius: '8px',
    border: '1px solid #d1d5db', fontSize: '14px', boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block', fontWeight: 600, marginBottom: '6px', fontSize: '13px', color: '#374151'
  };

  return (
    <section className="panel">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <h2 style={{ margin: 0 }}>
          <i className="fas fa-newspaper" style={{ marginRight: '10px', color: '#1B3C78' }}></i>
          Newsletter Management
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn small ${activeTab === 'newsletters' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('newsletters')}
            style={activeTab === 'newsletters' ? { background: '#1B3C78', color: 'white' } : {}}
          >
            <i className="fas fa-newspaper" style={{ marginRight: '6px' }}></i>
            Newsletters ({newsletters.length})
          </button>
          <button
            className={`btn small ${activeTab === 'subscribers' ? '' : 'ghost'}`}
            onClick={() => setActiveTab('subscribers')}
            style={activeTab === 'subscribers' ? { background: '#1B3C78', color: 'white' } : {}}
          >
            <i className="fas fa-users" style={{ marginRight: '6px' }}></i>
            Subscribers ({subscribers.filter(s => s.isActive).length})
          </button>
        </div>
      </div>

      {/* ==================== NEWSLETTERS TAB ==================== */}
      {activeTab === 'newsletters' && (
        <>
          {!showForm && (
            <button
              className="btn small"
              style={{ background: '#1B3C78', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px' }}
              onClick={() => { resetForm(); setShowForm(true); }}
            >
              <i className="fas fa-plus"></i> Upload New Newsletter
            </button>
          )}

          {showForm && (
            <div style={{
              background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px',
              padding: '24px', marginBottom: '24px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#1B3C78' }}>
                {editingId ? 'Edit Newsletter' : 'Upload New Newsletter'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. Monthly Highlights"
                      required
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={labelStyle}>Month *</label>
                      <select
                        value={formData.month}
                        onChange={(e) => setFormData({ ...formData, month: parseInt(e.target.value) })}
                        style={inputStyle}
                      >
                        {MONTH_NAMES.slice(1).map((name, i) => (
                          <option key={i + 1} value={i + 1}>{name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Year *</label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                        min={2020}
                        max={2040}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={labelStyle}>Description (optional)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of this newsletter edition..."
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={labelStyle}>Newsletter PDF {editingId ? '(optional - leave empty to keep current)' : '*'}</label>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => setPdfFile(e.target.files[0])}
                      style={{ fontSize: '14px' }}
                    />
                    {pdfFile && <p style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}><i className="fas fa-check"></i> {pdfFile.name}</p>}
                  </div>
                  <div>
                    <label style={labelStyle}>Cover Image (optional)</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setCoverFile(e.target.files[0])}
                      style={{ fontSize: '14px' }}
                    />
                    {coverFile && <p style={{ fontSize: '12px', color: '#059669', marginTop: '4px' }}><i className="fas fa-check"></i> {coverFile.name}</p>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                  <div>
                    <label style={labelStyle}>Home (optional - leave empty for global)</label>
                    <select
                      value={formData.homeId}
                      onChange={(e) => setFormData({ ...formData, homeId: e.target.value })}
                      style={inputStyle}
                    >
                      <option value="">All Homes (Global)</option>
                      {homes.map(h => (
                        <option key={h.id} value={h.id}>{h.homeName || h.name}</option>
                      ))}
                    </select>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '4px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.sendEmails}
                        onChange={(e) => setFormData({ ...formData, sendEmails: e.target.checked })}
                        style={{ width: '18px', height: '18px' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 500 }}>
                        <i className="fas fa-envelope" style={{ marginRight: '6px', color: '#2563eb' }}></i>
                        Email to all subscribers ({subscribers.filter(s => s.isActive).length})
                      </span>
                    </label>
                  </div>
                </div>

                {formData.sendEmails && (
                  <div style={{
                    background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px',
                    padding: '12px 16px', marginBottom: '16px', fontSize: '13px', color: '#1e40af'
                  }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    This will send the newsletter to <strong>{subscribers.filter(s => s.isActive).length}</strong> active subscribers.
                    You'll receive a confirmation email with the list of recipients.
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn small"
                    style={{ background: '#1B3C78', color: 'white', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    {submitting ? (
                      <><i className="fas fa-spinner fa-spin"></i> {formData.sendEmails ? 'Publishing & Emailing...' : 'Publishing...'}</>
                    ) : (
                      <><i className="fas fa-upload"></i> {editingId ? 'Update Newsletter' : (formData.sendEmails ? 'Publish & Email' : 'Publish Newsletter')}</>
                    )}
                  </button>
                  <button type="button" className="btn small ghost" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Newsletters List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin" style={{ fontSize: '1.5rem', color: '#1B3C78' }}></i>
              <p style={{ marginTop: '10px', color: '#6B7280' }}>Loading newsletters...</p>
            </div>
          ) : newsletters.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <i className="fas fa-newspaper" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', opacity: 0.5 }}></i>
              <p>No newsletters uploaded yet. Click "Upload New Newsletter" to get started.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
              {newsletters.map(nl => (
                <div key={nl.id} style={{
                  border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden',
                  background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                }}>
                  <div style={{
                    height: '6px',
                    background: 'linear-gradient(135deg, #1B3C78 0%, #2563eb 100%)'
                  }}></div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        background: '#eff6ff', color: '#1e40af', padding: '3px 10px',
                        borderRadius: '12px', fontSize: '12px', fontWeight: 600
                      }}>
                        {MONTH_NAMES[nl.month]} {nl.year}
                      </span>
                      {nl.homeId && (
                        <span style={{ fontSize: '11px', color: '#6B7280' }}>
                          {homes.find(h => h.id === nl.homeId)?.homeName || nl.homeId}
                        </span>
                      )}
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', color: '#111827' }}>{nl.title}</h4>
                    {nl.description && (
                      <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#6B7280', lineHeight: 1.4 }}>
                        {nl.description.length > 100 ? nl.description.slice(0, 100) + '...' : nl.description}
                      </p>
                    )}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <a href={nl.fileUrl} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '12px', color: '#2563eb', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fas fa-eye"></i> View PDF
                      </a>
                      <button className="btn ghost small" style={{ fontSize: '12px', padding: '4px 10px' }} onClick={() => handleEdit(nl)}>
                        <i className="fas fa-pen" style={{ marginRight: '4px' }}></i>Edit
                      </button>
                      <button className="btn ghost small" style={{ fontSize: '12px', padding: '4px 10px', color: '#ef4444' }} onClick={() => handleDelete(nl.id)}>
                        <i className="fas fa-trash" style={{ marginRight: '4px' }}></i>Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ==================== SUBSCRIBERS TAB ==================== */}
      {activeTab === 'subscribers' && (
        <>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: '20px', flexWrap: 'wrap', gap: '10px'
          }}>
            <div>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>
                <strong>{subscribers.filter(s => s.isActive).length}</strong> active subscribers
                {subscribers.filter(s => !s.isActive).length > 0 && (
                  <span style={{ marginLeft: '10px', color: '#9ca3af' }}>
                    ({subscribers.filter(s => !s.isActive).length} unsubscribed)
                  </span>
                )}
              </span>
            </div>
            <button className="btn small ghost" onClick={loadSubscribers}>
              <i className="fas fa-refresh" style={{ marginRight: '6px' }}></i>Refresh
            </button>
          </div>

          {subscribers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
              <i className="fas fa-users" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block', opacity: 0.5 }}></i>
              <p>No subscribers yet. Subscribers will appear here when users subscribe on the website.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e5e7eb' }}>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Name</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Email</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Status</th>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#374151' }}>Subscribed</th>
                    <th style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#374151' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map(sub => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '10px 14px' }}>{sub.name || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>No name</span>}</td>
                      <td style={{ padding: '10px 14px', color: '#2563eb' }}>{sub.email}</td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: '5px',
                          padding: '2px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 600,
                          background: sub.isActive ? '#dcfce7' : '#fef2f2',
                          color: sub.isActive ? '#166534' : '#991b1b',
                        }}>
                          <i className={`fas ${sub.isActive ? 'fa-check-circle' : 'fa-times-circle'}`} style={{ fontSize: '10px' }}></i>
                          {sub.isActive ? 'Active' : 'Unsubscribed'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', color: '#6B7280' }}>
                        {sub.subscribedAt ? new Date(sub.subscribedAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        }) : '—'}
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <button
                          className="btn ghost small"
                          style={{ fontSize: '12px', padding: '4px 10px', color: '#ef4444' }}
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          title="Remove subscriber"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default NewsletterManager;
