
import * as authService from './authService';
import { API_URL } from '../config/apiConfig';

// Use relative paths for all requests - Vite proxy will route to appropriate backend
const API_BASE = API_URL;
const SERVER_URL = '';

function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  if (path.startsWith('/')) return `${SERVER_URL}${path}`;
  return path;
}

function dataURItoBlob(dataURI) {
  try {
    if (!dataURI || typeof dataURI !== 'string') return null;
    
    // Check if it's already a blob url or http url (not base64)
    if (dataURI.startsWith('blob:') || dataURI.startsWith('http')) {
      console.log('dataURItoBlob: Input is already a URL, skipping conversion:', dataURI.substring(0, 50) + '...');
      return null;
    }

    const splitData = dataURI.split(',');
    if (splitData.length < 2) return null;
    
    const byteString = atob(splitData[1]);
    const mimeString = splitData[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    
    return new Blob([ab], { type: mimeString });
  } catch (e) {
    console.error('Error converting data URI to blob:', e);
    return null;
  }
}

export async function fetchNewsItems() {
  if (!API_BASE) return [];
  try {
    const res = await fetch(`${API_BASE}/news`);
    if (!res.ok) throw new Error('Failed to fetch news');
    const items = await res.json();
    console.log('fetchNewsItems: Retrieved items count:', items.length);
    items.forEach((item, index) => {
      console.log(`fetchNewsItems: Item ${index} - Title: "${item.title}", Excerpt length: ${item.excerpt?.length || 0}, Preview: "${item.excerpt?.substring(0, 50)}..."`);
    });
    return items.map(item => ({
      ...item,
      image: resolveImageUrl(item.image),
      gallery: item.gallery ? item.gallery.map(resolveImageUrl) : []
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function createNewsItem(item) {
  console.log('createNewsItem: Starting upload...', { title: item.title, shortDescription: item.shortDescription, date: item.date, location: item.location, image: item.image ? '[REDACTED]' : null, galleryCount: Array.isArray(item.gallery) ? item.gallery.length : 0 });
  console.log('createNewsItem: Using API_BASE:', API_BASE);
  if (!API_BASE) {
    console.error('createNewsItem: API_BASE is missing!');
    return null;
  }
  
  try {
    const formData = new FormData();
    Object.keys(item).forEach(key => {
      if (key === 'image' || key === 'gallery') return;
      formData.append(key, item[key]);
    });

    // Handle Main Image
    const mainImageBlob = dataURItoBlob(item.image);
    if (mainImageBlob) {
      console.log('createNewsItem: Main image converted to blob', mainImageBlob.size, mainImageBlob.type);
      formData.append('image', mainImageBlob, 'main-image.jpg');
    } else if (item.image) {
      console.log('createNewsItem: Main image is string/url', String(item.image).substring(0, 50));
      formData.append('image', item.image);
    }

    // Handle Gallery Images
    console.log('createNewsItem: Processing gallery...');
    const galleryUrls = [];
    if (Array.isArray(item.gallery)) {
      item.gallery.forEach((img, idx) => {
        const blob = dataURItoBlob(img);
        if (blob) {
          console.log(`createNewsItem: Gallery image ${idx} converted to blob`, blob.size);
          formData.append(`gallery_${idx}`, blob, `gallery-${idx}.jpg`);
        } else if (img) {
          galleryUrls.push(img);
        }
      });
      formData.append('gallery', JSON.stringify(galleryUrls));
    }

    const url = `${API_BASE}/news`;
    console.log('createNewsItem: Sending POST request to:', url);
    const res = await fetch(url, {
      method: 'POST',
      headers: authService.getAuthHeader(),
      body: formData
    });
    
    console.log('createNewsItem: Response status:', res.status);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('createNewsItem: Request failed!', res.status, errorText);
      throw new Error(`Failed to save news: ${res.status} ${res.statusText}`);
    }
    const json = await res.json();
    console.log('createNewsItem: Success!', json);
    return json;
  } catch (error) {
    console.error('createNewsItem: Exception caught:', error);
    throw error;
  }
}

export async function fetchNewsItemById(id) {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}/news/${id}`);
    if (!res.ok) return null;
    const item = await res.json();
    return {
      ...item,
      image: resolveImageUrl(item.image),
      gallery: item.gallery ? item.gallery.map(resolveImageUrl) : []
    };
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function deleteNewsItem(id) {
    if (!API_BASE) return false;
    try {
        const res = await fetch(`${API_BASE}/news/${id}`, {
          method: 'DELETE',
          headers: authService.getAuthHeader()
        });
        return res.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function updateNewsItem(item) {
  if (!API_BASE) return null;
  
  console.log('updateNewsItem: Starting update...', {
    id: item.id,
    title: item.title,
    excerptLength: item.excerpt?.length || 0,
    excerptPreview: item.excerpt?.substring(0, 100) + '...',
    hasImage: !!item.image,
    galleryCount: item.gallery?.length || 0
  });
  
  const formData = new FormData();
  Object.keys(item).forEach(key => {
    if (key === 'image' || key === 'gallery') return;
    formData.append(key, item[key]);
    console.log(`FormData: Adding ${key}`, key === 'excerpt' ? item[key]?.substring(0, 100) + '...' : item[key]);
  });
  
  const mainImageBlob = dataURItoBlob(item.image);
  if (mainImageBlob) {
    formData.append('image', mainImageBlob, 'main-image.jpg');
  } else {
     formData.append('image', item.image);
  }
  
  // Gallery logic similar to create
  if (Array.isArray(item.gallery)) {
    item.gallery.forEach((img, idx) => {
      const blob = dataURItoBlob(img);
      if (blob) {
        formData.append(`gallery_${idx}`, blob, `gallery-${idx}.jpg`);
      }
    });
    const existingUrls = item.gallery.filter(g => g && !g.startsWith('data:'));
    formData.append('gallery', JSON.stringify(existingUrls));
  }

  console.log('updateNewsItem: Sending PUT request to:', `${API_BASE}/news/${item.id}`);
  
  const res = await fetch(`${API_BASE}/news/${item.id}`, {
    method: 'PUT',
    headers: authService.getAuthHeader(),
    body: formData
  });
  
  console.log('updateNewsItem: Response status:', res.status);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('updateNewsItem: Failed to update news', res.status, res.statusText, errorText);
    throw new Error(`Failed to update news: ${res.status} ${res.statusText}. ${errorText}`);
  }
  const result = await res.json();
  console.log('updateNewsItem: Success!', result);
  return result;
}

// Deprecated sync functions for backward compatibility until refactor is complete
export function loadNewsItems() { return []; } 
export function saveNewsItem() { return []; } 
