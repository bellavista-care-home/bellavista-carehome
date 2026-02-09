/**
 * Decodes HTML entities in a string
 * @param {string} text - The text containing HTML entities
 * @returns {string} - The decoded text
 */
export function decodeHtmlEntities(text) {
  if (!text) return '';
  
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text;
  return textArea.value;
}

/**
 * Safely renders HTML content by decoding entities
 * @param {string} html - The HTML content to render
 * @returns {Object} - React element with dangerouslySetInnerHTML
 */
export function renderSafeHtml(html) {
  if (!html) return null;
  
  const decodedHtml = decodeHtmlEntities(html);
  return { __html: decodedHtml };
}