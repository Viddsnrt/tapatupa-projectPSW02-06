// src/pages/TarifObjekRetribusi/TarifObjekRetribusiPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Grid, Autocomplete, Checkbox, FormControlLabel,
  Menu, MenuItem, ListItemIcon, Skeleton, Snackbar,
  useTheme, alpha, Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { format, parseISO, isValid } from 'date-fns'; // Untuk format tanggal

const initialFormData = {
  idObjekRetribusi: '',
  idJenisJangkaWaktu: '',
  tanggalDinilai: format(new Date(), 'yyyy-MM-dd'), // Default hari ini
  namaPenilai: '',
  nominalTarif: '',
  fileHasilPenilaian: '',
  keterangan: '',
  isDefault: false,
};

const TarifObjekRetribusiPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null);
  const [formError, setFormError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [objekRetribusiOptions, setObjekRetribusiOptions] = useState([]);
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
      const response = await apiClient.get('/tarif-objek-retribusi');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Tarif Objek Retribusi.');
      console.error("Error fetching Tarif:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [objekRes, jenisRes] = await Promise.all([
        apiClient.get('/objek-retribusi?all=true'),
        apiClient.get('/jenis-jangka-waktu?all=true'),
      ]);
      setObjekRetribusiOptions(objekRes.data.data || []);
      setJenisJangkaWaktuOptions(jenisRes.data.data || []);
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
      fetchDropdownData();
    }
  }, [fetchData, fetchDropdownData, formMode]);

  const handleSetFormMode = (mode, item = null) => {
    handleCloseMenu();
    setEditingItem(item);
    if (mode === 'edit' && item) {
      let formattedDate = format(new Date(), 'yyyy-MM-dd');
      if (item.tanggalDinilai) {
        const parsedDate = parseISO(item.tanggalDinilai);
        if (isValid(parsedDate)) {
          formattedDate = format(parsedDate, 'yyyy-MM-dd');
        }
      }
      setFormData({
        idTarifObjekRetribusi: item.idTarifObjekRetribusi,
        idObjekRetribusi: item.idObjekRetribusi || '',
        idJenisJangkaWaktu: item.idJenisJangkaWaktu || '',
        tanggalDinilai: formattedDate,
        namaPenilai: item.namaPenilai || '',
        nominalTarif: item.nominalTarif === null || item.nominalTarif === undefined ? '' : String(item.nominalTarif),
        fileHasilPenilaian: item.fileHasilPenilaian || '',
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
    let idValue = '';
    if (newValue) {
        if (name === 'idObjekRetribusi') idValue = newValue.idObjekRetribusi;
        if (name === 'idJenisJangkaWaktu') idValue = newValue.idJenisJangkaWaktu;
    }
    setFormData(prev => ({ ...prev, [name]: idValue }));
  };

  const handleSubmit = async () => {
    if (!formData.idObjekRetribusi || !formData.idJenisJangkaWaktu || !formData.tanggalDinilai || formData.nominalTarif === '') {
        setFormError("Objek Retribusi, Jenis Jangka Waktu, Tanggal Dinilai, dan Nominal Tarif wajib diisi.");
        return;
    }
    const submitButton = document.getElementById('submit-button-tarif-objek-page');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = {
        ...formData,
        idObjekRetribusi: parseInt(formData.idObjekRetribusi, 10) || null,
        idJenisJangkaWaktu: parseInt(formData.idJenisJangkaWaktu, 10) || null,
        nominalTarif: parseFloat(formData.nominalTarif) || 0,
        // tanggalDinilai sudah string yyyy-MM-dd
        // isDefault sudah boolean
      };

      if (formMode === 'edit' && editingItem && formData.idTarifObjekRetribusi) {
        await apiClient.put(`/tarif-objek-retribusi/${formData.idTarifObjekRetribusi}`, payload);
        showSnackbar('Tarif Objek Retribusi berhasil diperbarui!', 'success');
      } else {
        const { idTarifObjekRetribusi, ...createData } = payload;
        await apiClient.post('/tarif-objek-retribusi', createData);
        showSnackbar('Tarif Objek Retribusi baru berhasil ditambahkan!', 'success');
      }
      setFormMode('list');
      fetchData();
    } catch (err) {
      console.error("Error saat menyimpan Tarif:", err);
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
    if (window.confirm('Apakah Anda yakin ingin menghapus tarif ini?')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/tarif-objek-retribusi/${id}`);
      fetchData();
      showSnackbar('Tarif Objek Retribusi berhasil dihapus.', 'success');
    } catch (err) {
      console.error("Error menghapus Tarif:", err);
      setPageError('Gagal menghapus data.');
      showSnackbar('Gagal menghapus data.', 'error');
    }
  };

  const tableHeaders = ["ID", "Objek Retribusi", "Jns. Jangka Waktu", "Tgl. Dinilai", "Nominal", "Default?", "Aksi"];

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
                    {formMode === 'edit' ? 'Edit Data' : 'Formulir Tambah'} Tarif Objek Retribusi
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            <Grid container spacing={2.5}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Objek Retribusi *</Typography>
                <Autocomplete 
                    options={objekRetribusiOptions} 
                    getOptionLabel={(o) => o.namaObjekRetribusi ? `${o.namaObjekRetribusi} (${o.kodeObjekRetribusi || 'No Code'})` : ''}
                    value={objekRetribusiOptions.find(o => o.idObjekRetribusi === formData.idObjekRetribusi) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idObjekRetribusi', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idObjekRetribusi === val.idObjekRetribusi}
                    renderInput={(params) => <TextField {...params} required size="small" placeholder="-- Pilih Objek Retribusi --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>} 
                    loading={loadingOptions} 
                    disabled={loadingOptions}
                    fullWidth 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Jenis Jangka Waktu *</Typography>
                <Autocomplete 
                    options={jenisJangkaWaktuOptions} 
                    getOptionLabel={(o) => o.jenisJangkaWaktu || ''}
                    value={jenisJangkaWaktuOptions.find(o => o.idJenisJangkaWaktu === formData.idJenisJangkaWaktu) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idJenisJangkaWaktu', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idJenisJangkaWaktu === val.idJenisJangkaWaktu}
                    renderInput={(params) => <TextField {...params} required size="small" placeholder="-- Pilih Jenis Jangka Waktu --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>} 
                    loading={loadingOptions} 
                    disabled={loadingOptions}
                    fullWidth 
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Tanggal Dinilai *</Typography>
                <TextField name="tanggalDinilai" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.tanggalDinilai} onChange={handleChange} required size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Nama Penilai</Typography>
                <TextField name="namaPenilai" fullWidth value={formData.namaPenilai} onChange={handleChange} size="small" placeholder="Nama penilai (opsional)" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Nominal Tarif (Rp) *</Typography>
                <TextField name="nominalTarif" type="number" fullWidth value={formData.nominalTarif} onChange={handleChange} required InputProps={{ inputProps: { min: 0, step: "1" } }} size="small" placeholder="e.g., 15000" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Path File Penilaian</Typography>
                <TextField name="fileHasilPenilaian" fullWidth value={formData.fileHasilPenilaian} onChange={handleChange} helperText="Path file manual (opsional)" size="small" placeholder="e.g., /files/penilaian.pdf" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>Keterangan</Typography>
                <TextField name="keterangan" fullWidth multiline rows={2} value={formData.keterangan} onChange={handleChange} size="small" placeholder="Info tambahan (opsional)" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}/>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel 
                    control={<Checkbox checked={formData.isDefault} onChange={handleChange} name="isDefault" color="primary" sx={{ '& .MuiSvgIcon-root': { fontSize: 22 }, mr: 0.5, ml: -1.2 }}/>} 
                    label={<Typography variant="body2" color="text.primary">Jadikan Tarif Default untuk Kombinasi Ini?</Typography>} 
                    sx={{mt:0.5}}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                id="submit-button-tarif-objek-page" 
                onClick={handleSubmit} 
                variant="contained" 
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                startIcon={<SaveIcon />}
              >
                {formMode === 'edit' ? 'Simpan Perubahan' : 'Simpan Tarif'}
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
            Manajemen Tarif Objek Retribusi
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
            <TextField size="small" placeholder="Cari Tarif..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
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
                  <TableCell key={header} align={header === "Aksi" || header === "Nominal" ? "right" : "left"}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? <TableSkeleton /> : 
                dataList.length === 0 ? (
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data tarif objek retribusi.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idTarifObjekRetribusi} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{item.idTarifObjekRetribusi}</TableCell>
                    <TableCell>{item.objek_retribusi ? item.objek_retribusi.namaObjekRetribusi : '-'}</TableCell>
                    <TableCell>{item.jenis_jangka_waktu ? item.jenis_jangka_waktu.jenisJangkaWaktu : '-'}</TableCell>
                    <TableCell>{item.tanggalDinilai && isValid(parseISO(item.tanggalDinilai)) ? format(parseISO(item.tanggalDinilai), 'dd MMM yyyy') : '-'}</TableCell>
                    <TableCell align="right" sx={{fontWeight: 500}}>{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(item.nominalTarif || 0)}</TableCell>
                    <TableCell>{item.isDefault ? 'Ya' : 'Tidak'}</TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idTarifObjekRetribusi)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idTarifObjekRetribusi === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Tarif
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Tarif
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

export default TarifObjekRetribusiPage;