import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogsView() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Initial load
    setLogs(window.omlLogs || []);

    const handleLogUpdate = () => {
      setLogs([...(window.omlLogs || [])]);
    };

    window.addEventListener('oml-log', handleLogUpdate);
    return () => window.removeEventListener('oml-log', handleLogUpdate);
  }, []);

  const copyLogs = () => {
    navigator.clipboard.writeText((window.omlLogs || []).join('\n')).then(() => {
        alert('Copiad!');
    }).catch(() => alert('Failed to copy'));
  };

  const clearLogs = () => {
      window.omlLogs = [];
      setLogs([]);
  };

  return (
    <>
      <div className="app-bar">
        <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>System <span className="brand-text">Logs</span></h2>
      </div>

      <div className="neu-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <span style={{ fontWeight: 'bold' }}>Live Traffic Inspector</span>
            <div style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="neu-button" style={{ padding: '6px 12px', width: 'auto' }} onClick={clearLogs}>Clear</button>
                <button type="button" className="neu-button primary" style={{ padding: '6px 12px', width: 'auto' }} onClick={copyLogs}>Copy</button>
            </div>
        </div>
        
        <div style={{ 
            flex: 1,
            background: '#1a1a1a', 
            color: '#00ff00', 
            padding: '12px', 
            borderRadius: '12px', 
            fontSize: '11px',
            fontFamily: 'monospace',
            overflowY: 'auto',
            textAlign: 'left',
            wordBreak: 'break-all',
            boxShadow: 'inset 0px 4px 10px rgba(0,0,0,0.5)'
        }}>
          {logs.length === 0 ? 'No logs yet. Waiting for traffic...' : logs.map((l, i) => (
            <div key={i} style={{ 
                marginBottom: '6px', 
                paddingBottom: '6px', 
                borderBottom: '1px solid #333',
                color: l.includes('ERR') ? '#ff5555' : (l.includes('RES') ? '#88ffff' : '#00ff00')
            }}>
                {l}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default LogsView;
