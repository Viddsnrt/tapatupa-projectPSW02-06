// src/pages/DashboardPage.jsx

import React, { useEffect, useState, useCallback } from 'react'; // Tambah useEffect, useState, useCallback
import apiClient from '../services/apiClient'; // Pastikan path benar
import { Typography, Box, Paper, Grid, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, useTheme, alpha, Icon, CircularProgress, Alert } from '@mui/material'; // Tambah CircularProgress, Alert
import logoTapatupa from '../assets/images/logoTAPATUPA.png';

// Ikon untuk StatCard (sudah ada)
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

// Ikon umum dan untuk recentActivities (sudah ada)
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventNoteIcon from '@mui/icons-material/EventNote';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import BusinessIcon from '@mui/icons-material/Business';

import { motion } from 'framer-motion';

// Komponen StatCard (Tidak berubah, tetap sama)
const StatCard = ({ title, value, icon, color = "primary", trend, unit = "", delay = 0 }) => {
  const theme = useTheme();
  const trendColor = trend && trend.startsWith('+') ? theme.palette.success.main : (trend && trend.startsWith('-') ? theme.palette.error.main : theme.palette.text.secondary);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      style={{ height: '100%' }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          borderRadius: '12px',
          backgroundColor: theme.palette.background.paper,
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 6px 16px ${alpha(theme.palette.common.black, 0.08)}`,
            },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
          <Avatar sx={{ bgcolor: alpha(theme.palette[color]?.main || theme.palette.primary.main, 0.15), color: theme.palette[color]?.main || theme.palette.primary.main, width: 48, height: 48, mr: 2 }}>
            {icon}
          </Avatar>
          <Typography variant="subtitle1" color="text.secondary" sx={{ fontWeight: 'medium' }}>{title}</Typography>
        </Box>
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary, mb: 1 }}>
          {value === undefined || value === null ? <CircularProgress size={24} /> : value}
          {unit && <Typography variant="h6" component="span" color="text.secondary" sx={{ ml: 0.5 }}>{unit}</Typography>}
        </Typography>
        {trend && (
          <Typography variant="body2" sx={{ color: trendColor, display: 'flex', alignItems: 'center' }}>
            <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, transform: trend.startsWith('-') ? 'rotate(180deg)' : 'none' }} />
            {trend} vs bulan lalu
          </Typography>
        )}
      </Paper>
    </motion.div>
  );
};

// Komponen ActivityItem (Tidak berubah, tetap sama)
const ActivityItem = ({ icon, primary, secondary, time }) => {
  const theme = useTheme();
  return (
    <>
      <ListItem alignItems="flex-start" sx={{ py: 1.5, '&:hover': { backgroundColor: alpha(theme.palette.action.hover, 0.5)} , borderRadius: theme.shape.borderRadius}}>
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1), color: theme.palette.primary.main }}>
            {icon || <NotificationsNoneIcon />}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={<Typography variant="body1" component="span" fontWeight="medium">{primary}</Typography>}
          secondary={
            <>
              <Typography
                sx={{ display: 'inline' }}
                component="span"
                variant="body2"
                color="text.secondary"
              >
                {secondary}
              </Typography>
              {time && <Typography variant="caption" display="block" color="text.disabled" sx={{mt:0.5}}>{time}</Typography>}
            </>
          }
        />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  )
};


const DashboardPage = () => {
  const theme = useTheme();
  const [dashboardData, setDashboardData] = useState({
    stats: {
      permohonanAktif: undefined,
      penggunaTerdaftar: undefined,
      objekRetribusi: undefined,
      totalTransaksiBulanIni: undefined,
    },
    recentActivities: [],
    // Anda bisa tambahkan data untuk chart di sini
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ganti dengan endpoint API Anda yang sebenarnya
      const statsPromise = apiClient.get('/dashboard/summary-stats'); // Endpoint untuk statistik
      const activitiesPromise = apiClient.get('/dashboard/recent-activities?limit=5'); // Endpoint untuk aktivitas

      const [statsRes, activitiesRes] = await Promise.all([statsPromise, activitiesPromise]);

      setDashboardData({
        stats: {
          permohonanAktif: statsRes.data.data?.activeApplications ?? 0,
          penggunaTerdaftar: statsRes.data.data?.registeredUsers ?? 0,
          objekRetribusi: statsRes.data.data?.retributionObjects ?? 0,
          totalTransaksiBulanIni: statsRes.data.data?.currentMonthTransactions ?? 0,
          // Tambahkan tren jika API Anda menyediakannya
        },
        recentActivities: activitiesRes.data.data || [],
      });

    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Gagal memuat data dashboard. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Data untuk kartu statistik dari state
  const statsCards = [
    { title: "Permohonan Aktif", value: dashboardData.stats.permohonanAktif, icon: <AssignmentLateIcon />, color: "primary", unit: "dokumen", delay: 0 /* trend: dashboardData.stats.permohonanTrend */ },
    { title: "Pengguna Terdaftar", value: dashboardData.stats.penggunaTerdaftar, icon: <PeopleAltIcon />, color: "secondary", delay: 1 /* trend: dashboardData.stats.penggunaTrend */ },
    { title: "Objek Retribusi", value: dashboardData.stats.objekRetribusi, icon: <BusinessCenterIcon />, color: "success", unit: "unit", delay: 2 /* trend: dashboardData.stats.objekTrend */ },
    { title: "Transaksi Bulan Ini", value: dashboardData.stats.totalTransaksiBulanIni, icon: <ReceiptLongIcon />, color: "info", unit: "transaksi", delay: 3 /* trend: dashboardData.stats.transaksiTrend */ },
  ];

  // Fungsi untuk memetakan tipe aktivitas ke ikon (contoh)
  const getActivityIcon = (type) => {
    switch (type) {
      case 'NEW_APPLICATION': return <AssignmentIcon />;
      case 'NEW_USER': return <PeopleIcon />;
      case 'PAYMENT_RECEIVED': return <MonetizationOnIcon />;
      case 'OBJECT_ADDED': return <BusinessIcon />;
      default: return <NotificationsNoneIcon />;
    }
  };


  return (
    <Box>
      {/* Welcome Banner (Tidak berubah) */}
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

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Kartu Statistik */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard 
              title={stat.title} 
              value={loading ? undefined : stat.value} // Tampilkan loader jika loading
              icon={stat.icon} 
              color={stat.color} 
              // trend={stat.trend} // Aktifkan jika API menyediakan data tren
              unit={stat.unit} 
              delay={index} 
            />
          </Grid>
        ))}
      </Grid>

      {/* Bagian lain seperti Chart atau Aktivitas Terbaru */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
            <Paper sx={{ p: {xs:2, md:3}, borderRadius: '12px', height: '100%', boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`}}>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium', mb:2}}>
                    Grafik Permohonan (Contoh)
                </Typography>
                {loading ? (
                    <Box sx={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center'}}><CircularProgress /></Box>
                ) : (
                    <Box sx={{height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: alpha(theme.palette.grey[500], 0.1), borderRadius: '8px'}}>
                        <Typography color="text.secondary">Data chart akan tampil di sini</Typography>
                        {/* Di sini nanti bisa integrasi dengan library chart seperti Recharts atau Chart.js dengan data dari API */}
                    </Box>
                )}
            </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
            <Paper sx={{ p: {xs:2, md:3}, borderRadius: '12px', height: '100%', boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`}}>
                <Typography variant="h6" gutterBottom sx={{fontWeight: 'medium', mb:1}}>
                    Aktivitas Terbaru
                </Typography>
                {loading ? (
                    <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200}}><CircularProgress /></Box>
                ) : dashboardData.recentActivities.length > 0 ? (
                    <List sx={{ width: '100%', bgcolor: 'background.paper', p:0 }}>
                        {dashboardData.recentActivities.map((activity, index) => (
                             <ActivityItem 
                                key={activity.id || index} // Gunakan ID unik dari API jika ada
                                icon={getActivityIcon(activity.type)} // Asumsi API mengembalikan 'type'
                                primary={activity.title} // Asumsi API mengembalikan 'title'
                                secondary={activity.description} // Asumsi API mengembalikan 'description'
                                time={activity.timestamp ? new Date(activity.timestamp).toLocaleString('id-ID') : ''} // Asumsi API mengembalikan 'timestamp'
                              />
                        ))}
                    </List>
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{textAlign: 'center', py: 5}}>Belum ada aktivitas terbaru.</Typography>
                )}
            </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;