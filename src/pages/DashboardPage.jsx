// src/pages/DashboardPage.jsx

import React, { useEffect } from 'react';
import { useDashboard } from '../contexts/DashboardContext'; // Tetap gunakan untuk error dan potensi fetch
import {
  Typography,
  Box,
  Paper,
  Grid, // Mungkin tidak terpakai lagi jika hanya banner
  Avatar,
  // List, ListItem, ListItemAvatar, ListItemText, Divider, // Tidak terpakai jika aktivitas dihapus
  useTheme,
  alpha,
  CircularProgress, // Untuk error handling jika fetch gagal
  Alert
} from '@mui/material';
import logoTapatupa from '../assets/images/logoTAPATUPA.png';

// Ikon-ikon untuk StatCard dan Aktivitas bisa dihapus jika komponennya juga dihapus total
// import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
// ... ikon lainnya ...

// import { motion } from 'framer-motion'; // Tidak terpakai jika StatCard dihapus

// Komponen StatCard dan ActivityItem bisa dihapus jika tidak digunakan di tempat lain
// atau biarkan jika mungkin akan dipakai lagi di masa depan dengan data sungguhan.
// Untuk sekarang, kita tidak merendernya.

const DashboardPage = () => {
  const theme = useTheme();
  // Tetap ambil error dan loading dari context, fetchDashboardData jika ingin tombol retry
  const { loading, error, fetchDashboardData, dashboardData } = useDashboard();

  useEffect(() => {
    // Logika ini bisa disederhanakan atau disesuaikan.
    // Jika DashboardProvider sudah melakukan fetch awal, mungkin tidak perlu fetch lagi di sini.
    // Namun, jika ada error, pengguna mungkin ingin mencoba lagi.
    if (!loading && error) {
        console.log("DashboardPage: Ada error saat memuat data dari context.");
    } else if (!loading && (!dashboardData || !dashboardData.stats || dashboardData.stats.permohonanAktif === undefined)) {
        // Kondisi ini untuk mencoba fetch jika data tampak belum ada, tapi hati-hati infinite loop jika ada masalah di context.
        // Lebih baik jika fetch awal dihandle sepenuhnya oleh Provider.
        // Untuk sekarang, kita bisa membiarkan provider yang handle fetch awal.
        // console.log("DashboardPage: Data stats dari context kosong, provider diharapkan sudah fetch.");
        // fetchDashboardData(); // Panggil ini jika ingin halaman dashboard selalu coba fetch jika data kosong
    }
  }, [fetchDashboardData, dashboardData, loading, error]);


  return (
    <Box>
      {/* Welcome Banner */}
      <Paper
        elevation={0}
        sx={{
          p: {xs: 2, md: 3.5},
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: 'center',
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          borderRadius: '16px',
          boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
        }}
      >
        <Avatar
          src={logoTapatupa}
          sx={{
            width: { xs: 70, md: 90 },
            height: { xs: 70, md: 90 },
            mr: { sm: 3 },
            mb: { xs: 2, sm: 0 },
            backgroundColor: theme.palette.common.white,
            p: 0.5,
            borderRadius: '12px'
          }}
          variant="rounded"
        />
        <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            Selamat Datang, Admin!
          </Typography>
          <Typography variant="h6" sx={{ mb: 1, opacity: 0.9 }}>
            Admin Dashboard TAPATUPA
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8 }}>
            Pantau dan kelola semua aktivitas terkait aset tanah dengan mudah.
          </Typography>
        </Box>
      </Paper>

      {/* Tampilkan error jika ada masalah saat context mencoba fetch data */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} action={
          <Button color="inherit" size="small" onClick={() => fetchDashboardData()}>
            COBA LAGI
          </Button>
        }>
          {error}
        </Alert>
      )}

      {/* Indikator loading global jika diperlukan (misalnya, jika banner juga menunggu data tertentu) */}
      {/* {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 5 }}>
          <CircularProgress />
          <Typography sx={{ml: 2}}>Memuat data dashboard...</Typography>
        </Box>
      )} */}

      {/* BAGIAN STATISTIK DAN AKTIVITAS DIHAPUS */}

      {/* Anda bisa menambahkan konten lain di sini jika ada */}
      {/* Contoh:
      <Paper sx={{ p: 3, borderRadius: '12px', boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}` }}>
        <Typography variant="h6">Ringkasan Lainnya</Typography>
        <Typography>Konten dashboard tambahan akan muncul di sini.</Typography>
      </Paper>
      */}

    </Box>
  );
};

export default DashboardPage;