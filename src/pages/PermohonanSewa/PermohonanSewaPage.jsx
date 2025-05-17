// src/pages/PermohonanSewa/PermohonanSewaPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import CloseIcon from '@mui/icons-material/Close'; // Bisa dihapus jika tidak ada tombol close spesifik
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress,
  Alert,
  TextField,
  Grid,
  Autocomplete,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  Skeleton,
  Snackbar,
  useTheme,
  alpha,
  Divider // Tambahkan Divider
} from '@mui/material';

// Impor Ikon
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

import { format, parseISO, isValid } from 'date-fns';
import { id as localeID } from 'date-fns/locale';

const initialFormData = {
  idJenisPermohonan: '',
  nomorSuratPermohonan: '',
  tanggalPengajuan: format(new Date(), 'yyyy-MM-dd'),
  idWajibRetribusi: '',
  idPeruntukanSewa: '',
  idStatus: '',
  createBy: '',
};

const getStatusChipColor = (statusName) => {
  const name = statusName?.toLowerCase() || '';
  if (name.includes('disetujui') || name.includes('aktif')) return 'success';
  if (name.includes('ditolak') || name.includes('tidak aktif')) return 'error';
  if (name.includes('proses') || name.includes('pending') || name.includes('diajukan')) return 'warning';
  if (name.includes('selesai') || name.includes('lunas')) return 'info';
  return 'default';
};

const PermohonanSewaPage = () => {
  const theme = useTheme();
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState(null); // Error untuk tampilan list
  const [formError, setFormError] = useState(null); // Error untuk form
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const [formMode, setFormMode] = useState('list'); // 'list', 'add', 'edit'
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [jenisPermohonanOptions, setJenisPermohonanOptions] = useState([]);
  const [wajibRetribusiOptions, setWajibRetribusiOptions] = useState([]);
  const [peruntukanSewaOptions, setPeruntukanSewaOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
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
      const response = await apiClient.get('/permohonan-sewa');
      setDataList(response.data.data || []);
    } catch (err) {
      setPageError('Gagal mengambil data Permohonan Sewa.');
      // showSnackbar('Gagal mengambil data Permohonan Sewa.', 'error'); // Snackbar bisa di-trigger dari pageError
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDropdownData = useCallback(async () => {
    setLoadingOptions(true);
    try {
      const [jpRes, wrRes, psRes, stRes, usrRes] = await Promise.all([
        apiClient.get('/jenis-permohonan?all=true'),
        apiClient.get('/wajib-retribusi?all=true'),
        apiClient.get('/peruntukan-sewa?all=true'),
        apiClient.get('/statuses?all=true'),
        apiClient.get('/users?all=true'),
      ]);
      setJenisPermohonanOptions(jpRes.data.data || []);
      setWajibRetribusiOptions(wrRes.data.data || []);
      setPeruntukanSewaOptions(psRes.data.data || []);
      setStatusOptions(stRes.data.data || []);
      setUserOptions(usrRes.data.data || []);
    } catch (err) {
      console.error("Error fetching dropdown options:", err);
      setFormError("Gagal memuat beberapa opsi dropdown."); // Error spesifik untuk form
      // showSnackbar("Gagal memuat opsi dropdown.", 'error');
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
      const parsedDate = item.tanggalPengajuan ? parseISO(item.tanggalPengajuan) : new Date();
      setFormData({
        idPermohonanSewa: item.idPermohonanSewa,
        idJenisPermohonan: item.idJenisPermohonan || '',
        nomorSuratPermohonan: item.nomorSuratPermohonan || '',
        tanggalPengajuan: isValid(parsedDate) ? format(parsedDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
        idWajibRetribusi: item.idWajibRetribusi || '',
        idPeruntukanSewa: item.idPeruntukanSewa || '',
        idStatus: item.idStatus || '',
        createBy: item.createBy || '',
      });
    } else if (mode === 'add') {
      setFormData(initialFormData);
    }
    setFormError(null); // Reset form error saat ganti mode
    setPageError(null); // Reset page error juga
    setFormMode(mode);
  };

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleAutocompleteChange = (name, newValue) => {
    let idValue = '';
    if (newValue) {
      if (name === 'idJenisPermohonan') idValue = newValue.idJenisPermohonan;
      else if (name === 'idWajibRetribusi') idValue = newValue.idWajibRetribusi;
      else if (name === 'idPeruntukanSewa') idValue = newValue.idPeruntukanSewa;
      else if (name === 'idStatus') idValue = newValue.idStatus;
      else if (name === 'createBy') idValue = newValue.userId;
    }
    setFormData(prev => ({ ...prev, [name]: idValue }));
  };

  const handleSubmit = async () => {
    if (!formData.idJenisPermohonan || !formData.nomorSuratPermohonan || !formData.tanggalPengajuan ||
        !formData.idWajibRetribusi || !formData.idPeruntukanSewa || !formData.idStatus) {
        setFormError("Semua field bertanda (*) wajib diisi.");
        return;
    }
    const submitButton = document.getElementById('submit-button-permohonan-sewa-page');
    if(submitButton) submitButton.disabled = true;
    setFormError(null);

    try {
      const payload = { ...formData };
      if (payload.createBy === '') payload.createBy = null;
      // Pastikan ID diubah ke integer jika backend memerlukannya, contoh:
      payload.idJenisPermohonan = parseInt(payload.idJenisPermohonan, 10) || null;
      payload.idWajibRetribusi = parseInt(payload.idWajibRetribusi, 10) || null;
      payload.idPeruntukanSewa = parseInt(payload.idPeruntukanSewa, 10) || null;
      payload.idStatus = parseInt(payload.idStatus, 10) || null;
      if(payload.createBy) payload.createBy = parseInt(payload.createBy, 10);


      if (formMode === 'edit' && editingItem && formData.idPermohonanSewa) {
        await apiClient.put(`/permohonan-sewa/${formData.idPermohonanSewa}`, payload);
        showSnackbar('Permohonan berhasil diperbarui!', 'success');
      } else {
        const { idPermohonanSewa, ...createData } = payload;
        await apiClient.post('/permohonan-sewa', createData);
        showSnackbar('Permohonan baru berhasil diajukan!', 'success');
      }
      setFormMode('list'); // Kembali ke daftar setelah sukses
      fetchData(); // Muat ulang data
    } catch (err) {
      console.error("Error saat menyimpan Permohonan Sewa:", err);
      const errorMessage = err.response?.data?.message || (err.response?.data?.errors ? 
                           (Object.values(err.response.data.errors || {}).flat().join('\n') || err.response.data.message) :
                           'Gagal menyimpan data. Periksa koneksi.');
      setFormError(`Gagal menyimpan: ${errorMessage}`);
    } finally {
      if(submitButton) submitButton.disabled = false;
    }
  };

  const handleDeleteConfirmation = (itemId) => {
    handleCloseMenu();
    if (window.confirm('Yakin ingin menghapus permohonan ini? Tindakan ini tidak dapat diurungkan.')) {
      handleDelete(itemId);
    }
  };

  const handleDelete = async (id) => {
    setPageError(null);
    try {
      await apiClient.delete(`/permohonan-sewa/${id}`);
      fetchData();
      showSnackbar('Permohonan berhasil dihapus.', 'success');
    } catch (err) { 
      showSnackbar('Gagal menghapus data.', 'error');
      setPageError('Gagal menghapus data.'); // Set page error juga
    }
  };
  
  const getPeruntukanLabel = (option) => {
    if (!option) return '';
    let label = `ID: ${option.idPeruntukanSewa} - ${option.jenisKegiatan || 'Kegiatan N/A'}`;
    if (option.objek_retribusi) {
      label += ` (Objek: ${option.objek_retribusi.namaObjekRetribusi || 'N/A'})`;
    }
    return label;
  };

  const tableHeaders = [
    "ID", "No. Surat", "Tgl. Pengajuan", "Jenis", "Pemohon", "Peruntukan", "Status", "Aksi"
  ];

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
                    {formMode === 'edit' ? 'Edit Detail' : 'Formulir'} Permohonan Sewa
                </Typography>
            </Box>

            {formError && <Alert severity="error" sx={{ mb: 2.5, borderRadius: '4px' }} onClose={() => setFormError(null)}>{formError}</Alert>}
            
            <Grid container spacing={2.5}>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Nomor Surat Permohonan *
                </Typography>
                <TextField autoFocus name="nomorSuratPermohonan" fullWidth value={formData.nomorSuratPermohonan} onChange={handleChange} required variant="outlined" size="small" placeholder="Masukkan nomor surat" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Tanggal Pengajuan *
                </Typography>
                <TextField name="tanggalPengajuan" type="date" fullWidth InputLabelProps={{ shrink: true }} value={formData.tanggalPengajuan} onChange={handleChange} required variant="outlined" size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Jenis Permohonan *
                </Typography>
                <Autocomplete options={jenisPermohonanOptions} getOptionLabel={(o) => o.jenisPermohonan || ''} value={jenisPermohonanOptions.find(o => o.idJenisPermohonan === formData.idJenisPermohonan) || null} onChange={(_, newVal) => handleAutocompleteChange('idJenisPermohonan', newVal)} isOptionEqualToValue={(opt, val) => opt.idJenisPermohonan === val.idJenisPermohonan} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Jenis Permohonan --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Pemohon (Wajib Retribusi) *
                </Typography>
                <Autocomplete options={wajibRetribusiOptions} getOptionLabel={(o) => o.namaWajibRetribusi ? `${o.namaWajibRetribusi} (NIK: ${o.NIK || 'N/A'})` : ''} value={wajibRetribusiOptions.find(o => o.idWajibRetribusi === formData.idWajibRetribusi) || null} onChange={(_, newVal) => handleAutocompleteChange('idWajibRetribusi', newVal)} isOptionEqualToValue={(opt, val) => opt.idWajibRetribusi === val.idWajibRetribusi} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Pemohon --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Peruntukan Sewa (Objek & Kegiatan) *
                </Typography>
                <Autocomplete options={peruntukanSewaOptions} getOptionLabel={getPeruntukanLabel} value={peruntukanSewaOptions.find(o => o.idPeruntukanSewa === formData.idPeruntukanSewa) || null} onChange={(_, newVal) => handleAutocompleteChange('idPeruntukanSewa', newVal)} isOptionEqualToValue={(opt, val) => opt.idPeruntukanSewa === val.idPeruntukanSewa} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Peruntukan --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Status Permohonan Awal *
                </Typography>
                <Autocomplete options={statusOptions} getOptionLabel={(o) => o.namaStatus || ''} value={statusOptions.find(o => o.idStatus === formData.idStatus) || null} onChange={(_, newVal) => handleAutocompleteChange('idStatus', newVal)} isOptionEqualToValue={(opt, val) => opt.idStatus === val.idStatus} renderInput={(params) => <TextField {...params} required variant="outlined" size="small" placeholder="-- Pilih Status --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Dibuat Oleh (Admin)
                </Typography>
                <Autocomplete options={userOptions} getOptionLabel={(o) => o.username || (o.name || `User ID: ${o.userId}`)} value={userOptions.find(o => o.userId === formData.createBy) || null} onChange={(_, newVal) => handleAutocompleteChange('createBy', newVal)} isOptionEqualToValue={(opt, val) => opt.userId === val.userId} renderInput={(params) => <TextField {...params} variant="outlined" size="small" placeholder="-- Pilih User Admin --" sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }} />} loading={loadingOptions} fullWidth />
                <Typography variant="caption" display="block" sx={{mt: 0.5, color: 'text.secondary'}}>
                  Kosongkan field ini jika permohonan dibuat otomatis oleh sistem atau oleh pemohon sendiri.
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Button 
                id="submit-button-permohonan-sewa-page" 
                onClick={handleSubmit} 
                variant="contained" 
                sx={{ textTransform:'none', borderRadius: '4px', px: 2, backgroundColor: theme.palette.success.main, '&:hover': { backgroundColor: theme.palette.success.dark } }}
                startIcon={<SaveIcon />}
              >
                Simpan Permohonan
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
            Permohonan Sewa
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => handleSetFormMode('add')}
            sx={{ borderRadius: '8px', py: 1.2, px: 2.5, textTransform: 'none', fontWeight: 'medium' }}
          >
            Ajukan Permohonan
          </Button>
        </Box>
        <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            <TextField size="small" placeholder="Cari permohonan..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
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
                  <TableRow><TableCell colSpan={tableHeaders.length} align="center" sx={{py:5}}>Tidak ada data permohonan.</TableCell></TableRow>
              ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idPermohonanSewa} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row">{item.idPermohonanSewa}</TableCell>
                    <TableCell sx={{maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                        <Tooltip title={item.nomorSuratPermohonan}><Typography variant="body2">{item.nomorSuratPermohonan}</Typography></Tooltip>
                    </TableCell>
                    <TableCell>
                      {item.tanggalPengajuan && isValid(parseISO(item.tanggalPengajuan)) ? 
                        format(parseISO(item.tanggalPengajuan), 'dd MMM yyyy', { locale: localeID }) : '-'}
                    </TableCell>
                    <TableCell>{item.jenis_permohonan?.jenisPermohonan || '-'}</TableCell>
                    <TableCell>{item.wajib_retribusi?.namaWajibRetribusi || '-'}</TableCell>
                    <TableCell>
                        <Tooltip title={item.peruntukan_sewa ? `${item.peruntukan_sewa.jenisKegiatan} (${item.peruntukan_sewa.objek_retribusi?.namaObjekRetribusi || 'Objek N/A'})` : '-'}>
                            <Typography variant="body2" sx={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                {item.peruntukan_sewa?.jenisKegiatan || '-'}
                            </Typography>
                        </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status?.namaStatus || '-'} 
                        size="small"
                        color={getStatusChipColor(item.status?.namaStatus)}
                        sx={{ fontWeight: 'medium' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={(e) => handleOpenMenu(e, item.idPermohonanSewa)}>
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
        <MenuItem onClick={() => handleSetFormMode('edit', dataList.find(d => d.idPermohonanSewa === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Permohonan
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Permohonan
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

export default PermohonanSewaPage;