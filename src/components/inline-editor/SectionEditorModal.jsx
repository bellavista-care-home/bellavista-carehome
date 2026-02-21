import React, { useState, useEffect } from 'react';
import * as authService from '../../services/authService';
import ContentBlocksEditor from './ContentBlocksEditor';
import RichTextEditor from './RichTextEditor';
import './SectionEditorModal.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * SectionEditorModal - Modal for editing section content
 * Renders different form fields based on sectionType
 * Supports split-view mode for side-by-side editing with live preview
 */
const SectionEditorModal = ({
  isOpen,
  onClose,
  onSave,
  sectionId,
  sectionType,
  homeId,
  sectionData,
  label,
  splitViewMode = false,
  onRefreshPreview
}) => {
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (sectionData) {
      setFormData({ ...sectionData });
    }
  }, [sectionData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      if (typeof arr[index] === 'object' && typeof value === 'object') {
        arr[index] = { ...arr[index], ...value };
      } else {
        arr[index] = value;
      }
      return { ...prev, [field]: arr };
    });
  };

  const handleAddArrayItem = (field, defaultValue = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), defaultValue]
    }));
  };

  const handleRemoveArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] || []).filter((_, i) => i !== index)
    }));
  };

  const handleMoveArrayItem = (field, index, direction) => {
    setFormData(prev => {
      const arr = [...(prev[field] || [])];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= arr.length) return prev;
      [arr[index], arr[newIndex]] = [arr[newIndex], arr[index]];
      return { ...prev, [field]: arr };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);

    try {
      const token = authService.getToken();
      
      // Use the section-specific API endpoint
      const response = await fetch(`${API_URL}/homes/${homeId}/section/${sectionType}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(buildUpdatePayload(sectionType, formData))
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save changes');
      }

      onSave(formData);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // Build API payload based on section type
  const buildUpdatePayload = (type, data) => {
    switch (type) {
      case 'hero':
        return {
          heroTitle: data.heroTitle,
          heroSubtitle: data.heroSubtitle,
          heroDescription: data.heroDescription,
          heroExpandedDesc: data.heroDescription,
          statsBedrooms: data.statsBedrooms,
          statsLocationBadge: data.statsLocationBadge,
          ciwReportUrl: data.ciwReportUrl,
          newsletterUrl: data.newsletterUrl
        };
      case 'about':
        // Extract legacy fields from content blocks for backwards compatibility
        const blocks = data.contentBlocks || [];
        const paragraphs = blocks.filter(b => b.type === 'paragraph');
        const subheadings = blocks.filter(b => b.type === 'subheading');
        
        return {
          aboutTitle: data.aboutTitle,
          // Legacy fields for backwards compatibility
          aboutIntro: paragraphs[0]?.content || data.welcomeText || '',
          aboutParagraph2: paragraphs[1]?.content || data.aboutText || '',
          carePhilosophyTitle: subheadings[0]?.content || data.carePhilosophyTitle || '',
          carePhilosophy: paragraphs[2]?.content || data.carePhilosophy || '',
          locationTitle: subheadings[1]?.content || data.locationTitle || '',
          locationDescription: paragraphs[3]?.content || data.locationDescription || '',
          // New dynamic content blocks
          contentBlocks: blocks
        };
      case 'whyChoose':
        return {
          whyChooseTitle: data.whyChooseTitle,
          whyChooseSubtitle: data.whyChooseSubtitle,
          whyChooseList: data.reasons,
          whyChooseClosing: data.whyChooseClosing
        };
      case 'services':
        return {
          servicesTitle: data.servicesTitle,
          servicesSubtitle: data.servicesSubtitle,
          servicesContent: data.servicesContent || data.servicesIntro
        };
      case 'facilities':
        return {
          facilitiesTitle: data.facilitiesTitle,
          facilitiesSubtitle: data.facilitiesSubtitle,
          facilitiesContent: data.facilitiesContent || data.facilitiesIntro
        };
      case 'activities':
        return {
          activitiesTitle: data.activitiesTitle,
          activitiesSubtitle: data.activitiesSubtitle,
          activitiesContent: data.activitiesContent || data.activitiesIntro
        };
      case 'team':
        return {
          teamTitle: data.teamTitle,
          teamSubtitle: data.teamSubtitle,
          teamContent: data.teamContent || data.teamIntro
        };
      case 'testimonials':
        return {
          testimonialsTitle: data.testimonialsTitle,
          googleRating: data.googleRating,
          googleReviewCount: data.googleReviewCount,
          carehomeRating: data.carehomeRating,
          carehomeReviewCount: data.carehomeReviewCount,
          testimonialsIntro: data.testimonialsIntro
        };
      case 'news':
        return {
          newsTitle: data.newsTitle,
          newsSubtitle: data.newsSubtitle
        };
      case 'contact':
        return {
          contactTitle: data.contactTitle,
          contactSubtitle: data.contactSubtitle,
          contactAddress: data.address,
          contactPhone: data.phone,
          contactEmail: data.email,
          contactMapUrl: data.mapUrl,
          quickFactBeds: data.registeredBeds,
          quickFactLocation: data.quickFactLocation,
          quickFactCareType: data.quickFactCareType,
          quickFactParking: data.parking,
          googleReviewUrl: data.googleReviewUrl,
          carehomeUrl: data.carehomeUrl
        };
      default:
        return data;
    }
  };

  if (!isOpen) return null;

  // Split view mode - editor appears as a slide-in panel
  if (splitViewMode) {
    return (
      <div className="section-editor-split-panel">
        <div className="section-editor-split-panel__header">
          <h2>
            <i className="fas fa-pencil-alt"></i>
            Edit {label || sectionType}
          </h2>
          <button className="section-editor-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="section-editor-split-panel__body">
          {error && (
            <div className="section-editor-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {/* Render form based on section type */}
          {renderSectionForm(sectionType, formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem, handleMoveArrayItem)}
        </div>

        <div className="section-editor-split-panel__footer">
          <button 
            className="section-editor-btn section-editor-btn--cancel"
            onClick={onClose}
            disabled={saving}
          >
            Close
          </button>
          <button 
            className="section-editor-btn section-editor-btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save"></i>
                Save & Preview
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Standard modal mode
  return (
    <div className="section-editor-overlay" onClick={onClose}>
      <div className="section-editor-modal section-editor-modal--large" onClick={e => e.stopPropagation()}>
        <div className="section-editor-header">
          <h2>
            <i className="fas fa-pencil-alt"></i>
            Edit {label || sectionType}
          </h2>
          <button className="section-editor-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="section-editor-body">
          {error && (
            <div className="section-editor-error">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          {/* Render form based on section type */}
          {renderSectionForm(sectionType, formData, handleChange, handleArrayChange, handleAddArrayItem, handleRemoveArrayItem, handleMoveArrayItem)}
        </div>

        <div className="section-editor-footer">
          <button 
            className="section-editor-btn section-editor-btn--cancel"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button 
            className="section-editor-btn section-editor-btn--save"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-check"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Render different forms based on section type
const renderSectionForm = (sectionType, formData, onChange, onArrayChange, onAddItem, onRemoveItem, onMoveItem) => {
  switch (sectionType) {
    case 'hero':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Main Title</label>
            <input
              type="text"
              value={formData.heroTitle || ''}
              onChange={(e) => onChange('heroTitle', e.target.value)}
              placeholder="e.g., Nursing Home in Barry"
            />
          </div>
          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              value={formData.heroSubtitle || ''}
              onChange={(e) => onChange('heroSubtitle', e.target.value)}
              placeholder="e.g., Stunning views over the Bristol Channel"
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              rows={4}
              value={formData.heroDescription || ''}
              onChange={(e) => onChange('heroDescription', e.target.value)}
              placeholder="Enter hero description..."
            />
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Number of Bedrooms</label>
              <input
                type="text"
                value={formData.statsBedrooms || ''}
                onChange={(e) => onChange('statsBedrooms', e.target.value)}
                placeholder="e.g., 39 Bedrooms"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Location Badge</label>
              <input
                type="text"
                value={formData.statsLocationBadge || ''}
                onChange={(e) => onChange('statsLocationBadge', e.target.value)}
                placeholder="e.g., Barry Seaside"
              />
            </div>
          </div>
          <div className="form-group">
            <label>CIW Report URL</label>
            <input
              type="url"
              value={formData.ciwReportUrl || ''}
              onChange={(e) => onChange('ciwReportUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="form-group">
            <label>Newsletter URL</label>
            <input
              type="url"
              value={formData.newsletterUrl || ''}
              onChange={(e) => onChange('newsletterUrl', e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      );

    case 'about':
      // Initialize content blocks from existing data if not already in block format
      const initializeAboutBlocks = () => {
        if (formData.contentBlocks && formData.contentBlocks.length > 0) {
          return formData.contentBlocks;
        }
        // Convert legacy data to blocks format
        const blocks = [];
        if (formData.welcomeText) {
          blocks.push({ id: 'legacy-p1', type: 'paragraph', content: formData.welcomeText });
        }
        if (formData.aboutText) {
          blocks.push({ id: 'legacy-p2', type: 'paragraph', content: formData.aboutText });
        }
        if (formData.carePhilosophyTitle) {
          blocks.push({ id: 'legacy-h1', type: 'subheading', content: formData.carePhilosophyTitle });
        }
        if (formData.carePhilosophy) {
          blocks.push({ id: 'legacy-p3', type: 'paragraph', content: formData.carePhilosophy });
        }
        if (formData.locationTitle) {
          blocks.push({ id: 'legacy-h2', type: 'subheading', content: formData.locationTitle });
        }
        if (formData.locationDescription) {
          blocks.push({ id: 'legacy-p4', type: 'paragraph', content: formData.locationDescription });
        }
        // Add default blocks if empty
        if (blocks.length === 0) {
          blocks.push(
            { id: 'default-1', type: 'paragraph', content: '' }
          );
        }
        return blocks;
      };

      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.aboutTitle || ''}
              onChange={(e) => onChange('aboutTitle', e.target.value)}
              placeholder="e.g., Welcome to Bellavista Barry"
            />
          </div>
          
          <ContentBlocksEditor
            blocks={initializeAboutBlocks()}
            onChange={(newBlocks) => onChange('contentBlocks', newBlocks)}
            sectionTitle="Section Content"
          />
        </div>
      );

    case 'whyChoose':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.whyChooseTitle || ''}
              onChange={(e) => onChange('whyChooseTitle', e.target.value)}
              placeholder="e.g., Why Choose Bellavista Barry"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.whyChooseSubtitle || ''}
              onChange={(e) => onChange('whyChooseSubtitle', e.target.value)}
              placeholder="e.g., Why Choose Us"
            />
          </div>
          
          <div className="form-group">
            <label>Reasons List</label>
            <div className="array-items">
              {(formData.reasons || []).map((reason, index) => (
                <div key={index} className="array-item array-item--with-controls">
                  <div className="array-item-controls">
                    <button 
                      type="button"
                      className="array-item-move"
                      onClick={() => onMoveItem('reasons', index, 'up')}
                      disabled={index === 0}
                    >
                      <i className="fas fa-chevron-up"></i>
                    </button>
                    <button 
                      type="button"
                      className="array-item-move"
                      onClick={() => onMoveItem('reasons', index, 'down')}
                      disabled={index === (formData.reasons || []).length - 1}
                    >
                      <i className="fas fa-chevron-down"></i>
                    </button>
                  </div>
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => onArrayChange('reasons', index, e.target.value)}
                    placeholder="Enter reason"
                  />
                  <button 
                    type="button" 
                    className="array-item-remove"
                    onClick={() => onRemoveItem('reasons', index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              ))}
              <button 
                type="button" 
                className="array-item-add"
                onClick={() => onAddItem('reasons', '')}
              >
                <i className="fas fa-plus"></i> Add Reason
              </button>
            </div>
          </div>
          
          <div className="form-group">
            <label>Closing Paragraph</label>
            <textarea
              rows={3}
              value={formData.whyChooseClosing || ''}
              onChange={(e) => onChange('whyChooseClosing', e.target.value)}
              placeholder="Enter closing paragraph..."
            />
          </div>
        </div>
      );

    case 'services':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.servicesTitle || ''}
              onChange={(e) => onChange('servicesTitle', e.target.value)}
              placeholder="e.g., Our Services"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.servicesSubtitle || ''}
              onChange={(e) => onChange('servicesSubtitle', e.target.value)}
              placeholder="e.g., High Quality Care"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <p className="form-help-text">Use the toolbar to add bullet points, bold, italic, and alignment</p>
            <RichTextEditor
              value={formData.servicesContent || formData.servicesIntro || ''}
              onChange={(html) => onChange('servicesContent', html)}
              placeholder="Describe your services... Use bullet points, bold, italic, and alignment from the toolbar above."
              minHeight={200}
            />
          </div>
        </div>
      );

    case 'facilities':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.facilitiesTitle || ''}
              onChange={(e) => onChange('facilitiesTitle', e.target.value)}
              placeholder="e.g., Modern & Safe Environment"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.facilitiesSubtitle || ''}
              onChange={(e) => onChange('facilitiesSubtitle', e.target.value)}
              placeholder="e.g., Facilities"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <p className="form-help-text">Use the toolbar to add bullet points, bold, italic, and alignment</p>
            <RichTextEditor
              value={formData.facilitiesContent || formData.facilitiesIntro || ''}
              onChange={(html) => onChange('facilitiesContent', html)}
              placeholder="Describe your facilities... Use bullet points, bold, italic, and alignment from the toolbar above."
              minHeight={200}
            />
          </div>
        </div>
      );

    case 'activities':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.activitiesTitle || ''}
              onChange={(e) => onChange('activitiesTitle', e.target.value)}
              placeholder="e.g., Activities"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.activitiesSubtitle || ''}
              onChange={(e) => onChange('activitiesSubtitle', e.target.value)}
              placeholder="e.g., Life at Bellavista"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <p className="form-help-text">Use the toolbar to add bullet points, bold, italic, and alignment</p>
            <RichTextEditor
              value={formData.activitiesContent || formData.activitiesIntro || ''}
              onChange={(html) => onChange('activitiesContent', html)}
              placeholder="Describe your activities... Use bullet points, bold, italic, and alignment from the toolbar above."
              minHeight={200}
            />
          </div>
        </div>
      );

    case 'team':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.teamTitle || ''}
              onChange={(e) => onChange('teamTitle', e.target.value)}
              placeholder="e.g., Our Team"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.teamSubtitle || ''}
              onChange={(e) => onChange('teamSubtitle', e.target.value)}
              placeholder="e.g., Dedicated Staff"
            />
          </div>
          <div className="form-group">
            <label>Content</label>
            <p className="form-help-text">Use the toolbar to add bullet points, bold, italic, and alignment</p>
            <RichTextEditor
              value={formData.teamContent || formData.teamIntro || ''}
              onChange={(html) => onChange('teamContent', html)}
              placeholder="Describe your team... Use bullet points, bold, italic, and alignment from the toolbar above."
              minHeight={200}
            />
          </div>
        </div>
      );

    case 'testimonials':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.testimonialsTitle || ''}
              onChange={(e) => onChange('testimonialsTitle', e.target.value)}
              placeholder="e.g., Trusted by Residents. Valued by Families."
            />
          </div>
          <div className="form-group">
            <label>Introduction Text</label>
            <textarea
              rows={3}
              value={formData.testimonialsIntro || ''}
              onChange={(e) => onChange('testimonialsIntro', e.target.value)}
              placeholder="Describe testimonials..."
            />
          </div>
          
          <div className="form-section-title">
            <i className="fab fa-google"></i> Google Reviews
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Google Rating (e.g., 4.8)</label>
              <input
                type="text"
                value={formData.googleRating || ''}
                onChange={(e) => onChange('googleRating', e.target.value)}
                placeholder="4.8"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Number of Reviews</label>
              <input
                type="number"
                value={formData.googleReviewCount || ''}
                onChange={(e) => onChange('googleReviewCount', parseInt(e.target.value) || '')}
                placeholder="85"
              />
            </div>
          </div>
          
          <div className="form-section-title">
            <i className="fas fa-home"></i> Carehome.co.uk Reviews
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Carehome Rating (e.g., 9.3)</label>
              <input
                type="text"
                value={formData.carehomeRating || ''}
                onChange={(e) => onChange('carehomeRating', e.target.value)}
                placeholder="9.3"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Number of Reviews</label>
              <input
                type="number"
                value={formData.carehomeReviewCount || ''}
                onChange={(e) => onChange('carehomeReviewCount', parseInt(e.target.value) || '')}
                placeholder="50"
              />
            </div>
          </div>
        </div>
      );

    case 'news':
      return (
        <div className="section-form">
          <div className="form-group">
            <label>Section Title</label>
            <input
              type="text"
              value={formData.newsTitle || ''}
              onChange={(e) => onChange('newsTitle', e.target.value)}
              placeholder="e.g., Latest News from Barry"
            />
          </div>
          <div className="form-group">
            <label>Section Subtitle</label>
            <input
              type="text"
              value={formData.newsSubtitle || ''}
              onChange={(e) => onChange('newsSubtitle', e.target.value)}
              placeholder="e.g., Updates"
            />
          </div>
          <div className="form-note">
            <i className="fas fa-info-circle"></i>
            <span>News items are managed separately in the News Manager section of the Admin Console.</span>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="section-form">
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Section Title</label>
              <input
                type="text"
                value={formData.contactTitle || ''}
                onChange={(e) => onChange('contactTitle', e.target.value)}
                placeholder="e.g., Contact & Information"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Section Subtitle</label>
              <input
                type="text"
                value={formData.contactSubtitle || ''}
                onChange={(e) => onChange('contactSubtitle', e.target.value)}
                placeholder="e.g., Get in Touch"
              />
            </div>
          </div>
          
          <div className="form-section-title">
            <i className="fas fa-address-card"></i> Contact Details
          </div>
          <div className="form-group">
            <label>Full Address</label>
            <textarea
              rows={2}
              value={formData.address || ''}
              onChange={(e) => onChange('address', e.target.value)}
              placeholder="Enter full address"
            />
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Phone Number</label>
              <input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => onChange('phone', e.target.value)}
                placeholder="e.g., 01234 567890"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Email Address</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
          </div>
          
          <div className="form-section-title">
            <i className="fas fa-list"></i> Quick Facts
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Registered Beds</label>
              <input
                type="text"
                value={formData.registeredBeds || ''}
                onChange={(e) => onChange('registeredBeds', e.target.value)}
                placeholder="e.g., 62"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Location</label>
              <input
                type="text"
                value={formData.quickFactLocation || ''}
                onChange={(e) => onChange('quickFactLocation', e.target.value)}
                placeholder="e.g., Barry"
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group form-group--half">
              <label>Care Type</label>
              <input
                type="text"
                value={formData.quickFactCareType || ''}
                onChange={(e) => onChange('quickFactCareType', e.target.value)}
                placeholder="e.g., Dementia Care"
              />
            </div>
            <div className="form-group form-group--half">
              <label>Parking</label>
              <input
                type="text"
                value={formData.parking || ''}
                onChange={(e) => onChange('parking', e.target.value)}
                placeholder="e.g., Available"
              />
            </div>
          </div>
          
          <div className="form-section-title">
            <i className="fas fa-link"></i> External Links
          </div>
          <div className="form-group">
            <label>Google Reviews URL</label>
            <input
              type="url"
              value={formData.googleReviewUrl || ''}
              onChange={(e) => onChange('googleReviewUrl', e.target.value)}
              placeholder="https://www.google.com/search?q=..."
            />
          </div>
          <div className="form-group">
            <label>Carehome.co.uk URL</label>
            <input
              type="url"
              value={formData.carehomeUrl || ''}
              onChange={(e) => onChange('carehomeUrl', e.target.value)}
              placeholder="https://www.carehome.co.uk/..."
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="section-form">
          <div className="form-note form-note--warning">
            <i className="fas fa-exclamation-triangle"></i>
            <span>No editor available for section type: <strong>{sectionType}</strong></span>
          </div>
        </div>
      );
  }
};

export default SectionEditorModal;
