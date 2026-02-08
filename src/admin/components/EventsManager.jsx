
import React, { useState, useEffect } from 'react';
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';
import EnhancedImageUploader from '../../components/EnhancedImageUploader';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const EventsManager = ({ notify }) => {
  const [events, setEvents] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    image: '',
    category: 'general'
  });

  // Locations options
  const locationOptions = [
    "Bellavista Barry",
    "Bellavista Cardiff",
    "Waverley Care Centre",
    "College Fields Nursing Home",
    "Baltimore Care Home",
    "Meadow Vale Cwtch",
    "All Locations"
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const data = await fetchEvents();
    setEvents(data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    // Join multiple locations with a comma
    setCurrentEvent(prev => ({ ...prev, location: selectedOptions.join(', ') }));
  };

  const handleImageChange = (url) => {
    setCurrentEvent(prev => ({ ...prev, image: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await updateEvent(currentEvent.id, currentEvent);
        notify('Event updated successfully', 'success');
      } else {
        await createEvent(currentEvent);
        notify('Event created successfully', 'success');
      }
      setIsEditing(false);
      resetForm();
      loadEvents();
    } catch (error) {
      notify('Failed to save event', 'error');
    }
  };

  const handleEdit = (event) => {
    setCurrentEvent(event);
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        notify('Event deleted successfully', 'success');
        loadEvents();
      } catch (error) {
        notify('Failed to delete event', 'error');
      }
    }
  };

  const resetForm = () => {
    setCurrentEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      image: '',
      category: 'general'
    });
    setIsEditing(false);
  };

  return (
    <div className="events-manager">
      <div className="admin-header">
        <h2>Manage Events</h2>
        <p>Add and manage upcoming events for the calendar.</p>
      </div>

      <div className="panel">
        <h3>{isEditing ? 'Edit Event' : 'Add New Event'}</h3>
        <form onSubmit={handleSubmit} className="admin-form">
          <div className="grid cols-2">
            <div className="field">
              <label>Event Title</label>
              <input
                type="text"
                name="title"
                value={currentEvent.title}
                onChange={handleInputChange}
                required
                placeholder="e.g. Summer Garden Party"
              />
            </div>
            <div className="field">
              <label>Category</label>
              <select name="category" value={currentEvent.category} onChange={handleInputChange}>
                <option value="general">General</option>
                <option value="entertainment">Entertainment</option>
                <option value="outing">Outing</option>
                <option value="celebration">Celebration</option>
                <option value="religious">Religious Service</option>
              </select>
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={currentEvent.date}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Time field removed as requested */}
            {/* 
            <div className="field">
              <label>Time</label>
              <input
                type="time"
                name="time"
                value={currentEvent.time}
                onChange={handleInputChange}
              />
            </div>
            */}
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Location (Hold Ctrl/Cmd to select multiple)</label>
              <select 
                multiple 
                name="location" 
                value={currentEvent.location ? currentEvent.location.split(', ') : []} 
                onChange={handleLocationChange}
                style={{ height: '120px' }}
              >
                {locationOptions.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <label>Description</label>
              <ReactQuill
                theme="snow"
                value={currentEvent.description}
                onChange={(val) => setCurrentEvent(prev => ({ ...prev, description: val }))}
                placeholder="Event details..."
                style={{ height: '200px', marginBottom: '50px' }}
              />
            </div>
            <div className="field" style={{ gridColumn: '1 / -1' }}>
              <EnhancedImageUploader
                label="Event Image"
                initialValue={currentEvent.image}
                onImageSelected={handleImageChange}
                aspectRatio={16/9}
              />
            </div>
          </div>
          <div className="form-actions">
            {isEditing && (
              <button type="button" className="btn ghost" onClick={resetForm}>
                Cancel
              </button>
            )}
            <button type="submit" className="btn btn-primary">
              {isEditing ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>

      <div className="panel" style={{ marginTop: '30px' }}>
        <h3>Upcoming Events</h3>
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Location</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No events found.</td>
                </tr>
              ) : (
                events.map(event => (
                  <tr key={event.id}>
                    <td>{event.date} {event.time}</td>
                    <td>{event.title}</td>
                    <td>{event.location}</td>
                    <td>
                      <span className={`badge badge-${event.category}`}>{event.category}</span>
                    </td>
                    <td>
                      <button className="btn-icon" onClick={() => handleEdit(event)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon delete" onClick={() => handleDelete(event.id)} title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventsManager;
