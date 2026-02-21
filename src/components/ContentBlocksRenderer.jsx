import React from 'react';
import './ContentBlocksRenderer.css';

/**
 * ContentBlocksRenderer - Renders dynamic content blocks on the frontend
 * Supports: heading, subheading, paragraph, bulletList, highlightBox, quote
 * Supports markdown-style formatting: **bold**, *italic*, __underline__
 */

// Parse markdown-style formatting to React elements
const parseFormattedText = (text) => {
  if (!text) return null;
  
  // Replace markdown patterns with HTML
  // Order matters: bold (**) before italic (*) to prevent conflicts
  let html = text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // **bold**
    .replace(/\*(.+?)\*/g, '<em>$1</em>')              // *italic*
    .replace(/__(.+?)__/g, '<u>$1</u>');               // __underline__
  
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const ContentBlocksRenderer = ({ blocks = [], className = '' }) => {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  const renderBlock = (block, index) => {
    switch (block.type) {
      case 'heading':
        return (
          <h2 key={block.id || index} className="content-block-heading">
            {parseFormattedText(block.content)}
          </h2>
        );
      
      case 'subheading':
        return (
          <h3 key={block.id || index} className="content-block-subheading section-header__title">
            {parseFormattedText(block.content)}
          </h3>
        );
      
      case 'paragraph':
        return (
          <p key={block.id || index} className="content-block-paragraph">
            {parseFormattedText(block.content)}
          </p>
        );
      
      case 'bulletList':
        return (
          <ul key={block.id || index} className="content-block-list">
            {(block.items || []).filter(item => item && item.trim()).map((item, i) => (
              <li key={i}>{parseFormattedText(item)}</li>
            ))}
          </ul>
        );
      
      case 'highlightBox':
        return (
          <div key={block.id || index} className="content-block-highlight">
            <p>{parseFormattedText(block.content)}</p>
          </div>
        );
      
      case 'quote':
        return (
          <blockquote key={block.id || index} className="content-block-quote">
            <p>{parseFormattedText(block.content)}</p>
          </blockquote>
        );
      
      default:
        return (
          <p key={block.id || index} className="content-block-paragraph">
            {parseFormattedText(block.content)}
          </p>
        );
    }
  };

  return (
    <div className={`content-blocks-container ${className}`}>
      {blocks.map((block, index) => renderBlock(block, index))}
    </div>
  );
};

export default ContentBlocksRenderer;
