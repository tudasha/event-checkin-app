import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AttendeeDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendeeDetails = async () => {
      try {
        setLoading(true);
        // Note: Currently no backend route for GET /api/attendees/:id
        // So we might fetch all and filter, or add the backend route
        // We'll try fetching all for now, to not disrupt the backend too much
        // Wait, we can fetch all and find the one. Or add GET /api/attendees/:id.
        // Let's assume we can fetch all and find
        const res = await axios.get('/api/attendees');
        const user = res.data.find(u => u.id === id);
        setAttendee(user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendeeDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="neu-container">
        <p style={{ textAlign: 'center' }}>Loading details...</p>
      </div>
    );
  }

  if (!attendee) {
    return (
      <div className="neu-container">
        <div className="app-bar">
          <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/attendees')}>
            ← Back
          </button>
          <h2>User Not Found</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="neu-container">
      <div className="app-bar">
        <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/attendees')}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>Attendee <span className="brand-text">Details</span></h2>
      </div>

      <div className="neu-card" style={{ padding: '20px', textAlign: 'left' }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'var(--primary)', borderBottom: '1px solid var(--background)', paddingBottom: '10px' }}>
          {attendee.fullName}
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '10px', marginBottom: '20px' }}>
          <strong>ID:</strong> <span>{attendee.id}</span>
          <strong>Email:</strong> <span>{attendee.email || 'N/A'}</span>
          <strong>Age:</strong> <span>{attendee.age}</span>
          <strong>Referral Source:</strong> <span>{attendee.referralSource || 'N/A'}</span>
          
          <strong>Dietary Restrictions:</strong> 
          <span style={{ 
            color: attendee.dietaryRestrictions && attendee.dietaryRestrictions.trim().toLowerCase() !== 'none' && attendee.dietaryRestrictions.trim() !== '' ? '#ffcc00' : 'inherit',
            fontWeight: attendee.dietaryRestrictions && attendee.dietaryRestrictions.trim().toLowerCase() !== 'none' && attendee.dietaryRestrictions.trim() !== '' ? 'bold' : 'normal'
          }}>
            {attendee.dietaryRestrictions || 'None'}
          </span>

          <strong>Media Consent:</strong> <span>{attendee.mediaConsent ? '✅ Yes' : '❌ No'}</span>
          <strong>Over 18:</strong> <span>{attendee.isOver18 ? '✅ Yes' : '❌ No'}</span>
          <strong>Parental Consent:</strong> <span>{attendee.hasParentalConsent ? '✅ Yes' : (attendee.isOver18 ? 'N/A' : '❌ No')}</span>
          <strong>Paid / Donated:</strong> <span>{attendee.hasPaid ? '✅ Yes' : '❌ No'}</span>
          <strong>Checked In:</strong> <span>{attendee.hasCheckedIn ? '✅ Yes' : '❌ No'}</span>
          <strong>Registration Time:</strong> <span>{new Date(attendee.timestamp).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default AttendeeDetailsView;
