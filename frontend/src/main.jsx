import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import axios from 'axios'

// Set default base URL for API requests.
// In dev, if VITE_API_URL is missing, it will use the proxy ('')
axios.defaults.baseURL = import.meta.env.VITE_API_URL || ''

// Prevent infinite loading by setting a global timeout of 10 seconds.
// If the backend doesn't answer in 10s, it throws an error.
axios.defaults.timeout = 10000;

// Security: Inject API Admin Token into all Axios requests if it exists in the environment
const adminToken = import.meta.env.VITE_ADMIN_TOKEN;
if (adminToken) {
  axios.defaults.headers.common['x-admin-token'] = adminToken;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
