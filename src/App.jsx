import React, { useState } from 'react';
import Home from './components/Home';
import Result from './components/Result';
import Prediction from './components/Prediction';
import Compare from './components/Compare';
import Graphs from './components/Graphs';
import './App.css';

function App() {
  const [page, setPage] = useState('home');
  const [result, setResult] = useState(null);

  const handleShowResult = (data) => {
    setResult(data);
    setPage('result');
  };

  return (
    <div className="app">
      {page === 'home' && (
        <Home
          onSubmit={handleShowResult}
          onPredict={() => setPage('predict')}
          onCompare={() => setPage('compare')}
          onGraphs={() => setPage('graphs')}
        />
      )}
      {page === 'result' && <Result data={result} onBack={() => setPage('home')} />}
      {page === 'predict' && <Prediction onBack={() => setPage('home')} />}
      {page === 'compare' && <Compare onBack={() => setPage('home')} />}
      {page === 'graphs' && <Graphs onBack={() => setPage('home')} />}
    </div>
  );
}

export default App;
