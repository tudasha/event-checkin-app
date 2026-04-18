import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AttendeesListView() {
  const navigate = useNavigate();
  const [attendees, setAttendees] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ fullName: '', age: '' });

  const fetchAttendees = async () => {
    try {
      setLoading(true);
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

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditFormData({ fullName: user.fullName, age: user.age });
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  const handleSaveEdit = async (id) => {
    try {
      await axios.put(`/api/attendees/${id}`, editFormData);
      setAttendees(attendees.map(user => 
        user.id === id ? { ...user, fullName: editFormData.fullName, age: editFormData.age } : user
      ));
      setEditingUserId(null);
    } catch (err) {
      console.error(err);
      alert('Failed to update user.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`/api/attendees/${id}`);
        setAttendees(attendees.filter(user => user.id !== id));
      } catch (err) {
        console.error(err);
        alert('Failed to delete user.');
      }
    }
  };

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
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attendees.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--background)' }}>
                    {editingUserId === user.id ? (
                      <>
                        <td style={{ padding: '12px 8px' }}>
                          <input 
                            className="neu-input" 
                            style={{ margin: 0, padding: '4px 8px' }} 
                            value={editFormData.fullName} 
                            onChange={(e) => setEditFormData({...editFormData, fullName: e.target.value})} 
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                          <input 
                            className="neu-input" 
                            type="number"
                            style={{ margin: 0, padding: '4px 8px', width: '60px' }} 
                            value={editFormData.age} 
                            onChange={(e) => setEditFormData({...editFormData, age: e.target.value})} 
                          />
                        </td>
                        <td style={{ padding: '12px 8px' }}>
                            {user.hasCheckedIn ? '✅ Yes' : 'No'}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', minWidth: '130px' }}>
                           <button className="neu-button" style={{ padding: '4px 8px', margin: '0 4px 0 0', display: 'inline-block', width: 'auto', background: 'var(--primary)', color: 'white' }} onClick={() => handleSaveEdit(user.id)}>Save</button>
                           <button className="neu-button" style={{ padding: '4px 8px', margin: 0, display: 'inline-block', width: 'auto' }} onClick={handleCancelEdit}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td style={{ padding: '12px 8px' }}>{user.fullName}</td>
                        <td style={{ padding: '12px 8px' }}>{user.age}</td>
                        <td style={{ padding: '12px 8px' }}>
                            {user.hasCheckedIn ? (
                                <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>✅ Yes</span>
                            ) : (
                                <span style={{ color: 'gray' }}>No</span>
                            )}
                        </td>
                        <td style={{ padding: '12px 8px', textAlign: 'right', minWidth: '130px' }}>
                           <button className="neu-button" style={{ padding: '4px 8px', margin: '0 4px 0 0', display: 'inline-block', width: 'auto' }} onClick={() => handleEditClick(user)}>Edit</button>
                           <button className="neu-button" style={{ padding: '4px 8px', margin: 0, display: 'inline-block', width: 'auto', background: '#ff6b6b', color: 'white' }} onClick={() => handleDelete(user.id)}>Del</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {attendees.length === 0 && (
                  <tr>
                    <td colSpan="4" style={{ padding: '16px', textAlign: 'center' }}>No attendees registered yet!</td>
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
