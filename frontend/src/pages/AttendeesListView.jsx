import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AttendeesListView() {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendees = async () => {
    try {
      const res = await axios.get('/api/attendees');
      setAttendees(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendees();
  }, []);

  return (
    <>
      <div className="app-bar">
        <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>All <span className="brand-text">Attendees</span></h2>
      </div>

      <div className="neu-card" style={{ maxWidth: '100%', overflowX: 'auto', padding: '16px' }}>
        {loading ? (
            <p style={{textAlign: 'center'}}>Loading...</p>
        ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--background)' }}>
                  <th style={{ padding: '12px 8px' }}>Name</th>
                  <th style={{ padding: '12px 8px' }}>Age</th>
                  <th style={{ padding: '12px 8px' }}>Checked-in</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--background)' }}>
                    <td style={{ padding: '12px 8px' }}>{user.fullName}</td>
                    <td style={{ padding: '12px 8px' }}>{user.age}</td>
                    <td style={{ padding: '12px 8px' }}>
                        {user.hasCheckedIn ? (
                            <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✅ Yes</span>
                        ) : (
                            <span style={{ color: 'gray' }}>No</span>
                        )}
                    </td>
                  </tr>
                ))}
                {attendees.length === 0 && (
                  <tr>
                    <td colSpan="3" style={{ padding: '16px', textAlign: 'center' }}>No attendees registered yet!</td>
                  </tr>
                )}
              </tbody>
            </table>
        )}
      </div>
    </>
  );
}

export default AttendeesListView;
