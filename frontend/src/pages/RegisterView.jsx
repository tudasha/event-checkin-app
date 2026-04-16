import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function RegisterView() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    email: '',
    referralSource: '',
    dietaryRestrictions: '',
    mediaConsent: false,
    isOver18: false,
    hasParentalConsent: false,
    hasPaid: false,
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  
  // Debug Logs State
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  // Initial debug log
  useEffect(() => {
    addLog(`App Mounted. Axios baseURL: ${axios.defaults.baseURL || 'EMPTY (using relative path)'}`);
  }, []);

  const addLog = (message) => {
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    const logStr = `[${time}] ${message}`;
    setLogs(prev => [...prev, logStr]);
    console.log(logStr);
  };

  const copyLogs = () => {
    navigator.clipboard.writeText(logs.join('\n')).then(() => {
      setMsg('Logs copied to clipboard!');
      setTimeout(() => setMsg(''), 2000);
    }).catch(err => {
      addLog(`Copy failed: ${err.message}`);
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAgeChange = (e) => {
    const age = parseInt(e.target.value) || 0;
    setFormData(prev => ({
        ...prev,
        age: e.target.value,
        isOver18: age >= 18
    }));
  }

  const handleSubmit = async (e, checkInNow = false) => {
    e.preventDefault();
    if(!formData.fullName || !formData.age) {
        setMsg('Please fill out name and age');
        addLog('Form submission blocked: Missing name or age.');
        return;
    }

    setLoading(true);
    setMsg('');
    try {
        const payload = { ...formData, hasCheckedIn: checkInNow };
        addLog(`POST /api/attendees | Payload: ${JSON.stringify(payload)}`);
        
        const res = await axios.post(`/api/attendees`, payload);
        addLog(`Success! Status: ${res.status}. Data: ${JSON.stringify(res.data)}`);
        
        setMsg('Successfully Registered!');
        setTimeout(() => navigate('/'), 2000);
    } catch(err) {
        let errDesc = err.message;
        if (err.response) {
            errDesc += ` | Code: ${err.response.status} | Data: ${JSON.stringify(err.response.data)}`;
        } else if (err.request) {
            errDesc += ` | The request was made but no response was received (Network error/CORS).`;
        }
        
        addLog(`ERROR: ${errDesc}`);
        console.error(err);
        setMsg(`Error: ${err.message}`);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {msg && (
        <div style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: msg.includes('Error') || msg.includes('failed') || msg.includes('fill') ? 'hsl(0, 70%, 55%)' : 'hsl(140, 60%, 45%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            {msg.includes('Error') || msg.includes('failed') || msg.includes('fill') ? '⚠️ ' : '✅ '}
            {msg}
        </div>
      )}

      <div className="app-bar">
        <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Register <span className="brand-text">Newcomer</span></h2>
      </div>

      <form className="neu-card" onSubmit={handleSubmit}>
        <input className="neu-input" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} required />
        <input className="neu-input" type="number" name="age" placeholder="Age" value={formData.age} onChange={handleAgeChange} required />
        <input className="neu-input" type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
        
        <input className="neu-input" name="referralSource" placeholder="Where did you find out about us?" value={formData.referralSource} onChange={handleChange} />
        <input className="neu-input" name="dietaryRestrictions" placeholder="Dietary Restrictions" value={formData.dietaryRestrictions} onChange={handleChange} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px', marginLeft: '5px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="mediaConsent" checked={formData.mediaConsent} onChange={handleChange} />
                I consent to be photographed/filmed
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input type="checkbox" name="hasPaid" checked={formData.hasPaid} onChange={handleChange} />
                Has paid / donated
            </label>
            {!formData.isOver18 && formData.age !== '' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)' }}>
                    <input type="checkbox" name="hasParentalConsent" checked={formData.hasParentalConsent} onChange={handleChange} />
                    Parental Declaration Signed
                </label>
            )}
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button type="button" className="neu-button" disabled={loading} style={{flex: 1, padding: '16px 8px'}} onClick={(e) => handleSubmit(e, false)}>
                {loading ? '...' : 'Register Only'}
            </button>
            <button type="button" className="neu-button primary" disabled={loading} style={{flex: 1, padding: '16px 8px'}} onClick={(e) => handleSubmit(e, true)}>
                {loading ? '...' : 'Register & Check-in'}
            </button>
        </div>
      </form>

      {/* Debug Logs Section */}
      <div style={{ marginTop: '20px', marginBottom: '40px' }}>
        <button 
          type="button" 
          className="neu-button" 
          onClick={() => setShowLogs(!showLogs)}
        >
          {showLogs ? 'Hide Debug Logs' : 'Show Debug Logs'}
        </button>

        {showLogs && (
          <div className="neu-card" style={{ marginTop: '10px', padding: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>Terminal</h3>
                <button 
                  type="button" 
                  className="neu-button primary" 
                  style={{ width: 'auto', padding: '6px 16px', margin: 0 }}
                  onClick={copyLogs}
                >
                  Copy All
                </button>
            </div>
            
            <div style={{ 
              background: '#1a1a1a', 
              color: '#00ff00', 
              padding: '10px', 
              borderRadius: '8px', 
              fontSize: '12px',
              fontFamily: 'monospace',
              maxHeight: '200px', 
              overflowY: 'auto',
              textAlign: 'left',
              wordBreak: 'break-all'
            }}>
              {logs.length === 0 ? 'No logs yet...' : logs.map((l, i) => (
                <div key={i} style={{ marginBottom: '4px' }}>{l}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default RegisterView;

