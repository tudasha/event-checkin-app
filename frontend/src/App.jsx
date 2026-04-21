import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import ScannerView from './pages/ScannerView';
import Dashboard from './pages/Dashboard';
import RegisterView from './pages/RegisterView';
import AttendeesListView from './pages/AttendeesListView';
import LogsView from './pages/LogsView';

function App() {
  const [serverStatus, setServerStatus] = useState('starting');

  useEffect(() => {
    let interval;
    const checkServer = async () => {
      try {
        await axios.get('/api/attendees/ping');
        setServerStatus('online');
        clearInterval(interval);
      } catch (err) {
        // keep trying if it fails
      }
    };
    checkServer();
    interval = setInterval(checkServer, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="neu-container" style={{ position: 'relative' }}>
        {/* Global Server Status Banner */}
        <div style={{
            position: 'sticky',
            top: 0,
            width: '100%',
            background: serverStatus === 'starting' ? 'hsl(30, 90%, 55%)' : 'hsl(145, 60%, 45%)',
            color: '#fff',
            padding: '8px',
            textAlign: 'center',
            fontWeight: 'bold',
            zIndex: 1000,
            borderBottomRightRadius: '15px',
            borderBottomLeftRadius: '15px',
            marginBottom: '15px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            opacity: serverStatus === 'starting' ? 1 : 0.8,
            transition: 'all 0.3s ease'
        }}>
            {serverStatus === 'starting' 
              ? '⏳ Server is starting (may take 50s)...' 
              : '✅ Server Online'}
        </div>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/scan" element={<ScannerView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/attendees" element={<AttendeesListView />} />
          <Route path="/logs" element={<LogsView />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
