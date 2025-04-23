import React from 'react';

const Result = ({ data, onBack }) => {
  return (
    <div className="result-container">
    <h1 className="main-title">HydroSentinel</h1>
    <h3 className="subtitle">Autonomous Water Level Monitoring Drone</h3>
      <h2>Result</h2>
      <p><strong>Water Level:</strong> {data.Level} Feet</p>
      <p><strong>Temperature:</strong> {data.temp} °C</p>
      <p><strong>Humidity:</strong> {data.humidity} %</p>
      <button onClick={onBack}>Check Another Date</button>
    </div>
  );
};

export default Result;
