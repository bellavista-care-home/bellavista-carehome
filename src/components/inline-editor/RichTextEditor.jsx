import React, { useRef, useEffect, useState } from 'react';
import './RichTextEditor.css';

/**
 * RichTextEditor - MS Word-like rich text editor with formatting options
 * Features: Bold, Italic, Underline, Strikethrough, Bullet List, Numbered List, 
 * Checkmark List, Alignment, Headings, Clear Formatting, Indent/Outdent
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Enter content...', minHeight = 150 }) => {
  const editorRef = useRef(null);
  const isUpdating = useRef(false);
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      // Only set innerHTML if it's different to avoid cursor jumping
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.format-dropdown-wrapper')) {
        setShowFormatDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInput = () => {
    if (editorRef.current) {
      isUpdating.current = true;
      const html = editorRef.current.innerHTML;
      onChange(html);
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
    }
  };

  const execCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  // Basic formatting
  const formatBold = () => execCommand('bold');
  const formatItalic = () => execCommand('italic');
  const formatUnderline = () => execCommand('underline');
  const formatStrikethrough = () => execCommand('strikeThrough');
  
  // Lists
  const formatBulletList = () => execCommand('insertUnorderedList');
  const formatNumberedList = () => execCommand('insertOrderedList');
  
  // Checkmark list - creates a bullet list with checkmark styling
  const formatCheckmarkList = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    // First create a bullet list
    execCommand('insertUnorderedList');
    
    // Add checkmark class to the ul
    setTimeout(() => {
      const range = selection.getRangeAt(0);
      let node = range.commonAncestorContainer;
      while (node && node.nodeName !== 'UL') {
        node = node.parentNode;
      }
      if (node && node.nodeName === 'UL') {
        node.classList.toggle('checkmark-list');
        handleInput();
      }
    }, 10);
  };
  
  // Alignment
  const alignLeft = () => execCommand('justifyLeft');
  const alignCenter = () => execCommand('justifyCenter');
  const alignRight = () => execCommand('justifyRight');
  const alignJustify = () => execCommand('justifyFull');
  
  // Indentation
  const indent = () => execCommand('indent');
  const outdent = () => execCommand('outdent');
  
  // Headings
  const formatHeading = (level) => {
    execCommand('formatBlock', level);
    setShowFormatDropdown(false);
  };
  
  // Clear formatting
  const clearFormatting = () => {
    execCommand('removeFormat');
    // Also remove block formatting
    execCommand('formatBlock', 'p');
  };
  
  // Handle paste - strip formatting option
  const handlePaste = (e) => {
    // Get plain text from clipboard
    const text = e.clipboardData?.getData('text/plain');
    if (text) {
      e.preventDefault();
      // Insert as plain text but preserve line breaks
      const html = text
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => `<p>${line}</p>`)
        .join('');
      document.execCommand('insertHTML', false, html);
      handleInput();
    }
  };

  // Insert horizontal line
  const insertHorizontalRule = () => execCommand('insertHorizontalRule');

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
        {/* Format dropdown */}
        <div className="toolbar-group format-dropdown-wrapper">
          <button
            type="button"
            className="toolbar-btn toolbar-btn--dropdown"
            onClick={(e) => {
              e.stopPropagation();
              setShowFormatDropdown(!showFormatDropdown);
            }}
            title="Text Format"
          >
            <span style={{ fontSize: '12px', fontWeight: '500' }}>Format</span>
            <i className="fas fa-chevron-down" style={{ fontSize: '8px', marginLeft: '4px' }}></i>
          </button>
          {showFormatDropdown && (
            <div className="format-dropdown">
              <button type="button" onClick={() => formatHeading('p')}>
                <span>Normal</span>
              </button>
              <button type="button" onClick={() => formatHeading('h1')}>
                <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>Heading 1</span>
              </button>
              <button type="button" onClick={() => formatHeading('h2')}>
                <span style={{ fontSize: '1.3em', fontWeight: 'bold' }}>Heading 2</span>
              </button>
              <button type="button" onClick={() => formatHeading('h3')}>
                <span style={{ fontSize: '1.1em', fontWeight: 'bold' }}>Heading 3</span>
              </button>
              <button type="button" onClick={() => formatHeading('blockquote')}>
                <span style={{ fontStyle: 'italic', color: '#666' }}>Quote</span>
              </button>
            </div>
          )}
        </div>

        <div className="toolbar-divider"></div>
        
        {/* Basic formatting */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatBold}
            title="Bold (Ctrl+B)"
          >
            <i className="fas fa-bold"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatItalic}
            title="Italic (Ctrl+I)"
          >
            <i className="fas fa-italic"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatUnderline}
            title="Underline (Ctrl+U)"
          >
            <i className="fas fa-underline"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatStrikethrough}
            title="Strikethrough"
          >
            <i className="fas fa-strikethrough"></i>
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        {/* Lists */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatBulletList}
            title="Bullet List"
          >
            <i className="fas fa-list-ul"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatNumberedList}
            title="Numbered List"
          >
            <i className="fas fa-list-ol"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={formatCheckmarkList}
            title="Checkmark List ✓"
          >
            <i className="fas fa-check-square"></i>
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        {/* Alignment */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={alignLeft}
            title="Align Left"
          >
            <i className="fas fa-align-left"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={alignCenter}
            title="Align Center"
          >
            <i className="fas fa-align-center"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={alignRight}
            title="Align Right"
          >
            <i className="fas fa-align-right"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={alignJustify}
            title="Justify"
          >
            <i className="fas fa-align-justify"></i>
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        {/* Indentation */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={outdent}
            title="Decrease Indent"
          >
            <i className="fas fa-outdent"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn"
            onClick={indent}
            title="Increase Indent"
          >
            <i className="fas fa-indent"></i>
          </button>
        </div>
        
        <div className="toolbar-divider"></div>
        
        {/* Utilities */}
        <div className="toolbar-group">
          <button
            type="button"
            className="toolbar-btn"
            onClick={insertHorizontalRule}
            title="Insert Horizontal Line"
          >
            <i className="fas fa-minus"></i>
          </button>
          <button
            type="button"
            className="toolbar-btn toolbar-btn--danger"
            onClick={clearFormatting}
            title="Clear Formatting"
          >
            <i className="fas fa-eraser"></i>
          </button>
        </div>
      </div>
      
      <div className="rich-text-paste-hint">
        <i className="fas fa-info-circle"></i>
        Tip: Pasted content is automatically cleaned to match your site's style
      </div>
      
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  );
};

export default RichTextEditor;
