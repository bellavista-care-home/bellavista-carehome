import React, { useState } from 'react';
import * as authService from '../../services/authService';
import SectionEditorModal from './SectionEditorModal';
import './EditableSection.css';

/**
 * EditableSection - Wrapper component for inline editing
 * Shows an edit button overlay when admin is logged in
 * 
 * @param {string} sectionId - Unique identifier for this section
 * @param {string} sectionType - Type of section (hero, about, services, facilities, team, etc.)
 * @param {string} homeId - The home ID this section belongs to
 * @param {object} sectionData - Current data for this section
 * @param {function} onUpdate - Callback when section is updated
 * @param {string} label - Display label for the edit button
 * @param {React.ReactNode} children - The actual section content
 */
const EditableSection = ({ 
  sectionId, 
  sectionType, 
  homeId, 
  sectionData, 
  onUpdate, 
  label,
  children 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if user is admin
  const user = authService.getCurrentUser();
  // Admin and super_admin can edit any home (support both 'superadmin' and 'super_admin')
  const isAdmin = user && (user.role === 'admin' || user.role === 'super_admin' || user.role === 'superadmin');
  // Home admin can only edit their assigned home (compare as strings)
  const isHomeAdmin = user && user.role === 'home_admin' && String(user.homeId) === String(homeId);
  const canEdit = isAdmin || isHomeAdmin;
  
  // Debug log (remove in production)
  console.log('EditableSection Debug:', { user, isAdmin, isHomeAdmin, canEdit, homeId });

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleSave = (updatedData) => {
    if (onUpdate) {
      onUpdate(updatedData);
    }
    setIsEditing(false);
  };

  const handleClose = () => {
    setIsEditing(false);
  };

  if (!canEdit) {
    return <>{children}</>;
  }

  return (
    <div 
      className={`editable-section ${isHovered ? 'editable-section--hover' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
      
      {/* Edit overlay button */}
      <div className={`editable-section__overlay ${isHovered ? 'visible' : ''}`}>
        <button 
          className="editable-section__edit-btn"
          onClick={handleEditClick}
          title={`Edit ${label || sectionType}`}
        >
          <i className="fas fa-pencil-alt"></i>
          <span>Edit {label || sectionType}</span>
        </button>
      </div>

      {/* Editor Modal */}
      {isEditing && (
        <SectionEditorModal
          isOpen={isEditing}
          onClose={handleClose}
          onSave={handleSave}
          sectionId={sectionId}
          sectionType={sectionType}
          homeId={homeId}
          sectionData={sectionData}
          label={label}
        />
      )}
    </div>
  );
};

export default EditableSection;
