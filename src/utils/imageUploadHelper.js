/**
 * Image Upload Helper
 * Handles uploading images to S3 and converting base64 to server URLs
 */

const RAW_VITE = import.meta.env.VITE_API_BASE_URL;
function normalizeViteHome(v) {
  if (!v) return null;
  if (v === '/api') return null;
  return v;
}
const VITE = normalizeViteHome(RAW_VITE);
const DEFAULT_PROD_API = 'https://d2vw0p0lgszg44.cloudfront.net/api';
const API_URL = import.meta.env.PROD ? (VITE || DEFAULT_PROD_API) : (VITE || 'http://localhost:8000/api');

/**
 * Converts a base64 data URL to a Blob
 */
function dataURLtoBlob(dataURL) {
  const arr = dataURL.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads an image to the server and returns the S3 URL
 * @param {string} imageDataURL - Base64 data URL of the image
 * @param {string} processType - Type of processing: 'resize_crop', 'resize_gallery', 'resize_gallery_pad', or 'none'
 * @returns {Promise<string>} The S3 URL of the uploaded image
 */
export async function uploadImageToS3(imageDataURL, processType = 'none') {
  if (!imageDataURL || !imageDataURL.startsWith('data:')) {
    // Already a URL, return as-is
    return imageDataURL;
  }

  try {
    const blob = dataURLtoBlob(imageDataURL);
    const file = new File([blob], `image-${Date.now()}.jpg`, { type: 'image/jpeg' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('process_type', processType);

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return data.url; // Returns S3 URL or /uploads/filename
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
}

/**
 * Uploads multiple images to S3 and returns an array of URLs
 * @param {Array<string>} images - Array of base64 data URLs or existing URLs
 * @param {string} processType - Type of processing
 * @param {Function} onProgress - Optional callback for progress updates
 * @returns {Promise<Array<string>>} Array of S3 URLs
 */
export async function uploadMultipleImages(images, processType = 'none', onProgress = null) {
  const results = [];
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    
    if (typeof image === 'string') {
      // Simple string URL
      if (image.startsWith('data:')) {
        const url = await uploadImageToS3(image, processType);
        results.push(url);
      } else {
        results.push(image);
      }
    } else if (typeof image === 'object' && image.url) {
      // Object with url property
      if (image.url.startsWith('data:')) {
        const url = await uploadImageToS3(image.url, processType);
        results.push({ ...image, url });
      } else {
        results.push(image);
      }
    }
    
    if (onProgress) {
      onProgress((i + 1) / images.length);
    }
  }
  
  return results;
}

/**
 * Checks if a URL is a base64 data URL
 */
export function isBase64DataURL(url) {
  return typeof url === 'string' && url.startsWith('data:');
}

/**
 * Converts all base64 images in an object to S3 URLs
 * Recursively processes nested objects and arrays
 */
export async function convertBase64ToURLs(obj, onProgress = null) {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    const results = [];
    for (let i = 0; i < obj.length; i++) {
      const item = obj[i];
      
      if (typeof item === 'string' && isBase64DataURL(item)) {
        const url = await uploadImageToS3(item);
        results.push(url);
      } else if (typeof item === 'object' && item.url && isBase64DataURL(item.url)) {
        const url = await uploadImageToS3(item.url);
        results.push({ ...item, url });
      } else if (typeof item === 'object') {
        results.push(await convertBase64ToURLs(item));
      } else {
        results.push(item);
      }
      
      if (onProgress) {
        onProgress(i / obj.length);
      }
    }
    return results;
  }

  // Handle object
  const result = { ...obj };
  for (const key in result) {
    const value = result[key];
    
    if (typeof value === 'string' && isBase64DataURL(value)) {
      result[key] = await uploadImageToS3(value);
    } else if (Array.isArray(value)) {
      result[key] = await convertBase64ToURLs(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = await convertBase64ToURLs(value);
    }
  }
  
  return result;
}
