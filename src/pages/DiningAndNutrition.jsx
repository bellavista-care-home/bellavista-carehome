import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { API_URL } from '../config/apiConfig';
import '../styles/DiningAndNutrition.css';

const DiningAndNutrition = () => {
  const [homeId, setHomeId] = useState('bellavista-barry'); // Default home
  const [mealPlans, setMealPlans] = useState({});
  // Selected day (by name) — default to today's weekday
  const today = new Date();
  const defaultDayName = today.toLocaleDateString('en-GB', { weekday: 'long' });
  const [selectedDay, setSelectedDay] = useState(defaultDayName);
  // Start of the currently-viewed week (Monday)
  const [weekStart, setWeekStart] = useState(() => {
    const d = new Date();
    const dayIndex = (d.getDay() + 6) % 7; // Monday=0, Sunday=6
    const monday = new Date(d);
    monday.setDate(d.getDate() - dayIndex);
    monday.setHours(0,0,0,0);
    return monday;
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [homes, setHomes] = useState([]);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const mealTypes = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];

  // Helpers: week/date utilities
  const getWeekDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const formatDayShort = (date) => date.toLocaleDateString('en-GB', { weekday: 'short' });
  const formatMonthShort = (date) => date.toLocaleDateString('en-GB', { month: 'short' });
  const formatMonthLong = (date) => date.toLocaleDateString('default', { month: 'long' });

  const formatWeekRange = (start) => {
    const dates = getWeekDates(start);
    const s = dates[0];
    const e = dates[6];
    if (s.getMonth() === e.getMonth()) {
      return `${s.getDate()}–${e.getDate()} ${formatMonthLong(s)} ${s.getFullYear()}`;
    }
    return `${s.getDate()} ${formatMonthShort(s)} – ${e.getDate()} ${formatMonthShort(e)} ${e.getFullYear()}`;
  };

  const prevWeek = () => {
    const prev = new Date(weekStart);
    prev.setDate(weekStart.getDate() - 7);
    setWeekStart(prev);
  };

  const nextWeek = () => {
    const next = new Date(weekStart);
    next.setDate(weekStart.getDate() + 7);
    setWeekStart(next);
  };

  // Fetch available homes
  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch(`${API_URL}/homes`);
        if (response.ok) {
          const data = await response.json();
          let homesArray = Array.isArray(data) ? data : [];
          
          // Map the property names if needed
          homesArray = homesArray.map(home => ({
            id: home.id,
            name: home.homeName || home.name || 'Unknown Home'
          }));
          
          setHomes(homesArray);
        } else {
          console.error('Failed to load homes:', response.status);
          // Set default homes if API fails
          setHomes([
            { id: 'bellavista-barry', name: 'Bellavista Barry' },
            { id: 'bellavista-cardiff', name: 'Bellavista Cardiff' },
            { id: 'waverley-care-center', name: 'Waverley Care Centre' },
            { id: 'college-fields-nursing-home', name: 'College Fields Nursing Home' },
            { id: 'baltimore-care-home', name: 'Baltimore Care Home' },
            { id: 'meadow-vale-cwtch', name: 'Meadow Vale Cwtch' }
          ]);
        }
      } catch (err) {
        console.error('Failed to load homes:', err);
        // Set fallback homes
        setHomes([
          { id: 'bellavista-barry', name: 'Bellavista Barry' },
          { id: 'bellavista-cardiff', name: 'Bellavista Cardiff' },
          { id: 'waverley-care-center', name: 'Waverley Care Centre' },
          { id: 'college-fields-nursing-home', name: 'College Fields Nursing Home' },
          { id: 'baltimore-care-home', name: 'Baltimore Care Home' },
          { id: 'meadow-vale-cwtch', name: 'Meadow Vale Cwtch' }
        ]);
      }
    };
    fetchHomes();
  }, []);

  // Fetch meal plans for selected home
  useEffect(() => {
    const fetchMealPlans = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}/meal-plans/${homeId}?groupByDay=true`);
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        const responseData = await response.json();
        
        // Handle the response format from the API
        let meals = {};
        if (responseData && responseData.success && responseData.data) {
          // API returns {success: true, data: {...}}
          meals = responseData.data;
        } else if (responseData && typeof responseData === 'object') {
          // Direct object response (grouped by day)
          meals = responseData;
        }
        
        setMealPlans(meals);
      } catch (err) {
        console.error('Failed to fetch meal plans:', err);
        setError('Error loading meal plans');
        setMealPlans({});
      } finally {
        setLoading(false);
      }
    };

    if (homeId) {
      fetchMealPlans();
    }
  }, [homeId]);

  const dayMeals = mealPlans[selectedDay] || [];

  return (
    <div className="dining-nutrition-page">
      <Helmet>
        <title>Dining & Nutrition - Bellavista Nursing Homes</title>
        <meta name="description" content="Explore our nutritious and delicious meal plans tailored for our residents' health and wellbeing." />
      </Helmet>

      {/* Hero Section */}
      <section className="dining-hero">
        <div className="dining-hero__overlay"></div>
        <div className="dining-hero__content">
          <h1 className="dining-hero__title">Dining & Nutrition</h1>
          <p className="dining-hero__subtitle">
            Nourishing Care Through Thoughtfully Prepared Meals
          </p>
        </div>
      </section>

      {/* Home Selector */}
      <section className="dining-section">
        <div className="container">
          <div className="home-selector">
            <label htmlFor="home-select" className="home-selector__label">
              Select a Home:
            </label>
            <select 
              id="home-select"
              value={homeId} 
              onChange={(e) => {
                setHomeId(e.target.value);
                setSelectedDay('Monday');
              }}
              className="home-selector__select"
            >
              {homes.map((home) => (
                <option key={home.id} value={home.id}>
                  {home.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Info Box */}
      <section className="dining-section dining-section--light">
        <div className="container">
          <div className="dining-info-box">
            <h2 className="dining-info-box__title">
              <i className="fas fa-utensils"></i> Our Commitment to Nutrition
            </h2>
            <p className="dining-info-box__text">
              At our care homes, we believe that mealtimes are an essential part of daily life. Our menus are carefully 
              planned by our nutritional team to ensure residents receive balanced, nutritious meals that support their 
              health and wellbeing. We cater to various dietary needs and preferences, from vegetarian and vegan options 
              to allergy-friendly alternatives.
            </p>
          </div>
        </div>
      </section>

      {/* Day Selector and Meal Display */}
      <section className="dining-section">
        <div className="container">
          {loading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading meal plans...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {/* Week header + selected date */}
              <div className="week-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px'}}>
                <div style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                  <button className="week-nav" onClick={prevWeek} aria-label="Previous week"><i className="fas fa-chevron-left"></i></button>
                  <div className="week-range__label" style={{fontWeight:600}}>{formatWeekRange(weekStart)}</div>
                  <button className="week-nav" onClick={nextWeek} aria-label="Next week"><i className="fas fa-chevron-right"></i></button>
                </div>
                <div style={{fontSize: '14px', color: '#666'}}>
                  <strong>{selectedDay}</strong>
                  {(() => {
                    const selDate = getWeekDates(weekStart).find(d => d.toLocaleDateString('en-GB', { weekday: 'long' }) === selectedDay) || getWeekDates(weekStart)[0];
                    return ` — ${selDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}`;
                  })()}
                </div>
              </div>

              {/* Day Navigation with dates */}
              <div className="day-navigation">
                {getWeekDates(weekStart).map((date) => {
                  const dayName = date.toLocaleDateString('en-GB', { weekday: 'long' });
                  return (
                    <button
                      key={date.toISOString()}
                      className={`day-button ${selectedDay === dayName ? 'day-button--active' : ''}`}
                      onClick={() => setSelectedDay(dayName)}
                    >
                      <div style={{fontSize:'12px', fontWeight:700}}>{formatDayShort(date)}</div>
                      <div style={{fontSize:'14px'}}>{date.getDate()} <small style={{color:'#666'}}>{formatMonthShort(date)}</small></div>
                    </button>
                  );
                })}
              </div>

              {/* Meals Grid */}
              <div className="meals-grid">
                {dayMeals.length > 0 ? (
                  dayMeals.map((meal) => (
                    <MealCard key={meal.id} meal={meal} />
                  ))
                ) : (
                  <div className="no-meals-message">
                    <i className="fas fa-calendar-check"></i>
                    <p>No meals scheduled for {selectedDay}. Check back soon!</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Dietary Information Section */}
      <section className="dining-section dining-section--white">
        <div className="container">
          <h2 className="section-title">Dietary Information & Allergies</h2>
          <div className="dietary-info-grid">
            <div className="dietary-card">
              <i className="fas fa-leaf"></i>
              <h3>Vegetarian & Vegan Options</h3>
              <p>We offer delicious meat-free alternatives daily, using fresh seasonal vegetables and plant-based proteins.</p>
            </div>
            <div className="dietary-card">
              <i className="fas fa-shield-alt"></i>
              <h3>Allergen Information</h3>
              <p>All meals are clearly labeled with allergen information. Our team carefully manages dietary restrictions.</p>
            </div>
            <div className="dietary-card">
              <i className="fas fa-apple-alt"></i>
              <h3>Balanced Nutrition</h3>
              <p>Every meal is designed to provide essential nutrients, vitamins, and minerals for optimal health.</p>
            </div>
            <div className="dietary-card">
              <i className="fas fa-utensils"></i>
              <h3>Texture-Modified Foods</h3>
              <p>For residents with swallowing difficulties, we provide appropriately modified meal preparations.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Meal Card Component
const MealCard = ({ meal }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="meal-card" onClick={() => setShowDetails(!showDetails)}>
      {meal.imageUrl && (
        <div className="meal-card__image">
          <img src={meal.imageUrl} alt={meal.mealName} loading="lazy" />
          <span className="meal-card__type">{meal.mealType}</span>
        </div>
      )}
      
      <div className="meal-card__content">
        <h3 className="meal-card__name">{meal.mealName}</h3>
        {meal.description && (
          <p className="meal-card__description">{meal.description}</p>
        )}

        {/* Tags */}
        {meal.tags && meal.tags.length > 0 && (
          <div className="meal-card__tags">
            {meal.tags.map((tag, idx) => (
              <span key={idx} className="meal-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Allergens */}
        {meal.allergyInfo && meal.allergyInfo.length > 0 && (
          <div className="meal-card__allergens">
            <i className="fas fa-exclamation-triangle"></i>
            <span>Contains: {meal.allergyInfo.join(', ')}</span>
          </div>
        )}

        {/* Nutrition */}
        {meal.nutritionalInfo && Object.keys(meal.nutritionalInfo).length > 0 && (
          <div className={`meal-card__nutrition ${showDetails ? 'show' : ''}`}>
            <div className="nutrition-item">
              <span className="nutrition-label">Calories:</span>
              <span className="nutrition-value">{meal.nutritionalInfo.calories}</span>
            </div>
            {meal.nutritionalInfo.protein && (
              <div className="nutrition-item">
                <span className="nutrition-label">Protein:</span>
                <span className="nutrition-value">{meal.nutritionalInfo.protein}g</span>
              </div>
            )}
            {meal.nutritionalInfo.carbs && (
              <div className="nutrition-item">
                <span className="nutrition-label">Carbs:</span>
                <span className="nutrition-value">{meal.nutritionalInfo.carbs}g</span>
              </div>
            )}
            {meal.nutritionalInfo.fat && (
              <div className="nutrition-item">
                <span className="nutrition-label">Fat:</span>
                <span className="nutrition-value">{meal.nutritionalInfo.fat}g</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiningAndNutrition;
