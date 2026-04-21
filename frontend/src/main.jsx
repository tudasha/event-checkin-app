import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios'

// Set default base URL for API requests.
// In dev, if VITE_API_URL is missing, it will use the proxy ('')
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

// Prevent infinite loading by setting a global timeout of 60 seconds (useful for Render cold starts).
// If the backend doesn't answer in 60s, it throws an error.
axios.defaults.timeout = 60000;
// Security: Inject API Admin Token into all Axios requests if it exists in the environment
const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
if (adminToken) {
  axios.defaults.headers.common['x-admin-token'] = adminToken;
}

// Global System Log Capturer (for Admin Debugging)
window.omlLogs = [];
const pushLog = (msg) => {
    const time = new Date().toISOString().split('T')[1].substring(0, 8);
    window.omlLogs.unshift(`[${time}] ${msg}`);
    if(window.omlLogs.length > 200) window.omlLogs.pop();
    window.dispatchEvent(new Event('oml-log'));
};

axios.interceptors.request.use(req => {
    pushLog(`REQ: [${req.method.toUpperCase()}] ${req.url}`);
    return req;
});
axios.interceptors.response.use(res => {
    const dataStr = res.data ? JSON.stringify(res.data) : '';
    pushLog(`RES: [${res.status}] ${res.config.url} => ${dataStr.substring(0, 100)}${dataStr.length > 100 ? '...' : ''}`);
    return res;
}, err => {
    pushLog(`ERR: ${err.message} (${err.response?.status || 'Network/Timeout'})`);
    return Promise.reject(err);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
