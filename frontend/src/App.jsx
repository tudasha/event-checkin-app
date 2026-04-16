import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import ScannerView from './pages/ScannerView';
import Dashboard from './pages/Dashboard';
import RegisterView from './pages/RegisterView';
import AttendeesListView from './pages/AttendeesListView';

function App() {
  return (
    <Router>
      <div className="neu-container">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<ScannerView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/attendees" element={<AttendeesListView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
