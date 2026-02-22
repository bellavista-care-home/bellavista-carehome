import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as authService from '../../services/authService';
import SectionEditorModal from '../../components/inline-editor/SectionEditorModal';
import './AdminPageEditor.css';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

// Section metadata with icons and labels
// editable: false means the section cannot be edited in admin
const SECTION_META = {
  hero: { icon: 'fas fa-home', label: 'Hero Section', color: '#3b82f6', editable: true },
  about: { icon: 'fas fa-info-circle', label: 'Welcome / About', color: '#10b981', editable: false },
  whyChoose: { icon: 'fas fa-check-circle', label: 'Why Choose Us', color: '#8b5cf6', editable: false },
  services: { icon: 'fas fa-hand-holding-heart', label: 'Our Services', color: '#f59e0b', editable: true },
  facilities: { icon: 'fas fa-building', label: 'Facilities', color: '#ef4444', editable: true },
  activities: { icon: 'fas fa-calendar-alt', label: 'Activities', color: '#06b6d4', editable: true },
  team: { icon: 'fas fa-users', label: 'Our Team', color: '#ec4899', editable: true },
  testimonials: { icon: 'fas fa-star', label: 'Testimonials', color: '#fbbf24', editable: false },
  news: { icon: 'fas fa-newspaper', label: 'Latest News', color: '#6366f1', editable: false },
  contact: { icon: 'fas fa-phone', label: 'Contact & Info', color: '#14b8a6', editable: true },
};

// Sortable Section Item Component
const SortableSectionItem = ({ section, onEdit, onToggleVisibility, homeData }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.sectionKey });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const meta = SECTION_META[section.sectionKey] || { 
    icon: 'fas fa-square', 
    label: section.sectionKey,
    color: '#6b7280' 
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`section-item ${!section.visible ? 'section-item--hidden' : ''} ${isDragging ? 'section-item--dragging' : ''}`}
    >
      <div className="section-item__drag" {...attributes} {...listeners}>
        <i className="fas fa-grip-vertical"></i>
      </div>
      
      <div className="section-item__icon" style={{ backgroundColor: meta.color }}>
        <i className={meta.icon}></i>
      </div>
      
      <div className="section-item__info">
        <h4>{section.customTitle || meta.label}</h4>
        <span className="section-item__key">{section.sectionKey}</span>
      </div>
      
      <div className="section-item__actions">
        <button
          className={`section-action-btn ${section.visible ? 'visible' : 'hidden'}`}
          onClick={() => onToggleVisibility(section)}
          title={section.visible ? 'Hide Section' : 'Show Section'}
        >
          <i className={`fas fa-eye${section.visible ? '' : '-slash'}`}></i>
        </button>
        
        {meta.editable !== false && (
          <button
            className="section-action-btn edit"
            onClick={() => onEdit(section)}
            title="Edit Section"
          >
            <i className="fas fa-pencil-alt"></i>
          </button>
        )}
        {meta.editable === false && (
          <span className="section-locked" title="This section is not editable">
            <i className="fas fa-lock"></i>
          </span>
        )}
      </div>
    </div>
  );
};

// Map admin slugs to frontend route paths
const slugToRouteMap = {
  'bellavista-barry': '/bellavista-barry',
  'bellavista-cardiff': '/bellavista-cardiff',
  'bellavista-baltimore': '/baltimore-care-home',
  'waverley-care-centre': '/waverley-care-center',
  'college-fields-nursing-home': '/college-fields-nursing-home',
  'meadow-vale-cwtch': '/meadow-vale-cwtch'
};

// Main Admin Page Editor Component
const AdminPageEditor = () => {
  const { homeSlug } = useParams();
  const frontendRoute = slugToRouteMap[homeSlug] || `/${homeSlug}`;
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [livePreviewOpen, setLivePreviewOpen] = useState(false);
  const iframeRef = React.useRef(null);
  const [iframeKey, setIframeKey] = useState(Date.now());
  const [previewScale, setPreviewScale] = useState(0.5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showIframe, setShowIframe] = useState(true);
  const [scrollToSection, setScrollToSection] = useState(null);

  const user = authService.getCurrentUser();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load home data and sections
  useEffect(() => {
    loadData();
  }, [homeSlug]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch full home data including sections
      const response = await fetch(`${API_URL}/homes/${homeSlug}/full`);
      if (!response.ok) throw new Error('Failed to load home data');
      
      const data = await response.json();
      setHomeData(data);
      setSections(data.sections || []);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle drag end
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSections((items) => {
        const oldIndex = items.findIndex(i => i.sectionKey === active.id);
        const newIndex = items.findIndex(i => i.sectionKey === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);
        return newOrder;
      });
    }
  };

  // Toggle section visibility
  const handleToggleVisibility = async (section) => {
    const newVisible = !section.visible;
    
    // Optimistic update
    setSections(prev => prev.map(s => 
      s.sectionKey === section.sectionKey ? { ...s, visible: newVisible } : s
    ));
    setHasChanges(true);

    try {
      const token = authService.getToken();
      await fetch(`${API_URL}/homes/${homeSlug}/sections/${section.sectionKey}/visibility`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ visible: newVisible })
      });
    } catch (err) {
      console.error('Error toggling visibility:', err);
      // Revert on error
      setSections(prev => prev.map(s => 
        s.sectionKey === section.sectionKey ? { ...s, visible: !newVisible } : s
      ));
    }
  };

  // Save section order
  const handleSaveOrder = async () => {
    setSaving(true);
    try {
      const token = authService.getToken();
      const orderedSections = sections.map((s, index) => ({
        sectionKey: s.sectionKey,
        order: index,
        visible: s.visible,
        customTitle: s.customTitle
      }));

      await fetch(`${API_URL}/homes/${homeSlug}/sections/order`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sections: orderedSections })
      });

      setHasChanges(false);
      // Show success toast or notification
    } catch (err) {
      console.error('Error saving order:', err);
      setError('Failed to save section order');
    } finally {
      setSaving(false);
    }
  };

  // Section key to HTML ID mapping
  const sectionIdMap = {
    hero: 'hero-section',
    about: 'about-section',
    whyChoose: 'whyChoose-section',
    services: 'services-section',
    facilities: 'facilities-section',
    activities: 'activities-section',
    team: 'team-section',
    testimonials: 'testimonials',
    news: 'news-section',
    contact: 'contact-section',
  };

  // Scroll preview to section
  const scrollPreviewToSection = (sectionKey) => {
    const sectionId = sectionIdMap[sectionKey];
    setScrollToSection(sectionId);
    
    // Try to scroll immediately if iframe is ready
    if (sectionId && iframeRef.current && iframeRef.current.contentWindow) {
      setTimeout(() => {
        try {
          iframeRef.current?.contentWindow?.postMessage(
            { type: 'scrollToSection', sectionId },
            '*'
          );
        } catch (e) {
          console.log('PostMessage failed');
        }
      }, 100);
    }
  };

  // Edit section content - opens editor without changing preview state
  const handleEditSection = (section) => {
    setEditingSection(section);
    // Scroll preview to the section being edited
    scrollPreviewToSection(section.sectionKey);
  };

  // Close editor modal
  const handleCloseEditor = () => {
    setEditingSection(null);
    // Keep live preview open if user wants to continue viewing
  };

  // Close both editor and preview
  const handleCloseAll = () => {
    setEditingSection(null);
    setLivePreviewOpen(false);
  };

  // Refresh the live preview iframe with complete destruction/recreation
  const refreshLivePreview = () => {
    setIsRefreshing(true);
    
    // Completely unmount the iframe first
    setShowIframe(false);
    
    // Wait a bit then remount with new key to force complete reload
    setTimeout(() => {
      setIframeKey(Date.now());
      setShowIframe(true);
    }, 100);
  };

  // Handle section save - just close the editor, user can manually refresh preview
  const handleSaveSection = async () => {
    setEditingSection(null);
    // Reload admin data to get fresh content for the sections list
    await loadData();
    // Don't auto-refresh preview - user has manual refresh button
  };

  // Build section data for editor
  const buildSectionData = (sectionKey) => {
    if (!homeData) return {};
    
    switch (sectionKey) {
      case 'hero':
        return {
          heroTitle: homeData.heroTitle,
          heroSubtitle: homeData.heroSubtitle,
          heroDescription: homeData.heroDescription || homeData.heroExpandedDesc,
          statsBedrooms: homeData.statsBedrooms,
          statsLocationBadge: homeData.statsLocationBadge,
          ciwReportUrl: homeData.ciwReportUrl,
          newsletterUrl: homeData.newsletterUrl,
          bannerImages: homeData.bannerImages || [],
        };
      case 'about':
        return {
          aboutTitle: homeData.aboutTitle,
          welcomeText: homeData.aboutIntro || homeData.description,
          aboutText: homeData.aboutParagraph2,
          carePhilosophyTitle: homeData.carePhilosophyTitle,
          carePhilosophy: homeData.carePhilosophy,
          locationTitle: homeData.locationTitle,
          locationDescription: homeData.locationDescription,
          // Include contentBlocks if available in homeData
          contentBlocks: homeData.contentBlocks || [],
        };
      case 'whyChoose':
        return {
          whyChooseTitle: homeData.whyChooseTitle,
          reasons: homeData.whyChooseList || [],
        };
      case 'services':
        return {
          servicesTitle: homeData.servicesTitle || 'Our Services',
          servicesSubtitle: homeData.servicesSubtitle,
          servicesIntro: homeData.servicesIntro,
          servicesContent: homeData.servicesContent || homeData.servicesIntro,
          services: homeData.servicesList || [],
          servicesClosing: homeData.servicesClosing,
        };
      case 'facilities':
        return {
          facilitiesTitle: homeData.facilitiesTitle || 'Our Facilities',
          facilitiesSubtitle: homeData.facilitiesSubtitle,
          facilitiesIntro: homeData.facilitiesIntro,
          facilitiesContent: homeData.facilitiesContent || homeData.facilitiesIntro,
          facilitiesList: homeData.facilitiesList || [],
          facilitiesGallery: homeData.facilitiesGallery || [],
        };
      case 'activities':
        return {
          activitiesTitle: homeData.activitiesTitle || 'Activities',
          activitiesSubtitle: homeData.activitiesSubtitle,
          activitiesIntro: homeData.activitiesIntro,
          activitiesContent: homeData.activitiesContent || homeData.activitiesIntro,
          activitiesList: homeData.activitiesList || [],
          activitiesGallery: homeData.activitiesGallery || [],
        };
      case 'team':
        return {
          teamTitle: homeData.teamTitle || 'Our Team',
          teamSubtitle: homeData.teamSubtitle,
          teamIntro: homeData.teamIntro,
          teamContent: homeData.teamContent || homeData.teamIntro,
          teamIntro2: homeData.teamIntro2,
          teamMembers: homeData.teamMembers || [],
          teamGallery: homeData.teamGallery || [],
        };
      case 'testimonials':
        return {
          testimonialsTitle: homeData.testimonialsTitle || 'Testimonials',
          googleRating: homeData.googleRating,
          googleReviewCount: homeData.googleReviewCount,
          carehomeRating: homeData.carehomeRating,
          carehomeReviewCount: homeData.carehomeReviewCount,
          testimonialsIntro: homeData.testimonialsIntro,
        };
      case 'news':
        return {
          newsTitle: homeData.newsTitle || 'Latest News',
          newsSubtitle: homeData.newsSubtitle,
        };
      case 'contact':
        return {
          contactTitle: homeData.contactTitle,
          contactSubtitle: homeData.contactSubtitle,
          address: homeData.contactAddress,
          phone: homeData.contactPhone,
          email: homeData.contactEmail,
          registeredBeds: homeData.quickFactBeds,
          parking: homeData.quickFactParking,
          quickFactLocation: homeData.quickFactLocation,
          quickFactCareType: homeData.quickFactCareType,
          googleReviewUrl: homeData.googleReviewUrl,
          carehomeUrl: homeData.carehomeUrl,
        };
      default:
        return {};
    }
  };

  if (loading) {
    return (
      <div className="admin-page-editor">
        <div className="admin-page-editor__loading">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading page editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-page-editor">
        <div className="admin-page-editor__error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
          <button onClick={loadData}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-editor">
      {/* Header */}
      <div className="admin-page-editor__header">
        <div className="header-left">
          <button className="back-btn" onClick={() => navigate('/admin-console')}>
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="header-info">
            <h1>Edit Page: {homeData?.name || homeSlug}</h1>
            <span className="header-subtitle">Drag sections to reorder • Click edit to modify content</span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`preview-btn ${livePreviewOpen ? 'active' : ''}`}
            onClick={() => setLivePreviewOpen(!livePreviewOpen)}
            title={livePreviewOpen ? 'Close Live Preview' : 'Open Live Preview'}
          >
            <i className={`fas fa-${livePreviewOpen ? 'columns' : 'desktop'}`}></i>
            {livePreviewOpen ? 'Close Preview' : 'Live Preview'}
          </button>
          <button 
            className="preview-btn"
            onClick={() => window.open(frontendRoute, '_blank')}
          >
            <i className="fas fa-external-link-alt"></i>
            Open in New Tab
          </button>
          {hasChanges && (
            <button 
              className="save-btn"
              onClick={handleSaveOrder}
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
                  Save Order
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Content - Split view when live preview is open */}
      <div className={`admin-page-editor__content ${livePreviewOpen ? 'split-view' : ''}`}>
        {/* Live Preview Panel */}
        {livePreviewOpen && (
          <div className="live-preview-panel">
            <div className="live-preview-panel__header">
              <h3>
                <i className="fas fa-eye"></i>
                Live Preview
              </h3>
              <div className="live-preview-controls">
                <select 
                  className="live-preview-scale-select"
                  value={previewScale}
                  onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                  title="Preview Scale"
                >
                  <option value="0.35">35%</option>
                  <option value="0.5">50%</option>
                  <option value="0.65">65%</option>
                  <option value="0.75">75%</option>
                </select>
                <button 
                  className="live-preview-btn"
                  onClick={refreshLivePreview}
                  title="Refresh Preview"
                  disabled={isRefreshing}
                >
                  <i className={`fas fa-sync-alt ${isRefreshing ? 'fa-spin' : ''}`}></i>
                </button>
                <button 
                  className="live-preview-btn"
                  onClick={() => window.open(frontendRoute, '_blank')}
                  title="Open in New Tab"
                >
                  <i className="fas fa-external-link-alt"></i>
                </button>
              </div>
            </div>
            <div className="live-preview-panel__content">
              {isRefreshing && (
                <div className="live-preview-loading">
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Refreshing preview...</span>
                </div>
              )}
              <div className="live-preview-scaler" style={{ transform: `scale(${previewScale})` }}>
                {showIframe && (
                  <iframe
                    key={iframeKey}
                    ref={iframeRef}
                    src={`${frontendRoute}?preview=true&nocache=${iframeKey}`}
                    title="Live Page Preview"
                    className="live-preview-iframe"
                    onLoad={() => {
                      setIsRefreshing(false);
                      // Scroll to section if one is set (after a short delay for content to render)
                      if (scrollToSection) {
                        setTimeout(() => {
                          try {
                            iframeRef.current?.contentWindow?.postMessage(
                              { type: 'scrollToSection', sectionId: scrollToSection },
                              '*'
                            );
                          } catch (e) {
                            console.log('Scroll postMessage failed');
                          }
                        }, 200);
                      }
                    }}
                  />
                )}
              </div>
            </div>
            <div className="live-preview-panel__footer">
              <i className="fas fa-info-circle"></i>
              <span>After saving, click the ↻ refresh button to see your changes.</span>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="sections-panel">
          <div className="sections-panel__header">
            <h2>
              <i className="fas fa-layer-group"></i>
              Page Sections
            </h2>
            <span className="section-count">{sections.length} sections</span>
          </div>
          
          <div className="sections-list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sections.map(s => s.sectionKey)}
                strategy={verticalListSortingStrategy}
              >
                {sections.map((section) => (
                  <SortableSectionItem
                    key={section.sectionKey}
                    section={section}
                    onEdit={handleEditSection}
                    onToggleVisibility={handleToggleVisibility}
                    homeData={homeData}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </div>
          
          <div className="sections-panel__footer">
            <p>
              <i className="fas fa-info-circle"></i>
              Drag sections to reorder how they appear on the page
            </p>
          </div>
        </div>

        {/* Quick Stats/Info Panel */}
        <div className="info-panel">
          <div className="info-card">
            <h3><i className="fas fa-chart-bar"></i> Page Stats</h3>
            <div className="info-stats">
              <div className="stat">
                <span className="stat-value">{sections.filter(s => s.visible).length}</span>
                <span className="stat-label">Visible Sections</span>
              </div>
              <div className="stat">
                <span className="stat-value">{sections.filter(s => !s.visible).length}</span>
                <span className="stat-label">Hidden Sections</span>
              </div>
            </div>
          </div>
          
          <div className="info-card">
            <h3><i className="fas fa-lightbulb"></i> Tips</h3>
            <ul className="tips-list">
              <li><i className="fas fa-grip-vertical"></i> Drag to reorder sections</li>
              <li><i className="fas fa-eye"></i> Click eye to show/hide</li>
              <li><i className="fas fa-pencil-alt"></i> Click pencil to edit content</li>
              <li><i className="fas fa-save"></i> Save order after reordering</li>
            </ul>
          </div>
          
          <div className="info-card">
            <h3><i className="fas fa-link"></i> Quick Links</h3>
            <div className="quick-links">
              <a href={frontendRoute} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-external-link-alt"></i> View Live Page
              </a>
              <a href={`/facilities${frontendRoute}`} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-building"></i> Facilities Page
              </a>
              <a href={`/activities${frontendRoute}`} target="_blank" rel="noopener noreferrer">
                <i className="fas fa-calendar-alt"></i> Activities Page
              </a>
            </div>
          </div>
          
          <div className="info-card">
            <h3><i className="fas fa-file-alt"></i> External Resources</h3>
            <div className="external-links">
              <div className="external-link-item">
                <span className="external-link-label">CIW Report URL</span>
                {homeData?.ciwReportUrl ? (
                  <a href={homeData.ciwReportUrl} target="_blank" rel="noopener noreferrer" className="external-link-url">
                    <i className="fas fa-external-link-alt"></i> View Report
                  </a>
                ) : (
                  <span className="external-link-empty">Not configured</span>
                )}
              </div>
              <div className="external-link-item">
                <span className="external-link-label">Newsletter URL</span>
                {homeData?.newsletterUrl ? (
                  <a href={homeData.newsletterUrl} target="_blank" rel="noopener noreferrer" className="external-link-url">
                    <i className="fas fa-external-link-alt"></i> View Newsletter
                  </a>
                ) : (
                  <span className="external-link-empty">Not configured</span>
                )}
              </div>
              <button 
                className="edit-external-links-btn"
                onClick={() => {
                  const heroSection = sections.find(s => s.sectionKey === 'hero');
                  if (heroSection) handleEditSection(heroSection);
                }}
              >
                <i className="fas fa-pencil-alt"></i> Edit in Hero Section
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Editor Modal */}
      {editingSection && (
        <SectionEditorModal
          isOpen={true}
          onClose={handleCloseEditor}
          onSave={handleSaveSection}
          sectionId={editingSection.sectionKey}
          sectionType={editingSection.sectionKey}
          homeId={homeSlug}
          sectionData={buildSectionData(editingSection.sectionKey)}
          label={SECTION_META[editingSection.sectionKey]?.label || editingSection.sectionKey}
          splitViewMode={livePreviewOpen}
          onRefreshPreview={refreshLivePreview}
        />
      )}
    </div>
  );
};

export default AdminPageEditor;
