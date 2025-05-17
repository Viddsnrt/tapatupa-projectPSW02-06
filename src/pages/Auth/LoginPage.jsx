import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  CssBaseline,
  GlobalStyles,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';

// Jika logo ada di folder public, pathnya seperti ini:
const LOGO_URL = 'src/assets/images/logoTAPATUPA.png';
// Jika logo ada di src/assets/, impor seperti ini:
// import tapatupaLogo from './assets/images/logoTAPATUPA.png'; // lalu gunakan src={tapatupaLogo}

const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      showSnackbar('Username dan Password tidak boleh kosong!', 'warning');
      return;
    }
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (username === "admin" && password === "password123") { // Ganti dengan kredensial dummy Anda
      localStorage.setItem('authToken', 'dummy-tapatupa-token-final');
      showSnackbar('Login Berhasil! Mengarahkan...', 'success');
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } else {
      showSnackbar('User Name atau Password salah!', 'error');
    }
    setLoading(false);
  };

  const formVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4, delay: 0.1, ease: "easeOut" } },
  };

  // Komponen untuk elemen dekoratif di background
  const DecorativeBox = ({ top, left, right, bottom, rotate, size = 150, opacity = 0.07, dashed = false }) => (
    <Box
      sx={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: !dashed ? `rgba(255, 255, 255, ${opacity})` : 'transparent',
        border: dashed ? `2px dashed rgba(255, 255, 255, ${opacity + 0.05})` : 'none',
        borderRadius: '12px',
        top,
        left,
        right,
        bottom,
        transform: `rotate(${rotate}deg)`,
        zIndex: 0, // Pastikan di belakang form
        pointerEvents: 'none', // Agar tidak mengganggu interaksi mouse
      }}
    />
  );


  return (
    <>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Kembali ke font default atau pilih yang sesuai
          },
        }}
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          backgroundColor: '#3498DB', // Warna biru solid seperti referensi
          padding: 2,
          position: 'relative', // Untuk positioning elemen dekoratif
          overflow: 'hidden', // Agar elemen dekoratif tidak keluar layar
        }}
      >
        {/* Elemen Dekoratif Background */}
        <DecorativeBox top="10%" left="10%" rotate={-15} size={220} />
        <DecorativeBox bottom="15%" right="12%" rotate={25} size={180} dashed />
        <DecorativeBox top="50%" left="25%" rotate={10} size={120} opacity={0.05}/>
        <DecorativeBox top="20%" right="20%" rotate={-5} size={100} opacity={0.04} dashed/>


        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          style={{ zIndex: 1 }} // Pastikan form di atas elemen dekoratif
        >
          <Paper
            elevation={5} // Shadow lebih lembut
            sx={{
              padding: { xs: '30px 25px', sm: '40px 35px' },
              width: '100%',
              maxWidth: 380, // Sedikit lebih ramping
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              backgroundColor: '#FFFFFF', // Putih solid
              boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.1)', // Shadow sesuai gambar
            }}
          >
            <motion.div variants={logoVariants}>
              <Box
                component="img"
                src={LOGO_URL} // Pastikan path logo benar
                alt="TAPATUPA Logo"
                sx={{
                  width: 'auto',
                  maxHeight: { xs: 60, sm: 75 },
                  mb: 2.5,
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error("Logo not found or error loading:", LOGO_URL);
                  // Mungkin tampilkan placeholder atau teks jika logo gagal dimuat
                  // e.target.parentElement.innerHTML = '<Typography color="error">Logo Error</Typography>';
                }}
              />
            </motion.div>

            <Typography
              component="h1"
              variant="h5" // Sedikit lebih kecil dari h4
              sx={{
                fontWeight: 'bold',
                color: '#333333',
                mb: 3,
              }}
            >
              Login
            </Typography>

            <Box component="form" onSubmit={handleLogin} noValidate sx={{ width: '100%' }}>
              {/* Menggunakan Typography untuk label, mirip gambar asli */}
              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#555555', textAlign: 'left', width: '100%' }}>
                User Name
              </Typography>
              <TextField
                required
                fullWidth
                id="username"
                placeholder="Masukkan Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
                variant="outlined" // Default variant
                size="small" // Agar field tidak terlalu tinggi
                sx={{ mb: 2 }}
              />

              <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5, color: '#555555', textAlign: 'left', width: '100%' }}>
                Password
              </Typography>
              <TextField
                required
                fullWidth
                name="password"
                placeholder="Masukkan Password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                variant="outlined"
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        sx={{ color: '#bdbdbd' }} // Warna ikon mata lebih lembut
                        disabled={loading}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{
                  padding: '10px 0',
                  fontSize: '1rem',
                  fontWeight: 'medium', // Tidak terlalu bold
                  backgroundColor: '#29B6F6', // Warna biru tombol (sesuaikan dengan logo/tema)
                  color: 'white',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                  transition: 'background-color 0.2s ease, transform 0.1s ease',
                  '&:hover': {
                    backgroundColor: '#039BE5', // Biru lebih gelap saat hover
                    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                    // transform: 'translateY(-1px)', // Efek hover halus
                  },
                  '&:active': {
                    // transform: 'translateY(0px) scale(0.99)',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  },
                  position: 'relative',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white', position: 'absolute' }} />
                ) : (
                  'Login'
                )}
              </Button>
            </Box>
          </Paper>
        </motion.div>
        <Typography variant="caption" sx={{ mt: 4, color: 'rgba(255,255,255,0.7)' }}>
          © {new Date().getFullYear()} TAPATUPA. All rights reserved.
        </Typography>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Posisi di bawah tengah
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default LoginPage;