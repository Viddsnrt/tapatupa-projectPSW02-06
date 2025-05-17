// src/pages/User/UserPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient'; // Pastikan path ini benar
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Tooltip, Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
  useTheme, alpha, Divider
} from '@mui/material';

// Impor Ikon
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const initialFormData = {
  username: '',
  email: '',
  password: '',
  password_confirmation: '',
  keterangan: '',
  // token: '', // Token biasanya tidak diinput manual oleh user
};

const UserPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [selectedItemIdMenu, setSelectedItemIdMenu] = useState(null);

  const handleOpenMenu = (event, itemId) => {
    setAnchorElMenu(event.currentTarget);
    setSelectedItemIdMenu(itemId);
  };

  const handleCloseMenu = () => {
    setAnchorElMenu(null);
    setSelectedItemIdMenu(null);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const response = await apiClient.get('/users');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data User.');
      console.error("Error fetching Users:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (formMode === 'list') {
        fetchData();
    }
  }, [fetchData, formMode]);

  const handleSetFormMode = (mode, item = null) => {
    handleCloseMenu();
    setEditingItem(item);
    if (mode === 'edit' && item) {
      setFormData({
        userId: item.userId,
        username: item.username || '',
        email: item.email || '',
        password: '', // Kosongkan password saat edit
        password_confirmation: '',
        keterangan: item.keterangan || '',
      });
    } else if (mode === 'add') {
      setFormData(initialFormData);
    }
    setFormError(null);
    setFormMode(mode);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email) {
        setFormError("Username dan Email wajib diisi.");
        return;
    }
    if (formMode === 'add' && !formData.password) {
        setFormError("Password wajib diisi saat membuat user baru.");
        return;
    }
    if (formData.password && formData.password !== formData.password_confirmation) {
        setFormError("Password dan Konfirmasi Password tidak cocok.");
        return;
    }

    const submitButton = document.getElementById('submit-button-user');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = { ...formData };
      if (formMode === 'edit' && !payload.password) {
        delete payload.password;
        delete payload.password_confirmation;
      }

      if (formMode === 'edit' && editingItem && formData.userId) {
        await apiClient.put(`/users/${formData.userId}`, payload);
        showSnackbar('Data User berhasil diperbarui!', 'success');
      } else {
        const { userId, ...createData } = payload;
        await apiClient.post('/users', createData);
        showSnackbar('User baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan User:", err);
      const errorMessage = err.response?.data?.message || (err.response?.data?.errors ? 
                           Object.values(err.response.data.errors).flat().join('\n') :
                           'Gagal menyimpan data.');
      setFormError(`Gagal menyimpan: ${errorMessage}`);
    } finally {
      if(submitButton) submitButton.disabled = false;
    }
  };

  const handleDeleteConfirmation = (itemId) => {
    handleCloseMenu();
    if (window.confirm('Apakah Anda yakin ingin menghapus user ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/users/${id}`);
      fetchData();
      showSnackbar('User berhasil dihapus.', 'success');
    } catch (err) {
      console.error("Error menghapus User:", err);
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Username", "Email", "Keterangan", "Aksi"];

  const TableSkeleton = () => (
    Array.from(new Array(5)).map((_, index) => (
      <TableRow key={index}>
        {tableHeaders.map(header => (
          <TableCell key={header}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
        ))}
      </TableRow>
    ))
  );
  
  // --- BAGIAN RENDER ---
  if (formMode === 'add' || formMode === 'edit') {
    // --- TAMPILAN FORM PENUH (FULL-WIDTH) DENGAN FIELD VERTIKAL ---
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            borderRadius: '12px',
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`,
        }}>
            <Box sx={{ // Header Form
                backgroundColor: theme.palette.success.main,
                color: theme.palette.common.white,
                p: 1.5,
                mb: 3,
                borderRadius: '8px 8px 0 0',
                mx: { xs: -2, md: -3 }, 
                mt: { xs: -2, md: -3 },
            }}>
                <Typography variant="h6" component="h1" sx={{ fontWeight: 'medium' }}>
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} User
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            <Grid container spacing={2.5}> {/* Spasi vertikal antar field */}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Username *</Typography>
                <TextField autoFocus name="username" fullWidth variant="outlined" value={formData.username} onChange={handleChange} required size="small" placeholder="Masukkan Username" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Email *</Typography>
                <TextField name="email" type="email" fullWidth variant="outlined" value={formData.email} onChange={handleChange} required size="small" placeholder="Masukkan Email" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>{formMode === 'edit' ? "Password Baru (Opsional)" : "Password *"}</Typography>
                <TextField name="password" type="password" fullWidth variant="outlined" value={formData.password} onChange={handleChange} required={formMode === 'add'} size="small" placeholder={formMode === 'edit' ? "Kosongkan jika tidak diubah" : "Minimal 8 karakter"} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>{formMode === 'edit' && !formData.password ? "Konfirmasi Password (Opsional)" : "Konfirmasi Password *"}</Typography>
                <TextField name="password_confirmation" type="password" fullWidth variant="outlined" value={formData.password_confirmation} onChange={handleChange} required={formMode === 'add' || !!formData.password} size="small" placeholder="Ulangi Password" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan</Typography>
                <TextField name="keterangan" fullWidth multiline rows={3} variant="outlined" value={formData.keterangan} onChange={handleChange} size="small" placeholder="Info tambahan mengenai user (opsional)" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>
              
            </Grid> {/* Akhir Grid Container untuk field */}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button id="submit-button-user" onClick={handleSubmit} variant="contained" sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }} startIcon={<SaveIcon />}>
                Simpan User
              </Button>
              <Button onClick={() => setFormMode('list')} variant="contained" sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.grey[600], '&:hover': { backgroundColor: theme.palette.grey[700] } }} startIcon={<ArrowBackIcon />}>
                Kembali ke Daftar
              </Button>
            </Box>
        </Paper>
        
        <Snackbar
            open={snackbar.open}
            autoHideDuration={5000}
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
            {snackbar.message}
            </Alert>
        </Snackbar>
      </Box>
    );
  }

  // --- TAMPILAN TABEL DATA (MODE 'list') ---
  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <Paper sx={{ 
        p: { xs: 2, md: 3 }, 
        mb: 3,
        borderRadius: '12px',
        boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`,
      }}>
        <Box sx={{ display: 'flex', flexDirection: {xs: 'column', sm: 'row'}, justifyContent: 'space-between', alignItems: {sm:'center'}, gap: 2, mb: 2.5 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
            Manajemen User
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleSetFormMode('add')}
            sx={{ borderRadius: '8px', py: 1.2, px: 2.5, textTransform: 'none', fontWeight: 'medium' }}
          >
            Tambah User
          </Button>
        </Box>
        <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <TextField size="small" placeholder="Cari User..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
            <Button variant="outlined" startIcon={<FilterListIcon />} size="small" sx={{textTransform:'none'}}>Filter</Button>
        </Box>
      </Paper>

      {pageError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPageError(null)}>{pageError}</Alert>}
      
      <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`}}>
        <TableContainer>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead sx={{ '& .MuiTableCell-head': { backgroundColor: alpha(theme.palette.primary.light, 0.1), fontWeight: 'bold', color: theme.palette.primary.dark }}}>
              <TableRow>
                {tableHeaders.map(header => (
                  <TableCell key={header} align={header === "Aksi" ? "right" : "left"}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableSkeleton /> : 
                dataList.length === 0 ? (
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data user.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.userId} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.userId}</TableCell>
                    <TableCell>{item.username}</TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.keterangan || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.userId)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                </TableRow>
                ))
            )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleCloseMenu}
        PaperProps={{ elevation: 1, sx: { overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.05))', mt: 0.5, '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, }, '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, } }, }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.userId === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit User
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus User
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UserPage;