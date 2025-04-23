import React, { useState } from 'react';

const graphOptions = [
  { id: 'date-water', label: 'Date vs Water Level', image: 'wvsd.jpg' },
  { id: 'date-temp', label: 'Date vs Temperature', image: 'tvsd.jpg' },
  { id: 'temp-water', label: 'Temperature vs Water Level', image: 'wvst.jpg' }
];

const Graphs = ({ onBack }) => {
  const [selectedGraph, setSelectedGraph] = useState('');

  if (selectedGraph) {
    return (
      <div className="graph-container">

        <h2 className="section-title">Graph</h2>
        <img
          src={`/src/assets/${selectedGraph}`}
          alt="Graph"
          className="graph-image"
        />
        <button onClick={onBack} className="submit-btn">Back to Home</button>
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="main-title">HydroSentinel</h1>
      <h3 className="subtitle">Autonomous Water Level Monitoring Drone</h3>
      <h2 className="section-title">Select a Graph</h2>
      <div className="button-group">
        {graphOptions.map(option => (
          <button
            key={option.id}
            onClick={() => setSelectedGraph(option.image)}
            className="other-btn"
          >
            {option.label}
          </button>
        ))}
        <button onClick={onBack} className="submit-btn">Go Back</button>
      </div>
    </div>
  );
};

export default Graphs;
