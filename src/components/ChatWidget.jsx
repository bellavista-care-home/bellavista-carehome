import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { event } from '../utils/analytics';
import '../styles/ChatWidget.css';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const widgetRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // Track chat widget usage
    event('chat_widget_toggle', {
      action: isOpen ? 'close' : 'open',
      widget_type: 'quick_links'
    });
  };

  // Close widget when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="chat-widget" ref={widgetRef}>
      <button
        type="button"
        className="chat-button"
        onClick={toggleChat}
        aria-label={isOpen ? "Close quick links panel" : "Open quick links panel"}
        aria-expanded={isOpen}
        aria-controls="chat-widget-panel"
      >
        <i className="fas fa-comments" aria-hidden="true"></i>
        <div className="chat-tooltip">Ask a Question</div>
      </button>
      <div
        id="chat-widget-panel"
        className={`chat-popup ${isOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="false"
        aria-label="Quick links for enquiries and contact"
      >
        <div className="chat-header">
          <h4>How can we help you?</h4>
          <button
            type="button"
            className="chat-close"
            onClick={toggleChat}
            aria-label="Close quick links panel"
          >
            <i className="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        <div className="chat-options">
          <Link 
            to="/enquiry" 
            className="chat-option"
            onClick={() => event('chat_option_click', { option: 'care_enquiry', widget_type: 'quick_links' })}
          >
            <i className="fas fa-heart"></i>
            <span>Care Enquiry</span>
          </Link>
          <Link 
            to="/schedule-tour" 
            className="chat-option"
            onClick={() => event('chat_option_click', { option: 'schedule_tour', widget_type: 'quick_links' })}
          >
            <i className="fas fa-calendar"></i>
            <span>Schedule Tour</span>
          </Link>
          <Link 
            to="/contact" 
            className="chat-option"
            onClick={() => event('chat_option_click', { option: 'call_us', widget_type: 'quick_links' })}
          >
            <i className="fas fa-phone"></i>
            <span>Call Us</span>
          </Link>
          <Link 
            to="/faq" 
            className="chat-option"
            onClick={() => event('chat_option_click', { option: 'faq', widget_type: 'quick_links' })}
          >
            <i className="fas fa-question-circle"></i>
            <span>FAQ</span>
          </Link>
          <Link 
            to="/contact" 
            className="chat-option emergency"
            onClick={() => event('chat_option_click', { option: 'emergency', widget_type: 'quick_links' })}
          >
            <i className="fas fa-ambulance"></i>
            <span>Emergency</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ChatWidget;
