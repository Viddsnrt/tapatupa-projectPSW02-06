// src/components/layout/AdminLayout.jsx

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemButton, ListItemIcon,
  ListItemText, CssBaseline, Box, Button, IconButton, Divider, Avatar, Tooltip, Menu, MenuItem,
  useTheme, alpha // alpha untuk warna transparan
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import PeopleIcon from '@mui/icons-material/People';
import TimerIcon from '@mui/icons-material/Timer';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import BusinessIcon from '@mui/icons-material/Business';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings'; // Contoh ikon tambahan
import AccountCircleIcon from '@mui/icons-material/AccountCircle'; // Untuk profil

import logoTapatupa from '../../assets/images/logoTAPATUPA.png';

const drawerWidth = 280; // Sedikit lebih lebar

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'Permohonan Sewa', icon: <AssignmentIcon />, path: '/permohonan-sewa' },
  { text: 'Wajib Retribusi', icon: <PeopleIcon />, path: '/wajib-retribusi' },
  { text: 'Objek Retribusi', icon: <BusinessIcon />, path: '/objek-retribusi' },
  { text: 'Manajemen User', icon: <SupervisedUserCircleIcon />, path: '/users' },
];

const masterDataItems = [
  { text: 'Jenis Permohonan', icon: <DescriptionIcon />, path: '/jenis-permohonan' },
  { text: 'Jenis Jangka Waktu', icon: <ScheduleIcon />, path: '/jenis-jangka-waktu' },
  { text: 'Lokasi Objek Retribusi', icon: <LocationOnIcon />, path: '/lokasi-objek-retribusi' },
  { text: 'Jenis Objek Retribusi', icon: <CategoryIcon />, path: '/jenis-objek-retribusi' },
  { text: 'Jenis Status', icon: <RuleFolderIcon />, path: '/jenis-status' },
  { text: 'Jangka Waktu Sewa', icon: <TimerIcon />, path: '/jangka-waktu-sewa' },
  { text: 'Manajemen Status', icon: <PlaylistAddCheckIcon />, path: '/statuses' },
  { text: 'Peruntukan Sewa', icon: <AssignmentTurnedInIcon />, path: '/peruntukan-sewa' },
  { text: 'Tarif Objek Retribusi', icon: <MonetizationOnIcon />, path: '/tarif-objek-retribusi' },
];

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Untuk active state
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    handleCloseUserMenu();
    navigate('/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2, // Padding lebih
        // backgroundColor: alpha(theme.palette.primary.main, 0.05), // Warna latar header drawer
        // borderBottom: `1px solid ${theme.palette.divider}`
      }}>
        <Avatar
          src={logoTapatupa}
          sx={{ width: 50, height: 50, mr: 1.5 }}
          variant="rounded"
        />
        <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          TAPATUPA
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ flexGrow: 1, overflowY: 'auto', p: 1 }}> {/* Padding list */}
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={mobileOpen ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: theme.shape.borderRadius,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12), // Warna aktif lebih subtle
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 'medium' : 'normal' }} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 2 }}>
          <Typography variant="overline" color="text.secondary">Master Data</Typography>
        </Divider>
        {masterDataItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ my: 0.5 }}>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              onClick={mobileOpen ? handleDrawerToggle : undefined}
              sx={{
                borderRadius: theme.shape.borderRadius,
                '&.Mui-selected': {
                  backgroundColor: alpha(theme.palette.primary.main, 0.12),
                  color: theme.palette.primary.main,
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                  },
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.15),
                  }
                },
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.primary, 0.05),
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: location.pathname === item.path ? theme.palette.primary.main : theme.palette.text.secondary }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: location.pathname === item.path ? 'medium' : 'normal' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" // Atau 'text'
            color="error" 
            startIcon={<LogoutIcon />} 
            onClick={handleLogout}
            sx={{ borderRadius: theme.shape.borderRadius }}
          >
            Logout
          </Button>
        </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.paper, // AppBar putih atau warna netral
          color: theme.palette.text.primary, // Teks AppBar jadi gelap
          boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)', // Shadow lebih halus
        }}
        // elevation={0} // Bisa juga tanpa shadow jika drawer ada border
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'medium' }}>
            {/* Dinamiskan judul berdasarkan halaman, jika perlu */}
            {menuItems.find(item => item.path === location.pathname)?.text ||
             masterDataItems.find(item => item.path === location.pathname)?.text ||
             "Admin Panel"}
          </Typography>

          <Tooltip title="Pengaturan Akun">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1.5 }}>
              <Avatar alt="Admin User" src="/static/images/avatar/2.jpg">A</Avatar> {/* Ganti dengan src dinamis */}
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={handleCloseUserMenu} component={Link} to="/profile"> {/* Contoh link profil */}
              <ListItemIcon><AccountCircleIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Profil Saya</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleCloseUserMenu} component={Link} to="/settings"> {/* Contoh link pengaturan */}
               <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
              <ListItemText>Pengaturan</ListItemText>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
              <ListItemText sx={{color: 'error.main'}}>Logout</ListItemText>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer // Drawer untuk mobile
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth,
                borderRight: 'none', // Hilangkan border jika mau
                boxShadow: theme.shadows[3]
            },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer // Drawer untuk desktop
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: drawerWidth, 
                borderRight: `1px solid ${theme.palette.divider}`, // Border halus
                backgroundColor: theme.palette.background.paper, // Background drawer
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.mode === 'light' ? alpha(theme.palette.grey[500], 0.05) : theme.palette.grey[900], // Background konten lebih cerah/netral
          // backgroundColor: theme.palette.background.default, // Pilihan lain
        }}
      >
        <Toolbar /> {/* Spacer untuk AppBar */}
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;