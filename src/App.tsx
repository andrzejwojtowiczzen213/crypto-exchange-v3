import React, { Suspense } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Container from './components/Container';
import Checkout from './components/Checkout';
import Status from './components/Status';
import './App.css';

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Container />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </div>
      </Router>
    </Suspense>
  );
}

export default App;
