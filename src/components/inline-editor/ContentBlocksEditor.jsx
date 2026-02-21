import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './ContentBlocksEditor.css';

// Block type definitions with icons
const BLOCK_TYPES = {
  heading: { label: 'Heading', icon: 'fas fa-heading', color: '#3b82f6' },
  subheading: { label: 'Subheading', icon: 'fas fa-h', color: '#8b5cf6' },
  paragraph: { label: 'Paragraph', icon: 'fas fa-paragraph', color: '#10b981' },
  bulletList: { label: 'Bullet List', icon: 'fas fa-list-ul', color: '#f59e0b' },
  highlightBox: { label: 'Highlight Box', icon: 'fas fa-lightbulb', color: '#ec4899' },
  quote: { label: 'Quote', icon: 'fas fa-quote-left', color: '#6366f1' },
};

// Sortable Block Item
const SortableBlockItem = ({ block, index, onUpdate, onRemove, onDuplicate, totalBlocks }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const blockType = BLOCK_TYPES[block.type] || BLOCK_TYPES.paragraph;

  // Format text with markdown-style syntax
  const formatText = (textarea, format) => {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    
    let wrapper = '';
    switch (format) {
      case 'bold': wrapper = '**'; break;
      case 'italic': wrapper = '*'; break;
      case 'underline': wrapper = '__'; break;
      default: return;
    }
    
    const newText = text.substring(0, start) + wrapper + selectedText + wrapper + text.substring(end);
    return { newText, newCursorPos: end + wrapper.length * 2 };
  };

  const handleFormat = (e, format, textareaRef, currentContent, onContentChange) => {
    e.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    const result = formatText(textarea, format);
    if (result) {
      onContentChange(result.newText);
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(result.newCursorPos, result.newCursorPos);
      }, 0);
    }
  };

  // Ref for textarea
  const textareaRef = React.useRef(null);

  const renderBlockContent = () => {
    switch (block.type) {
      case 'heading':
      case 'subheading':
        return (
          <input
            type="text"
            value={block.content || ''}
            onChange={(e) => onUpdate(index, { ...block, content: e.target.value })}
            placeholder={`Enter ${block.type}...`}
            className="block-input block-input--title"
          />
        );
      
      case 'paragraph':
      case 'quote':
      case 'highlightBox':
        return (
          <div className="block-text-editor">
            <div className="block-format-toolbar">
              <button
                type="button"
                className="format-btn"
                onClick={(e) => handleFormat(e, 'bold', textareaRef, block.content, (newText) => onUpdate(index, { ...block, content: newText }))}
                title="Bold (select text first)"
              >
                <i className="fas fa-bold"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={(e) => handleFormat(e, 'italic', textareaRef, block.content, (newText) => onUpdate(index, { ...block, content: newText }))}
                title="Italic (select text first)"
              >
                <i className="fas fa-italic"></i>
              </button>
              <button
                type="button"
                className="format-btn"
                onClick={(e) => handleFormat(e, 'underline', textareaRef, block.content, (newText) => onUpdate(index, { ...block, content: newText }))}
                title="Underline (select text first)"
              >
                <i className="fas fa-underline"></i>
              </button>
              <span className="format-hint">Select text, then click format</span>
            </div>
            <textarea
              ref={textareaRef}
              rows={block.type === 'paragraph' ? 4 : 3}
              value={block.content || ''}
              onChange={(e) => onUpdate(index, { ...block, content: e.target.value })}
              placeholder={`Enter ${blockType.label.toLowerCase()}...`}
              className="block-input block-input--text"
            />
          </div>
        );
      
      case 'bulletList':
        return (
          <div className="block-bullet-list">
            {(block.items || ['']).map((item, itemIndex) => (
              <div key={itemIndex} className="bullet-item">
                <span className="bullet-marker">•</span>
                <input
                  type="text"
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(block.items || [''])];
                    newItems[itemIndex] = e.target.value;
                    onUpdate(index, { ...block, items: newItems });
                  }}
                  placeholder="Enter list item..."
                  className="block-input"
                />
                <button
                  type="button"
                  className="bullet-remove"
                  onClick={() => {
                    const newItems = (block.items || ['']).filter((_, i) => i !== itemIndex);
                    onUpdate(index, { ...block, items: newItems.length ? newItems : [''] });
                  }}
                  disabled={(block.items || ['']).length <= 1}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="bullet-add"
              onClick={() => {
                const newItems = [...(block.items || ['']), ''];
                onUpdate(index, { ...block, items: newItems });
              }}
            >
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`content-block ${isDragging ? 'content-block--dragging' : ''}`}
    >
      <div className="content-block__header">
        <div className="content-block__drag" {...attributes} {...listeners}>
          <i className="fas fa-grip-vertical"></i>
        </div>
        <div className="content-block__type" style={{ backgroundColor: blockType.color }}>
          <i className={blockType.icon}></i>
          <span>{blockType.label}</span>
        </div>
        <div className="content-block__actions">
          <button
            type="button"
            className="block-action duplicate"
            onClick={() => onDuplicate(index)}
            title="Duplicate"
          >
            <i className="fas fa-copy"></i>
          </button>
          <button
            type="button"
            className="block-action remove"
            onClick={() => onRemove(index)}
            title="Remove"
            disabled={totalBlocks <= 1}
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div className="content-block__body">
        {renderBlockContent()}
      </div>
    </div>
  );
};

// Main Content Blocks Editor
const ContentBlocksEditor = ({ blocks = [], onChange, sectionTitle = "Content Blocks" }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Ensure blocks have unique IDs
  const ensureIds = (blockList) => {
    return blockList.map((block, index) => ({
      ...block,
      id: block.id || `block-${Date.now()}-${index}`
    }));
  };

  const blocksWithIds = ensureIds(blocks);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = blocksWithIds.findIndex(b => b.id === active.id);
      const newIndex = blocksWithIds.findIndex(b => b.id === over.id);
      onChange(arrayMove(blocksWithIds, oldIndex, newIndex));
    }
  };

  const handleUpdate = (index, updatedBlock) => {
    const newBlocks = [...blocksWithIds];
    newBlocks[index] = updatedBlock;
    onChange(newBlocks);
  };

  const handleRemove = (index) => {
    const newBlocks = blocksWithIds.filter((_, i) => i !== index);
    onChange(newBlocks);
  };

  const handleDuplicate = (index) => {
    const blockToDuplicate = blocksWithIds[index];
    const newBlock = {
      ...blockToDuplicate,
      id: `block-${Date.now()}-dup`
    };
    const newBlocks = [...blocksWithIds];
    newBlocks.splice(index + 1, 0, newBlock);
    onChange(newBlocks);
  };

  const handleAddBlock = (type) => {
    const newBlock = {
      id: `block-${Date.now()}`,
      type,
      content: '',
      items: type === 'bulletList' ? [''] : undefined
    };
    onChange([...blocksWithIds, newBlock]);
  };

  return (
    <div className="content-blocks-editor">
      <div className="content-blocks-editor__header">
        <h3>
          <i className="fas fa-cubes"></i>
          {sectionTitle}
        </h3>
        <span className="block-count">{blocksWithIds.length} blocks</span>
      </div>

      <div className="content-blocks-editor__list">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocksWithIds.map(b => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {blocksWithIds.map((block, index) => (
              <SortableBlockItem
                key={block.id}
                block={block}
                index={index}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
                onDuplicate={handleDuplicate}
                totalBlocks={blocksWithIds.length}
              />
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <div className="content-blocks-editor__add">
        <span className="add-label">Add Block:</span>
        <div className="add-buttons">
          {Object.entries(BLOCK_TYPES).map(([type, config]) => (
            <button
              key={type}
              type="button"
              className="add-block-btn"
              onClick={() => handleAddBlock(type)}
              style={{ '--btn-color': config.color }}
            >
              <i className={config.icon}></i>
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="content-blocks-editor__tips">
        <i className="fas fa-info-circle"></i>
        <span>Drag blocks to reorder. Add headings, paragraphs, lists, and more.</span>
      </div>
    </div>
  );
};

export default ContentBlocksEditor;
