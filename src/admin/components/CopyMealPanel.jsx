import React, { useState } from 'react';
import { getAuthHeader } from '../../services/authService';
import { API_URL } from '../../config/apiConfig';

// Small, focused component that handles copying a single meal to other dates
export default function CopyMealPanel({
  meal,
  weekStart,
  days,
  mealPlans,
  selectedHomeId,
  onClose,
  onRefresh
}) {
  const [copyTargets, setCopyTargets] = useState([]);
  const [copyCustomDate, setCopyCustomDate] = useState('');
  const [copyLoading, setCopyLoading] = useState(false);
  const [copyMessage, setCopyMessage] = useState(null);
  const [copyError, setCopyError] = useState(null);

  const getWeekDates = (start) => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const handleCopy = async () => {
    try {
      setCopyLoading(true);
      setCopyMessage(null);
      setCopyError(null);

      const source = meal;
      const weekDates = getWeekDates(weekStart);
      const targets = [];

      // compile selected days
      copyTargets.forEach(dayName => {
        const idx = days.indexOf(dayName);
        if (idx >= 0) {
          targets.push(weekDates[idx].toISOString().slice(0,10));
        }
      });

      if (copyCustomDate) targets.push(copyCustomDate);

      // filter out duplicates already present
      const toCreate = [];
      let skipped = 0;
      targets.forEach(dateIso => {
        const exists = mealPlans.some(m => m.effectiveDate === dateIso && m.mealType === source.mealType && m.mealName === source.mealName && m.isActive !== false);
        if (exists) { skipped++; return; }
        toCreate.push({
          dayOfWeek: new Date(dateIso + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'long' }),
          mealType: source.mealType,
          mealName: source.mealName,
          description: source.description,
          ingredients: source.ingredients || [],
          allergyInfo: source.allergyInfo || [],
          imageUrl: source.imageUrl || '',
          nutritionalInfo: source.nutritionalInfo || {},
          tags: source.tags || [],
          isSpecialMenu: source.isSpecialMenu || false,
          effectiveDate: dateIso
        });
      });

      if (toCreate.length === 0) {
        setCopyMessage(null);
        setCopyError(`Nothing to copy. ${skipped} duplicates skipped.`);
        setCopyLoading(false);
        return;
      }

      const headers = { 'Content-Type': 'application/json', ...getAuthHeader() };
      const resp = await fetch(`${API_URL}/meal-plans/bulk-create`, { method: 'POST', headers, body: JSON.stringify({ homeId: selectedHomeId, meals: toCreate }) });
      if (!resp.ok) throw new Error('Copy failed');

      // refresh parent list
      if (typeof onRefresh === 'function') await onRefresh();

      setCopyMessage(`Copied ${toCreate.length} meals${skipped ? ` — skipped ${skipped} duplicates` : ''}`);
      setCopyLoading(false);
      if (typeof onClose === 'function') onClose();
    } catch (err) {
      setCopyError(err.message || String(err));
      setCopyLoading(false);
    }
  };

  return (
    <div style={{border:'1px solid #eee', padding:12, marginTop:8, background:'#fafafa', borderRadius:6}}>
      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <strong style={{flex:1}}>Copy "{meal.mealName}" to:</strong>
        <button style={{fontSize:12}} onClick={() => setCopyTargets(days.slice())}>Select all</button>
        <button style={{fontSize:12}} onClick={() => setCopyTargets([])}>Clear</button>
      </div>

      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:8}}>
        {getWeekDates(weekStart).map((d, i) => {
          const dayName = days[i];
          const iso = d.toISOString().slice(0,10);
          const checked = copyTargets.includes(dayName);
          return (
            <label key={iso} style={{display:'flex', alignItems:'center', gap:6}}>
              <input type="checkbox" checked={checked} onChange={(e) => {
                if (e.target.checked) setCopyTargets(prev => [...prev, dayName]);
                else setCopyTargets(prev => prev.filter(x => x !== dayName));
              }} />
              <span style={{fontSize:13}}>{dayName} — {d.getDate()} {d.toLocaleDateString('en-GB',{ month:'short' })}</span>
            </label>
          );
        })}
      </div>

      <div style={{display:'flex', gap:8, alignItems:'center', marginBottom:8}}>
        <label style={{display:'flex', gap:8, alignItems:'center'}}>
          <input type="date" value={copyCustomDate} onChange={e => setCopyCustomDate(e.target.value)} />
          <span style={{color:'#666', fontSize:13}}>or pick a custom date</span>
        </label>
      </div>

      <div style={{display:'flex', gap:8, justifyContent:'flex-end'}}>
        <button className="btn-secondary" onClick={() => { if (typeof onClose === 'function') onClose(); }}>Cancel</button>
        <button className="btn-primary" onClick={handleCopy} disabled={copyLoading}>{copyLoading ? 'Copying…' : 'Copy'}</button>
      </div>

      {copyMessage && <div style={{marginTop:8, color:'green'}}>{copyMessage}</div>}
      {copyError && <div style={{marginTop:8, color:'#b91c1c'}}>{copyError}</div>}
    </div>
  );
}
