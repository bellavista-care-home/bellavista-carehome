
const API_BASE = import.meta.env.PROD 
  ? 'https://d2vw0p0lgszg44.cloudfront.net/api' 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api');

const SERVER_URL = API_BASE ? API_BASE.replace('/api', '') : '';

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
  if (!API_BASE) {
    console.error('API_BASE is missing');
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
      formData.append('image', mainImageBlob, 'main-image.jpg');
    } else if (item.image) {
      formData.append('image', item.image);
    }

    // Handle Gallery Images
    const galleryUrls = [];
    if (Array.isArray(item.gallery)) {
      item.gallery.forEach((img, idx) => {
        const blob = dataURItoBlob(img);
        if (blob) {
          formData.append(`gallery_${idx}`, blob, `gallery-${idx}.jpg`);
        } else if (img) {
          galleryUrls.push(img);
        }
      });
      formData.append('gallery', JSON.stringify(galleryUrls));
    }

    const res = await fetch(`${API_BASE}/news`, {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to save news: ${res.status} ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Failed to create news item:', error);
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
        const res = await fetch(`${API_BASE}/news/${id}`, { method: 'DELETE' });
        return res.ok;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export async function updateNewsItem(item) {
  if (!API_BASE) return null;
  
  const formData = new FormData();
  Object.keys(item).forEach(key => {
    if (key === 'image' || key === 'gallery') return;
    formData.append(key, item[key]);
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

  const res = await fetch(`${API_BASE}/news/${item.id}`, {
    method: 'PUT',
    body: formData
  });
  
  if (!res.ok) throw new Error('Failed to update news');
  return await res.json();
}

// Deprecated sync functions for backward compatibility until refactor is complete
export function loadNewsItems() { return []; } 
export function saveNewsItem(item) { return []; } 
