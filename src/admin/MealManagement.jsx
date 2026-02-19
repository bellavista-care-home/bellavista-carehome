import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getAuthHeader } from '../services/authService';
import '../styles/MealManagement.css';
import CopyMealPanel from './components/CopyMealPanel';

const MealManagement = () => {
  const [homes, setHomes] = useState([]);
  const [selectedHomeId, setSelectedHomeId] = useState('');
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingMealId, setEditingMealId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userHomeId, setUserHomeId] = useState(null);

  // Week state for date-specific management
  const today = new Date();
  const getWeekStart = (d = new Date()) => {
    const date = new Date(d);
    const dayIndex = (date.getDay() + 6) % 7; // Monday = 0
    const monday = new Date(date);
    monday.setDate(date.getDate() - dayIndex);
    monday.setHours(0,0,0,0);
    return monday;
  };
  const [weekStart, setWeekStart] = useState(getWeekStart());
  const [selectedDay, setSelectedDay] = useState(today.toLocaleDateString('en-GB', { weekday: 'long' }));
  const [createForWeek, setCreateForWeek] = useState(false);

  // Copy-single-meal UI state (panel moved to `CopyMealPanel` component)
  const [copyTargetMealId, setCopyTargetMealId] = useState(null);
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const commonAllergens = ['Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Fish', 'Shellfish', 'Sesame'];
  const commonTags = ['Vegetarian', 'Vegan', 'High-Protein', 'Low-Sodium', 'Diabetic-Friendly', 'Nut-Free'];

  const [formData, setFormData] = useState({
    dayOfWeek: 'Monday',
    mealType: 'Breakfast',
    mealName: '',
    description: '',
    imageUrl: '',
    ingredients: [],
    allergyInfo: [],
    nutritionalInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: ''
    },
    tags: [],
    isSpecialMenu: false,
    effectiveDate: new Date().toISOString().slice(0,10) // default to today
  });

  // Get current user info from token
  useEffect(() => {
    import('../services/authService').then(({ getCurrentUser }) => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUserRole(currentUser.role);
        setUserHomeId(currentUser.homeId || currentUser.home_id || null);
      }
    }).catch(err => console.error('Failed to get current user:', err));
  }, []);

  // Fetch homes
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch('/api/homes');
        if (response.ok) {
          const data = await response.json();
          let homesArray = Array.isArray(data) ? data : [];
          
          // Map the property names if needed (API returns homeName)
          homesArray = homesArray.map(home => ({
            id: home.id,
            name: home.homeName || home.name || 'Unknown Home'
          }));
          
          setHomes(homesArray);
          
          // Set default home based on user role
          if (userRole === 'superadmin' && homesArray.length > 0) {
            setSelectedHomeId(homesArray[0].id);
          } else if (userRole === 'home_admin' && userHomeId) {
            setSelectedHomeId(userHomeId);
          }
        } else {
          console.error('Failed to fetch homes:', response.status);
          setHomes([]);
        }
      } catch (err) {
        console.error('Error fetching homes:', err);
        setHomes([]);
      }
    };

    if (userRole) {
      fetchHomes();
    }
  }, [userRole, userHomeId]);

  // Fetch meal plans for selected home
  useEffect(() => {
    if (!selectedHomeId) return;

    const fetchMealPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const headers = {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        };
        // include weekStart so backend/filtering can be implemented later if needed
        const qs = `?weekStart=${weekStart.toISOString().slice(0,10)}`;
        const response = await fetch(`/api/meal-plans/${selectedHomeId}${qs}`, { headers });
        if (response.ok) {
          const data = await response.json();
          const mealsArray = data.data || data || [];
          const activeMeals = Array.isArray(mealsArray) 
            ? mealsArray.filter(meal => meal.isActive !== false)
            : [];
          setMealPlans(activeMeals);
        } else {
          throw new Error('Failed to fetch meal plans');
        }
      } catch (err) {
        setError(err.message);
        setMealPlans([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMealPlans();
  }, [selectedHomeId, weekStart]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('nutrition.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutritionalInfo: {
          ...prev.nutritionalInfo,
          [field]: value
        }
      }));
    } else if (type === 'checkbox') {
      if (name === 'isSpecialMenu') {
        setFormData(prev => ({
          ...prev,
          isSpecialMenu: checked
        }));
      } else if (name.startsWith('allergen_')) {
        const allergen = name.replace('allergen_', '');
        setFormData(prev => ({
          ...prev,
          allergyInfo: checked
            ? [...prev.allergyInfo, allergen]
            : prev.allergyInfo.filter(a => a !== allergen)
        }));
      } else if (name.startsWith('tag_')) {
        const tag = name.replace('tag_', '');
        setFormData(prev => ({
          ...prev,
          tags: checked
            ? [...prev.tags, tag]
            : prev.tags.filter(t => t !== tag)
        }));
      }
    } else {
      // if effectiveDate changes, also set the dayOfWeek automatically
      if (name === 'effectiveDate') {
        const d = new Date(value + 'T00:00:00');
        const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
        setFormData(prev => ({
          ...prev,
          effectiveDate: value,
          dayOfWeek: weekday
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }
  };

  const handleAddIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }));
  };

  const handleRemoveIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleIngredientChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError(null);

    if (!selectedHomeId || !formData.mealName || !formData.effectiveDate) {
      setError('Please select a home, enter a meal name and choose a date');
      return;
    }

    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };

      if (createForWeek) {
        // create same meal for every day of the selected week
        const weekDates = getWeekDates(weekStart);
        const meals = weekDates.map(d => ({
          dayOfWeek: d.toLocaleDateString('en-GB', { weekday: 'long' }),
          mealType: formData.mealType,
          mealName: formData.mealName,
          description: formData.description,
          ingredients: formData.ingredients.filter(i => i),
          allergyInfo: formData.allergyInfo,
          imageUrl: formData.imageUrl,
          nutritionalInfo: {
            calories: formData.nutritionalInfo.calories ? parseInt(formData.nutritionalInfo.calories) : null,
            protein: formData.nutritionalInfo.protein ? parseFloat(formData.nutritionalInfo.protein) : null,
            carbs: formData.nutritionalInfo.carbs ? parseFloat(formData.nutritionalInfo.carbs) : null,
            fat: formData.nutritionalInfo.fat ? parseFloat(formData.nutritionalInfo.fat) : null,
            fiber: formData.nutritionalInfo.fiber ? parseFloat(formData.nutritionalInfo.fiber) : null
          },
          tags: formData.tags,
          isSpecialMenu: formData.isSpecialMenu,
          effectiveDate: d.toISOString().slice(0,10)
        }));

        const resp = await fetch('/api/meal-plans/bulk-create', {
          method: 'POST',
          headers,
          body: JSON.stringify({ homeId: selectedHomeId, meals })
        });

        if (!resp.ok) throw new Error('Failed to create meals for week');

      } else {
        const payload = {
          homeId: selectedHomeId,
          ...formData,
          ingredients: formData.ingredients.filter(i => i),
          nutritionalInfo: {
            calories: formData.nutritionalInfo.calories ? parseInt(formData.nutritionalInfo.calories) : null,
            protein: formData.nutritionalInfo.protein ? parseFloat(formData.nutritionalInfo.protein) : null,
            carbs: formData.nutritionalInfo.carbs ? parseFloat(formData.nutritionalInfo.carbs) : null,
            fat: formData.nutritionalInfo.fat ? parseFloat(formData.nutritionalInfo.fat) : null,
            fiber: formData.nutritionalInfo.fiber ? parseFloat(formData.nutritionalInfo.fiber) : null
          }
        };

        const method = editingMealId ? 'PUT' : 'POST';
        const url = editingMealId ? `/api/meal-plans/${editingMealId}` : '/api/meal-plans/';

        const response = await fetch(url, { method, headers, body: JSON.stringify(payload) });
        if (!response.ok) throw new Error('Failed to save meal plan');
      }

      // refresh list for the selected week
      resetForm();
      setShowForm(false);
      const mealsResponse = await fetch(`/api/meal-plans/${selectedHomeId}?weekStart=${weekStart.toISOString().slice(0,10)}`, { headers });
      if (mealsResponse.ok) {
        const data = await mealsResponse.json();
        const mealsArray = data.data || data || [];
        const activeMeals = Array.isArray(mealsArray) ? mealsArray.filter(m => m.isActive !== false) : [];
        setMealPlans(activeMeals);
      }

    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditMeal = (meal) => {
    setFormData({
      dayOfWeek: meal.dayOfWeek,
      mealType: meal.mealType,
      mealName: meal.mealName,
      description: meal.description || '',
      imageUrl: meal.imageUrl || '',
      ingredients: meal.ingredients || [],
      allergyInfo: meal.allergyInfo || [],
      nutritionalInfo: meal.nutritionalInfo || {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: ''
      },
      tags: meal.tags || [],
      isSpecialMenu: meal.isSpecialMenu || false,
      effectiveDate: meal.effectiveDate || ''
    });
    setEditingMealId(meal.id);
    setShowForm(true);
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;

    try {
      const response = await fetch(`/api/meal-plans/${mealId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        }
      });

      if (response.status === 401) {
        // Token expired - redirect to login
        alert('Your session has expired. Please log in again.');
        window.location.href = '/admin/login';
        return;
      }

      if (response.ok) {
        // Re-fetch meals
        await refreshMeals();
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || errorData.error || 'Failed to delete meal plan');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    const weekDates = getWeekDates(weekStart);
    const selIndex = days.indexOf(selectedDay) >= 0 ? days.indexOf(selectedDay) : 0;
    const defaultDate = weekDates[selIndex] ? weekDates[selIndex].toISOString().slice(0,10) : new Date().toISOString().slice(0,10);

    setFormData({
      dayOfWeek: 'Monday',
      mealType: 'Breakfast',
      mealName: '',
      description: '',
      imageUrl: '',
      ingredients: [],
      allergyInfo: [],
      nutritionalInfo: {
        calories: '',
        protein: '',
        carbs: '',
        fat: '',
        fiber: ''
      },
      tags: [],
      isSpecialMenu: false,
      effectiveDate: defaultDate
    });
    setEditingMealId(null);
    setCreateForWeek(false);
  }; 

  // helper to re-fetch meals for the selected home/week
  const refreshMeals = async () => {
    if (!selectedHomeId) return;
    try {
      const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
      const mealsResponse = await fetch(`/api/meal-plans/${selectedHomeId}?weekStart=${weekStart.toISOString().slice(0,10)}`, { headers });
      if (mealsResponse.ok) {
        const data = await mealsResponse.json();
        const mealsArray = data.data || data || [];
        setMealPlans(Array.isArray(mealsArray) ? mealsArray.filter(m => m.isActive !== false) : []);
      }
    } catch (err) {
      console.error('Failed to refresh meals:', err);
    }
  };

  const handleCancelForm = () => {
    resetForm();
    setShowForm(false);
  };

  // Week helpers
  const getWeekDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatISO = (date) => date.toISOString().slice(0,10);

  const formatWeekRange = (start) => {
    const s = new Date(start);
    const e = new Date(start);
    e.setDate(s.getDate() + 6);
    if (s.getMonth() === e.getMonth()) {
      return `${s.getDate()}–${e.getDate()} ${s.toLocaleDateString('default', { month: 'long' })} ${s.getFullYear()}`;
    }
    return `${s.getDate()} ${s.toLocaleDateString('en-GB', { month: 'short' })} – ${e.getDate()} ${e.toLocaleDateString('en-GB', { month: 'short' })} ${e.getFullYear()}`;
  };

  // Group meals for the currently selected week - include date-specific and recurring templates
  const mealsByDay = days.reduce((acc, day, idx) => {
    acc[day] = [];
    const weekDates = getWeekDates(weekStart);
    const dateForDay = weekDates[idx];
    const isoDate = formatISO(dateForDay);

    // date-specific meals for that date
    const dateMeals = mealPlans.filter(m => m.effectiveDate === isoDate && m.dayOfWeek === day);
    // recurring template meals (no effectiveDate)
    const templateMeals = mealPlans.filter(m => !m.effectiveDate && m.dayOfWeek === day);

    // date-specific should appear first
    acc[day] = [...dateMeals, ...templateMeals];
    return acc;
  }, {});

  if (!userRole) {
    return (
      <div className="meal-management-page">
        <div className="container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Only superadmin and home_admin can access this
  if (userRole !== 'superadmin' && userRole !== 'home_admin') {
    return (
      <div className="meal-management-page">
        <div className="container">
          <div className="error-message">
            <i className="fas fa-lock"></i>
            <p>You don't have permission to access meal management.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="meal-management-page">
      <Helmet>
        <title>Meal Management - Bellavista</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="container">
        {/* Header */}
        <div className="mm-header">
          <h1>Meal Plan Management</h1>
          <p>Create and manage meal plans for your care homes</p>
        </div>

        {/* Home Selector and Action Button */}
        <div className="mm-controls">
          <div className="home-selector">
            <label htmlFor="homeSelect">Select Home:</label>
            <select
              id="homeSelect"
              value={selectedHomeId}
              onChange={(e) => setSelectedHomeId(e.target.value)}
              disabled={userRole === 'home_admin'}
            >
              <option value="">-- Choose a home --</option>
              {homes.map(home => (
                <option key={home.id} value={home.id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <i className="fas fa-plus"></i> Add New Meal
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <p>{error}</p>
            <button className="close-btn" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="mm-form-container">
            <h2>{editingMealId ? 'Edit Meal' : 'Add New Meal'}</h2>
            <form onSubmit={handleSubmitForm} className="mm-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="dayOfWeek">Day of Week:</label>
                  <select
                    id="dayOfWeek"
                    name="dayOfWeek"
                    value={formData.dayOfWeek}
                    onChange={handleFormChange}
                    required
                  >
                    {days.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="mealType">Meal Type:</label>
                  <select
                    id="mealType"
                    name="mealType"
                    value={formData.mealType}
                    onChange={handleFormChange}
                    required
                  >
                    {mealTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="mealName">Meal Name:</label>
                <input
                  id="mealName"
                  type="text"
                  name="mealName"
                  value={formData.mealName}
                  onChange={handleFormChange}
                  placeholder="e.g., Roasted Chicken with Vegetables"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description:</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe the meal, cooking methods, etc."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label htmlFor="imageUrl">Image URL:</label>
                <input
                  id="imageUrl"
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Ingredients */}
              <div className="form-section">
                <h3>Ingredients</h3>
                <div className="ingredients-list">
                  {formData.ingredients.map((ingredient, index) => (
                    <div key={index} className="ingredient-item">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) => handleIngredientChange(index, e.target.value)}
                        placeholder="e.g., Chicken breast, Olive oil"
                      />
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleAddIngredient}
                >
                  <i className="fas fa-plus"></i> Add Ingredient
                </button>
              </div>

              {/* Allergens */}
              <div className="form-section">
                <h3>Allergens</h3>
                <div className="checkbox-group">
                  {commonAllergens.map(allergen => (
                    <label key={allergen} className="checkbox-label">
                      <input
                        type="checkbox"
                        name={`allergen_${allergen}`}
                        checked={formData.allergyInfo.includes(allergen)}
                        onChange={handleFormChange}
                      />
                      {allergen}
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="form-section">
                <h3>Tags</h3>
                <div className="checkbox-group">
                  {commonTags.map(tag => (
                    <label key={tag} className="checkbox-label">
                      <input
                        type="checkbox"
                        name={`tag_${tag}`}
                        checked={formData.tags.includes(tag)}
                        onChange={handleFormChange}
                      />
                      {tag}
                    </label>
                  ))}
                </div>
              </div>

              {/* Nutrition Info */}
              <div className="form-section">
                <h3>Nutritional Information</h3>
                <div className="form-row-multi">
                  <div className="form-group-small">
                    <label htmlFor="calories">Calories:</label>
                    <input
                      id="calories"
                      type="number"
                      name="nutrition.calories"
                      value={formData.nutritionalInfo.calories}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group-small">
                    <label htmlFor="protein">Protein (g):</label>
                    <input
                      id="protein"
                      type="number"
                      step="0.1"
                      name="nutrition.protein"
                      value={formData.nutritionalInfo.protein}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group-small">
                    <label htmlFor="carbs">Carbs (g):</label>
                    <input
                      id="carbs"
                      type="number"
                      step="0.1"
                      name="nutrition.carbs"
                      value={formData.nutritionalInfo.carbs}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group-small">
                    <label htmlFor="fat">Fat (g):</label>
                    <input
                      id="fat"
                      type="number"
                      step="0.1"
                      name="nutrition.fat"
                      value={formData.nutritionalInfo.fat}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                  <div className="form-group-small">
                    <label htmlFor="fiber">Fiber (g):</label>
                    <input
                      id="fiber"
                      type="number"
                      step="0.1"
                      name="nutrition.fiber"
                      value={formData.nutritionalInfo.fiber}
                      onChange={handleFormChange}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Special Menu */}
              <div className="form-section">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isSpecialMenu"
                    checked={formData.isSpecialMenu}
                    onChange={handleFormChange}
                  />
                  This is a special menu for a specific date
                </label>
                <div className="form-group">
                  <label htmlFor="effectiveDate">Effective Date (required):</label>
                  <input
                    id="effectiveDate"
                    type="date"
                    name="effectiveDate"
                    value={formData.effectiveDate}
                    onChange={handleFormChange}
                    required
                    min={new Date(0).toISOString().slice(0,10)}
                  />
                </div>

                <div className="form-group" style={{display:'flex', alignItems:'center', gap:'10px'}}>
                  <input id="createForWeek" type="checkbox" checked={createForWeek} onChange={(e) => setCreateForWeek(e.target.checked)} />
                  <label htmlFor="createForWeek">Create this meal for every day of the selected week</label>
                </div>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  <i className="fas fa-save"></i> {editingMealId ? 'Update Meal' : 'Create Meal'}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleCancelForm}
                >
                  <i className="fas fa-times"></i> Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Meals List */}
        {!loading && selectedHomeId && (
          <div className="mm-meals-list">
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <h2 style={{margin:0}}>Meals for Selected Home</h2>
              <div style={{display:'flex', gap: '8px', alignItems:'center'}}>
                <button className="week-nav" onClick={() => { const prev = new Date(weekStart); prev.setDate(weekStart.getDate()-7); setWeekStart(prev); }} aria-label="Previous week"><i className="fas fa-chevron-left"></i></button>
                <div style={{fontWeight:600}}>{formatWeekRange(weekStart)}</div>
                <button className="week-nav" onClick={() => { const nxt = new Date(weekStart); nxt.setDate(weekStart.getDate()+7); setWeekStart(nxt); }} aria-label="Next week"><i className="fas fa-chevron-right"></i></button>
                <button className="btn-secondary" onClick={async () => {
                  if (!confirm('Copy all date-specific meals from this week to next week?')) return;
                  try {
                    const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
                    const resp = await fetch('/api/meal-plans/copy-week', { method: 'POST', headers, body: JSON.stringify({ homeId: selectedHomeId, sourceWeekStart: weekStart.toISOString().slice(0,10) }) });
                    if (!resp.ok) throw new Error('Copy week failed');
                    const payload = await resp.json();
                    // refresh
                    await refreshMeals();
                    alert('Copy completed');
                  } catch (err) {
                    alert('Copy failed: ' + (err.message || err));
                  }
                }}>
                  <i className="fas fa-copy"></i> Copy week → next week
                </button>
              </div>
            </div>
            {mealPlans.length === 0 ? (
              <div className="empty-state">
                <i className="fas fa-inbox"></i>
                <p>No meals added yet. Click "Add New Meal" to get started.</p>
              </div>
            ) : (
              <div className="days-container">
                {days.map((day, idx) => {
                  const dayDate = getWeekDates(weekStart)[idx];
                  const dayLabel = dayDate ? `${dayDate.getDate()} ${dayDate.toLocaleDateString('en-GB', { month: 'short' })}` : '';
                  return (
                    <div key={day} className="day-section">
                      <h3>{day} <small style={{color:'#666', marginLeft:8}}>{dayLabel}</small></h3>
                      {mealsByDay[day].length === 0 ? (
                        <p className="no-meals">No meals scheduled</p>
                      ) : (
                        <div className="meals-list">
                          {mealsByDay[day].map(meal => (
                            <div key={meal.id} className="meal-item">
                              <div className="meal-item__header">
                                <div>
                                  <h4>{meal.mealName}</h4>
                                  <p className="meal-type">{meal.mealType}{meal.effectiveDate ? ` — ${new Date(meal.effectiveDate).toLocaleDateString('en-GB')}` : ''}</p>
                                </div>
                                {meal.isSpecialMenu && (
                                  <span className="special-badge">Special Menu</span>
                                )}
                              </div>
                              {meal.description && (
                                <p className="meal-description">{meal.description}</p>
                              )}
                              <div className="meal-item__actions">
                                <button
                                  className="btn-copy"
                                  onClick={() => {
                                    if (copyTargetMealId === meal.id) {
                                      setCopyTargetMealId(null);
                                    } else {
                                      setCopyTargetMealId(meal.id);
                                    }
                                  }}
                                >
                                  <i className="fas fa-clone"></i> Copy
                                </button>
                                <button
                                  className="btn-edit"
                                  onClick={() => handleEditMeal(meal)}
                                >
                                  <i className="fas fa-edit"></i> Edit
                                </button>
                                <button
                                  className="btn-delete"
                                  onClick={() => handleDeleteMeal(meal.id)}
                                >
                                  <i className="fas fa-trash"></i> Delete
                                </button>
                                {copyTargetMealId === meal.id && (
                                  <CopyMealPanel
                                    meal={meal}
                                    weekStart={weekStart}
                                    days={days}
                                    mealPlans={mealPlans}
                                    selectedHomeId={selectedHomeId}
                                    onClose={() => setCopyTargetMealId(null)}
                                    onRefresh={refreshMeals}
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {loading && (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Loading meal plans...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealManagement;
