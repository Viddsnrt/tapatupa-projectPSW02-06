// src/App.jsx

import React from 'react';
import { AppRoutes } from './routes'; // Pastikan path ke file routes/index.jsx benar
import { DashboardProvider } from './contexts/DashboardContext'; // <-- 1. IMPORT PROVIDER

// Import MUI ThemeProvider jika ingin kustomisasi tema global
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

// Buat tema default atau kustom MUI
const theme = createTheme({
  // palette: {
  //   primary: {
  //     main: '#1976d2', // Contoh warna primer
  //   },
  //   secondary: {
  //     main: '#dc004e', // Contoh warna sekunder
  //   },
  // },
  // typography: {
  //   fontFamily: 'Roboto, Arial, sans-serif',
  // },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalisasi CSS dasar dari MUI */}
      <DashboardProvider> {/* <-- 2. BUNGKUS AppRoutes DENGAN PROVIDER */}
        <AppRoutes />
      </DashboardProvider>
    </ThemeProvider>
  );
}

export default App;