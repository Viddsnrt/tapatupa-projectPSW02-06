import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Pastikan path ke App.jsx benar
// import './index.css'; // Jika kamu punya file CSS global tambahan

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);