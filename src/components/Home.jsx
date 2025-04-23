import React, { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import data from '../assets/data.json';

const Home = ({ onSubmit, onPredict, onCompare, onGraphs }) => {
  const [date, setDate] = useState('');

  const handleSubmit = () => {
    const inputDate = new Date(date);
    const formattedDate = inputDate.toLocaleDateString('en-GB'); // "dd/mm/yyyy"

    const found = data.find(entry => entry.datetime === formattedDate);

    if (!found) {
      toast.error('Data not available for selected date!');
    } else {
      onSubmit(found);
    }
  };

  return (
    <div className="form-container">
      <h1 className="main-title">HydroSentinel</h1>
      <h3 className="subtitle">Autonomous Water Level Monitoring Drone</h3>
      <h2 className="section-title">Check the Water Level</h2>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="date-input"
      />

      <div className="button-group">
        <button onClick={handleSubmit} className="submit-btn">Check Water Level</button>
        <button onClick={onCompare} className="other-btn">Compare Water Level</button>
        <button onClick={onPredict} className="other-btn">Prediction Water Level</button>
        <button onClick={onGraphs} className="other-btn">See Graphs</button>
      </div>

      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default Home;
