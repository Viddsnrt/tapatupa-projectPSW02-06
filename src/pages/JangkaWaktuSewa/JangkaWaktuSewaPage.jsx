// src/pages/JangkaWaktuSewa/JangkaWaktuSewaPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient'; // Pastikan path benar
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Autocomplete, Checkbox, FormControlLabel, Tooltip, Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
  useTheme, alpha, Divider, Chip // Tambahkan Chip
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
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

const initialFormData = {
  idJenisJangkaWaktu: '',
  jangkaWaktu: '',
  keterangan: '',
  isDefault: false,
};

const JangkaWaktuSewaPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [jenisJangkaWaktuOptions, setJenisJangkaWaktuOptions] = useState([]);
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
      const response = await apiClient.get('/jangka-waktu-sewa');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Jangka Waktu Sewa.');
      console.error("Error fetching Jangka Waktu Sewa:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchJenisJangkaWaktuOptions = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const response = await apiClient.get('/jenis-jangka-waktu?all=true');
      setJenisJangkaWaktuOptions(response.data.data || []);
    } catch (err) {
      console.error("Error fetching Jenis Jangka Waktu options:", err);
      setPageError("Gagal memuat opsi Jenis Jangka Waktu.");
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    if (formMode === 'list') {
        fetchData();
    }
    if (formMode === 'add' || formMode === 'edit') {
        fetchJenisJangkaWaktuOptions();
    }
  }, [fetchData, fetchJenisJangkaWaktuOptions, formMode]);

  const handleSetFormMode = (mode, item = null) => {
    handleCloseMenu();
    setEditingItem(item);
    if (mode === 'edit' && item) {
      setFormData({
        idJangkaWaktuSewa: item.idJangkaWaktuSewa,
        idJenisJangkaWaktu: item.idJenisJangkaWaktu || '',
        jangkaWaktu: item.jangkaWaktu || '',
        keterangan: item.keterangan || '',
        isDefault: item.isDefault || false,
      });
    } else if (mode === 'add') {
      setFormData(initialFormData);
    }
    setFormError(null);
    setFormMode(mode);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAutocompleteChange = (name, newValue) => {
    setFormData(prev => ({
      ...prev,
      [name]: newValue ? newValue.idJenisJangkaWaktu : ''
    }));
  };

  const handleSubmit = async () => {
    if (!formData.idJenisJangkaWaktu || !formData.jangkaWaktu) {
        setFormError("Jenis Jangka Waktu dan Jangka Waktu wajib diisi.");
        return;
    }
    const submitButton = document.getElementById('submit-button-jangka-waktu-sewa');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = { ...formData };
      if (formMode === 'edit' && editingItem && formData.idJangkaWaktuSewa) {
        await apiClient.put(`/jangka-waktu-sewa/${formData.idJangkaWaktuSewa}`, payload);
        showSnackbar('Jangka Waktu Sewa berhasil diperbarui!', 'success');
      } else {
        const { idJangkaWaktuSewa, ...createData } = payload;
        await apiClient.post('/jangka-waktu-sewa', createData);
        showSnackbar('Jangka Waktu Sewa baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan Jangka Waktu Sewa:", err);
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
    if (window.confirm('Apakah Anda yakin ingin menghapus jangka waktu sewa ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/jangka-waktu-sewa/${id}`);
      fetchData();
      showSnackbar('Jangka Waktu Sewa berhasil dihapus.', 'success');
    } catch (err) {
      console.error("Error menghapus Jangka Waktu Sewa:", err);
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Jenis", "Jangka Waktu", "Keterangan", "Default?", "Aksi"];

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
            borderRadius: '12px', // Konsisten dengan WajibRetribusiPage
            boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.05)}`, // Konsisten
        }}>
            {/* Header Form */}
            <Box sx={{ 
                backgroundColor: theme.palette.success.main, // Warna hijau seperti gambar dan WajibRetribusiPage
                color: theme.palette.common.white,
                p: 1.5,
                mb: 3,
                borderRadius: '8px 8px 0 0', // Radius atas untuk header di dalam Paper
                mx: { xs: -2, md: -3 }, // Mengambil padding parent
                mt: { xs: -2, md: -3 }, // Mengambil padding parent
            }}>
                <Typography variant="h6" component="h1" sx={{ fontWeight: 'medium' }}>
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} Jangka Waktu Sewa
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            {/* GRID CONTAINER UNTUK FIELD-FIELD FORM */}
            <Grid container spacing={2.5}> {/* Spasi vertikal antar field */}
              
              {/* Jenis Jangka Waktu */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Jangka Waktu *</Typography>
                <Autocomplete
                    options={jenisJangkaWaktuOptions}
                    getOptionLabel={(option) => option.jenisJangkaWaktu || ''}
                    value={jenisJangkaWaktuOptions.find(opt => opt.idJenisJangkaWaktu === formData.idJenisJangkaWaktu) || null}
                    onChange={(_, newValue) => handleAutocompleteChange('idJenisJangkaWaktu', newValue)}
                    isOptionEqualToValue={(option, value) => option.idJenisJangkaWaktu === value.idJenisJangkaWaktu}
                    renderInput={(params) => (
                    <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Jenis Jangka Waktu --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                    )}
                    loading={loadingOptions}
                    disabled={loadingOptions}
                    fullWidth
                />
              </Grid>

              {/* Jangka Waktu */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jangka Waktu *</Typography>
                <TextField autoFocus name="jangkaWaktu" fullWidth variant="outlined" value={formData.jangkaWaktu} onChange={handleChange} required size="small" placeholder="Contoh: 1 Tahun, Harian, 6 Bulan" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              {/* Keterangan */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan</Typography>
                <TextField name="keterangan" fullWidth multiline rows={3} variant="outlined" value={formData.keterangan} onChange={handleChange} size="small" placeholder="Deskripsi atau info tambahan (opsional)" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              {/* Is Default (Checkbox) */}
              <Grid item xs={12}>
                {/* Label dipisah agar konsisten dengan field lain jika diperlukan di masa depan */}
                {/* <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jadikan Default?</Typography> */}
                <FormControlLabel
                    control={
                    <Checkbox
                        checked={formData.isDefault}
                        onChange={handleChange}
                        name="isDefault"
                        color="primary"
                        sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, mr: 0.5, ml: -1.2 }} // ml untuk alignment
                    />
                    }
                    label={<Typography variant="body2" color="text.primary">Jadikan Pilihan Default?</Typography>}
                    sx={{mt:1}} // Sedikit margin atas
                />
              </Grid>
              
            </Grid> {/* Akhir Grid Container untuk field */}

            <Divider sx={{ my: 3 }} />

            {/* Tombol Aksi */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                id="submit-button-jangka-waktu-sewa" 
                onClick={handleSubmit} 
                variant="contained" 
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                startIcon={<SaveIcon />}
              >
                {formMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Jangka Waktu'}
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
            Manajemen Jangka Waktu Sewa
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
            <TextField size="small" placeholder="Cari Jangka Waktu..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
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
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data jangka waktu sewa.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idJangkaWaktuSewa} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.idJangkaWaktuSewa}</TableCell>
                    <TableCell>{item.jenis_jangka_waktu ? item.jenis_jangka_waktu.jenisJangkaWaktu : '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.jangkaWaktu}</TableCell>
                    <TableCell>{item.keterangan || '-'}</TableCell>
                    <TableCell>
                      {item.isDefault ? 
                        <Chip icon={<CheckCircleOutlineIcon />} label="Ya" color="success" size="small" variant="outlined" /> :
                        <Chip icon={<RadioButtonUncheckedIcon />} label="Tidak" size="small" variant="outlined" />
                      }
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idJangkaWaktuSewa)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idJangkaWaktuSewa === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Jangka Waktu
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Jangka Waktu
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

export default JangkaWaktuSewaPage;