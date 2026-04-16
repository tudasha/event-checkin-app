import React, { useState } from 'react';
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
        return;
    }

    setLoading(true);
    setMsg('');
    try {
        await axios.post(`/api/attendees`, { ...formData, hasCheckedIn: checkInNow });
        setMsg('Successfully Registered!');
        setTimeout(() => navigate('/'), 2000);
    } catch(err) {
        console.error(err);
        setMsg('Registration failed. Check server connection.');
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
            background: msg.includes('failed') || msg.includes('fill') ? 'hsl(0, 70%, 55%)' : 'hsl(140, 60%, 45%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '24px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 1000,
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            animation: 'fadeIn 0.3s ease-in-out'
        }}>
            {msg.includes('failed') || msg.includes('fill') ? '⚠️ ' : '✅ '}
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
    </>
  );
}

export default RegisterView;
