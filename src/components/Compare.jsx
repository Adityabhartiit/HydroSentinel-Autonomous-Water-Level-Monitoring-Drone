import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import data from '../assets/data.json';

const Compare = ({ onBack }) => {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [comparison, setComparison] = useState(null);

  const handleCompare = () => {
    const formattedDate1 = new Date(date1).toLocaleDateString('en-GB');
    const formattedDate2 = new Date(date2).toLocaleDateString('en-GB');

    const d1 = data.find(d => d.datetime === formattedDate1);
    const d2 = data.find(d => d.datetime === formattedDate2);

    if (!d1 || !d2) {
      toast.error('Data not available for selected dates!');
      setComparison(null);
      return;
    }

    setComparison({ d1, d2 });
  };

  return (
    <div className="form-container">
      <h1 className="main-title">HydroSentinel</h1>
      <h3 className="subtitle">Autonomous Water Level Monitoring Drone</h3>
      <h2 className="section-title">Compare Water Levels</h2>

      <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="date-input" />
      <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="date-input" />

      <button onClick={handleCompare} className="submit-btn">Compare</button>
      <button onClick={onBack} className="other-btn">Go Back</button>

      {comparison && (
        <div style={{ marginTop: '20px' }}>
          <p><strong>{comparison.d1.datetime} - Water Level:</strong> {comparison.d1.Level} Feet</p>
          <p><strong>{comparison.d2.datetime} - Water Level:</strong> {comparison.d2.Level} Feet</p>
          <p><strong>Difference:</strong> {(comparison.d1.Level - comparison.d2.Level).toFixed(2)} Feet</p>
        </div>
      )}

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Compare;
