import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/authService';
import * as XLSX from 'xlsx';
import ImageUploader from '../components/ImageUploader';
import NewsForm from './components/NewsForm';
import { fetchNewsItems, createNewsItem, updateNewsItem, deleteNewsItem } from '../services/newsService';
import { fetchScheduledTours, updateBookingInAPI } from '../services/tourService';
import { fetchCareEnquiries } from '../services/enquiryService';
import { fetchHomes, updateHome } from '../services/homeService';
import { fetchFaqs, createFaq, deleteFaq } from '../services/faqService';
import { fetchVacancies, createVacancy, updateVacancy, deleteVacancy } from '../services/vacancyService';
import { fetchManagementTeam, createManagementMember, updateManagementMember, deleteManagementMember, seedManagementTeam } from '../services/managementService';
import { fetchReviews, deleteReview, importGoogleReviews } from '../services/reviewService';
import { fetchUsers, createUser, deleteUser } from '../services/userService';
import { convertBase64ToURLs, uploadImageToS3 } from '../utils/imageUploadHelper';
import HomeForm from './components/HomeForm';
import VacancyForm from './components/VacancyForm';
import EventsManager from './components/EventsManager';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import './AdminConsole.css';

const AdminConsole = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeView, setActiveView] = useState('update-home');
  
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      // Redirect home_admin to a safe default view if they land on the restricted update-home view
      if (currentUser.role === 'home_admin' && activeView === 'update-home') {
        setActiveView('home-section-ciw-report');
      }
    }
  }, []);

  const isHomeAdmin = user?.role === 'home_admin';

  const [newsFormKey, setNewsFormKey] = useState(0);
  const [toast, setToast] = useState({ message: '', type: 'success', visible: false });

  const notify = (message, type = 'success') => {
    setToast({ message, type, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000);
  };

  const [isBusy, setIsBusy] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedHome, setSelectedHome] = useState(null);
  const [homes, setHomes] = useState([]);
  const [newsForm, setNewsForm] = useState({
    id: '',
    title: '',
    excerpt: '',
    fullDescription: '',
    image: '',
    category: 'events',
    date: '',
    location: 'All Locations',
    author: 'Bellavista Team',
    badge: '',
    important: false,
    gallery: [],
    videoUrl: ''
  });
  const MAX_EXCERPT = 180;
  const [newsList, setNewsList] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [selectedVacancy, setSelectedVacancy] = useState(null);
  const [isAddingVacancy, setIsAddingVacancy] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewSearch, setReviewSearch] = useState('');
  const [reviewLocationFilter, setReviewLocationFilter] = useState('');
  const [mgmtMembers, setMgmtMembers] = useState([]);
  const [isEditingMgmt, setIsEditingMgmt] = useState(false);
  const [mgmtForm, setMgmtForm] = useState({ id: '', name: '', role: '', description: '', image: '', order: 0 });
  const [showImportGoogle, setShowImportGoogle] = useState(false);
  const [showImportCarehome, setShowImportCarehome] = useState(false);
  const [importPlaceId, setImportPlaceId] = useState('');
  const [importTargetLocation, setImportTargetLocation] = useState('Bellavista Barry');
  const [importApiKey, setImportApiKey] = useState('');

  const [users, setUsers] = useState([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'home_admin', home_id: '' });

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      notify('Failed to load users', 'error');
    }
  };

  const handleCreateUser = async () => {
    if (!userForm.username || !userForm.password) {
      notify('Username and Password are required', 'error');
      return;
    }
    if (userForm.role === 'home_admin' && !userForm.home_id) {
      notify('Please select a home for Home Admin', 'error');
      return;
    }

    try {
      setIsBusy(true);
      const payload = {
        ...userForm,
        home_id: userForm.role === 'superadmin' ? null : (userForm.home_id || null)
      };
      await createUser(payload);
      notify('User created successfully!', 'success');
      setIsAddingUser(false);
      setUserForm({ username: '', password: '', role: 'home_admin', home_id: '' });
      loadUsers();
    } catch (e) {
      console.error(e);
      notify(e.message || 'Failed to create user', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      setIsBusy(true);
      await deleteUser(id);
      notify('User deleted successfully', 'success');
      loadUsers();
    } catch (e) {
      console.error(e);
      notify('Failed to delete user', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const loadHomes = async () => {
    const data = await fetchHomes();
    setHomes(data);
  };

  const loadMgmtTeam = async () => {
    try {
      const data = await fetchManagementTeam();
      setMgmtMembers(data);
    } catch (e) {
      console.error(e);
      notify('Failed to load management team', 'error');
    }
  };

  const handleSeedMgmt = async () => {
    setIsBusy(true);
    try {
      await seedManagementTeam();
      notify('Default members added!', 'success');
      loadMgmtTeam();
    } catch (e) {
      notify('Failed to seed team', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveMgmt = async () => {
    if (!mgmtForm.name || !mgmtForm.role) {
      notify('Name and Role are required', 'error');
      return;
    }
    setIsBusy(true);
    try {
      let imageUrl = mgmtForm.image;
      if (imageUrl && imageUrl.startsWith('data:')) {
          imageUrl = await uploadImageToS3(imageUrl, 'none');
      }
      const payload = { ...mgmtForm, image: imageUrl };
      
      if (mgmtForm.id) {
          await updateManagementMember(mgmtForm.id, payload);
          notify('Member updated!', 'success');
      } else {
          await createManagementMember(payload);
          notify('Member added!', 'success');
      }
      setIsEditingMgmt(false);
      setMgmtForm({ id: '', name: '', role: '', description: '', image: '', order: 0 });
      loadMgmtTeam();
    } catch (e) {
      notify('Error saving member', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteMgmt = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    setIsBusy(true);
    try {
      await deleteManagementMember(id);
      notify('Member deleted', 'success');
      loadMgmtTeam();
    } catch (e) {
      notify('Error deleting member', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveHome = async (homeData) => {
    try {
      setIsBusy(true);
      
      // Convert any remaining base64 images to S3 URLs before sending
      notify('Processing images...', 'info');
      const optimizedData = await convertBase64ToURLs(homeData);
      
      await updateHome(optimizedData.id, optimizedData);
      notify('Home updated successfully!', 'success');
      setSelectedHome(null);
      loadHomes();
    } catch (error) {
      console.error(error);
      notify('Failed to update home.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const [bookings, setBookings] = useState([]);
  const [bookingSearch, setBookingSearch] = useState('');
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [kioskCheckIns, setKioskCheckIns] = useState([]);
  const [kioskSearch, setKioskSearch] = useState('');

  const downloadExcel = (data, filename) => {
    if (!data.length) {
      notify('No data to download', 'error');
      return;
    }
    
    // Format data for Excel
    const formattedData = data.map(row => ({
      'Name': row.name || '',
      'Phone': row.phone || '',
      'Email': row.email || '',
      'Location': row.location || '',
      'Preferred Date': row.preferredDate || '',
      'Preferred Time': row.preferredTime || '',
      'Created At': new Date(row.createdAt).toLocaleString(),
      'Status': row.status || 'requested',
      'Message': row.message || ''
    }));

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    
    // Auto-size columns (simple estimation)
    const columnWidths = [
      { wch: 20 }, // Name
      { wch: 15 }, // Phone
      { wch: 25 }, // Email
      { wch: 25 }, // Location
      { wch: 15 }, // Date
      { wch: 15 }, // Time
      { wch: 20 }, // Created
      { wch: 12 }, // Status
      { wch: 40 }  // Message
    ];
    worksheet['!cols'] = columnWidths;

    // Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");

    // Write file
    XLSX.writeFile(workbook, filename);
  };

  const handleDownload = (type) => {
    const filename = type === 'all' 
      ? `All_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`
      : `Visited_Bookings_${new Date().toISOString().split('T')[0]}.xlsx`;

    if (type === 'all') {
      downloadExcel(bookings, filename);
    } else if (type === 'visited') {
      const visited = bookings.filter(b => b.status === 'visited');
      downloadExcel(visited, filename);
    }
    setShowDownloadModal(false);
  };
  
  const loadBookings = async () => {
    try {
      const data = await fetchScheduledTours();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  };

  const loadKioskCheckIns = async () => {
    try {
      // Use config directly instead of dynamic import if possible, or ensure it resolves
      const { API_URL } = await import('../config/apiConfig');
      const { getAuthHeader } = await import('../services/authService');
      
      const response = await fetch(`${API_URL}/kiosk/check-ins`, {
        headers: getAuthHeader()
      });
      
      if (response.ok) {
        const data = await response.json();
        setKioskCheckIns(Array.isArray(data) ? data : []);
      } else {
        console.error('Failed to fetch kiosk check-ins:', response.status);
        setKioskCheckIns([]);
      }
    } catch (error) {
      console.error('Failed to load kiosk check-ins:', error);
      setKioskCheckIns([]);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await updateBookingInAPI(id, { status });
      // Update local state to reflect change immediately
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
    } catch (error) {
      console.error('Failed to update booking status:', error);
      notify('Failed to update status', 'error');
    }
  };

  const [enquiries, setEnquiries] = useState([]);
  const [enquirySearch, setEnquirySearch] = useState('');
  
  const loadEnquiries = async () => {
    try {
      const data = await fetchCareEnquiries();
      setEnquiries(Array.isArray(data) ? data : []);
    } catch {
      setEnquiries([]);
    }
  };

  const [applications, setApplications] = useState([]);
  const [applicationSearch, setApplicationSearch] = useState('');
  
  const loadApplications = () => {
    try {
      const key = 'career_applications';
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    }
  };

  const loadNews = async () => {
    const items = await fetchNewsItems();
    setNewsList(items);
  };

  useEffect(() => {
    if (activeView === 'scheduled-tours') {
      loadBookings();
      const interval = setInterval(loadBookings, 10000);
      return () => clearInterval(interval);
    }
    if (activeView === 'care-enquiries') {
      loadEnquiries();
      const interval = setInterval(loadEnquiries, 10000);
      return () => clearInterval(interval);
    }
    if (activeView === 'career-applications') {
      loadApplications();
      const interval = setInterval(loadApplications, 5000);
      const onStorage = (e) => {
        if (e.key === 'career_applications') loadApplications();
      };
      window.addEventListener('storage', onStorage);
      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', onStorage);
      };
    }
    if (activeView === 'update-news') {
      loadNews();
    }
    if (activeView === 'update-home' || activeView.startsWith('home-section-')) {
      loadHomes();
    }
    if (activeView === 'manage-faqs') {
      loadFaqs();
    }
    if (activeView === 'manage-users') {
      loadHomes(); // For dropdown
      loadUsers();
    }
    if (activeView === 'reviews') {
      loadReviews();
    }
    if (activeView === 'manage-management-team') {
      loadMgmtTeam();
    }
  }, [activeView]);

  // Add news
  const addNews = async () => {
    if (!newsForm.title || !newsForm.date || !newsForm.excerpt) {
      notify('Please fill in at least title, date, and summary', 'error');
      return;
    }
    
    // Auto-generate ID if empty (though backend handles it usually)
    const id = (newsForm.id || newsForm.title).toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 50);
    
    const payload = {
      ...newsForm,
      id
    };

    try {
      setIsBusy(true);
      await createNewsItem(payload);
      notify('News saved successfully!', 'success');
      
      // Reset form
      setNewsForm({
        id: '',
        title: '',
        excerpt: '',
        fullDescription: '',
        image: '',
        category: 'events',
        date: '',
        location: 'All Locations',
        author: 'Bellavista Team',
        badge: '',
        important: false,
        gallery: [],
        videoUrl: ''
      });
      
      // If we were viewing list, refresh it
      if (activeView === 'update-news') {
        loadNews();
      }
    } catch (e) {
      console.error(e);
      notify('Failed to save news. See console.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const updateNews = async () => {
    if (!selectedNews) return;
    if (!newsForm.title || !newsForm.date || !newsForm.excerpt) {
      notify('Please fill in at least title, date, and summary', 'error');
      return;
    }
    
    const payload = {
      ...newsForm,
      id: selectedNews.id // Ensure we keep the original ID
    };

    try {
      setIsBusy(true);
      await updateNewsItem(payload);
      notify('News updated successfully!', 'success');
      
      // Refresh list
      loadNews();
      
      setSelectedNews(null);
      setNewsForm({
        id: '',
        title: '',
        excerpt: '',
        fullDescription: '',
        image: '',
        category: 'events',
        date: '',
        location: 'All Locations',
        author: 'Bellavista Team',
        badge: '',
        important: false,
        gallery: [],
        videoUrl: ''
      });
    } catch (e) {
      console.error(e);
      notify('Failed to update news. See console.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleNewsChange = (field, value) => {
    setNewsForm(prev => ({ ...prev, [field]: value }));
  };

  const startEditNews = (news) => {
    setSelectedNews(news);
    setActiveView('update-news');
    setNewsForm({
      id: news.id,
      title: news.title || '',
      excerpt: news.excerpt || '',
      fullDescription: news.fullDescription || '',
      image: news.image || '',
      category: news.category || 'events',
      date: news.date || '',
      location: news.location || 'All Locations',
      author: news.author || 'Bellavista Team',
      badge: news.badge || '',
      important: !!news.important,
      gallery: Array.isArray(news.gallery) ? news.gallery : [],
      videoUrl: news.videoUrl || ''
    });
  };
  
  // Initial load if we start on update-news
  useEffect(() => {
    if (activeView === 'update-news') loadNews();
  }, []);

  const loadFaqs = async () => {
    try {
      const data = await fetchFaqs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setFaqs([]);
    }
  };

  const addFaqHandler = async () => {
    if (!faqQuestion || !faqAnswer) {
      notify('Please enter question and answer', 'error');
      return;
    }
    try {
      await createFaq({ question: faqQuestion, answer: faqAnswer });
      notify('FAQ added successfully!', 'success');
      setFaqQuestion('');
      setFaqAnswer('');
      loadFaqs();
    } catch (e) {
      console.error(e);
      notify('Failed to add FAQ', 'error');
    }
  };

  const removeFaq = async (id) => {
    if(!window.confirm('Delete this FAQ?')) return;
    try {
      await deleteFaq(id);
      notify('FAQ deleted successfully!', 'success');
      loadFaqs();
    } catch (e) {
      console.error(e);
      notify('Failed to delete FAQ', 'error');
    }
  };

  const loadVacancies = async () => {
    try {
      const data = await fetchVacancies();
      setVacancies(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setVacancies([]);
    }
  };

  useEffect(() => {
    if (activeView === 'manage-vacancies') loadVacancies();
  }, [activeView]);

  const loadReviews = async () => {
    try {
      const data = await fetchReviews(reviewLocationFilter ? { location: reviewLocationFilter } : {});
      setReviews(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setReviews([]);
      notify('Failed to load reviews', 'error');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await deleteReview(id);
      notify('Review deleted successfully', 'success');
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (e) {
      console.error(e);
      notify('Failed to delete review', 'error');
    }
  };

  const handleImportGoogle = async () => {
    try {
      setIsBusy(true);
      // If user provided a place ID, use it. Otherwise pass null to let backend lookup by location name.
      const placeId = importPlaceId && importPlaceId.trim().length > 0 ? importPlaceId.trim() : null;
      const apiKey = importApiKey && importApiKey.trim().length > 0 ? importApiKey.trim() : '';
      
      const res = await importGoogleReviews(placeId, importTargetLocation, apiKey);
      notify(`Imported ${res.imported} reviews!`, 'success');
      setShowImportGoogle(false);
      setImportPlaceId('');
      setImportApiKey('');
      loadReviews();
    } catch (e) {
      console.error(e);
      notify(e.message || 'Failed to import reviews', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleImportCarehome = async () => {
    try {
      setIsBusy(true);
      const { importCarehomeReviews } = await import('../services/reviewService');
      const res = await importCarehomeReviews(importTargetLocation);
      notify(`Imported ${res.imported} reviews from carehome.co.uk!`, 'success');
      setShowImportCarehome(false);
      loadReviews();
    } catch (e) {
      console.error(e);
      notify(e.message || 'Failed to import carehome reviews', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleSaveVacancy = async (data) => {
    try {
      setIsBusy(true);
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== null) {
          formData.append(key, data[key]);
        }
      });

      if (selectedVacancy) {
        await updateVacancy(selectedVacancy.id, formData);
        notify('Vacancy updated successfully!', 'success');
      } else {
        await createVacancy(formData);
        notify('Vacancy created successfully!', 'success');
      }
      setSelectedVacancy(null);
      setIsAddingVacancy(false);
      loadVacancies();
    } catch (e) {
      console.error(e);
      notify('Failed to save vacancy', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const handleDeleteVacancy = async () => {
    if (!selectedVacancy) return;
    if (!window.confirm('Are you sure you want to delete this vacancy?')) return;
    try {
      setIsBusy(true);
      await deleteVacancy(selectedVacancy.id);
      notify('Vacancy deleted successfully!', 'success');
      setSelectedVacancy(null);
      loadVacancies();
    } catch (e) {
      console.error(e);
      notify('Failed to delete vacancy', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  const logout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('isAuthenticated');
      navigate('/login');
    }
  };
  const [editingHomeId, setEditingHomeId] = useState(null);
  const [tempAdminEmail, setTempAdminEmail] = useState('');

  const startEditHomeEmail = (home) => {
    setEditingHomeId(home.id);
    setTempAdminEmail(home.adminEmail || '');
  };

  const saveHomeEmail = async (home) => {
    try {
      setIsBusy(true);
      await updateHome(home.id, { ...home, adminEmail: tempAdminEmail });
      notify('Admin email updated successfully!', 'success');
      setEditingHomeId(null);
      loadHomes();
    } catch (error) {
      console.error(error);
      notify('Failed to update email.', 'error');
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    if (isHomeAdmin && user?.homeId && homes.length > 0) {
      const myHome = homes.find(h => h.id === user.homeId);
      if (myHome) {
        setReviewLocationFilter(myHome.homeName);
      }
    }
  }, [isHomeAdmin, user, homes]);

  // Derived state for filtered reviews
  const filteredReviews = reviews.filter(r => {
    // 1. Filter by Location Dropdown
    const matchesLocation = !reviewLocationFilter || r.location === reviewLocationFilter;

    // 2. Filter by Search Text
    const q = reviewSearch.trim().toLowerCase();
    const matchesSearch = !q || [
      r.name,
      r.location,
      r.review,
      r.source
    ].filter(Boolean).some(v => String(v).toLowerCase().includes(q));

    return matchesLocation && matchesSearch;
  });

  return (
    <div className="app">
      <header>
        <div className="brand">
          <i className="fa-solid fa-hospital-user"></i>
          <h1>Bellavista Admin</h1>
          <span className="admin-badge">Dashboard</span>
        </div>
        <div className="header-actions">
          <button className="btn" onClick={logout}>
            <i className="fa-solid fa-sign-out-alt"></i>&nbsp;Logout
          </button>
        </div>
      </header>

      <aside data-lenis-prevent>
        <div className="search">
          <i className="fa-solid fa-magnifying-glass"></i>
          <input 
            id="globalSearch" 
            placeholder="Quick search…" 
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
          />
        </div>
        <div className="nav">
          {!isHomeAdmin ? (
          <>
          <div className="group-title">Homes</div>
          <button 
            className="disabled"
            style={{ opacity: 0.5, cursor: 'not-allowed' }}
            title="Temporarily Disabled"
          >
            <i className="fa-solid fa-house-medical"></i><span>Add Home (Disabled)</span>
          </button>
          <button 
            className={activeView === 'update-home' ? 'active' : ''}
            onClick={() => setActiveView('update-home')}
          >
            <i className="fa-solid fa-pen-to-square"></i><span>Update Home</span>
          </button>
          <div className="group-title">News</div>
          <button 
            className={activeView === 'add-news' ? 'active' : ''}
            onClick={() => setActiveView('add-news')}
          >
            <i className="fa-solid fa-newspaper"></i><span>Add News</span>
          </button>
          <button 
            className={activeView === 'update-news' ? 'active' : ''}
            onClick={() => setActiveView('update-news')}
          >
            <i className="fa-solid fa-rectangle-list"></i><span>Update News</span>
          </button>
          <div className="group-title">Content</div>
          <button 
            className={activeView === 'manage-faqs' ? 'active' : ''}
            onClick={() => setActiveView('manage-faqs')}
          >
            <i className="fa-solid fa-circle-question"></i><span>Manage FAQs</span>
          </button>
          <button 
            className={activeView === 'manage-vacancies' ? 'active' : ''}
            onClick={() => setActiveView('manage-vacancies')}
          >
            <i className="fa-solid fa-briefcase"></i><span>Manage Vacancies</span>
          </button>
          <button 
            className={activeView === 'manage-events' ? 'active' : ''}
            onClick={() => setActiveView('manage-events')}
          >
            <i className="fa-solid fa-calendar-alt"></i><span>Manage Events</span>
          </button>
          <button
            className={activeView === 'reviews' ? 'active' : ''}
            onClick={() => setActiveView('reviews')}
          >
            <i className="fa-solid fa-star-half-stroke"></i><span>Reviews</span>
          </button>
          <button
            className={activeView === 'manage-management-team' ? 'active' : ''}
            onClick={() => setActiveView('manage-management-team')}
          >
            <i className="fa-solid fa-user-tie"></i><span>Management Team</span>
          </button>
          {!isHomeAdmin && (
            <>
              <div className="group-title">Users</div>
              <button 
                className={activeView === 'manage-users' ? 'active' : ''}
                onClick={() => setActiveView('manage-users')}
              >
                <i className="fa-solid fa-users-gear"></i><span>User Management</span>
              </button>
            </>
          )}
          <div className="group-title">Enquiries</div>
          <button 
            className={activeView === 'kiosk-links' ? 'active' : ''}
            onClick={() => setActiveView('kiosk-links')}
          >
            <i className="fa-solid fa-tablet-screen-button"></i><span>Reception Kiosks</span>
          </button>
          <button 
            className={activeView === 'scheduled-tours' ? 'active' : ''}
            onClick={() => setActiveView('scheduled-tours')}
          >
            <i className="fa-solid fa-calendar-check"></i><span>Scheduled Tours</span>
          </button>
          <button 
            className={activeView === 'kiosk-checkins' ? 'active' : ''}
            onClick={() => { setActiveView('kiosk-checkins'); loadKioskCheckIns(); }}
          >
            <i className="fa-solid fa-clipboard-list"></i><span>Kiosk Check-Ins</span>
          </button>
          <button 
            className={activeView === 'care-enquiries' ? 'active' : ''}
            onClick={() => setActiveView('care-enquiries')}
          >
            <i className="fa-solid fa-heart"></i><span>Care Enquiries</span>
          </button>
          <button 
            className={activeView === 'career-applications' ? 'active' : ''}
            onClick={() => setActiveView('career-applications')}
          >
            <i className="fa-solid fa-briefcase"></i><span>Career Applications</span>
          </button>
          </>
          ) : (
          <>
            <div className="group-title">Home Content</div>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-image"></i><span>Card Images</span>
            </button>
            <button className={activeView === 'home-section-ciw-report' ? 'active' : ''} onClick={() => setActiveView('home-section-ciw-report')}>
              <i className="fa-solid fa-file-pdf"></i><span>CIW Report</span>
            </button>
            <button className={activeView === 'home-section-newsletter' ? 'active' : ''} onClick={() => setActiveView('home-section-newsletter')}>
              <i className="fa-solid fa-newspaper"></i><span>Newsletter</span>
            </button>
            <button className={activeView === 'home-section-banner-images' ? 'active' : ''} onClick={() => setActiveView('home-section-banner-images')}>
              <i className="fa-solid fa-panorama"></i><span>Scrolling Banner Images</span>
            </button>
            <button className={activeView === 'home-section-facilities-gallery' ? 'active' : ''} onClick={() => setActiveView('home-section-facilities-gallery')}>
              <i className="fa-solid fa-building"></i><span>Facilities Gallery</span>
            </button>
            <button className={activeView === 'home-section-activities-gallery' ? 'active' : ''} onClick={() => setActiveView('home-section-activities-gallery')}>
              <i className="fa-solid fa-person-running"></i><span>Activities Gallery</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-users"></i><span>My Team Gallery</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-user-doctor"></i><span>My Team Positions</span>
            </button>

            <div className="group-title">News & Events</div>
            <button className={activeView === 'add-news' ? 'active' : ''} onClick={() => setActiveView('add-news')}>
              <i className="fa-solid fa-plus"></i><span>Add News</span>
            </button>
            <button className={activeView === 'update-news' ? 'active' : ''} onClick={() => setActiveView('update-news')}>
              <i className="fa-solid fa-pen-to-square"></i><span>Update News</span>
            </button>
            <button className={activeView === 'manage-events' ? 'active' : ''} onClick={() => setActiveView('manage-events')}>
              <i className="fa-solid fa-calendar-alt"></i><span>Manage Events</span>
            </button>

            <div className="group-title">Management</div>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-star"></i><span>Reviews</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-briefcase"></i><span>Manage Vacancies</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-tablet-screen-button"></i><span>Reception Kiosk</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-calendar-check"></i><span>Scheduled Tours</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-clipboard-list"></i><span>Kiosk Check-ins</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-heart"></i><span>Care Enquiries</span>
            </button>
            <button className="disabled" style={{ opacity: 0.5, cursor: 'not-allowed' }} title="Temporarily Disabled">
              <i className="fa-solid fa-user-nurse"></i><span>Career Applications</span>
            </button>
          </>
          )}
        </div>
      </aside>

      <main>
        {activeView === 'add-home' && (
          <HomeForm mode="add" />
        )}

        {(activeView === 'update-home' || activeView.startsWith('home-section-')) && (
          (selectedHome || (isHomeAdmin && homes.find(h => h.id === user.homeId))) ? (
            <HomeForm 
              mode="edit" 
              initialData={selectedHome || (isHomeAdmin && homes.find(h => h.id === user.homeId))} 
              onCancel={() => setSelectedHome(null)}
              onSave={handleSaveHome}
              isHomeAdmin={isHomeAdmin}
              activeSection={activeView.startsWith('home-section-') ? activeView.replace('home-section-', '') : 'all'}
            />
          ) : (
            isHomeAdmin ? (
              <div style={{padding:'20px'}}>Loading home data...</div>
            ) : (
            <section className="panel">
              <h2>Update Home</h2>
              <div className="toolbar">
                <input id="homeSearch" placeholder="Search homes…" style={{flex:1}} />
                {!isHomeAdmin && (
                  <button className="btn ghost small" style={{opacity: 0.5, cursor: 'not-allowed'}} title="Disabled">
                    <i className="fa-solid fa-plus"></i>&nbsp;New
                  </button>
                )}
              </div>
              <div style={{marginTop:'20px'}}>
                <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px'}}>
                  {homes
                    .filter(h => !isHomeAdmin || (user && user.homeId && h.id === user.homeId))
                    .map(home => (
                    <div key={home.id} style={{border:'1px solid #e0e0e0', borderRadius:'10px', overflow:'hidden', background:'white'}}>
                      <div style={{height:'140px', background:`url(${home.homeImage}) center/cover`}}></div>
                      <div style={{padding:'15px'}}>
                        <h3 style={{margin:'0 0 5px 0'}}>{home.homeName}</h3>
                        <p style={{color:'#666', fontSize:'13px', marginBottom:'15px'}}>{home.homeLocation}</p>
                        <button className="btn small" onClick={() => setSelectedHome(home)}>
                          <i className="fa-solid fa-pen"></i> Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            )
          )
        )}

        {activeView === 'add-news' && (
          <NewsForm 
            key={newsFormKey}
            mode="add"
            onNotify={notify}
            onSave={async (newsData) => {
              try {
                setIsBusy(true);
                await createNewsItem(newsData);
                notify('News published successfully!', 'success');
                setNewsFormKey(prev => prev + 1);
                setNewsForm({
                  id: '',
                  title: '',
                  excerpt: '',
                  fullDescription: '',
                  image: '',
                  category: 'events',
                  date: '',
                  location: 'All Locations',
                  author: 'Bellavista Team',
                  badge: '',
                  important: false,
                  gallery: [],
                  videoUrl: '',
                  videoDescription: ''
                });
              } catch (error) {
                console.error('Failed to publish news:', error);
                notify('Failed to publish news. Please try again.', 'error');
              } finally {
                setIsBusy(false);
              }
            }}
          />
        )}

        {activeView === 'update-news' && (
          <section className="panel">
            <h2>Update News</h2>
            {!selectedNews && (
              <>
                <div className="toolbar">
                  <input placeholder="Search news…" style={{flex:1}} />
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:'16px',marginTop:'16px'}}>
                  {newsList.map(item=>(
                    <div key={item.id} style={{border:'1px solid #e0e0e0',borderRadius:'10px',overflow:'hidden',background:'white'}}>
                      <div style={{height:'140px',background:`url(${item.image}) center/cover`}}></div>
                      <div style={{padding:'12px'}}>
                        <h3 style={{margin:'0 0 4px 0', fontSize:'16px'}}>{item.title}</h3>
                        <p className="muted" style={{fontSize:'12px'}}>{item.date} • {item.location}</p>
                        <button className="btn small" style={{marginTop:'8px'}} onClick={()=>startEditNews(item)}><i className="fa-solid fa-pen"></i> Edit</button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            {selectedNews && (
              <NewsForm 
                mode="edit"
                initialData={selectedNews}
                onNotify={notify}
                onCancel={()=>{
                  setSelectedNews(null); 
                  setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                }}
                onSave={async (newsData) => {
                  try {
                    setIsBusy(true);
                    await updateNewsItem(newsData);
                    notify('News updated successfully!', 'success');
                    setSelectedNews(null);
                    setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                    loadNews();
                  } catch (error) {
                    console.error('Failed to update news:', error);
                    notify('Failed to update news. Please try again.', 'error');
                  } finally {
                    setIsBusy(false);
                  }
                }}
                onDelete={async (id) => {
                  try {
                    setIsBusy(true);
                    await deleteNewsItem(id);
                    notify('News deleted successfully!', 'success');
                    setSelectedNews(null);
                    setNewsForm({id:'',title:'',excerpt:'',fullDescription:'',image:'',category:'events',date:'',location:'All Locations',author:'Bellavista Team',badge:'',important:false,gallery:[],videoUrl:'',videoDescription:''});
                    loadNews();
                  } catch (error) {
                    console.error('Failed to delete news:', error);
                    notify('Failed to delete news. Please try again.', 'error');
                  } finally {
                    setIsBusy(false);
                  }
                }}
              />
            )}
          </section>
        )}

        {activeView === 'reviews' && (
          <section className="panel">
            <h2>Reviews</h2>
            <div className="toolbar">
              <input
                placeholder="Search by name, location, text..."
                style={{ flex: 1 }}
                value={reviewSearch}
                onChange={e => setReviewSearch(e.target.value)}
              />
              <select
                value={reviewLocationFilter}
                onChange={e => setReviewLocationFilter(e.target.value)}
                style={{ marginLeft: '8px', minWidth: '200px' }}
                disabled={isHomeAdmin}
              >
                <option value="">All Locations</option>
                <option value="Bellavista Barry">Bellavista Barry</option>
                <option value="Bellavista Cardiff">Bellavista Cardiff</option>
                <option value="Waverley Care Centre">Waverley Care Centre</option>
                <option value="College Fields Nursing Home">College Fields Nursing Home</option>
                <option value="Baltimore Care Home">Baltimore Care Home</option>
                <option value="Meadow Vale Cwtch">Meadow Vale Cwtch</option>
                <option value="Bellavista Nursing Homes">Bellavista Nursing Homes (Group)</option>
              </select>
              <button
                className="btn ghost small"
                style={{ marginLeft: '8px' }}
                onClick={loadReviews}
              >
                <i className="fa-solid fa-rotate"></i>&nbsp;Refresh
              </button>
              <button
                className="btn primary small"
                style={{ marginLeft: '8px' }}
                onClick={() => { setShowImportGoogle(!showImportGoogle); setShowImportCarehome(false); }}
              >
                <i className="fab fa-google"></i>&nbsp;Google Import
              </button>
            </div>

            {showImportGoogle && (
              <div style={{ background: '#e8f0fe', padding: '15px', marginTop: '15px', borderRadius: '8px', border: '1px solid #d2e3fc' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#1967d2' }}>Import from Google Maps</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#555' }}>Target Location</label>
                    <select
                      value={importTargetLocation}
                      onChange={e => setImportTargetLocation(e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Bellavista Barry">Bellavista Barry</option>
                      <option value="Bellavista Cardiff">Bellavista Cardiff</option>
                      <option value="Waverley Care Centre">Waverley Care Centre</option>
                      <option value="College Fields Nursing Home">College Fields Nursing Home</option>
                      <option value="Baltimore Care Home">Baltimore Care Home</option>
                      <option value="Meadow Vale Cwtch">Meadow Vale Cwtch</option>
                      <option value="Bellavista Nursing Homes">Bellavista Nursing Homes (Group)</option>
                    </select>
                  </div>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#555' }}>
                      Google Place ID (<a href="https://developers.google.com/maps/documentation/places/web-service/place-id" target="_blank" rel="noreferrer">Find it here</a>)
                    </label>
                    <input
                      placeholder="e.g. ChIJ..."
                      value={importPlaceId}
                      onChange={e => setImportPlaceId(e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    />
                  </div>
                  <button className="btn primary" onClick={handleImportGoogle} disabled={isBusy}>
                    {isBusy ? 'Importing...' : 'Import Reviews'}
                  </button>
                </div>
              </div>
            )}

            {showImportCarehome && (
              <div style={{ background: '#fce8f3', padding: '15px', marginTop: '15px', borderRadius: '8px', border: '1px solid #fad2e6' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#e6007e' }}>Import from Carehome.co.uk</h4>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <label style={{ display: 'block', fontSize: '12px', marginBottom: '4px', color: '#555' }}>Target Location</label>
                    <select
                      value={importTargetLocation}
                      onChange={e => setImportTargetLocation(e.target.value)}
                      style={{ width: '100%', padding: '8px' }}
                    >
                      <option value="Bellavista Barry">Bellavista Barry</option>
                      <option value="Bellavista Cardiff">Bellavista Cardiff</option>
                      <option value="Waverley Care Centre">Waverley Care Centre</option>
                      <option value="College Fields Nursing Home">College Fields Nursing Home</option>
                      <option value="Baltimore Care Home">Baltimore Care Home</option>
                      <option value="Meadow Vale Cwtch">Meadow Vale Cwtch</option>
                      <option value="Bellavista Nursing Homes">Bellavista Nursing Homes (Group)</option>
                    </select>
                  </div>
                  <div style={{ flex: 2 }}>
                    <p style={{ fontSize: '12px', color: '#666', margin: '0 0 4px 0', lineHeight: '1.4' }}>
                      This will scrape the latest reviews directly from the carehome.co.uk page for the selected location.
                    </p>
                  </div>
                  <button 
                    className="btn primary" 
                    style={{ background: '#e6007e', borderColor: '#e6007e' }} 
                    onClick={handleImportCarehome} 
                    disabled={isBusy}
                  >
                    {isBusy ? 'Scraping...' : 'Start Import'}
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '16px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f7f9fc' }}>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Location</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Rating</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Review</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Source</th>
                    <th style={{ textAlign: 'left', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Created</th>
                    <th style={{ textAlign: 'right', padding: '10px', borderBottom: '1px solid #e0e0e0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews
                    .map(r => (
                      <tr key={r.id}>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>{r.name}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>{r.location}</td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                          <span style={{ color: '#ffc107' }}>
                            {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                          </span>
                          <span style={{ marginLeft: '4px', fontSize: '12px', color: '#555' }}>
                            {r.rating}/5
                          </span>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', maxWidth: '350px' }}>
                          {r.review}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                          <span className="muted" style={{ fontSize: '12px' }}>{r.source}</span>
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', fontSize: '12px' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleString() : ''}
                        </td>
                        <td style={{ padding: '10px', borderBottom: '1px solid #f0f0f0', textAlign: 'right' }}>
                          <button
                            className="btn small"
                            style={{ background: '#ff4d4f', color: 'white' }}
                            onClick={() => handleDeleteReview(r.id)}
                          >
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  {filteredReviews.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                        No reviews found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'manage-management-team' && (
          <section className="panel">
            <h2>Management Team</h2>
            
            {isEditingMgmt ? (
              <div className="field-group" style={{background:'#f8f9fa', padding:'20px', borderRadius:'10px', marginBottom:'20px'}}>
                <h3 style={{marginBottom:'15px'}}>{mgmtForm.id ? 'Edit Member' : 'Add Member'}</h3>
                <div className="grid cols-2">
                  <div className="field">
                    <label>Name</label>
                    <input 
                      value={mgmtForm.name} 
                      onChange={e => setMgmtForm({...mgmtForm, name: e.target.value})}
                      placeholder="e.g. Helen Randall"
                    />
                  </div>
                  <div className="field">
                    <label>Role</label>
                    <input 
                      value={mgmtForm.role} 
                      onChange={e => setMgmtForm({...mgmtForm, role: e.target.value})}
                      placeholder="e.g. Home Manager"
                    />
                  </div>
                  <div className="field" style={{gridColumn:'1/-1'}}>
                    <label>Description</label>
                    <ReactQuill 
                      theme="snow"
                      value={mgmtForm.description} 
                      onChange={value => setMgmtForm({...mgmtForm, description: value})}
                      placeholder="Brief description of role and responsibilities..."
                      style={{height: '150px', marginBottom: '50px'}}
                    />
                  </div>
                  <div className="field">
                    <label>Sort Order</label>
                    <input 
                      type="number"
                      value={mgmtForm.order} 
                      onChange={e => setMgmtForm({...mgmtForm, order: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  <div className="field">
                    <label>Photo</label>
                    <ImageUploader 
                      currentImage={mgmtForm.image}
                      onImageSelect={(base64) => setMgmtForm({...mgmtForm, image: base64})}
                    />
                  </div>
                </div>
                <div className="toolbar" style={{marginTop:'20px'}}>
                  <button className="btn" onClick={handleSaveMgmt}>Save Member</button>
                  <button className="btn ghost" onClick={() => setIsEditingMgmt(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="toolbar">
                <div className="right"></div>
                <button className="btn" onClick={() => {
                  setMgmtForm({ id: '', name: '', role: '', description: '', image: '', order: 0 });
                  setIsEditingMgmt(true);
                }}>
                  <i className="fa-solid fa-plus"></i>&nbsp;Add Member
                </button>
              </div>
            )}

            <div style={{marginTop:'10px'}}>
              {mgmtMembers.length === 0 && !isEditingMgmt && (
                <div style={{textAlign:'center', padding:'40px', background:'#f8f9fa', borderRadius:'10px'}}>
                  <p className="muted" style={{marginBottom:'20px'}}>No management team members found.</p>
                  <button className="btn" onClick={handleSeedMgmt}>
                    <i className="fa-solid fa-seedling"></i>&nbsp;Load Default Team
                  </button>
                </div>
              )}

              {mgmtMembers.map((m) => (
                <div key={m.id} style={{
                  background:'#fff', 
                  border:'1px solid #e6eef7',
                  padding:'16px', 
                  borderRadius:'12px', 
                  marginBottom:'12px', 
                  display:'flex', 
                  gap:'16px',
                  alignItems:'center'
                }}>
                  <div style={{width:'60px', height:'60px', borderRadius:'50%', overflow:'hidden', flexShrink:0, background:'#f0f4f8', display:'grid', placeItems:'center'}}>
                    {m.image ? (
                      <img src={m.image} style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    ) : (
                      <i className="fa-solid fa-user" style={{color:'#cbd5e1'}}></i>
                    )}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:'flex', gap:'10px', alignItems:'baseline'}}>
                      <h3 style={{margin:0, fontSize:'16px'}}>{m.name}</h3>
                      <span className="muted" style={{fontSize:'13px'}}>{m.role}</span>
                    </div>
                    <p style={{margin:'4px 0 0', fontSize:'14px', color:'#64748b'}}>{m.description}</p>
                  </div>
                  <div style={{display:'flex', gap:'8px'}}>
                    <button className="btn small ghost" onClick={() => {
                      setMgmtForm(m);
                      setIsEditingMgmt(true);
                      window.scrollTo({top:0, behavior:'smooth'});
                    }}>
                      <i className="fa-solid fa-pen"></i>
                    </button>
                    <button className="btn small" style={{background:'#ff4d4f', color:'white', borderColor:'#ff4d4f'}} onClick={() => handleDeleteMgmt(m.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
              {/* Removed duplicate empty check */}
            </div>
          </section>
        )}

        {activeView === 'manage-faqs' && (
          <section className="panel">
            <h2>Manage FAQs</h2>
            <div className="grid cols-2">
              <div className="field"><label>Question</label><input value={faqQuestion} onChange={e=>setFaqQuestion(e.target.value)} type="text" placeholder="What types of care do you provide?"/></div>
              <div className="field" style={{gridColumn:'1/-1'}}>
                <label>Answer</label>
                <ReactQuill 
                  theme="snow"
                  value={faqAnswer} 
                  onChange={setFaqAnswer}
                  placeholder="We provide residential, nursing, dementia, respite, and palliative care…"
                  style={{height: '150px', marginBottom: '50px'}}
                />
              </div>
            </div>
            <div className="toolbar">
              <div className="right"></div>
              <button className="btn" onClick={addFaqHandler}>
                <i className="fa-solid fa-plus"></i>&nbsp;Add FAQ
              </button>
            </div>
            <div style={{marginTop:'10px'}}>
              {faqs.map((f)=>(
                <div key={f.id || Math.random()} style={{background:'#f0f4f8', padding:'12px', borderRadius:'8px', marginBottom:'8px', display:'flex', justifyContent:'space-between', alignItems:'start'}}>
                  <div>
                    <strong>{f.question}</strong>
                    <div className="muted" style={{fontSize:'13px', marginTop:'4px'}} dangerouslySetInnerHTML={{ __html: f.answer }} />
                  </div>
                  {f.id && (
                    <button className="btn small" style={{background:'#ff4d4f', color:'white', marginLeft:'10px'}} onClick={()=>removeFaq(f.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  )}
                </div>
              ))}
              {faqs.length === 0 && <p className="muted">No FAQs found.</p>}
            </div>
          </section>
        )}

        {activeView === 'manage-vacancies' && (
          <section className="panel">
            <h2>Manage Vacancies</h2>
            
            {(selectedVacancy || isAddingVacancy) ? (
              <VacancyForm
                mode={selectedVacancy ? 'edit' : 'add'}
                initialData={selectedVacancy}
                onSave={handleSaveVacancy}
                onCancel={() => {
                  setSelectedVacancy(null);
                  setIsAddingVacancy(false);
                }}
                onDelete={handleDeleteVacancy}
              />
            ) : (
              <>
                <div className="toolbar">
                  <button className="btn primary" onClick={() => setIsAddingVacancy(true)}>
                    <i className="fa-solid fa-plus"></i> Add New Vacancy
                  </button>
                  <button className="btn ghost small" onClick={loadVacancies}>
                    <i className="fa-solid fa-rotate"></i> Refresh
                  </button>
                </div>

                <div className="list-container" style={{ marginTop: '20px' }}>
                  {vacancies.map(vacancy => (
                    <div key={vacancy.id} className="list-item" style={{
                      padding: '15px', 
                      background: '#f8f9fa', 
                      borderRadius: '8px', 
                      marginBottom: '10px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      border: '1px solid #e9ecef'
                    }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        {vacancy.image && (
                          <img 
                            src={vacancy.image} 
                            alt={vacancy.title} 
                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                          />
                        )}
                        <div>
                          <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{vacancy.title}</h3>
                          <div style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                            {vacancy.location && <span style={{ marginRight: '15px' }}><i className="fa-solid fa-map-marker-alt"></i> {vacancy.location}</span>}
                            {vacancy.type && <span><i className="fa-solid fa-clock"></i> {vacancy.type}</span>}
                          </div>
                        </div>
                      </div>
                      <button className="btn small" onClick={() => setSelectedVacancy(vacancy)}>
                        <i className="fa-solid fa-pen"></i> Edit
                      </button>
                    </div>
                  ))}
                  
                  {vacancies.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}>
                      <p>No vacancies found. Click "Add New Vacancy" to create one.</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {activeView === 'manage-events' && (
          <EventsManager notify={notify} />
        )}

        {activeView === 'kiosk-links' && (
          <section className="panel">
            <h2>Reception Kiosk Links</h2>
            <p>Open these links on the tablet/device at each reception desk.</p>
            <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(250px, 1fr))', gap:'20px', marginTop:'20px'}}>
              {[
                {id: 'barry', name: 'Bellavista Barry'},
                {id: 'cardiff', name: 'Bellavista Cardiff'},
                {id: 'waverley', name: 'Waverley Care Centre'},
                {id: 'college-fields', name: 'College Fields'},
                {id: 'baltimore', name: 'Baltimore Care Home'},
                {id: 'meadow-vale', name: 'Meadow Vale Cwtch'}
              ].map(home => (
                <div key={home.id} style={{border:'1px solid #e0e0e0', borderRadius:'10px', padding:'20px', background:'white'}}>
                  <h3>{home.name}</h3>
                  <div style={{marginTop:'15px'}}>
                    <a 
                      href={`/kiosk/${home.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="btn"
                      style={{display:'block', textAlign:'center', textDecoration:'none'}}
                    >
                      <i className="fa-solid fa-external-link-alt"></i> Open Kiosk
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeView === 'kiosk-link' && (
          <section className="panel">
             <h2>Reception Kiosk</h2>
             {isHomeAdmin && user.homeId ? (
                <div style={{marginTop:'20px'}}>
                  <p>Open this link on the tablet/device at the reception desk.</p>
                  <a 
                    href={`/kiosk/${user.homeId}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="btn"
                    style={{display:'inline-block', textDecoration:'none', marginTop:'10px', background:'#28a745', color:'white'}}
                  >
                    <i className="fa-solid fa-external-link-alt"></i> Open Kiosk for My Home
                  </a>
                </div>
             ) : (
                <p>No home assigned or available.</p>
             )}
          </section>
        )}

        {activeView === 'scheduled-tours' && (
          <section className="panel">
            <h2>Scheduled Tours</h2>
            <div className="toolbar">
              <input placeholder="Search by name, location, phone..." style={{flex:1}} value={bookingSearch} onChange={e=>setBookingSearch(e.target.value)}/>
              <button className="btn small" onClick={() => setShowDownloadModal(true)} style={{marginRight:'8px'}}>
                <i className="fa-solid fa-download"></i>&nbsp;Download Excel
              </button>
              <button className="btn ghost small" onClick={loadBookings}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            
            {showDownloadModal && (
              <div style={{
                position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
              }}>
                <div style={{background: 'white', padding: '20px', borderRadius: '8px', width: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'}}>
                  <h3 style={{marginTop: 0, marginBottom: '20px'}}>Download Bookings</h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                    <button className="btn" onClick={() => handleDownload('all')}>
                      <i className="fa-solid fa-file-csv"></i>&nbsp;Download All Requests
                    </button>
                    <button className="btn" style={{background: '#28a745', color: 'white', border: 'none'}} onClick={() => handleDownload('visited')}>
                      <i className="fa-solid fa-check-double"></i>&nbsp;Download Visited Only
                    </button>
                    <button className="btn ghost" onClick={() => setShowDownloadModal(false)} style={{marginTop: '10px'}}>
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Preferred</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Visited?</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings
                    .filter(b => {
                      const q = bookingSearch.trim().toLowerCase();
                      if (!q) return true;
                      return [
                        b.name, b.phone, b.email, b.location, b.preferredDate, b.preferredTime
                      ].filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(b => (
                      <tr key={b.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.name}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.location}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{b.preferredDate} • {b.preferredTime}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{new Date(b.createdAt).toLocaleString()}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                          <span style={{
                            background: b.status === 'visited' ? '#d4edda' : (b.status === 'cancelled' ? '#f8d7da' : '#eaf6ff'), 
                            color: b.status === 'visited' ? '#155724' : (b.status === 'cancelled' ? '#721c24' : '#0366d6'), 
                            padding:'4px 8px', borderRadius:'12px', fontSize:'12px'
                          }}>
                            {b.status || 'requested'}
                          </span>
                        </td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                          <button 
                            className="btn small" 
                            style={{marginRight:'5px', background: b.status === 'visited' ? '#28a745' : '#eee', color: b.status === 'visited' ? 'white' : '#333'}}
                            onClick={() => updateBookingStatus(b.id, 'visited')}
                            title="Mark as Visited"
                          >
                            <i className="fa-solid fa-check"></i>
                          </button>
                          <button 
                            className="btn small"
                            style={{background: b.status === 'cancelled' ? '#dc3545' : '#eee', color: b.status === 'cancelled' ? 'white' : '#333'}}
                            onClick={() => updateBookingStatus(b.id, 'cancelled')}
                            title="Mark as Cancelled"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="8" style={{padding:'20px', textAlign:'center', color:'#666'}}>No tour requests yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'kiosk-checkins' && (
          <section className="panel">
            <h2>Visitor Check-Ins (Kiosk)</h2>
            <div className="toolbar">
              <input placeholder="Search by name, location, email..." style={{flex:1}} value={kioskSearch} onChange={e=>setKioskSearch(e.target.value)}/>
              <button className="btn ghost small" onClick={loadKioskCheckIns}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            
            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Check-In Time</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Purpose</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {kioskCheckIns
                    .filter(c => kioskSearch === '' || 
                      c.name?.toLowerCase().includes(kioskSearch.toLowerCase()) ||
                      c.location?.toLowerCase().includes(kioskSearch.toLowerCase()) ||
                      c.email?.toLowerCase().includes(kioskSearch.toLowerCase())
                    )
                    .map(c => (
                      <tr key={c.id} style={{borderBottom:'1px solid #f0f0f0'}}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}><strong>{c.name}</strong></td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{c.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{c.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{c.location}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0', fontSize:'13px'}}>
                          {new Date(c.checkInTime).toLocaleString()}
                        </td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0', fontSize:'13px'}}>
                          {c.visitPurpose || '—'}
                        </td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                          <span style={{
                            background: c.status === 'checked-out' ? '#d4edda' : '#cce5ff',
                            color: c.status === 'checked-out' ? '#155724' : '#0366d6', 
                            padding:'4px 8px', borderRadius:'12px', fontSize:'12px'
                          }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  {kioskCheckIns.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{padding:'20px', textAlign:'center', color:'#666'}}>No check-ins yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'care-enquiries' && (
          <section className="panel">
            <h2>Care Enquiries</h2>
            <div className="toolbar">
              <input placeholder="Search by name, phone, type, location..." style={{flex:1}} value={enquirySearch} onChange={e=>setEnquirySearch(e.target.value)} />
              <button className="btn ghost small" onClick={loadEnquiries}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Phone</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Type</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Message</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries
                    .filter(e => {
                      const q = enquirySearch.trim().toLowerCase();
                      if (!q) return true;
                      return [e.name, e.phone, e.email, e.enquiryType, e.location, e.message]
                        .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(e => (
                      <tr key={e.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.name}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.phone}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.enquiryType}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.location}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{e.message}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{new Date(e.createdAt).toLocaleString()}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}><span style={{background:'#fff4e5', color:'#a15c00', padding:'4px 8px', borderRadius:'12px', fontSize:'12px'}}>{e.status || 'received'}</span></td>
                      </tr>
                    ))}
                  {enquiries.length === 0 && (
                    <tr><td colSpan="8" style={{padding:'20px', textAlign:'center', color:'#666'}}>No enquiries yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'career-applications' && (
          <section className="panel">
            <h2>Career Applications</h2>
            <div className="toolbar">
              <input placeholder="Search by name, phone, position..." style={{flex:1}} value={applicationSearch} onChange={e=>setApplicationSearch(e.target.value)} />
              <button className="btn ghost small" onClick={loadApplications}><i className="fa-solid fa-rotate"></i>&nbsp;Refresh</button>
            </div>
            <div style={{marginTop:'16px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Name</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Email</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Position</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>CV</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'left', padding:'10px', borderBottom:'1px solid #e0e0e0'}}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications
                    .filter(a => {
                      const q = applicationSearch.trim().toLowerCase();
                      if (!q) return true;
                      return [a.firstName, a.lastName, a.email, a.jobRole, a.status]
                        .filter(Boolean).some(v => String(v).toLowerCase().includes(q));
                    })
                    .map(a => (
                      <tr key={a.id}>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.firstName} {a.lastName}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.email}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.jobRole}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                            {a.cvUrl ? (
                                <a href={a.cvUrl} target="_blank" rel="noreferrer" style={{color:'var(--primary-blue)', textDecoration:'underline'}}>
                                    <i className="fa-solid fa-file-pdf"></i> View CV
                                </a>
                            ) : <span className="muted">No CV</span>}
                        </td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>{a.createdAt ? new Date(a.createdAt).toLocaleString() : 'N/A'}</td>
                        <td style={{padding:'10px', borderBottom:'1px solid #f0f0f0'}}>
                            <span style={{background:'#e6f7ff', color:'#1890ff', padding:'4px 8px', borderRadius:'12px', fontSize:'12px'}}>
                                {a.status || 'received'}
                            </span>
                        </td>
                      </tr>
                    ))}
                  {applications.length === 0 && (
                    <tr><td colSpan="6" style={{padding:'20px', textAlign:'center', color:'#666'}}>No applications yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {activeView === 'manage-users' && (
          <section className="panel">
            <h2>User Management</h2>
            
            <div className="group-title" style={{marginTop:'0', marginBottom:'15px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
              <i className="fa-solid fa-users-gear"></i> System Users (Login Accounts)
            </div>
            
            {isAddingUser ? (
              <div className="field-group" style={{background:'#f8f9fa', padding:'20px', borderRadius:'10px', marginBottom:'20px'}}>
                <h3 style={{marginBottom:'15px'}}>Create New User</h3>
                <div className="grid cols-2">
                  <div className="field">
                    <label>Username</label>
                    <input 
                      value={userForm.username} 
                      onChange={e => setUserForm({...userForm, username: e.target.value})}
                      placeholder="e.g. barry_admin"
                    />
                  </div>
                  <div className="field">
                    <label>Password</label>
                    <input 
                      type="password"
                      value={userForm.password} 
                      onChange={e => setUserForm({...userForm, password: e.target.value})}
                      placeholder="Initial password"
                    />
                  </div>
                  <div className="field">
                    <label>Role</label>
                    <select 
                      value={userForm.role} 
                      onChange={e => setUserForm({...userForm, role: e.target.value})}
                    >
                      <option value="home_admin">Home Admin</option>
                      <option value="superadmin">Superadmin</option>
                    </select>
                  </div>
                  {userForm.role === 'home_admin' && (
                    <div className="field">
                      <label>Assign to Home</label>
                      <select 
                        value={userForm.home_id} 
                        onChange={e => setUserForm({...userForm, home_id: e.target.value})}
                      >
                        <option value="">Select a Home...</option>
                        {homes.map(h => (
                          <option key={h.id} value={h.id}>{h.homeName}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
                <div className="toolbar" style={{marginTop:'20px'}}>
                  <button className="btn" onClick={handleCreateUser}>Create User</button>
                  <button className="btn ghost" onClick={() => setIsAddingUser(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="toolbar">
                 <p className="muted" style={{flex:1}}>Manage login accounts for Home Admins.</p>
                 <button className="btn" onClick={() => setIsAddingUser(true)}>
                   <i className="fa-solid fa-plus"></i>&nbsp;Add User
                 </button>
              </div>
            )}

            <div style={{marginTop:'20px', overflowX:'auto', marginBottom: '40px'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Username</th>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Role</th>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Assigned Home</th>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Created</th>
                    <th style={{textAlign:'right', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}><strong>{u.username}</strong></td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}>
                        <span style={{
                          background: u.role === 'superadmin' ? '#e6f7ff' : '#f6ffed',
                          color: u.role === 'superadmin' ? '#1890ff' : '#52c41a',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'
                        }}>
                          {u.role === 'superadmin' ? 'Superadmin' : 'Home Admin'}
                        </span>
                      </td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}>
                         {u.home_name || (u.role === 'superadmin' ? 'All Homes' : <span className="muted">None</span>)}
                      </td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0', fontSize:'13px'}}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0', textAlign:'right'}}>
                        <button className="btn small" style={{background:'#ff4d4f', color:'white', borderColor:'#ff4d4f'}} onClick={() => handleDeleteUser(u.id)}>
                           <i className="fa-solid fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan="5" style={{padding:'20px', textAlign:'center', color:'#666'}}>No users found</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="group-title" style={{marginTop:'30px', marginBottom:'15px', borderBottom: '1px solid #eee', paddingBottom: '5px'}}>
              <i className="fa-solid fa-envelope"></i> Notification Emails
            </div>
            <p className="muted" style={{marginBottom:'15px'}}>Configure which email addresses receive tour booking notifications for each location.</p>
            <div style={{marginTop:'10px', overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse'}}>
                <thead>
                  <tr style={{background:'#f7f9fc'}}>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Home</th>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Location</th>
                    <th style={{textAlign:'left', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Admin Email</th>
                    <th style={{textAlign:'right', padding:'12px', borderBottom:'1px solid #e0e0e0'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {homes.map(home => (
                    <tr key={home.id}>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}><strong>{home.homeName}</strong></td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}>{home.homeLocation}</td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0'}}>
                        {editingHomeId === home.id ? (
                          <input 
                            type="email" 
                            value={tempAdminEmail} 
                            onChange={(e) => setTempAdminEmail(e.target.value)}
                            style={{padding:'8px', width:'100%', boxSizing:'border-box'}}
                          />
                        ) : (
                          home.adminEmail || <span className="muted">Not set</span>
                        )}
                      </td>
                      <td style={{padding:'12px', borderBottom:'1px solid #f0f0f0', textAlign:'right'}}>
                        {editingHomeId === home.id ? (
                          <>
                            <button className="btn small" onClick={() => saveHomeEmail(home)} style={{marginRight:'5px', background:'#28a745', color:'white'}}>
                              <i className="fa-solid fa-check"></i> Save
                            </button>
                            <button className="btn small ghost" onClick={() => setEditingHomeId(null)}>
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                          </>
                        ) : (
                          <button className="btn small" onClick={() => startEditHomeEmail(home)}>
                            <i className="fa-solid fa-pen"></i> Edit
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
      {isBusy && (
        <div className="loading-overlay">
          <div style={{display:'grid',placeItems:'center'}}>
            <div className="spinner"></div>
            <div className="loading-text">Processing…</div>
          </div>
        </div>
      )}
      {toast.visible && (
        <div className="toast-container">
          <div className={`toast ${toast.type}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
};

export default AdminConsole;
