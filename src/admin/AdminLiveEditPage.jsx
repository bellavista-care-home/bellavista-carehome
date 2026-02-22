import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import * as authService from '../services/authService';
import AdminPageEditor from './components/AdminPageEditor';

// Map slugs for validation
const validHomeSlugs = [
  'bellavista-barry',
  'bellavista-cardiff',
  'college-fields',
  'waverley-care-centre',
  'baltimore-care-home',
  'meadow-vale-cwtch'
];

/**
 * AdminLiveEditPage - Admin page editor with drag-drop section ordering
 * URL: /admin-console/:homeSlug
 */
const AdminLiveEditPage = () => {
  const { homeSlug } = useParams();
  const user = authService.getCurrentUser();

  // Check if user is authenticated
  if (!user) {
    console.log('AdminLiveEditPage: No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin rights
  const isAdmin = user.role === 'admin' || user.role === 'super_admin' || user.role === 'superadmin' || user.role === 'home_admin';
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Validate home slug
  if (!validHomeSlugs.includes(homeSlug)) {
    return (
      <div style={{ padding: '50px', textAlign: 'center' }}>
        <h2>Home not found</h2>
        <p>The home "{homeSlug}" does not exist.</p>
        <a href="/admin-console" style={{ color: '#2563eb' }}>← Back to Admin Console</a>
      </div>
    );
  }

  // Render the admin page editor
  return <AdminPageEditor />;
};

export default AdminLiveEditPage;
