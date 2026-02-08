import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEO from '../components/SEO';
import { fetchEvents } from '../services/eventService';
import '../styles/Events.css';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    // Filter events for the selected date
    // Use local date parts to construct YYYY-MM-DD string to match backend storage
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const daysEvents = events.filter(e => e.date === dateStr);
    setSelectedEvents(daysEvents);
  }, [selectedDate, events]);

  const loadEvents = async () => {
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (error) {
      console.error('Failed to load events', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    return days;
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (increment) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + increment);
    setCurrentDate(newDate);
  };

  const handleDateClick = (day) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    // Adjust for timezone offset to ensure correct YYYY-MM-DD comparison
    // Actually, simpler to just keep it as a Date object and format when filtering
    // But we need to be careful with timezones.
    // Let's treat everything as local date for simplicity in this context
    // or use UTC if the backend stores YYYY-MM-DD string strictly.
    // Backend stores "YYYY-MM-DD" string.
    // So let's construct a local date that produces that string.
    
    // We'll just set selectedDate to this local date.
    setSelectedDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for previous month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), i).toISOString().split('T')[0];
      // Check if there are events on this day (ignoring time)
      // Note: This simple ISOString split might be off by one day depending on timezone vs UTC.
      // Better approach:
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const year = checkDate.getFullYear();
      const month = String(checkDate.getMonth() + 1).padStart(2, '0');
      const day = String(checkDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const hasEvents = events.some(e => e.date === formattedDate);
      const isSelected = selectedDate && 
        selectedDate.getDate() === i && 
        selectedDate.getMonth() === currentDate.getMonth() && 
        selectedDate.getFullYear() === currentDate.getFullYear();
      
      const isToday = new Date().toDateString() === checkDate.toDateString();

      days.push(
        <div 
          key={i} 
          className={`calendar-day ${hasEvents ? 'has-events' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
          onClick={() => handleDateClick(i)}
        >
          <span className="day-number">{i}</span>
          {hasEvents && <div className="event-dot"></div>}
        </div>
      );
    }

    return days;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <SEO 
        title="Calendar of Events | Bellavista Nursing Homes"
        description="View our upcoming events, activities, and celebrations at Bellavista Nursing Homes."
      />
      {/* Header is already included in App.jsx */}
      <div className="events-page">
        <section className="hero-section small-hero">
          <div className="hero-content">
            <h1>Calendar of Events</h1>
            <p>Join us in our daily activities and special celebrations</p>
          </div>
        </section>

        <section className="calendar-container-wrapper">
          <div className="calendar-layout">
            <div className="calendar-section">
              <div className="calendar-header">
                <button onClick={() => changeMonth(-1)}><i className="fas fa-chevron-left"></i></button>
                <h2>{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
                <button onClick={() => changeMonth(1)}><i className="fas fa-chevron-right"></i></button>
              </div>
              <div className="calendar-grid">
                <div className="weekday">Sun</div>
                <div className="weekday">Mon</div>
                <div className="weekday">Tue</div>
                <div className="weekday">Wed</div>
                <div className="weekday">Thu</div>
                <div className="weekday">Fri</div>
                <div className="weekday">Sat</div>
                {renderCalendar()}
              </div>
            </div>

            <div className="events-list-section">
              <h3>Events for {selectedDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
              <h4 className="daily-subheading" style={{ color: '#565449', fontSize: '1rem', marginTop: '-1rem', marginBottom: '1.5rem', fontWeight: 'normal' }}>
                Daily Schedule
              </h4>
              
              {loading ? (
                <div className="loading-spinner">Loading events...</div>
              ) : selectedEvents.length > 0 ? (
                <div className="daily-events-list">
                  {selectedEvents.map(event => (
                    <div key={event.id} className="event-card-small">
                      {event.image && (
                        <div className="event-image">
                          <img src={event.image} alt={event.title} />
                        </div>
                      )}
                      <div className="event-details">
                        <span className="event-time">{event.time}</span>
                        <h4>{event.title}</h4>
                        <p className="event-location"><i className="fas fa-map-marker-alt"></i> {event.location}</p>
                        {event.description && <p className="event-desc">{event.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-events">
                  <p>No events scheduled for this day.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="upcoming-events-section">
          <div className="container">
            <h2>Upcoming Highlights</h2>
            <div className="events-grid">
              {events
                .filter(e => new Date(e.date) >= new Date())
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3)
                .map(event => (
                  <div key={event.id} className="event-card">
                    <div className="event-date-badge">
                      <span className="day">{new Date(event.date).getDate()}</span>
                      <span className="month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                    </div>
                    {event.image && (
                      <div className="card-image">
                        <img src={event.image} alt={event.title} />
                      </div>
                    )}
                    <div className="card-content">
                      <h3>{event.title}</h3>
                      <div className="event-details">
                        <span><i className="fas fa-clock"></i> {event.time || 'All Day'}</span>
                        <span><i className="fas fa-map-marker-alt"></i> {event.location || 'All Locations'}</span>
                      </div>
                      <div className="event-description">
                        {event.description && <div className="event-desc" dangerouslySetInnerHTML={{ __html: event.description }} />}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
      </div>
      {/* Footer is already included in App.jsx */}
    </>
  );
};

export default Events;
