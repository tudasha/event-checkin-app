import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';

function ScannerView() {
  const navigate = useNavigate();
  const [attendee, setAttendee] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Only initialize scanner if not already scanning.
    scannerRef.current = new Html5QrcodeScanner(
      "qr-reader", 
      { fps: 10, qrbox: { width: 250, height: 250 } }, 
      false
    );
    
    scannerRef.current.render(onScanSuccess, onScanFailure);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
      }
    };
  }, []);

  const onScanSuccess = async (decodedText, decodedResult) => {
    try {
        scannerRef.current.clear(); // stop scanning on success
        setErrorMsg('');
        
        // Using the Vite proxy to avoid Mixed Content (HTTPS -> HTTP) errors!
        const res = await axios.get(`/api/attendees/scan/${decodedText}`);
        setAttendee(res.data);
    } catch (err) {
        if (err.response && err.response.status === 409) {
            setErrorMsg('Ticket has already been scanned -> scan another');
        } else {
            setErrorMsg('QR Token not found or invalid.');
        }
        console.error(err);
    }
  };

  const onScanFailure = (error) => {
      // Ignored for UX, fails constantly until a code is properly in view
  };

  const handleMarkAsPaid = async () => {
    try {
      const res = await axios.put(`/api/attendees/${attendee.id}/pay`);
      setAttendee(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to update payment status');
    }
  };

  return (
    <>
      <div className="app-bar">
        <button className="neu-button" style={{ width: 'auto', padding: '8px 16px', marginBottom: 0 }} onClick={() => navigate('/')}>
          ← Back
        </button>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>QR <span className="brand-text">Scan</span></h2>
      </div>

      <div className="neu-card">
        {!attendee ? (
            <>
                <div id="qr-reader" style={{ width: '100%', borderRadius: '12px', overflow: 'hidden', display: errorMsg ? 'none' : 'block' }}></div>
                {errorMsg && (
                    <div style={{ textAlign: 'center', marginTop: '16px' }}>
                        <p className="error-msg" style={{ marginBottom: '16px', fontWeight: 'bold', color: 'hsl(0, 80%, 60%)' }}>
                            {errorMsg}
                        </p>
                        <button className="neu-button primary" onClick={() => window.location.reload()}>
                          Scan Another
                        </button>
                    </div>
                )}
                {!errorMsg && (
                    <p style={{ textAlign: 'center', marginTop: '16px', color: 'var(--text-dark)', opacity: 0.7 }}>
                      Point camera at ticket QR code
                    </p>
                )}
            </>
        ) : (
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
                    {attendee.hasPaid ? '✅' : '❗'}
                </div>
                <h2 style={{ color: attendee.hasPaid ? 'var(--primary)' : 'hsl(30, 90%, 55%)', marginBottom: '16px' }}>
                    {attendee.hasPaid ? 'Valid Ticket' : 'Payment Required'}
                </h2>
                <div style={{ textAlign: 'left', background: 'var(--background)', padding: '16px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <p><strong>Name:</strong> {attendee.fullName}</p>
                    <p><strong>Age:</strong> {attendee.age} {attendee.isOver18 ? '(18+)' : '(Minor)'}</p>
                    <p><strong>Email:</strong> {attendee.email || 'N/A'}</p>
                    <p><strong>Paid/Donated:</strong> {attendee.hasPaid ? 'Yes ✅' : 'No ❌'}</p>
                    <p><strong>Parental Consent:</strong> {attendee.hasParentalConsent ? 'Yes ✅' : (attendee.isOver18 ? 'N/A' : 'No ❌')}</p>
                    <p><strong>Media Consent:</strong> {attendee.mediaConsent ? 'Yes ✅' : 'No ❌'}</p>
                    <p><strong>Dietary:</strong> {attendee.dietaryRestrictions || 'None'}</p>
                    <p><strong>Referral:</strong> {attendee.referralSource || 'N/A'}</p>
                    <p><strong>Registered On:</strong> {new Date(attendee.timestamp).toLocaleString()}</p>
                </div>
                
                {!attendee.hasPaid ? (
                    <button className="neu-button" style={{color: 'hsl(30, 90%, 55%)', border: '1px solid hsl(30, 90%, 55%)'}} onClick={handleMarkAsPaid}>
                        Mark as Paid
                    </button>
                ) : (
                    <button className="neu-button primary" onClick={() => {
                         setAttendee(null);
                         window.location.reload();
                    }}>
                      Scan Another
                    </button>
                )}
            </div>
        )}
      </div>
    </>
  );
}

export default ScannerView;
