import React, { useState } from 'react';
import axios from 'axios';
import Result from './Result';

const Prediction = ({ onBack }) => {
  const [date, setDate] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateTempHumidity = () => ({
    temp: (Math.random() * 10 + 30).toFixed(1),
    humidity: (Math.random() * 40 + 30).toFixed(1),
  });

  const handleSubmit = async () => {
    if (!date) {
      alert('Please select a valid date.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/predict', {
        date,
      });

      const { predicted_level } = response.data;
      const { temp, humidity } = generateTempHumidity();

      setResult({ Level: predicted_level, temp, humidity, date });
    } catch (error) {
      alert('Error fetching prediction. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div>
        <Result data={result} onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="form-container">
      <h1 className="main-title">HydroSentinel</h1>
      <h3 className="subtitle">Autonomous Water Level Monitoring Drone</h3>
      <h2 className="section-title">Predict the Water Level</h2>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <div className="button-group">
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Predicting...' : 'Get Prediction'}
      </button>
      <button onClick={onBack}>Go Back to Home</button>
      </div>
    </div>
  );
};

export default Prediction;
