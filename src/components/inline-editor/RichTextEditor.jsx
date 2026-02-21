import React, { useRef, useEffect } from 'react';
import './RichTextEditor.css';

/**
 * RichTextEditor - MS Word-like rich text editor with formatting options
 * Features: Bold, Italic, Underline, Bullet List, Numbered List, Alignment
 */
const RichTextEditor = ({ value, onChange, placeholder = 'Enter content...', minHeight = 150 }) => {
  const editorRef = useRef(null);
  const isUpdating = useRef(false);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && !isUpdating.current) {
      // Only set innerHTML if it's different to avoid cursor jumping
      if (editorRef.current.innerHTML !== (value || '')) {
        editorRef.current.innerHTML = value || '';
      }
    }
  }, [value]);

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

  const formatBold = () => execCommand('bold');
  const formatItalic = () => execCommand('italic');
  const formatUnderline = () => execCommand('underline');
  const formatBulletList = () => execCommand('insertUnorderedList');
  const formatNumberedList = () => execCommand('insertOrderedList');
  const alignLeft = () => execCommand('justifyLeft');
  const alignCenter = () => execCommand('justifyCenter');
  const alignRight = () => execCommand('justifyRight');

  return (
    <div className="rich-text-editor">
      <div className="rich-text-toolbar">
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
        </div>
        
        <div className="toolbar-divider"></div>
        
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
        </div>
        
        <div className="toolbar-divider"></div>
        
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
        </div>
      </div>
      
      <div
        ref={editorRef}
        className="rich-text-content"
        contentEditable
        onInput={handleInput}
        onBlur={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight: `${minHeight}px` }}
      />
    </div>
  );
};

export default RichTextEditor;
