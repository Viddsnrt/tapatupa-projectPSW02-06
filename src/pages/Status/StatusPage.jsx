// src/pages/Status/StatusPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Autocomplete, Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
  useTheme, alpha, Divider // Dialog, DialogActions, DialogContent, DialogTitle dihapus
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
  idJenisStatus: '',
  namaStatus: '',
  keteranganStatus: '',
  createBy: '', // Bisa null atau ID user
};

const StatusPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [jenisStatusOptions, setJenisStatusOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

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
      const response = await apiClient.get('/statuses');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Status.');
      console.error("Error fetching Status:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [jenisStatusRes, usersRes] = await Promise.all([
        apiClient.get('/jenis-status?all=true'),
        apiClient.get('/users?all=true')
      ]);
      setJenisStatusOptions(jenisStatusRes.data.data || []);
      setUserOptions(usersRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
      setPageError("Gagal memuat opsi untuk form."); // Bisa juga setFormError jika lebih spesifik
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    if (formMode === 'list') {
      fetchData();
    }
    if (formMode === 'add' || formMode === 'edit') {
      fetchDropdownData();
    }
  }, [fetchData, fetchDropdownData, formMode]);

  const handleSetFormMode = (mode, item = null) => {
    handleCloseMenu();
    setEditingItem(item);
    if (mode === 'edit' && item) {
      setFormData({
        idStatus: item.idStatus,
        idJenisStatus: item.idJenisStatus || '',
        namaStatus: item.namaStatus || '',
        keteranganStatus: item.keteranganStatus || '',
        createBy: item.createBy || '', // Jika ada, akan dicocokkan dengan Autocomplete
      });
    } else if (mode === 'add') {
      setFormData(initialFormData);
    }
    setFormError(null);
    setFormMode(mode);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAutocompleteChange = (name, newValue) => {
    let idValue = '';
    if (newValue) {
        if (name === 'idJenisStatus') idValue = newValue.idJenisStatus;
        if (name === 'createBy') idValue = newValue.userId;
    }
    setFormData(prev => ({ ...prev, [name]: idValue }));
  };

  const handleSubmit = async () => {
    if (!formData.idJenisStatus || !formData.namaStatus) {
        setFormError("Jenis Status dan Nama Status wajib diisi.");
        return;
    }
    const submitButton = document.getElementById('submit-button-status-page'); // ID Unik
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = { ...formData };
      if (payload.createBy === '') { // Pastikan createBy menjadi null jika kosong
          payload.createBy = null;
      }

      if (formMode === 'edit' && editingItem && formData.idStatus) {
        await apiClient.put(`/statuses/${formData.idStatus}`, payload);
        showSnackbar('Status berhasil diperbarui!', 'success');
      } else {
        const { idStatus, ...createData } = payload;
        await apiClient.post('/statuses', createData);
        showSnackbar('Status baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan Status:", err);
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
    if (window.confirm('Apakah Anda yakin ingin menghapus status ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/statuses/${id}`);
      fetchData();
      showSnackbar('Status berhasil dihapus.', 'success');
    } catch (err)
 {
      console.error("Error menghapus Status:", err);
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Jenis Status", "Nama Status", "Keterangan", "Dibuat Oleh", "Aksi"];

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
    return (
      <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
        <Paper sx={{ 
            p: { xs: 2, md: 3 }, 
            borderRadius: '12px',
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`,
        }}>
            <Box sx={{ 
                backgroundColor: theme.palette.success.main,
                color: theme.palette.common.white,
                p: 1.5,
                mb: 3,
                borderRadius: '8px 8px 0 0',
                mx: { xs: -2, md: -3 }, 
                mt: { xs: -2, md: -3 },
            }}>
                <Typography variant="h6" component="h1" sx={{ fontWeight: 'medium' }}>
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} Status
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Status *</Typography>
                <Autocomplete
                    options={jenisStatusOptions}
                    getOptionLabel={(option) => option.jenisStatus || ''}
                    value={jenisStatusOptions.find(opt => opt.idJenisStatus === formData.idJenisStatus) || null}
                    onChange={(_, newValue) => handleAutocompleteChange('idJenisStatus', newValue)}
                    isOptionEqualToValue={(option, value) => option.idJenisStatus === value.idJenisStatus}
                    renderInput={(params) => (
                    <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Jenis Status --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                    )}
                    loading={loadingOptions}
                    disabled={loadingOptions}
                    fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Nama Status *</Typography>
                <TextField
                    autoFocus // Pindah autoFocus ke sini jika field pertama adalah Autocomplete
                    name="namaStatus"
                    fullWidth
                    variant="outlined"
                    value={formData.namaStatus}
                    onChange={handleChange}
                    required
                    size="small"
                    placeholder="Masukkan nama status"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan Status</Typography>
                <TextField
                    name="keteranganStatus"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={formData.keteranganStatus}
                    onChange={handleChange}
                    size="small"
                    placeholder="Deskripsi atau info tambahan (opsional)"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Dibuat Oleh (User)</Typography>
                <Autocomplete
                    options={userOptions}
                    getOptionLabel={(option) => option.username || (option.name || `User ID: ${option.userId}`)}
                    value={userOptions.find(opt => opt.userId === formData.createBy) || null}
                    onChange={(_, newValue) => handleAutocompleteChange('createBy', newValue)}
                    isOptionEqualToValue={(option, value) => option.userId === value.userId}
                    renderInput={(params) => (
                    <TextField {...params} variant="outlined" size="small" placeholder="-- Pilih User --" helperText="Kosongkan jika diisi otomatis oleh sistem" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                    )}
                    loading={loadingOptions}
                    disabled={loadingOptions}
                    fullWidth
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                id="submit-button-status-page" 
                onClick={handleSubmit} 
                variant="contained" 
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                startIcon={<SaveIcon />}
              >
                {formMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Status'}
              </Button>
              <Button 
                onClick={() => setFormMode('list')}
                variant="contained" 
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.grey[600], '&:hover': { backgroundColor: theme.palette.grey[700] } }}
                startIcon={<ArrowBackIcon />}
              >
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
            Manajemen Status
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleSetFormMode('add')}
            sx={{ borderRadius: '8px', py: 1.2, px: 2.5, textTransform: 'none', fontWeight: 'medium' }}
          >
            Tambah Baru
          </Button>
        </Box>
        <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <TextField size="small" placeholder="Cari Status..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
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
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data status.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idStatus} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.idStatus}</TableCell>
                    <TableCell>{item.jenis_status ? item.jenis_status.jenisStatus : '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.namaStatus}</TableCell>
                    <TableCell>{item.keteranganStatus || '-'}</TableCell>
                    <TableCell>{item.creator ? item.creator.username : (item.createBy || '-')}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idStatus)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idStatus === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Status
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Status
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

export default StatusPage;