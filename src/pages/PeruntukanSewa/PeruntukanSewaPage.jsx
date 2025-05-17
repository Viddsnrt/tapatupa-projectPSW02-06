// src/pages/PeruntukanSewa/PeruntukanSewaPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Autocomplete, Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
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
  idObjekRetribusi: '',
  idJenisJangkaWaktu: '',
  jenisKegiatan: '',
  keteranganPeruntukan: '',
  lamaSewa: '',
};

const PeruntukanSewaPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list');
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // State untuk opsi dropdown
  const [objekRetribusiOptions, setObjekRetribusiOptions] = useState([]); // BARU
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
      const response = await apiClient.get('/peruntukan-sewa');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Peruntukan Sewa.');
      console.error("Error fetching Peruntukan Sewa:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Memuat data untuk SEMUA dropdown
  const fetchDropdownData = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [objekRes, jenisJangkaWaktuRes] = await Promise.all([ // BARU: Tambahkan fetch objek retribusi
        apiClient.get('/objek-retribusi?all=true'), // ASUMSI ENDPOINT INI ADA
        apiClient.get('/jenis-jangka-waktu?all=true'),
      ]);
      setObjekRetribusiOptions(objekRes.data.data || []); // BARU
      setJenisJangkaWaktuOptions(jenisJangkaWaktuRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
      setPageError("Gagal memuat opsi dropdown.");
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    if (formMode === 'list') {
      fetchData();
    }
    if (formMode === 'add' || formMode === 'edit') {
      fetchDropdownData(); // Akan memuat kedua opsi dropdown
    }
  }, [fetchData, fetchDropdownData, formMode]);

  const handleSetFormMode = (mode, item = null) => {
    handleCloseMenu();
    setEditingItem(item);
    if (mode === 'edit' && item) {
      setFormData({
        idPeruntukanSewa: item.idPeruntukanSewa,
        idObjekRetribusi: item.idObjekRetribusi || '',
        idJenisJangkaWaktu: item.idJenisJangkaWaktu || '',
        jenisKegiatan: item.jenisKegiatan || '',
        keteranganPeruntukan: item.keteranganPeruntukan || '',
        lamaSewa: item.lamaSewa === null || item.lamaSewa === undefined ? '' : String(item.lamaSewa),
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

  // Menangani perubahan untuk SEMUA Autocomplete
  const handleAutocompleteChange = (name, newValue) => {
    let idValue = '';
    if (newValue) {
        if (name === 'idJenisJangkaWaktu') idValue = newValue.idJenisJangkaWaktu;
        if (name === 'idObjekRetribusi') idValue = newValue.idObjekRetribusi; // BARU
    }
    setFormData(prev => ({ ...prev, [name]: idValue }));
  };

  const handleSubmit = async () => {
    if (!formData.idObjekRetribusi || !formData.idJenisJangkaWaktu || !formData.jenisKegiatan) {
        setFormError("Objek Retribusi, Jenis Jangka Waktu, dan Jenis Kegiatan wajib diisi."); // Pesan error diperbarui
        return;
    }
    const submitButton = document.getElementById('submit-button-peruntukan-sewa-page');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = {
        ...formData,
        // Pastikan ID dikirim sebagai integer jika backend memerlukannya
        idObjekRetribusi: formData.idObjekRetribusi ? parseInt(formData.idObjekRetribusi, 10) : null,
        idJenisJangkaWaktu: formData.idJenisJangkaWaktu ? parseInt(formData.idJenisJangkaWaktu, 10) : null,
        lamaSewa: formData.lamaSewa === '' || formData.lamaSewa === null ? null : parseInt(formData.lamaSewa, 10),
      };

      if (formMode === 'edit' && editingItem && formData.idPeruntukanSewa) {
        await apiClient.put(`/peruntukan-sewa/${formData.idPeruntukanSewa}`, payload);
        showSnackbar('Peruntukan Sewa berhasil diperbarui!', 'success');
      } else {
        const { idPeruntukanSewa, ...createData } = payload;
        await apiClient.post('/peruntukan-sewa', createData);
        showSnackbar('Peruntukan Sewa baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan Peruntukan Sewa:", err);
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
    if (window.confirm('Apakah Anda yakin ingin menghapus data peruntukan sewa ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/peruntukan-sewa/${id}`);
      fetchData();
      showSnackbar('Peruntukan Sewa berhasil dihapus.', 'success');
    } catch (err) {
      console.error("Error menghapus Peruntukan Sewa:", err);
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Objek Retribusi", "Jenis Jangka Waktu", "Jenis Kegiatan", "Lama Sewa", "Aksi"];

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
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} Peruntukan Sewa
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}

            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Objek Retribusi *</Typography>
                <Autocomplete
                    options={objekRetribusiOptions}
                    getOptionLabel={(option) => option.namaObjekRetribusi ? `${option.namaObjekRetribusi} (${option.kodeObjekRetribusi || 'No Code'})` : ''} // Tampilkan nama dan kode jika ada
                    value={objekRetribusiOptions.find(opt => opt.idObjekRetribusi === formData.idObjekRetribusi) || null}
                    onChange={(_, newValue) => handleAutocompleteChange('idObjekRetribusi', newValue)}
                    isOptionEqualToValue={(option, value) => option.idObjekRetribusi === value.idObjekRetribusi}
                    renderInput={(params) => (
                    <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Objek Retribusi --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
                    )}
                    loading={loadingOptions}
                    disabled={loadingOptions}
                    fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Jangka Waktu *</Typography>
                <Autocomplete
                    options={jenisJangkaWaktuOptions}
                    getOptionLabel={(option) => option.jenisJangkaWaktu || ''}
                    value={jenisJangkaWaktuOptions.find(opt => opt.idJenisJangkaWaktu === formData.idJenisJangkaWaktu) || null}
                    onChange={(_, newValue) => handleAutocompleteChange('idJenisJangkaWaktu', newValue)}
                    isOptionEqualToValue={(option, value) => option.idJenisJangkaWaktu === value.idJenisJangkaWaktu}
                    renderInput={(params) => (
                    <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Jenis Jangka Waktu --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
                    )}
                    loading={loadingOptions}
                    disabled={loadingOptions}
                    fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Kegiatan *</Typography>
                <TextField
                    name="jenisKegiatan"
                    fullWidth
                    autoFocus={!formData.idObjekRetribusi} // AutoFocus jika Objek Retribusi belum dipilih
                    variant="outlined"
                    value={formData.jenisKegiatan}
                    onChange={handleChange}
                    required
                    size="small"
                    placeholder="Masukkan jenis kegiatan"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Lama Sewa</Typography>
                <TextField
                    name="lamaSewa"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={formData.lamaSewa}
                    onChange={handleChange}
                    size="small"
                    placeholder="Angka (e.g., 1, 12)"
                    helperText="Unit tergantung Jenis Jangka Waktu"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan Peruntukan</Typography>
                <TextField
                    name="keteranganPeruntukan"
                    fullWidth
                    multiline
                    rows={3}
                    variant="outlined"
                    value={formData.keteranganPeruntukan}
                    onChange={handleChange}
                    size="small"
                    placeholder="Deskripsi atau info tambahan (opsional)"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button
                id="submit-button-peruntukan-sewa-page"
                onClick={handleSubmit}
                variant="contained"
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                startIcon={<SaveIcon />}
              >
                {formMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Peruntukan'}
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
            Manajemen Peruntukan Sewa
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
            <TextField size="small" placeholder="Cari Peruntukan..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
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
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data peruntukan sewa.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idPeruntukanSewa} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.idPeruntukanSewa}</TableCell>
                    <TableCell>{item.objek_retribusi ? item.objek_retribusi.namaObjekRetribusi || `ID: ${item.idObjekRetribusi}` : `ID: ${item.idObjekRetribusi}`}</TableCell>
                    <TableCell>{item.jenis_jangka_waktu ? item.jenis_jangka_waktu.jenisJangkaWaktu : '-'}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{item.jenisKegiatan}</TableCell>
                    <TableCell>{item.lamaSewa === null || item.lamaSewa === undefined ? '-' : item.lamaSewa}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idPeruntukanSewa)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idPeruntukanSewa === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Peruntukan
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Peruntukan
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

export default PeruntukanSewaPage;