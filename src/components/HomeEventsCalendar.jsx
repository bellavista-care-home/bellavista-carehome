import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEvents } from '../services/eventService';
import './HomeEventsCalendar.css';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const HomeEventsCalendar = ({ locationName, homeName }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [modalEvent, setModalEvent] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      const data = await fetchEvents(locationName);
      if (mounted) {
        setEvents(data);
        setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [locationName]);

  useEffect(() => {
    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const d = String(selectedDate.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${d}`;
    setSelectedEvents(events.filter(e => e.date === dateStr));
  }, [selectedDate, events]);

  const getDaysInMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date) =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const changeMonth = (inc) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + inc);
    setCurrentDate(d);
  };

  const handleDateClick = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="hec-day hec-day--empty" />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
      const y = checkDate.getFullYear();
      const m = String(checkDate.getMonth() + 1).padStart(2, '0');
      const d = String(checkDate.getDate()).padStart(2, '0');
      const formattedDate = `${y}-${m}-${d}`;
      const hasEvents = events.some(e => e.date === formattedDate);

      const isSelected =
        selectedDate.getDate() === i &&
        selectedDate.getMonth() === currentDate.getMonth() &&
        selectedDate.getFullYear() === currentDate.getFullYear();

      const isToday = new Date().toDateString() === checkDate.toDateString();

      days.push(
        <div
          key={i}
          className={[
            'hec-day',
            hasEvents ? 'hec-day--has-events' : '',
            isSelected ? 'hec-day--selected' : '',
            isToday ? 'hec-day--today' : '',
          ].filter(Boolean).join(' ')}
          onClick={() => handleDateClick(i)}
        >
          <span className="hec-day__num">{i}</span>
          {hasEvents && <span className="hec-day__dot" />}
        </div>
      );
    }
    return days;
  };

  const formatTime = (t) => {
    if (!t) return 'All Day';
    const [h, min] = t.split(':');
    let hour = parseInt(h, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    if (hour > 12) hour -= 12;
    if (hour === 0) hour = 12;
    return `${hour}:${min} ${period}`;
  };

  return (
    <section className="hec-section loc-section loc-section--light">
      <div className="container">
        <div className="section-header section-header--center" style={{ marginBottom: '2.5rem' }}>
          <span className="section-header__subtitle">What's On</span>
          <h2 className="section-header__title">Events & Activities</h2>
        </div>

        <div className="hec-layout">
          {/* ---- Calendar ---- */}
          <div className="hec-calendar">
            <div className="hec-cal-header">
              <button className="hec-nav-btn" onClick={() => changeMonth(-1)} aria-label="Previous month">
                <i className="fas fa-chevron-left" />
              </button>
              <h3 className="hec-month-title">
                {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button className="hec-nav-btn" onClick={() => changeMonth(1)} aria-label="Next month">
                <i className="fas fa-chevron-right" />
              </button>
            </div>

            <div className="hec-grid">
              {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                <div key={d} className="hec-weekday">{d}</div>
              ))}
              {renderCalendar()}
            </div>
          </div>

          {/* ---- Events Panel ---- */}
          <div className="hec-panel">
            <div className="hec-panel-header">
              <i className="fas fa-calendar-day hec-panel-icon" />
              <div>
                <p className="hec-panel-date">
                  {selectedDate.toLocaleDateString('en-GB', {
                    weekday: 'long', day: 'numeric', month: 'long'
                  })}
                </p>
                <p className="hec-panel-home">{homeName}</p>
              </div>
            </div>

            <div className="hec-events-list">
              {loading ? (
                <p className="hec-empty"><i className="fas fa-spinner fa-spin" /> Loading events…</p>
              ) : selectedEvents.length > 0 ? (
                selectedEvents.map(event => (
                  <div
                    key={event.id}
                    className="hec-event-item"
                    onClick={() => setModalEvent(event)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && setModalEvent(event)}
                  >
                    {event.image && (
                      <img src={event.image} alt={event.title} className="hec-event-img" />
                    )}
                    <div className="hec-event-body">
                      <span className="hec-event-time">
                        <i className="fas fa-clock" />
                        {event.startTime
                          ? `${formatTime(event.startTime)}${event.endTime ? ` – ${formatTime(event.endTime)}` : ''}`
                          : formatTime(event.time)
                        }
                      </span>
                      <h5 className="hec-event-title">{event.title}</h5>
                      {event.description && (
                        <div
                          className="hec-event-desc"
                          dangerouslySetInnerHTML={{ __html: event.description }}
                        />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="hec-empty">
                  <i className="fas fa-calendar-times hec-empty-icon" />
                  <p>No events scheduled for this day.</p>
                  <p className="hec-empty-hint">Select a highlighted date to view events.</p>
                </div>
              )}
            </div>

            <div className="hec-panel-footer">
              <Link to="/events" className="hec-view-all">
                <i className="fas fa-calendar-alt" /> View Full Calendar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      {modalEvent && (
        <div className="hec-modal-overlay" onClick={() => setModalEvent(null)}>
          <div className="hec-modal" onClick={e => e.stopPropagation()}>
            <button className="hec-modal-close" onClick={() => setModalEvent(null)}>
              <i className="fas fa-times" />
            </button>
            {modalEvent.image && (
              <img src={modalEvent.image} alt={modalEvent.title} className="hec-modal-img" />
            )}
            <div className="hec-modal-content">
              <span className="hec-modal-time">
                <i className="fas fa-clock" />
                {modalEvent.startTime
                  ? `${formatTime(modalEvent.startTime)}${modalEvent.endTime ? ` – ${formatTime(modalEvent.endTime)}` : ''}`
                  : formatTime(modalEvent.time)
                }
              </span>
              <h3 className="hec-modal-title">{modalEvent.title}</h3>
              {modalEvent.location && (
                <p className="hec-modal-location">
                  <i className="fas fa-map-marker-alt" /> {modalEvent.location}
                </p>
              )}
              {modalEvent.description && (
                <div
                  className="hec-modal-desc"
                  dangerouslySetInnerHTML={{ __html: modalEvent.description }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default HomeEventsCalendar;
