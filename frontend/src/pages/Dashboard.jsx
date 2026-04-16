import React from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  return (
    <>
      <div className="app-bar">
        <h1 className="header" style={{ margin: 0, fontSize: '1.5rem' }}>
          Event<span className="brand-text">Check-in</span>
        </h1>
      </div>
      
      <div className="neu-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <img src="/vite.svg" alt="logo" style={{ width: '80px', height: '80px', marginBottom: '20px' }} />
        
        <button className="neu-button primary" onClick={() => navigate('/scan')}>
          Scan QR Code Ticket
        </button>
        
        <button className="neu-button" onClick={() => navigate('/register')}>
          Register Newcomer
        </button>

        <button className="neu-button" style={{color: 'gray', border: '1px solid var(--background)'}} onClick={() => navigate('/attendees')}>
          View All Attendees
        </button>
      </div>
    </>
  );
}

export default Dashboard;
