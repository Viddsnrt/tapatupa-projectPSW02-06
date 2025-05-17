// src/pages/ObjekRetribusi/ObjekRetribusiPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient'; // Pastikan path ini benar
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Autocomplete, Tooltip, Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
  useTheme, alpha, Divider, InputAdornment // InputAdornment untuk satuan
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
  idLokasiObjekRetribusi: '',
  idJenisObjekRetribusi: '',
  kodeObjekRetribusi: '',
  namaObjekRetribusi: '',
  noBangunan: '',
  jumlahLantai: '',
  panjangTanah: '',
  lebarTanah: '',
  luasTanah: '',
  panjangBangunan: '',
  lebarBangunan: '',
  luasBangunan: '',
  alamatObjek: '',
  latitute: '',
  longitude: '',
  keteranganObjek: '',
  gambarDenahTanah: '',
};

const ObjekRetribusiPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [lokasiOptions, setLokasiOptions] = useState([]);
  const [jenisObjekOptions, setJenisObjekOptions] = useState([]);
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

  const calculateLuas = useCallback((panjang, lebar) => {
    const p = parseFloat(panjang);
    const l = parseFloat(lebar);
    if (!isNaN(p) && !isNaN(l) && p > 0 && l > 0) {
      return (p * l).toFixed(2);
    }
    return '';
  }, []);

  useEffect(() => {
    const newLuasTanah = calculateLuas(formData.panjangTanah, formData.lebarTanah);
    if (newLuasTanah !== formData.luasTanah) {
        setFormData(prev => ({ ...prev, luasTanah: newLuasTanah }));
    }
  }, [formData.panjangTanah, formData.lebarTanah, formData.luasTanah, calculateLuas]);

  useEffect(() => {
    const newLuasBangunan = calculateLuas(formData.panjangBangunan, formData.lebarBangunan);
    if (newLuasBangunan !== formData.luasBangunan) {
        setFormData(prev => ({ ...prev, luasBangunan: newLuasBangunan }));
    }
  }, [formData.panjangBangunan, formData.lebarBangunan, formData.luasBangunan, calculateLuas]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setPageError(null);
    try {
      const response = await apiClient.get('/objek-retribusi');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Objek Retribusi.');
      console.error("Error fetching Objek Retribusi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [lokasiRes, jenisObjekRes] = await Promise.all([
        apiClient.get('/lokasi-objek-retribusi?all=true'),
        apiClient.get('/jenis-objek-retribusi?all=true'),
      ]);
      setLokasiOptions(lokasiRes.data.data || []);
      setJenisObjekOptions(jenisObjekRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
      setPageError("Gagal memuat opsi dropdown untuk form.");
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
        idObjekRetribusi: item.idObjekRetribusi,
        idLokasiObjekRetribusi: item.idLokasiObjekRetribusi || '',
        idJenisObjekRetribusi: item.idJenisObjekRetribusi || '',
        kodeObjekRetribusi: item.kodeObjekRetribusi || '',
        namaObjekRetribusi: item.namaObjekRetribusi || '',
        noBangunan: item.noBangunan || '',
        jumlahLantai: item.jumlahLantai === null ? '' : String(item.jumlahLantai),
        panjangTanah: item.panjangTanah === null ? '' : String(item.panjangTanah),
        lebarTanah: item.lebarTanah === null ? '' : String(item.lebarTanah),
        luasTanah: item.luasTanah === null ? '' : String(item.luasTanah),
        panjangBangunan: item.panjangBangunan === null ? '' : String(item.panjangBangunan),
        lebarBangunan: item.lebarBangunan === null ? '' : String(item.lebarBangunan),
        luasBangunan: item.luasBangunan === null ? '' : String(item.luasBangunan),
        alamatObjek: item.alamatObjek || '',
        latitute: item.latitute || '',
        longitude: item.longitude || '',
        keteranganObjek: item.keteranganObjek || '',
        gambarDenahTanah: item.gambarDenahTanah || '',
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

  const handleAutocompleteChange = (name, newValue) => {
    let idValue = '';
    if (newValue) {
        if (name === 'idLokasiObjekRetribusi') idValue = newValue.idLokasiObjekRetribusi;
        if (name === 'idJenisObjekRetribusi') idValue = newValue.idJenisObjekRetribusi;
    }
    setFormData(prev => ({ ...prev, [name]: idValue }));
  };

  const handleSubmit = async () => {
    if (!formData.idLokasiObjekRetribusi || !formData.idJenisObjekRetribusi || !formData.namaObjekRetribusi || !formData.alamatObjek) {
        setFormError("Lokasi, Jenis, Nama Objek, dan Alamat Objek wajib diisi.");
        return;
    }
    const submitButton = document.getElementById('submit-button-objek-retribusi');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = {
        ...formData,
        jumlahLantai: formData.jumlahLantai === '' ? null : parseInt(formData.jumlahLantai, 10),
        panjangTanah: formData.panjangTanah === '' ? null : parseFloat(formData.panjangTanah),
        lebarTanah: formData.lebarTanah === '' ? null : parseFloat(formData.lebarTanah),
        luasTanah: formData.luasTanah === '' ? null : parseFloat(formData.luasTanah),
        panjangBangunan: formData.panjangBangunan === '' ? null : parseFloat(formData.panjangBangunan),
        lebarBangunan: formData.lebarBangunan === '' ? null : parseFloat(formData.lebarBangunan),
        luasBangunan: formData.luasBangunan === '' ? null : parseFloat(formData.luasBangunan),
      };

      if (formMode === 'edit' && editingItem && formData.idObjekRetribusi) {
        await apiClient.put(`/objek-retribusi/${formData.idObjekRetribusi}`, payload);
        showSnackbar('Objek Retribusi berhasil diperbarui!', 'success');
      } else {
        const { idObjekRetribusi, ...createData } = payload;
        await apiClient.post('/objek-retribusi', createData);
        showSnackbar('Objek Retribusi baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan Objek Retribusi:", err);
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
    if (window.confirm('Apakah Anda yakin ingin menghapus objek retribusi ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/objek-retribusi/${id}`);
      fetchData();
      showSnackbar('Objek Retribusi berhasil dihapus.', 'success');
    } catch (err) {
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Kode", "Nama Objek", "Lokasi", "Jenis", "Alamat", "Aksi"];

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
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} Objek Retribusi
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            <Grid container spacing={2.5}> {/* Spasi vertikal antar field */}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Nama Objek Retribusi *</Typography>
                <TextField autoFocus name="namaObjekRetribusi" fullWidth variant="outlined" value={formData.namaObjekRetribusi} onChange={handleChange} required size="small" placeholder="Masukkan Nama Objek" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Kode Objek (Opsional)</Typography>
                <TextField name="kodeObjekRetribusi" fullWidth variant="outlined" value={formData.kodeObjekRetribusi} onChange={handleChange} size="small" placeholder="Masukkan Kode Objek" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Lokasi Objek *</Typography>
                <Autocomplete options={lokasiOptions} getOptionLabel={(o) => o.lokasiObjekRetribusi || ''} value={lokasiOptions.find(o => o.idLokasiObjekRetribusi === formData.idLokasiObjekRetribusi) || null} onChange={(_, newVal) => handleAutocompleteChange('idLokasiObjekRetribusi', newVal)} isOptionEqualToValue={(opt, val) => opt.idLokasiObjekRetribusi === val.idLokasiObjekRetribusi} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Lokasi --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Objek *</Typography>
                <Autocomplete options={jenisObjekOptions} getOptionLabel={(o) => o.jenisObjekRetribusi || ''} value={jenisObjekOptions.find(o => o.idJenisObjekRetribusi === formData.idJenisObjekRetribusi) || null} onChange={(_, newVal) => handleAutocompleteChange('idJenisObjekRetribusi', newVal)} isOptionEqualToValue={(opt, val) => opt.idJenisObjekRetribusi === val.idJenisObjekRetribusi} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Jenis Objek --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Alamat Lengkap Objek *</Typography>
                <TextField name="alamatObjek" fullWidth multiline rows={3} variant="outlined" value={formData.alamatObjek} onChange={handleChange} required size="small" placeholder="Masukkan Alamat Objek" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

              <Grid item xs={12}><Divider sx={{my:1}}><Typography variant="caption" color="text.secondary">Detail Bangunan & Tanah</Typography></Divider></Grid>

              {/* Baris untuk No. Bangunan & Jumlah Lantai */}
              <Grid item container spacing={2.5} xs={12}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>No. Bangunan</Typography>
                    <TextField name="noBangunan" fullWidth variant="outlined" value={formData.noBangunan} onChange={handleChange} size="small" placeholder="No. Bangunan" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jumlah Lantai</Typography>
                    <TextField name="jumlahLantai" type="number" fullWidth variant="outlined" value={formData.jumlahLantai} onChange={handleChange} size="small" placeholder="0" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
              </Grid>
              
              {/* Baris untuk Ukuran Tanah */}
              <Grid item container spacing={2.5} xs={12}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Panjang Tanah</Typography>
                    <TextField name="panjangTanah" type="number" fullWidth variant="outlined" value={formData.panjangTanah} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Lebar Tanah</Typography>
                    <TextField name="lebarTanah" type="number" fullWidth variant="outlined" value={formData.lebarTanah} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Luas Tanah</Typography>
                    <TextField name="luasTanah" type="number" fullWidth variant="outlined" value={formData.luasTanah} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m²</InputAdornment>, readOnly: true }} helperText="Otomatis terhitung" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' }, backgroundColor: alpha(theme.palette.grey[400], 0.1) }} />
                </Grid>
              </Grid>

              {/* Baris untuk Ukuran Bangunan */}
              <Grid item container spacing={2.5} xs={12}>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Panjang Bangunan</Typography>
                    <TextField name="panjangBangunan" type="number" fullWidth variant="outlined" value={formData.panjangBangunan} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Lebar Bangunan</Typography>
                    <TextField name="lebarBangunan" type="number" fullWidth variant="outlined" value={formData.lebarBangunan} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m</InputAdornment> }} sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Luas Bangunan</Typography>
                    <TextField name="luasBangunan" type="number" fullWidth variant="outlined" value={formData.luasBangunan} onChange={handleChange} size="small" placeholder="0" InputProps={{ endAdornment: <InputAdornment position="end">m²</InputAdornment>, readOnly: true }} helperText="Otomatis terhitung" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' }, backgroundColor: alpha(theme.palette.grey[400], 0.1) }} />
                </Grid>
              </Grid>
              
              <Grid item xs={12}><Divider sx={{my:1}}><Typography variant="caption" color="text.secondary">Koordinat & Lainnya</Typography></Divider></Grid>

              {/* Baris untuk Koordinat */}
              <Grid item container spacing={2.5} xs={12}>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Latitude</Typography>
                    <TextField name="latitute" fullWidth variant="outlined" value={formData.latitute} onChange={handleChange} size="small" placeholder="Contoh: 2.0xxxx" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Longitude</Typography>
                    <TextField name="longitude" fullWidth variant="outlined" value={formData.longitude} onChange={handleChange} size="small" placeholder="Contoh: 99.xxxx" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan Tambahan</Typography>
                <TextField name="keteranganObjek" fullWidth multiline rows={3} variant="outlined" value={formData.keteranganObjek} onChange={handleChange} size="small" placeholder="Info tambahan mengenai objek" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Path Gambar Denah</Typography>
                <TextField name="gambarDenahTanah" helperText="Isi path manual ke file gambar denah (opsional)" fullWidth variant="outlined" value={formData.gambarDenahTanah} onChange={handleChange} size="small" placeholder="Contoh: images/denah/objek-a.jpg" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>

            </Grid> {/* Akhir Grid Container untuk field */}

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button id="submit-button-objek-retribusi" onClick={handleSubmit} variant="contained" sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }} startIcon={<SaveIcon />}>
                Simpan Objek
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
            Manajemen Objek Retribusi
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
            <TextField size="small" placeholder="Cari Objek Retribusi..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
            <Button variant="outlined" startIcon={<FilterListIcon />} size="small" sx={{textTransform:'none'}}>Filter</Button>
        </Box>
      </Paper>

      {pageError && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPageError(null)}>{pageError}</Alert>}
      
      <Paper sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`}}>
        <TableContainer>
          <Table stickyHeader sx={{ minWidth: 750 }}>
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
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data objek retribusi.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idObjekRetribusi} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.idObjekRetribusi}</TableCell>
                    <TableCell>{item.kodeObjekRetribusi || '-'}</TableCell>
                    <TableCell>{item.namaObjekRetribusi}</TableCell>
                    <TableCell>{item.lokasi_objek_retribusi ? item.lokasi_objek_retribusi.lokasiObjekRetribusi : 'N/A'}</TableCell>
                    <TableCell>{item.jenis_objek_retribusi ? item.jenis_objek_retribusi.jenisObjekRetribusi : 'N/A'}</TableCell>
                    <TableCell>{item.alamatObjek}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idObjekRetribusi)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idObjekRetribusi === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Data
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Data
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

export default ObjekRetribusiPage;