import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('appMode') !== 'user'; // default is admin
  });

  useEffect(() => {
    localStorage.setItem('appMode', isAdmin ? 'admin' : 'user');
  }, [isAdmin]);

  return (
    <>
      <div className="app-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px' }}>
        <h1 className="header" style={{ margin: 0, fontSize: '1.5rem' }}>
          Event<span className="brand-text">Check-in</span>
        </h1>
        
        {/* User / Admin Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 'bold', color: 'gray' }}>
          <span style={{ color: !isAdmin ? 'var(--primary)' : 'gray' }}>User</span>
          <div 
            onClick={() => setIsAdmin(!isAdmin)}
            style={{
              width: '44px', height: '24px', borderRadius: '24px', 
              background: isAdmin ? 'var(--primary)' : '#e0e5ec',
              boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.1), inset -2px -2px 5px rgba(255,255,255,0.7)',
              position: 'relative', cursor: 'pointer',
              transition: 'background 0.3s'
            }}>
             <div style={{
                position: 'absolute', top: '2px', left: isAdmin ? '22px' : '2px',
                width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                boxShadow: '1px 1px 3px rgba(0,0,0,0.2)',
                transition: 'left 0.3s ease-in-out'
             }}/>
          </div>
          <span style={{ color: isAdmin ? 'var(--primary)' : 'gray' }}>Admin</span>
        </div>
      </div>
      
      <div className="neu-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <img src="/vite.svg" alt="logo" style={{ width: '80px', height: '80px', marginBottom: '20px' }} />
        
        {isAdmin && (
          <button className="neu-button primary" onClick={() => navigate('/scan')}>
            Scan QR Code Ticket
          </button>
        )}
        
        <button className="neu-button" onClick={() => navigate('/register')}>
          {isAdmin ? 'Register Newcomer' : 'New Web Registration'}
        </button>

        {isAdmin && (
          <button className="neu-button" style={{color: 'gray', border: '1px solid var(--background)'}} onClick={() => navigate('/attendees')}>
            View All Attendees
          </button>
        )}
      </div>
    </>
  );
}

export default Dashboard;
