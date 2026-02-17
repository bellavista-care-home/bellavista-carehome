import React from 'react';

const SimpleTimePicker = ({ label, value, onChange }) => {
  const parseTime = () => {
    if (!value) {
      return { hour: '12', minute: '00', period: 'AM' };
    }
    const [h, m] = value.split(':');
    let hNum = parseInt(h, 10);
    const p = hNum >= 12 ? 'PM' : 'AM';
    if (hNum > 12) hNum -= 12;
    if (hNum === 0) hNum = 12;
    return {
      hour: String(hNum).padStart(2, '0'),
      minute: m,
      period: p
    };
  };

  const { hour, minute, period } = parseTime();

  const updateTime = (newHour, newMinute, newPeriod) => {
    let h = parseInt(newHour, 10);
    if (newPeriod === 'PM' && h !== 12) h += 12;
    if (newPeriod === 'AM' && h === 12) h = 0;

    const timeString = `${String(h).padStart(2, '0')}:${newMinute}`;
    onChange(timeString);
  };

  const handleHourChange = (e) => {
    const val = e.target.value;
    updateTime(val, minute, period);
  };

  const handleMinuteChange = (e) => {
    const val = e.target.value;
    updateTime(hour, val, period);
  };

  const handlePeriodChange = (e) => {
    const val = e.target.value;
    updateTime(hour, minute, val);
  };

  return (
    <div className="simple-time-picker">
      <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '13px', color: '#334155' }}>{label}</label>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        <select 
          value={hour} 
          onChange={handleHourChange}
          style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: '1.5px solid #e6eef7', 
            background: '#fff',
            fontWeight: '500',
            outline: 'none',
            cursor: 'pointer',
            flex: 1
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map(h => (
            <option key={h} value={String(h).padStart(2, '0')}>{String(h).padStart(2, '0')}</option>
          ))}
        </select>
        <span style={{ fontWeight: 'bold', color: '#64748b' }}>:</span>
        <select 
          value={minute} 
          onChange={handleMinuteChange}
          style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: '1.5px solid #e6eef7', 
            background: '#fff',
            fontWeight: '500',
            outline: 'none',
            cursor: 'pointer',
            flex: 1
          }}
        >
          {Array.from({ length: 12 }, (_, i) => i * 5).map(m => (
            <option key={m} value={String(m).padStart(2, '0')}>{String(m).padStart(2, '0')}</option>
          ))}
        </select>
        <select 
          value={period} 
          onChange={handlePeriodChange}
          style={{ 
            padding: '10px', 
            borderRadius: '8px', 
            border: '1.5px solid #e6eef7', 
            background: '#f8f9fa',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer',
            flex: 1,
            color: period === 'AM' ? '#f59f00' : '#1971c2'
          }}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>
      </div>
    </div>
  );
};

export default SimpleTimePicker;
