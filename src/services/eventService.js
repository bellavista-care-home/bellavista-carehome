
import { API_URL } from '../config/apiConfig';
import { getAuthHeaders } from './authService';

export const fetchEvents = async () => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to create event');
    return await response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id, eventData) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(eventData),
    });
    if (!response.ok) throw new Error('Failed to update event');
    return await response.json();
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return await response.json();
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
