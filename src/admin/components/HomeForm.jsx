import React, { useState, useEffect } from 'react';
import EnhancedImageUploader from '../../components/EnhancedImageUploader';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { fetchHome } from '../../services/homeService';

// Simplified Care Section Item
const CareSectionItem = ({ item, index, total, field, onMove, onRemove, onUpdate }) => {
  const title = item.title || '';
  const description = item.description || '';
  const image = item.image || ''; // Single image URL
  const showOnPage = item.showOnPage || false;
  
  const [isExpanded, setIsExpanded] = useState(false);

  const handleImageUpload = (url) => {
      onUpdate(field, index, { image: url });
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'white',
      marginBottom: '20px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{
        padding: '15px',
        background: '#f8f9fa',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px'}}>
           <span style={{background: '#667eea', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px'}}>{index + 1}</span>
           {title || 'Untitled Care Item'}
           {showOnPage && <span style={{fontSize: '10px', background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '4px'}}>Visible</span>}
        </div>
        <div style={{display: 'flex', gap: '4px'}}>
          <button className="btn ghost small icon-only" disabled={index === 0} onClick={() => onMove(field, index, 'up')}><i className="fa-solid fa-chevron-up"></i></button>
          <button className="btn ghost small icon-only" disabled={index === total - 1} onClick={() => onMove(field, index, 'down')}><i className="fa-solid fa-chevron-down"></i></button>
          <button className="btn ghost small icon-only" onClick={() => setIsExpanded(!isExpanded)}><i className="fa-solid fa-pencil"></i></button>
          <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => onRemove(field, index)}><i className="fa-solid fa-trash"></i></button>
        </div>
      </div>

      {isExpanded && (
        <div style={{padding: '20px'}}>
           <div className="field">
              <label>Title</label>
              <input type="text" value={title} onChange={(e) => onUpdate(field, index, { title: e.target.value })} placeholder="e.g. Dementia Care" />
           </div>
           
           <div className="field">
              <label>Image (Standard size: 16:9)</label>
              <EnhancedImageUploader 
                label="Click to upload or drag and drop"
                aspectRatio={16/9}
                initialValue={image}
                onImageSelected={handleImageUpload}
                showCrop={true}
                allowSkipOnUpload={true}
              />
           </div>

           <div className="field">
              <label>Full Description (Modal)</label>
              <ReactQuill theme="snow" value={description} onChange={(val) => onUpdate(field, index, { description: val })} style={{height: '200px', marginBottom: '50px'}} />
           </div>

           <div className="field">
               <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#28a745'}}>
                  <input type="checkbox" checked={showOnPage} onChange={(e) => onUpdate(field, index, { showOnPage: e.target.checked })} style={{marginRight: '8px', width: 'auto'}} />
                  Show on Care Page
               </label>
               <small className="muted" style={{display: 'block', marginTop: '5px'}}>
                 If checked, this item will appear in the alternating layout section on the Care page.
               </small>
           </div>
        </div>
      )}
    </div>
  );
};

// Helper to render a Gallery Grid Item
const GalleryItem = ({ item, index, total, field, label, onMove, onRemove, onUpdate }) => {
  const isObj = typeof item === 'object';
  const url = isObj ? item.url : item;
  const type = isObj ? item.type : 'image';
  const cropMode = isObj ? item.cropMode : 'uncropped';

  // New fields
  const title = isObj ? item.title || '' : '';
  const shortDesc = isObj ? item.shortDescription || '' : '';
  const fullDesc = isObj ? item.fullDescription || '' : '';
  const showOnPage = isObj ? item.showOnPage || false : false;

  const [isExpanded, setIsExpanded] = useState(false);

  // Strip HTML from short description for preview, preserving line breaks if needed or just simple text
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      overflow: 'hidden',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      gridColumn: isExpanded ? '1 / -1' : 'auto'
    }}>
      <div style={{
        height: '140px',
        background: '#f0f0f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}>
        {type === 'video' ? (
           <div style={{textAlign: 'center'}}>
             <i className="fa-solid fa-video" style={{fontSize: '32px', color: '#666', marginBottom: '5px'}}></i>
             <div style={{fontSize: '10px', color: '#666', maxWidth: '90%', overflow: 'hidden', textOverflow: 'ellipsis', margin: '0 auto'}}>{url}</div>
           </div>
        ) : (
           <img src={url} style={{width: '100%', height: '100%', objectFit: cropMode === 'cropped' ? 'cover' : 'contain', backgroundColor: '#333'}} alt="" />
        )}
        {label && (
          <div style={{position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(44, 90, 160, 0.9)', color: 'white', fontSize: '10px', fontWeight: 'bold'}}>
            {label}
          </div>
        )}
        {showOnPage && (
          <div style={{position: 'absolute', top: 0, right: 0, padding: '4px 8px', background: '#28a745', color: 'white', fontSize: '10px', fontWeight: 'bold', borderBottomLeftRadius: '4px'}}>
            Page Visible
          </div>
        )}
      </div>
      <div style={{
        padding: '10px',
        borderTop: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'white'
      }}>
         <div style={{display: 'flex', gap: '4px'}}>
            <button className="btn ghost small icon-only" disabled={index === 0} onClick={() => onMove(field, index, 'up')} title="Move Left/Up">
               <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button className="btn ghost small icon-only" disabled={index === total - 1} onClick={() => onMove(field, index, 'down')} title="Move Right/Down">
               <i className="fa-solid fa-chevron-right"></i>
            </button>
            <button className="btn ghost small" onClick={() => setIsExpanded(!isExpanded)} title="Edit Details" style={{marginLeft: '4px', fontSize: '12px'}}>
               {isExpanded ? 'Hide' : 'Edit'}
            </button>
         </div>
         <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => onRemove(field, index)} title="Remove">
            <i className="fa-solid fa-trash"></i>
         </button>
      </div>
      
      {/* Expanded Details Form */}
      {isExpanded && (
         <div style={{ padding: '15px', background: '#f9f9f9', borderTop: '1px solid #eee' }}>
            <div className="field">
               <label>Title</label>
               <input type="text" value={title} onChange={(e) => onUpdate(field, index, { title: e.target.value })} placeholder="Activity/Facility Title" />
            </div>
            <div className="field">
               <label>Short Description (Card) <span style={{fontSize: '0.8em', color: '#666', fontWeight: 'normal'}}> - Plain text recommended for best layout</span></label>
               <textarea 
                 value={stripHtml(shortDesc)} 
                 onChange={(e) => onUpdate(field, index, { shortDescription: e.target.value })} 
                 placeholder="Brief description for the card..."
                 style={{
                   width: '100%',
                   height: '80px',
                   padding: '10px',
                   borderRadius: '4px',
                   border: '1px solid #ccc',
                   fontFamily: 'inherit',
                   fontSize: '14px',
                   resize: 'vertical'
                 }}
               />
               {/* Hidden Quill to maintain compatibility if needed, or just switch to textarea entirely for Short Desc */}
            </div>
             <div className="field">
               <label>Full Description (Modal)</label>
               <ReactQuill theme="snow" value={fullDesc} onChange={(val) => onUpdate(field, index, { fullDescription: val })} style={{height: '150px', marginBottom: '50px'}} />
            </div>
            <div className="field" style={{marginBottom: 0}}>
               <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#28a745'}}>
                  <input type="checkbox" checked={showOnPage} onChange={(e) => onUpdate(field, index, { showOnPage: e.target.checked })} style={{marginRight: '8px', width: 'auto'}} />
                  Show on {field === 'activityImages' ? 'Activities' : field === 'careGalleryImages' ? 'Care' : 'Facilities'} Page
               </label>
               <small className="muted" style={{display: 'block', marginTop: '5px'}}>
                 Checked: Shows as a card on the page AND in the gallery.<br/>
                 Unchecked: Shows ONLY in the gallery slider.
               </small>
            </div>
         </div>
      )}
    </div>
  );
};

const HomeForm = ({ mode = 'add', initialData = null, onCancel, onSave, isHomeAdmin = false, activeSection = 'all' }) => {
  // Helper to get section title
  const getSectionTitle = () => {
    switch(activeSection) {
      case 'card-images': return 'Card Images';
      case 'ciw-report': return 'CIW Report';
      case 'newsletter': return 'Newsletter';
      case 'banner-images': return 'Scrolling Banner Images';
      case 'facilities-gallery': return 'Facilities Gallery';
      case 'activities-gallery': return 'Activities Gallery';
      case 'care-gallery': return 'Care Gallery';
      case 'team-gallery': return 'My Team Gallery';
      case 'team-positions': return 'My Team Positions';
      default: return mode === 'add' ? 'Add Home' : 'Update Home';
    }
  };

  const createInitialFormData = () => {
    if (mode === 'edit' && initialData) {
      return {
        homeName: initialData.homeName || '',
        homeLocation: initialData.homeLocation || '',
        adminEmail: initialData.adminEmail || '',
        homeImage: initialData.homeImage || '',
        cardImage2: initialData.cardImage2 || '',
        homeBadge: initialData.homeBadge || '',
        homeDesc: initialData.homeDesc || '',
        heroTitle: initialData.heroTitle || '',
        heroSubtitle: initialData.heroSubtitle || '',
        heroBgImage: initialData.heroBgImage || '',
        heroExpandedDesc: initialData.heroExpandedDesc || '',
        ciwReportUrl: initialData.ciwReportUrl || '',
        newsletterUrl: initialData.newsletterUrl || '',
        bannerImages: initialData.bannerImages || [],
        statsBedrooms: initialData.statsBedrooms || '',
        statsPremier: initialData.statsPremier || '',
        teamMembers: initialData.teamMembers || [],
        teamGalleryImages: initialData.teamGalleryImages || [],
        careIntro: initialData.careIntro || '',
        careSectionsJson: initialData.careSectionsJson || [],
        careGalleryImages: initialData.careGalleryImages || [],
        activitiesIntro: initialData.activitiesIntro || '',
        activities: initialData.activities || [],
        activityImages: initialData.activityImages || [],
        activitiesModalDesc: initialData.activitiesModalDesc || '',
        facilitiesIntro: initialData.facilitiesIntro || '',
        facilitiesList: initialData.facilitiesList || [],
        detailedFacilities: initialData.detailedFacilities || [],
        facilitiesGalleryImages: initialData.facilitiesGalleryImages || [],
        homeFeatured: initialData.homeFeatured || false
      };
    }
    return {
      id: '',
      homeName: '',
      homeLocation: '',
      adminEmail: '',
      homeImage: '',
      cardImage2: '',
      homeBadge: '',
      homeDesc: '',
      heroTitle: '',
      heroSubtitle: '',
      heroBgImage: '',
      heroExpandedDesc: '',
      ciwReportUrl: '',
      newsletterUrl: '',
      bannerImages: [],
      statsBedrooms: '',
      statsPremier: '',
      teamMembers: [],
      teamGalleryImages: [],
      careIntro: '',
      careSectionsJson: [],
      careGalleryImages: [],
      activitiesIntro: '',
      activities: [],
      activityImages: [],
      activitiesModalDesc: '',
      facilitiesIntro: '',
      facilitiesList: [],
      detailedFacilities: [],
      facilitiesGalleryImages: [],
      homeFeatured: false
    };
  };

  const [formData, setFormData] = useState(createInitialFormData);
  // Start with loading=true when editing to prevent showing empty form
  const [isLoadingHomeData, setIsLoadingHomeData] = useState(mode === 'edit');

  // Fetch full home data when editing (since homes list only has lightweight data)
  useEffect(() => {
    const loadFullHomeData = async () => {
      if (mode === 'edit' && initialData?.id) {
        setIsLoadingHomeData(true);
        try {
          const fullHome = await fetchHome(initialData.id);
          if (fullHome) {
            setFormData({
              id: fullHome.id,
              homeName: fullHome.homeName || '',
              homeLocation: fullHome.homeLocation || '',
              adminEmail: fullHome.adminEmail || '',
              homeImage: fullHome.homeImage || '',
              cardImage2: fullHome.cardImage2 || '',
              homeBadge: fullHome.homeBadge || '',
              homeDesc: fullHome.homeDesc || '',
              heroTitle: fullHome.heroTitle || '',
              heroSubtitle: fullHome.heroSubtitle || '',
              heroBgImage: fullHome.heroBgImage || '',
              heroExpandedDesc: fullHome.heroExpandedDesc || '',
              ciwReportUrl: fullHome.ciwReportUrl || '',
              newsletterUrl: fullHome.newsletterUrl || '',
              bannerImages: fullHome.bannerImages || [],
              statsBedrooms: fullHome.statsBedrooms || '',
              statsPremier: fullHome.statsPremier || '',
              teamMembers: fullHome.teamMembers || [],
              teamGalleryImages: fullHome.teamGalleryImages || [],
              careIntro: fullHome.careIntro || '',
              careSectionsJson: fullHome.careSectionsJson || [],
              careGalleryImages: fullHome.careGalleryImages || [],
              activitiesIntro: fullHome.activitiesIntro || '',
              activities: fullHome.activities || [],
              activityImages: fullHome.activityImages || [],
              activitiesModalDesc: fullHome.activitiesModalDesc || '',
              facilitiesIntro: fullHome.facilitiesIntro || '',
              facilitiesList: fullHome.facilitiesList || [],
              detailedFacilities: fullHome.detailedFacilities || [],
              facilitiesGalleryImages: fullHome.facilitiesGalleryImages || [],
              homeFeatured: fullHome.homeFeatured || false
            });
          }
        } catch (err) {
          console.error('Failed to load full home data:', err);
        } finally {
          setIsLoadingHomeData(false);
        }
      }
    };
    loadFullHomeData();
  }, [mode, initialData?.id]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (field, item) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], item] }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const moveItem = (field, index, direction) => {
    const newArray = [...formData[field]];
    if (direction === 'up' && index > 0) {
      [newArray[index], newArray[index - 1]] = [newArray[index - 1], newArray[index]];
    } else if (direction === 'down' && index < newArray.length - 1) {
      [newArray[index], newArray[index + 1]] = [newArray[index + 1], newArray[index]];
    }
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const updateItem = (field, index, updates) => {
    const newArray = [...formData[field]];
    // If item is string, convert to object first
    if (typeof newArray[index] !== 'object') {
       newArray[index] = { type: 'image', url: newArray[index] };
    }
    newArray[index] = { ...newArray[index], ...updates };
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  // Local state for list inputs
  const [teamInput, setTeamInput] = useState({ name: '', role: '', image: '' });
  const [teamGalleryInput, setTeamGalleryInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });
  const [activityMediaInput, setActivityMediaInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });
  const [facilityMediaInput, setFacilityMediaInput] = useState({ type: 'image', url: '', cropMode: 'uncropped' });

  const [uploadingDoc, setUploadingDoc] = useState(null);

  const handleDocUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    setUploadingDoc(field);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const { API_URL } = await import('../../config/apiConfig');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formDataUpload
      });

      if (!response.ok) throw new Error('Upload failed');

      const data = await response.json();
      setFormData(prev => ({ ...prev, [field]: data.url }));
    } catch (error) {
      console.error('Document upload error:', error);
      alert('Failed to upload document.');
    } finally {
      setUploadingDoc(null);
    }
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (file, field) => {
    if (!file) return;

    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('process_type', 'none');

      const { API_URL } = await import('../../config/apiConfig');
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const videoUrl = data.url; // Returns /uploads/filename.ext

      const newItem = { type: 'video', url: videoUrl };
      addItem(field, newItem);
      
      // Reset inputs
      if (field === 'facilitiesGalleryImages') setFacilityMediaInput(prev => ({ ...prev, url: '' }));
      if (field === 'activityImages') setActivityMediaInput(prev => ({ ...prev, url: '' }));
      if (field === 'teamGalleryImages') setTeamGalleryInput(prev => ({ ...prev, url: '' }));
      
    } catch (error) {
      console.error('Video upload error:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // GalleryItem moved outside

  if (isLoadingHomeData) {
    return (
      <section className="panel" style={{display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', padding: '60px'}}>
        <i className="fa-solid fa-spinner fa-spin" style={{fontSize:'48px', color:'#667eea', marginBottom:'20px'}}></i>
        <h3>Loading Home Data...</h3>
        <p className="muted">Please wait while we fetch the full home information</p>
      </section>
    );
  }

  return (
    <section className="panel" style={{display:'flex', flexDirection:'column', height:'100%', overflow:'hidden', padding: 0}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', padding:'20px', borderBottom:'1px solid #f0f0f0'}}>
        <div>
          <h2>{getSectionTitle()}</h2>
          <p className="muted">{mode === 'add' ? 'Create a new Nursing Home card.' : `Editing ${initialData?.homeName || 'Home'}`}</p>
        </div>
        {mode === 'edit' && (
          <button className="btn ghost" onClick={onCancel}>
            <i className="fa-solid fa-arrow-left"></i> Back to List
          </button>
        )}
      </div>
      
      <div style={{flex: 1, overflowY: 'auto', padding: '20px'}} data-lenis-prevent>
      {/* 1. Basic Information (Read Only) */}
      {(activeSection === 'all' && !isHomeAdmin) && (
      <>
      <div className="group-title" style={{marginTop:'20px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-info-circle"></i> Basic Information
      </div>
      <div className="grid cols-2">
        <div className="field">
          <label>Home Name</label>
          <input 
            value={formData.homeName} 
            readOnly
            disabled
            type="text"
            style={{background: '#f5f5f5', color: '#666'}}
          />
        </div>
        <div className="field">
          <label>Location</label>
          <input 
            value={formData.homeLocation} 
            readOnly
            disabled
            type="text"
            style={{background: '#f5f5f5', color: '#666'}}
          />
        </div>
        <div className="field" style={{gridColumn: '1 / -1'}} data-lenis-prevent>
          <label>Description (About)</label>
          <ReactQuill 
            theme="snow"
            value={formData.homeDesc} 
            onChange={(val) => handleChange('homeDesc', val)}
            style={{height: '150px', marginBottom: '50px'}}
          />
        </div>
        <div className="field" style={{gridColumn: '1 / -1'}}>
          <label>Admin Email (Receives Tour Booking Notifications)</label>
          <input 
            value={formData.adminEmail} 
            onChange={(e) => handleChange('adminEmail', e.target.value)}
            type="email"
            placeholder="Enter admin email address"
          />
        </div>
      </div>
      </>
      )}

      {/* 2. Card Images */}
      {(activeSection === 'all' || activeSection === 'card-images') && (
      <>
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-image"></i> Card Images (Max 2)
      </div>
      <div className="grid cols-2">
        <div className="field">
          <EnhancedImageUploader 
            label="Card Image 1" 
            aspectRatio={4/3}
            initialValue={formData.homeImage}
            onImageSelected={(url) => handleChange('homeImage', url)}
            showCrop={true}
            allowSkipOnUpload={true}
          />
        </div>
        <div className="field">
          <EnhancedImageUploader 
            label="Card Image 2" 
            aspectRatio={4/3}
            initialValue={formData.cardImage2}
            onImageSelected={(url) => handleChange('cardImage2', url)}
            showCrop={true}
            allowSkipOnUpload={true}
          />
          <small className="muted" style={{display:'block', marginTop:'5px'}}>
            *This image is used for the second card on the main page.
          </small>
        </div>
      </div>

      {/* Card Images Preview Gallery */}
      {(formData.homeImage || formData.cardImage2) && (
        <div className="field" style={{marginTop: '20px'}}>
          <label style={{marginBottom: '10px', display: 'block', fontWeight: 'bold'}}>
            {[formData.homeImage, formData.cardImage2].filter(Boolean).length} Card {[formData.homeImage, formData.cardImage2].filter(Boolean).length === 1 ? 'Image' : 'Images'} Preview
          </label>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            {formData.homeImage && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  height: '140px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={formData.homeImage} style={{width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#333'}} alt="Card 1" />
                  <div style={{position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(44, 90, 160, 0.9)', color: 'white', fontSize: '10px', fontWeight: 'bold'}}>
                    Card 1
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'white'
                }}>
                  <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => handleChange('homeImage', '')} title="Remove">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            )}
            {formData.cardImage2 && (
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  height: '140px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={formData.cardImage2} style={{width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#333'}} alt="Card 2" />
                  <div style={{position: 'absolute', top: 0, left: 0, right: 0, padding: '4px 8px', background: 'rgba(44, 90, 160, 0.9)', color: 'white', fontSize: '10px', fontWeight: 'bold'}}>
                    Card 2
                  </div>
                </div>
                <div style={{
                  padding: '10px',
                  borderTop: '1px solid #eee',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'white'
                }}>
                  <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => handleChange('cardImage2', '')} title="Remove">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      </>
      )}

      {/* 3. Documents & Links */}
      {((activeSection === 'all' && !isHomeAdmin) || activeSection === 'ciw-report' || activeSection === 'newsletter') && (
      <>
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-file-pdf"></i> Documents & Links
      </div>
      <div className="grid cols-2">
        {(activeSection === 'all' || activeSection === 'ciw-report') && (
        <div className="field">
          <label>CIW Report (PDF)</label>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => handleDocUpload(e, 'ciwReportUrl')}
              disabled={uploadingDoc === 'ciwReportUrl'}
              style={{display: 'none'}}
              id="ciw-upload"
            />
            <button 
              className="btn small ghost" 
              onClick={() => document.getElementById('ciw-upload').click()}
              disabled={uploadingDoc === 'ciwReportUrl'}
            >
              {uploadingDoc === 'ciwReportUrl' ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-upload"></i> Upload PDF</>}
            </button>
            {formData.ciwReportUrl ? (
              <a href={formData.ciwReportUrl} target="_blank" rel="noopener noreferrer" style={{fontSize: '13px', color: '#667eea', textDecoration: 'underline'}}>
                View Report
              </a>
            ) : (
              <span className="muted" style={{fontSize: '12px'}}>No file selected</span>
            )}
            {formData.ciwReportUrl && (
               <button className="btn ghost small icon-only" style={{color: '#ff4757', marginLeft: 'auto'}} onClick={() => handleChange('ciwReportUrl', '')} title="Remove">
                 <i className="fa-solid fa-trash"></i>
               </button>
            )}
          </div>
        </div>
        )}
        {(activeSection === 'all' || activeSection === 'newsletter') && (
        <div className="field">
          <label>Newsletter (PDF)</label>
          <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
            <input 
              type="file" 
              accept="application/pdf"
              onChange={(e) => handleDocUpload(e, 'newsletterUrl')}
              disabled={uploadingDoc === 'newsletterUrl'}
              style={{display: 'none'}}
              id="newsletter-upload"
            />
            <button 
              className="btn small ghost" 
              onClick={() => document.getElementById('newsletter-upload').click()}
              disabled={uploadingDoc === 'newsletterUrl'}
            >
              {uploadingDoc === 'newsletterUrl' ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-upload"></i> Upload PDF</>}
            </button>
            {formData.newsletterUrl ? (
              <a href={formData.newsletterUrl} target="_blank" rel="noopener noreferrer" style={{fontSize: '13px', color: '#667eea', textDecoration: 'underline'}}>
                View Newsletter
              </a>
            ) : (
              <span className="muted" style={{fontSize: '12px'}}>No file selected</span>
            )}
            {formData.newsletterUrl && (
               <button className="btn ghost small icon-only" style={{color: '#ff4757', marginLeft: 'auto'}} onClick={() => handleChange('newsletterUrl', '')} title="Remove">
                 <i className="fa-solid fa-trash"></i>
               </button>
            )}
          </div>
        </div>
        )}
      </div>
      </>
      )}

      {/* Scrolling Banner Images */}
      {((activeSection === 'all' && !isHomeAdmin) || activeSection === 'banner-images') && (
      <>
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-panorama"></i> Scrolling Banner Images
      </div>
      <div className="field">
        <label>Add Banner Image</label>
        
        {/* Bulk Upload Section for Banners */}
        <div style={{marginBottom: '15px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
            <div>
              <strong style={{display: 'block', marginBottom: '5px', fontSize: '15px'}}>📦 Bulk Upload Banners</strong>
              <span style={{fontSize: '12px', opacity: 0.9}}>Upload multiple banner images at once</span>
            </div>
            <button 
              className="btn"
              style={{background: 'white', color: '#667eea', border: 'none', fontWeight: 'bold'}}
              onClick={() => document.getElementById('bulk-banner-upload').click()}
              disabled={isUploading}
            >
              {isUploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-images"></i> Select Multiple</>}
            </button>
          </div>
          <input
            type="file"
            id="bulk-banner-upload"
            accept="image/*"
            multiple
            style={{display: 'none'}}
            onChange={async (e) => {
              const files = Array.from(e.target.files).slice(0, 30);
              if (files.length === 0) return;
              
              setIsUploading(true);
              let uploaded = 0;
              
              try {
                for (const file of files) {
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('process_type', 'none');
                    
                    const { API_URL } = await import('../../config/apiConfig');
                    
                    const response = await fetch(`${API_URL}/upload`, {
                      method: 'POST',
                      body: formData,
                    });
                    
                    if (response.ok) {
                      const data = await response.json();
                      // Add to banners, default showOnMain to true for convenience? Or false? 
                      // Let's default to false to be safe, user can check them.
                      addItem('bannerImages', { url: data.url, showOnMain: true });
                      uploaded++;
                    }
                  } catch (error) {
                    console.error('Upload error for file:', file.name, error);
                  }
                }
              } finally {
                setIsUploading(false);
                e.target.value = '';
                alert(`✅ Successfully uploaded ${uploaded} of ${files.length} banner images!`);
              }
            }}
          />
        </div>

        <div style={{marginBottom: '20px'}}>
           <EnhancedImageUploader 
              label="Upload Banner Image" 
              aspectRatio={16/9}
              onImageSelected={(url) => {
                 if (url) {
                    addItem('bannerImages', { url: url, showOnMain: false });
                 }
              }}
              showCrop={true}
              autoReset={true}
              allowSkipOnUpload={true}
            />
        </div>

        {formData.bannerImages && formData.bannerImages.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '15px',
            marginTop: '15px'
          }}>
            {formData.bannerImages.map((item, index) => (
              <div key={index} style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                overflow: 'hidden',
                background: 'white',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{
                  height: '140px',
                  background: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img src={item.url} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt={`Banner ${index + 1}`} />
                </div>
                <div style={{
                  padding: '10px',
                  borderTop: '1px solid #eee',
                  background: 'white'
                }}>
                   <div style={{marginBottom: '10px'}}>
                     <label style={{display: 'flex', alignItems: 'center', cursor: 'pointer', fontSize: '13px', fontWeight: '500'}}>
                       <input 
                         type="checkbox" 
                         checked={item.showOnMain || false} 
                         onChange={(e) => {
                            const newBanners = [...formData.bannerImages];
                            newBanners[index] = { ...newBanners[index], showOnMain: e.target.checked };
                            setFormData(prev => ({ ...prev, bannerImages: newBanners }));
                         }}
                         style={{marginRight: '8px'}}
                       />
                       Show on Main Page
                     </label>
                   </div>
                   <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <div style={{display: 'flex', gap: '4px'}}>
                        <button className="btn ghost small icon-only" disabled={index === 0} onClick={() => moveItem('bannerImages', index, 'up')}><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="btn ghost small icon-only" disabled={index === formData.bannerImages.length - 1} onClick={() => moveItem('bannerImages', index, 'down')}><i className="fa-solid fa-chevron-right"></i></button>
                      </div>
                      <button className="btn ghost small icon-only" style={{color: '#ff4757', borderColor: '#ff4757'}} onClick={() => removeItem('bannerImages', index)}><i className="fa-solid fa-trash"></i></button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </>
      )}

      {/* 3. Facilities */}
      {(activeSection === 'all' || activeSection === 'facilities-gallery') && (
      <>
      <div className="group-title" style={{marginTop:'30px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-building"></i> Facilities Gallery
      </div>
      <div className="field">
         <label>Add Facility Media</label>
         <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
          
          {/* Bulk Upload Section */}
          <div style={{marginBottom: '15px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
              <div>
                <strong style={{display: 'block', marginBottom: '5px', fontSize: '15px'}}>📦 Bulk Upload (Testing)</strong>
                <span style={{fontSize: '12px', opacity: 0.9}}>Upload up to 30 images at once</span>
              </div>
              <button 
                className="btn"
                style={{background: 'white', color: '#667eea', border: 'none', fontWeight: 'bold'}}
                onClick={() => document.getElementById('bulk-facility-upload').click()}
                disabled={isUploading}
              >
                {isUploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-images"></i> Select Multiple</>}
              </button>
            </div>
            <input
              type="file"
              id="bulk-facility-upload"
              accept="image/*"
              multiple
              style={{display: 'none'}}
              onChange={async (e) => {
                const files = Array.from(e.target.files).slice(0, 30);
                if (files.length === 0) return;
                
                setIsUploading(true);
                let uploaded = 0;
                
                try {
                  for (const file of files) {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('process_type', 'none');
                      
                      const API_URL = window.location.hostname === 'localhost' 
                        ? 'http://localhost:8000/api' 
                        : 'https://tx33akztgs.eu-west-2.awsapprunner.com/api';
                      
                      const response = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        addItem('facilitiesGalleryImages', { type: 'image', url: data.url, cropMode: 'uncropped' });
                        uploaded++;
                      }
                    } catch (error) {
                      console.error('Upload error for file:', file.name, error);
                    }
                  }
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                  alert(`✅ Successfully uploaded ${uploaded} of ${files.length} images!`);
                }
              }}
            />
          </div>
          
           <div style={{marginBottom:'15px'}}>
             <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
             <div style={{display: 'flex', gap: '15px'}}>
               <label style={{
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 cursor: 'pointer',
                 padding: '8px 16px',
                 background: facilityMediaInput.type === 'image' ? '#e6f7ff' : 'white',
                 border: `1px solid ${facilityMediaInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                 borderRadius: '4px'
               }}>
                 <input 
                   type="radio" 
                   name="facilityMediaType" 
                   value="image"
                   checked={facilityMediaInput.type === 'image'}
                   onChange={() => setFacilityMediaInput({...facilityMediaInput, type: 'image'})}
                   style={{cursor: 'pointer'}}
                 />
                 <span><i className="fa-solid fa-image"></i> Image</span>
               </label>
               <label style={{
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: '8px', 
                 cursor: 'pointer',
                 padding: '8px 16px',
                 background: facilityMediaInput.type === 'video' ? '#e6f7ff' : 'white',
                 border: `1px solid ${facilityMediaInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                 borderRadius: '4px'
               }}>
                 <input 
                   type="radio" 
                   name="facilityMediaType" 
                   value="video"
                   checked={facilityMediaInput.type === 'video'}
                   onChange={() => setFacilityMediaInput({...facilityMediaInput, type: 'video'})}
                   style={{cursor: 'pointer'}}
                 />
                 <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          


          {facilityMediaInput.type === 'video' ? (
             <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
               <div style={{display: 'flex', gap: '10px'}}>
                  <input 
                    type="text" 
                    placeholder="Paste Video URL (YouTube/Vimeo)..."
                    value={facilityMediaInput.url}
                    onChange={e => setFacilityMediaInput({...facilityMediaInput, url: e.target.value})}
                    style={{flex:1}}
                  />
                  <button className="btn" onClick={() => {
                    if(facilityMediaInput.url) { 
                      const newItem = { type: facilityMediaInput.type, url: facilityMediaInput.url };
                      addItem('facilitiesGalleryImages', newItem);
                      setFacilityMediaInput({...facilityMediaInput, url: ''});
                    }
                  }}><i className="fa-solid fa-plus"></i> Add URL</button>
               </div>
               
               <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                 <input
                    type="file"
                    accept="video/*"
                    id="facility-video-upload"
                    style={{display: 'none'}}
                    onChange={(e) => handleVideoUpload(e.target.files[0], 'facilitiesGalleryImages')}
                 />
                 <button 
                    className="btn ghost" 
                    onClick={() => document.getElementById('facility-video-upload').click()}
                    disabled={isUploading}
                 >
                    {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                 </button>
                 <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
               </div>
             </div>
           ) : (
              <EnhancedImageUploader
                label=""
                aspectRatio={16/9}
                onImageSelected={(url) => {
                   if (url) addItem('facilitiesGalleryImages', { type: 'image', url, cropMode: facilityMediaInput.cropMode });
                }}
                autoReset={true}
                allowSkipOnUpload={true}
                showCrop={true}
              />
           )}
         </div>
         
         {formData.facilitiesGalleryImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.facilitiesGalleryImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.facilitiesGalleryImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.facilitiesGalleryImages.length} 
                  field="facilitiesGalleryImages" 
                  onMove={moveItem}
                  onRemove={removeItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
           </>
         )}
      </div>
      </>
      )}

      {/* 4. Activities */}
      {((activeSection === 'all' && !isHomeAdmin) || activeSection === 'activities-gallery') && (
      <>
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-person-running"></i> Activities Gallery
      </div>
      <div className="field">
        <label>Add Activity Media</label>
        <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
          
          {/* Bulk Upload Section */}
          <div style={{marginBottom: '15px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
              <div>
                <strong style={{display: 'block', marginBottom: '5px', fontSize: '15px'}}>📦 Bulk Upload (Testing)</strong>
                <span style={{fontSize: '12px', opacity: 0.9}}>Upload up to 30 images at once</span>
              </div>
              <button 
                className="btn"
                style={{background: 'white', color: '#667eea', border: 'none', fontWeight: 'bold'}}
                onClick={() => document.getElementById('bulk-activity-upload').click()}
                disabled={isUploading}
              >
                {isUploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-images"></i> Select Multiple</>}
              </button>
            </div>
            <input
              type="file"
              id="bulk-activity-upload"
              accept="image/*"
              multiple
              style={{display: 'none'}}
              onChange={async (e) => {
                const files = Array.from(e.target.files).slice(0, 30);
                if (files.length === 0) return;
                
                setIsUploading(true);
                let uploaded = 0;
                
                try {
                  for (const file of files) {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('process_type', 'none');
                      
                      const API_URL = window.location.hostname === 'localhost' 
                        ? 'http://localhost:8000/api' 
                        : 'https://tx33akztgs.eu-west-2.awsapprunner.com/api';
                      
                      const response = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        addItem('activityImages', { type: 'image', url: data.url, cropMode: 'uncropped' });
                        uploaded++;
                      }
                    } catch (error) {
                      console.error('Upload error for file:', file.name, error);
                    }
                  }
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                  alert(`✅ Successfully uploaded ${uploaded} of ${files.length} images!`);
                }
              }}
            />
          </div>
          
          <div style={{marginBottom:'15px'}}>
            <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: activityMediaInput.type === 'image' ? '#e6f7ff' : 'white',
                border: `1px solid ${activityMediaInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="activityMediaType" 
                  value="image"
                  checked={activityMediaInput.type === 'image'}
                  onChange={() => setActivityMediaInput({...activityMediaInput, type: 'image'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-image"></i> Image</span>
              </label>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: activityMediaInput.type === 'video' ? '#e6f7ff' : 'white',
                border: `1px solid ${activityMediaInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="activityMediaType" 
                  value="video"
                  checked={activityMediaInput.type === 'video'}
                  onChange={() => setActivityMediaInput({...activityMediaInput, type: 'video'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          
          {activityMediaInput.type === 'video' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                   type="text" 
                   placeholder="Paste Video URL (YouTube/MP4)..."
                   value={activityMediaInput.url}
                   onChange={e => setActivityMediaInput({...activityMediaInput, url: e.target.value})}
                   style={{flex:1}}
                />
                <button className="btn" onClick={() => {
                  if(activityMediaInput.url) { 
                    const newItem = { type: activityMediaInput.type, url: activityMediaInput.url };
                    addItem('activityImages', newItem);
                    setActivityMediaInput({...activityMediaInput, url: ''});
                  }
                }}><i className="fa-solid fa-plus"></i> Add URL</button>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                <input
                   type="file"
                   accept="video/*"
                   id="activity-video-upload"
                   style={{display: 'none'}}
                   onChange={(e) => handleVideoUpload(e.target.files[0], 'activityImages')}
                />
                <button 
                   className="btn ghost" 
                   onClick={() => document.getElementById('activity-video-upload').click()}
                   disabled={isUploading}
                >
                   {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                </button>
                <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
              </div>
            </div>
          ) : (
            <EnhancedImageUploader
               label=""
               aspectRatio={16/9}
               onImageSelected={(url) => {
                  if (url) addItem('activityImages', { type: 'image', url, cropMode: activityMediaInput.cropMode });
               }}
               autoReset={true}
               allowSkipOnUpload={true}
               showCrop={true}
             />
          )}
        </div>
        
        {formData.activityImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.activityImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.activityImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.activityImages.length} 
                  field="activityImages"
                  label={i === 0 ? 'Main Card' : null}
                  onMove={moveItem}
                  onRemove={removeItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
           </>
         )}
      </div>
      </>
      )}

      {/* 4.5. Care Gallery */}
      {((activeSection === 'all' && !isHomeAdmin) || activeSection === 'care-gallery') && (
      <>
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-hand-holding-heart"></i> Care Gallery
      </div>
      
      <div className="field" style={{marginTop: '20px'}}>
        <label style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
           <span>Care Items</span>
           <button className="btn btn-primary small" onClick={() => addItem('careSectionsJson', { title: '', description: '', image: '', showOnPage: false })}>
             <i className="fa-solid fa-plus"></i> Add Care
           </button>
        </label>
        
        {formData.careSectionsJson && formData.careSectionsJson.length > 0 ? (
           <div style={{marginTop: '15px'}}>
             {formData.careSectionsJson.map((item, i) => (
               <CareSectionItem 
                 key={i} 
                 item={item} 
                 index={i} 
                 total={formData.careSectionsJson.length} 
                 field="careSectionsJson" 
                 onMove={moveItem}
                 onRemove={removeItem}
                 onUpdate={updateItem}
               />
             ))}
           </div>
        ) : (
           <div style={{padding: '30px', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc'}}>
              <p>No care items added yet.</p>
              <button className="btn ghost" onClick={() => addItem('careSectionsJson', { title: '', description: '', image: '', showOnPage: false })}>
                Add Care
              </button>
           </div>
        )}
      </div>
      </>
      )}

      {/* 5. Meet My Team (Gallery) */}
      {(activeSection === 'all' || activeSection === 'team-gallery') && (
      <>
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-users"></i> Meet My Team (Gallery)
      </div>
      <div className="field">
        <label>Add Team Gallery Media</label>
        <div style={{
           border: '2px dashed #e0e0e0',
           borderRadius: '8px',
           padding: '20px',
           backgroundColor: '#fafafa',
           marginBottom: '20px'
         }}>
          
          {/* Bulk Upload Section */}
          <div style={{marginBottom: '15px', padding: '15px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '8px', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px'}}>
              <div>
                <strong style={{display: 'block', marginBottom: '5px', fontSize: '15px'}}>📦 Bulk Upload (Testing)</strong>
                <span style={{fontSize: '12px', opacity: 0.9}}>Upload up to 30 images at once</span>
              </div>
              <button 
                className="btn"
                style={{background: 'white', color: '#667eea', border: 'none', fontWeight: 'bold'}}
                onClick={() => document.getElementById('bulk-team-upload').click()}
                disabled={isUploading}
              >
                {isUploading ? <><i className="fa-solid fa-spinner fa-spin"></i> Uploading...</> : <><i className="fa-solid fa-images"></i> Select Multiple</>}
              </button>
            </div>
            <input
              type="file"
              id="bulk-team-upload"
              accept="image/*"
              multiple
              style={{display: 'none'}}
              onChange={async (e) => {
                const files = Array.from(e.target.files).slice(0, 30);
                if (files.length === 0) return;
                
                setIsUploading(true);
                let uploaded = 0;
                
                try {
                  for (const file of files) {
                    try {
                      const formData = new FormData();
                      formData.append('file', file);
                      formData.append('process_type', 'none');
                      
                      const API_URL = window.location.hostname === 'localhost' 
                        ? 'http://localhost:8000/api' 
                        : 'https://tx33akztgs.eu-west-2.awsapprunner.com/api';
                      
                      const response = await fetch(`${API_URL}/upload`, {
                        method: 'POST',
                        body: formData,
                      });
                      
                      if (response.ok) {
                        const data = await response.json();
                        addItem('teamGalleryImages', { type: 'image', url: data.url, cropMode: 'uncropped' });
                        uploaded++;
                      }
                    } catch (error) {
                      console.error('Upload error for file:', file.name, error);
                    }
                  }
                } finally {
                  setIsUploading(false);
                  e.target.value = '';
                  alert(`✅ Successfully uploaded ${uploaded} of ${files.length} images!`);
                }
              }}
            />
          </div>
          
          <div style={{marginBottom:'15px'}}>
            <label style={{fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block'}}>Media Type</label>
            <div style={{display: 'flex', gap: '15px'}}>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: teamGalleryInput.type === 'image' ? '#e6f7ff' : 'white',
                border: `1px solid ${teamGalleryInput.type === 'image' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="teamMediaType" 
                  value="image"
                  checked={teamGalleryInput.type === 'image'}
                  onChange={() => setTeamGalleryInput({...teamGalleryInput, type: 'image'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-image"></i> Image</span>
              </label>
              <label style={{
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                cursor: 'pointer',
                padding: '8px 16px',
                background: teamGalleryInput.type === 'video' ? '#e6f7ff' : 'white',
                border: `1px solid ${teamGalleryInput.type === 'video' ? '#1890ff' : '#d9d9d9'}`,
                borderRadius: '4px'
              }}>
                <input 
                  type="radio" 
                  name="teamMediaType" 
                  value="video"
                  checked={teamGalleryInput.type === 'video'}
                  onChange={() => setTeamGalleryInput({...teamGalleryInput, type: 'video'})}
                  style={{cursor: 'pointer'}}
                />
                <span><i className="fa-solid fa-video"></i> Video</span>
              </label>
            </div>
          </div>
          

          
          {teamGalleryInput.type === 'video' ? (
            <div style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
              <div style={{display: 'flex', gap: '10px'}}>
                <input 
                  type="text" 
                  placeholder="Paste Video URL..."
                  value={teamGalleryInput.url}
                  onChange={e => setTeamGalleryInput({...teamGalleryInput, url: e.target.value})}
                  style={{flex:1}}
                />
                <button className="btn" onClick={() => {
                  if(teamGalleryInput.url) { 
                    const newItem = { type: teamGalleryInput.type, url: teamGalleryInput.url };
                    addItem('teamGalleryImages', newItem);
                    setTeamGalleryInput({...teamGalleryInput, url: ''});
                  }
                }}><i className="fa-solid fa-plus"></i> Add URL</button>
              </div>
              
              <div style={{display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', background: 'white', borderRadius: '4px', border: '1px solid #eee'}}>
                <input
                   type="file"
                   accept="video/*"
                   id="team-video-upload"
                   style={{display: 'none'}}
                   onChange={(e) => handleVideoUpload(e.target.files[0], 'teamGalleryImages')}
                />
                <button 
                   className="btn ghost" 
                   onClick={() => document.getElementById('team-video-upload').click()}
                   disabled={isUploading}
                >
                   {isUploading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-upload"></i>} Upload Video File
                </button>
                <span className="muted" style={{fontSize: '12px'}}>Supports MP4, WebM (Max 50MB)</span>
              </div>
            </div>
          ) : (
            <EnhancedImageUploader
              label=""
              aspectRatio={16/9}
              onImageSelected={(url) => {
                 if (url) addItem('teamGalleryImages', { type: 'image', url, cropMode: teamGalleryInput.cropMode });
              }}
              autoReset={true}
              allowSkipOnUpload={true}
              showCrop={true}
            />
          )}
        </div>
        
        {formData.teamGalleryImages.length > 0 && (
           <>
            <label style={{marginBottom: '10px', display: 'block'}}>{formData.teamGalleryImages.length} Items in Gallery</label>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {formData.teamGalleryImages.map((item, i) => (
                <GalleryItem 
                  key={i} 
                  item={item} 
                  index={i} 
                  total={formData.teamGalleryImages.length} 
                  field="teamGalleryImages"
                  onMove={moveItem}
                  onRemove={removeItem}
                  onUpdate={updateItem}
                />
              ))}
            </div>
           </>
         )}
      </div>
      </>
      )}

      {/* 6. My Team (Position) */}
      {(activeSection === 'all' || activeSection === 'team-positions') && (
      <>
      <div className="group-title" style={{marginTop:'40px', marginBottom:'10px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
        <i className="fa-solid fa-user-doctor"></i> My Team Position
      </div>
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #eee',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <div className="grid cols-2" style={{alignItems:'start', gap: '20px'}}>
          <div>
            <div className="field">
              <label>Name</label>
              <input 
                value={teamInput.name} 
                onChange={e => setTeamInput({...teamInput, name: e.target.value})} 
                type="text" 
                placeholder="Full Name"
              />
            </div>
            <div className="field">
              <label>Role</label>
              <input 
                value={teamInput.role} 
                onChange={e => setTeamInput({...teamInput, role: e.target.value})} 
                type="text" 
                placeholder="Manager / Nurse"
              />
            </div>
          </div>
          <div>
            <EnhancedImageUploader
              label="Member Photo"
              aspectRatio={1}
              initialValue={teamInput.image}
              onImageSelected={(url) => setTeamInput({...teamInput, image: url})}
              autoReset={false}
              allowSkipOnUpload={true}
              showCrop={true}
            />
          </div>
        </div>
        <button className="btn" style={{marginTop:'10px'}} onClick={() => {
          if(teamInput.name && teamInput.role) {
            addItem('teamMembers', teamInput);
            setTeamInput({name:'', role:'', image:''});
          } else {
            alert('Please enter Name and Role');
          }
        }}><i className="fa-solid fa-plus"></i> Add Team Member</button>
      </div>
      
      {formData.teamMembers.length > 0 && (
        <div style={{marginTop:'20px'}}>
          <label style={{marginBottom: '10px', display: 'block'}}>{formData.teamMembers.length} Members Added</label>
          <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
            {formData.teamMembers.map((m, i) => (
              <div key={i} style={{
                background:'white', 
                padding:'10px', 
                borderRadius:'8px', 
                display:'flex', 
                alignItems:'center', 
                gap:'15px',
                border: '1px solid #ddd',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}>
                <div style={{width:'50px', height:'50px', borderRadius:'50%', overflow:'hidden', background:'#eee', border:'1px solid #ddd'}}>
                   <img src={m.image || 'https://via.placeholder.com/50'} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
                </div>
                <div style={{flex:1}}>
                  <strong style={{fontSize:'16px', color:'#2c5aa0'}}>{m.name}</strong>
                  <div className="muted">{m.role}</div>
                </div>
                <div style={{display:'flex', gap:'5px'}}>
                  <button className="btn ghost small icon-only" disabled={i === 0} onClick={() => moveItem('teamMembers', i, 'up')}><i className="fa-solid fa-arrow-up"></i></button>
                  <button className="btn ghost small icon-only" disabled={i === formData.teamMembers.length - 1} onClick={() => moveItem('teamMembers', i, 'down')}><i className="fa-solid fa-arrow-down"></i></button>
                  <button className="btn ghost small icon-only" style={{color:'red'}} onClick={() => removeItem('teamMembers', i)}><i className="fa-solid fa-trash"></i></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </>
      )}
      </div>

      <div className="toolbar" style={{marginTop:'40px', paddingTop: '20px', borderTop: '1px solid #eee'}}>
        <div className="right"></div>
        <button className="btn" onClick={() => {
          if (onSave) {
            onSave(formData);
          } else {
            alert(`${mode === 'add' ? 'Added' : 'Updated'} successfully! (Prototype)`);
          }
        }}>
          <i className={mode === 'add' ? "fa-solid fa-plus" : "fa-solid fa-save"}></i>&nbsp;{mode === 'add' ? 'Add Home' : 'Update Home'}
        </button>
      </div>
    </section>
  );
};

export default HomeForm;
