import React, { useState, useEffect, useCallback } from 'react';
import { fetchCareServices, createCareService, updateCareService, deleteCareService } from '../../services/careService';
import EnhancedImageUploader from '../../components/EnhancedImageUploader';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const CareServiceItem = ({ item, index, total, onMove, onRemove, onUpdate }) => {
    const title = item.title || '';
    const description = item.description || '';
    // imagesJson is a JSON string or array in the parent state?
    // The parent should parse it. Let's assume item.images is an array of URLs.
    const image = (item.images && item.images.length > 0) ? item.images[0] : '';
    const showOnPage = item.showOnPage !== false; // Default true

    const [isExpanded, setIsExpanded] = useState(false);

    const handleImageUpload = (url) => {
        // We only support 1 image now.
        onUpdate(item.id, { images: [url] });
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
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ background: '#667eea', color: 'white', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>{index + 1}</span>
                    {title || 'Untitled Care Service'}
                    {showOnPage && <span style={{ fontSize: '10px', background: '#28a745', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>Visible</span>}
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                        type="button"
                        className="btn ghost small icon-only"
                        disabled={index === 0}
                        onClick={() => onMove(index, 'up')}
                        aria-label="Move service up"
                    >
                        <i className="fa-solid fa-chevron-up" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="btn ghost small icon-only"
                        disabled={index === total - 1}
                        onClick={() => onMove(index, 'down')}
                        aria-label="Move service down"
                    >
                        <i className="fa-solid fa-chevron-down" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="btn ghost small icon-only"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-label={isExpanded ? "Collapse service details" : "Expand service details"}
                    >
                        <i className="fa-solid fa-pencil" aria-hidden="true"></i>
                    </button>
                    <button
                        type="button"
                        className="btn ghost small icon-only"
                        style={{ color: '#ff4757', borderColor: '#ff4757' }}
                        onClick={() => onRemove(item.id)}
                        aria-label="Delete service"
                    >
                        <i className="fa-solid fa-trash" aria-hidden="true"></i>
                    </button>
                </div>
            </div>

            {isExpanded && (
                <div style={{ padding: '20px' }}>
                    <div className="field">
                        <label>Title</label>
                        <input type="text" value={title} onChange={(e) => onUpdate(item.id, { title: e.target.value })} placeholder="e.g. Dementia Care" />
                    </div>

                    <div className="field">
                        <label>Image (Standard size: 16:9)</label>
                        <EnhancedImageUploader
                            label="Click to upload or drag and drop"
                            aspectRatio={16 / 9}
                            initialValue={image}
                            onImageSelected={handleImageUpload}
                            showCrop={true}
                            allowSkipOnUpload={true}
                        />
                    </div>

                    <div className="field">
                        <label>Full Description (Modal)</label>
                        <ReactQuill theme="snow" value={description} onChange={(val) => onUpdate(item.id, { description: val })} style={{ height: '200px', marginBottom: '50px' }} />
                    </div>

                    <div className="field">
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', fontWeight: 'bold', color: '#28a745' }}>
                            <input type="checkbox" checked={showOnPage} onChange={(e) => onUpdate(item.id, { showOnPage: e.target.checked })} style={{ marginRight: '8px', width: 'auto' }} />
                            Show on Care Page
                        </label>
                    </div>
                </div>
            )}
        </div>
    );
};

const CareServiceManager = ({ notify }) => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadServices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchCareServices();
            // Ensure data has correct structure
            const processed = data.map(s => ({
                ...s,
                images: Array.isArray(s.images) ? s.images : [],
                showOnPage: s.showOnPage !== undefined ? s.showOnPage : true
            }));
            setServices(processed);
        } catch (error) {
            console.error(error);
            notify('Failed to load services', 'error');
        } finally {
            setLoading(false);
        }
    }, [notify]);

    const handleAddService = async () => {
        const newService = {
            title: 'New Care Service',
            description: '',
            images: [],
            showOnPage: true,
            order: services.length + 1
        };

        try {
            const res = await createCareService(newService);
            // Reload to get the ID and everything
            if (res && res.id) {
                // Optimistic update or reload? Reload is safer to get ID.
                // But we can also just append.
                // Let's reload to be safe.
                loadServices();
                notify('Service added', 'success');
            }
        } catch {
            notify('Failed to add service', 'error');
        }
    };

    const handleUpdate = async (id, updates) => {
        // Update local state first for responsiveness
        setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));

        // Debounce or just save?
        // Since we are inside the item component, sending requests on every keystroke (like title) is bad.
        // But ReactQuill onChange is also frequent.
        // However, the previous implementation of HomeForm was local state + Save button.
        // Here I am trying to mix it.
        // Let's rely on a "Save Changes" button for the whole list?
        // No, `CareSectionItem` in `HomeForm` was local state until "Update Home" was clicked.
        // Here, we are managing individual resources.
        // If I want to match `HomeForm` UX, I should probably not auto-save on every keystroke.
        // But `CareServiceManager` works with API.
        // I will implement a "Save All" button at the bottom.
        // But wait, `createCareService` creates it on the server.
        // So the items exist on the server.
        // If I edit them locally, I need to push updates.
        // I will add a "Save Changes" button.
    };
    
    // We need a separate state for "modified" services or just diff?
    // Simpler: Just save everything on "Save Changes".
    
    const saveAllChanges = async () => {
        setLoading(true);
        try {
            const updates = services.map((s, idx) => ({
                ...s,
                order: idx + 1
            }));
            await Promise.all(updates.map(s => updateCareService(s.id, s)));
            notify('All changes saved successfully', 'success');
            loadServices();
        } catch {
            notify('Failed to save changes', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Are you sure you want to delete this service?')) return;
        try {
            await deleteCareService(id);
            setServices(prev => prev.filter(s => s.id !== id));
            notify('Service deleted', 'success');
        } catch {
            notify('Failed to delete service', 'error');
        }
    };

    useEffect(() => {
        loadServices();
    }, [loadServices]);

    const handleMove = (index, direction) => {
        const newServices = [...services];
        if (direction === 'up' && index > 0) {
            [newServices[index], newServices[index - 1]] = [newServices[index - 1], newServices[index]];
        } else if (direction === 'down' && index < newServices.length - 1) {
            [newServices[index], newServices[index + 1]] = [newServices[index + 1], newServices[index]];
        }
        setServices(newServices);
        // Note: Order is not saved until "Save Changes" is clicked.
    };

    if (loading && services.length === 0) return <div>Loading...</div>;

    return (
        <div className="admin-section">
            <div className="section-header">
                <h2>Global Care Services</h2>
                <button className="btn btn-primary" onClick={handleAddService}>
                    <i className="fas fa-plus"></i> Add Care
                </button>
            </div>

            <div className="care-services-list">
                {services.map((service, index) => (
                    <CareServiceItem
                        key={service.id}
                        item={service}
                        index={index}
                        total={services.length}
                        onMove={handleMove}
                        onRemove={handleRemove}
                        onUpdate={handleUpdate}
                    />
                ))}
            </div>

            {services.length > 0 && (
                <div className="form-actions" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                    <button className="btn btn-primary" onClick={saveAllChanges} disabled={loading}>
                        {loading ? 'Saving...' : 'Save All Changes'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default CareServiceManager;
