import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient';
import CloseIcon from '@mui/icons-material/Close';
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
  Alert,          // Untuk pesan error/sukses di dalam halaman
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Autocomplete,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,   // Untuk ikon di dalam MenuItem
  Skeleton,       // Untuk efek loading pada tabel
  Snackbar,       // Untuk notifikasi pop-up
  useTheme,
  alpha
} from '@mui/material';

// Impor Ikon dari @mui/icons-material
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
// Pastikan ikon lain yang mungkin kamu tambahkan juga diimpor di sini

// Impor dari date-fns
import { format, parseISO, isValid } from 'date-fns';
import { id as localeID } from 'date-fns/locale'; // Untuk format tanggal Indonesia

// Jika kamu menggunakan framer-motion (opsional untuk animasi)
// import { motion } from 'framer-motion';
const initialFormData = {
  idJenisPermohonan: '',
  nomorSuratPermohonan: '',
  tanggalPengajuan: format(new Date(), 'yyyy-MM-dd'),
  idWajibRetribusi: '',
  idPeruntukanSewa: '',
  idStatus: '',
  createBy: '',
};

// Fungsi untuk mendapatkan warna chip berdasarkan status
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
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' }); // Snackbar lokal

  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const [jenisPermohonanOptions, setJenisPermohonanOptions] = useState([]);
  const [wajibRetribusiOptions, setWajibRetribusiOptions] = useState([]);
  const [peruntukanSewaOptions, setPeruntukanSewaOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);

  // State untuk menu aksi di tabel
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
    setError(null);
    try {
      const response = await apiClient.get('/permohonan-sewa');
      setDataList(response.data.data || []);
    } catch (err) {
      setError('Gagal mengambil data Permohonan Sewa.');
      showSnackbar('Gagal mengambil data Permohonan Sewa.', 'error');
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
      setError("Gagal memuat beberapa opsi dropdown.");
      showSnackbar("Gagal memuat opsi dropdown.", 'error');
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchDropdownData();
  }, [fetchData, fetchDropdownData]);

  const handleOpenForm = (item = null) => {
    handleCloseMenu(); // Tutup menu aksi jika terbuka
    setEditingItem(item);
    if (item) {
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
    } else {
      setFormData(initialFormData);
    }
    setError(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => setOpenForm(false);
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
        showSnackbar("Semua field bertanda (*) wajib diisi.", "warning");
        return;
    }
    const submitButton = document.getElementById('submit-button-permohonan-sewa');
    if(submitButton) submitButton.disabled = true;
    setError(null);

    try {
      const payload = { ...formData };
      if (payload.createBy === '') payload.createBy = null;

      if (editingItem && formData.idPermohonanSewa) {
        await apiClient.put(`/permohonan-sewa/${formData.idPermohonanSewa}`, payload);
        showSnackbar('Permohonan berhasil diperbarui!', 'success');
      } else {
        const { idPermohonanSewa, ...createData } = payload; // Hapus idPermohonanSewa saat create
        await apiClient.post('/permohonan-sewa', createData);
        showSnackbar('Permohonan baru berhasil diajukan!', 'success');
      }
      fetchData();
      handleCloseForm();
    } catch (err) {
      console.error("Error saat menyimpan Permohonan Sewa:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.errors ? 
                           (Object.values(err.response.data.errors || {}).flat().join('\n') || err.response.data.message) :
                           'Gagal menyimpan data. Periksa koneksi.';
      showSnackbar(`Gagal menyimpan: ${errorMessage}`, 'error');
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
    setError(null);
    try {
      await apiClient.delete(`/permohonan-sewa/${id}`);
      fetchData();
      showSnackbar('Permohonan berhasil dihapus.', 'success');
    } catch (err) { 
      showSnackbar('Gagal menghapus data.', 'error');
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

  // Skeleton untuk tabel
  const TableSkeleton = () => (
    Array.from(new Array(5)).map((_, index) => (
      <TableRow key={index}>
        {tableHeaders.map(header => (
          <TableCell key={header}><Skeleton variant="text" sx={{ fontSize: '1rem' }} /></TableCell>
        ))}
      </TableRow>
    ))
  );


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
            onClick={() => handleOpenForm()}
            sx={{ borderRadius: '8px', py: 1.2, px: 2.5, textTransform: 'none', fontWeight: 'medium' }}
          >
            Ajukan Permohonan
          </Button>
        </Box>
        <Box sx={{display: 'flex', gap: 1, mb: 2}}>
            {/* Tambahkan filter/search di sini jika perlu */}
            <TextField size="small" placeholder="Cari permohonan..." InputProps={{startAdornment: <SearchIcon fontSize="small" sx={{mr:0.5, color:'text.disabled'}}/>}}/>
            <Button variant="outlined" startIcon={<FilterListIcon />} size="small" sx={{textTransform:'none'}}>Filter</Button>
        </Box>
      </Paper>

      {error && !snackbar.open && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
      
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
                    <TableCell>{item.jenis_permohonan?.jenisPermohonan || 'N/A'}</TableCell>
                    <TableCell>{item.wajib_retribusi?.namaWajibRetribusi || 'N/A'}</TableCell>
                    <TableCell>
                        <Tooltip title={item.peruntukan_sewa ? `${item.peruntukan_sewa.jenisKegiatan} (${item.peruntukan_sewa.objek_retribusi?.namaObjekRetribusi || 'Objek N/A'})` : 'N/A'}>
                            <Typography variant="body2" sx={{maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                                {item.peruntukan_sewa?.jenisKegiatan || 'N/A'}
                            </Typography>
                        </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={item.status?.namaStatus || 'N/A'} 
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
      
      {/* Menu Aksi untuk setiap baris */}
      <Menu
        anchorEl={anchorElMenu}
        open={Boolean(anchorElMenu)}
        onClose={handleCloseMenu}
        PaperProps={{
          elevation: 1,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.05))',
            mt: 0.5,
            '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1, },
            '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0, }
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => handleOpenForm(dataList.find(d => d.idPermohonanSewa === selectedItemIdMenu))}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          Edit Permohonan
        </MenuItem>
        <MenuItem onClick={() => handleDeleteConfirmation(selectedItemIdMenu)} sx={{color: 'error.main'}}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          Hapus Permohonan
        </MenuItem>
      </Menu>


      {/* Dialog Form */}
        <Dialog 
        open={openForm} 
        onClose={handleCloseForm} 
        maxWidth="sm" // Mungkin 'sm' lebih cocok untuk form vertikal
        fullWidth 
        PaperProps={{ 
          sx: { 
            borderRadius: '8px', 
            boxShadow: theme.shadows[5], 
          } 
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: theme.palette.success.main, // Warna hijau atau sesuaikan
          color: theme.palette.common.white,
          p: 1.5, 
          fontSize: '1.1rem',
          fontWeight: 'medium',
          // Jika ingin tombol close di header dialog
          // display: 'flex', 
          // alignItems: 'center',
          // justifyContent: 'space-between'
        }}>
          {editingItem ? 'Edit Detail' : 'Formulir'} Permohonan Sewa
          {/* 
          <IconButton
            aria-label="close"
            onClick={handleCloseForm}
            sx={{ color: 'common.white' }}
          >
            <CloseIcon />
          </IconButton> 
          */}
        </DialogTitle>

        {/* KONTEN DIALOG YANG DIREVISI UNTUK SUSUNAN VERTIKAL */}
        <DialogContent sx={{ 
            pt: 2.5, 
            pb: 2,
            px: {xs: 2, sm: 3},
        }}>
            {error && <Alert severity="error" sx={{ mb: 2, borderRadius: '4px' }} onClose={() => setError(null)}>{error}</Alert>}
            
            <Grid container spacing={2.5}> {/* Spasi vertikal antar field */}
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Nomor Surat Permohonan *
                </Typography>
                <TextField 
                    name="nomorSuratPermohonan" 
                    fullWidth 
                    value={formData.nomorSuratPermohonan} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                    size="small"
                    placeholder="Masukkan nomor surat"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Tanggal Pengajuan *
                </Typography>
                <TextField 
                    name="tanggalPengajuan" 
                    type="date" 
                    fullWidth 
                    InputLabelProps={{ shrink: true }}
                    value={formData.tanggalPengajuan} 
                    onChange={handleChange} 
                    required 
                    variant="outlined"
                    size="small"
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Jenis Permohonan *
                </Typography>
                <Autocomplete 
                    options={jenisPermohonanOptions} 
                    getOptionLabel={(o) => o.jenisPermohonan || ''}
                    value={jenisPermohonanOptions.find(o => o.idJenisPermohonan === formData.idJenisPermohonan) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idJenisPermohonan', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idJenisPermohonan === val.idJenisPermohonan}
                    renderInput={(params) => 
                        <TextField {...params} 
                            required 
                            variant="outlined" 
                            size="small"
                            placeholder="-- Pilih Jenis Permohonan --"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                        />} 
                    loading={loadingOptions} 
                    fullWidth 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Pemohon (Wajib Retribusi) *
                </Typography>
                <Autocomplete 
                    options={wajibRetribusiOptions} 
                    getOptionLabel={(o) => o.namaWajibRetribusi ? `${o.namaWajibRetribusi} (NIK: ${o.NIK || 'N/A'})` : ''}
                    value={wajibRetribusiOptions.find(o => o.idWajibRetribusi === formData.idWajibRetribusi) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idWajibRetribusi', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idWajibRetribusi === val.idWajibRetribusi}
                    renderInput={(params) => 
                        <TextField {...params} 
                            required 
                            variant="outlined" 
                            size="small"
                            placeholder="-- Pilih Pemohon --"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                        />} 
                    loading={loadingOptions} 
                    fullWidth 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Peruntukan Sewa (Objek & Kegiatan) *
                </Typography>
                <Autocomplete 
                    options={peruntukanSewaOptions} 
                    getOptionLabel={getPeruntukanLabel}
                    value={peruntukanSewaOptions.find(o => o.idPeruntukanSewa === formData.idPeruntukanSewa) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idPeruntukanSewa', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idPeruntukanSewa === val.idPeruntukanSewa}
                    renderInput={(params) => 
                        <TextField {...params} 
                            required 
                            variant="outlined" 
                            size="small"
                            placeholder="-- Pilih Peruntukan --"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                        />} 
                    loading={loadingOptions} 
                    fullWidth 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Status Permohonan Awal *
                </Typography>
                <Autocomplete 
                    options={statusOptions} 
                    getOptionLabel={(o) => o.namaStatus || ''}
                    value={statusOptions.find(o => o.idStatus === formData.idStatus) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('idStatus', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.idStatus === val.idStatus}
                    renderInput={(params) => 
                        <TextField {...params} 
                            required 
                            variant="outlined" 
                            size="small"
                            placeholder="-- Pilih Status --"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                        />} 
                    loading={loadingOptions} 
                    fullWidth 
                />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom sx={{fontWeight: 'bold', color: 'text.primary', mb: 0.5}}>
                  Dibuat Oleh (Admin)
                </Typography>
                <Autocomplete 
                    options={userOptions} 
                    getOptionLabel={(o) => o.username || (o.name || '')}
                    value={userOptions.find(o => o.userId === formData.createBy) || null}
                    onChange={(_, newVal) => handleAutocompleteChange('createBy', newVal)}
                    isOptionEqualToValue={(opt, val) => opt.userId === val.userId}
                    renderInput={(params) => 
                        <TextField {...params} 
                            variant="outlined" 
                            size="small"
                            placeholder="-- Pilih User Admin --"
                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '4px' } }}
                        />} 
                    loading={loadingOptions} 
                    fullWidth 
                />
                <Typography variant="caption" display="block" sx={{mt: 0.5, color: 'text.secondary'}}>
                  Kosongkan field ini jika permohonan dibuat otomatis oleh sistem atau oleh pemohon sendiri.
                </Typography>
              </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ 
          p: '16px 24px',
          borderTop: `1px solid ${theme.palette.divider}`,
          justifyContent: 'space-between',
        }}>
          <Button 
            id="submit-button-permohonan-sewa" 
            onClick={handleSubmit} 
            variant="contained" 
            sx={{
                textTransform:'none', 
                borderRadius: '4px', 
                px: 2, 
                backgroundColor: theme.palette.success.main, 
                '&:hover': { backgroundColor: theme.palette.success.dark }
            }}
            startIcon={<SaveIcon />}
          >
            Simpan Permohonan
          </Button>
          <Button 
            onClick={handleCloseForm} 
            variant="contained" 
            sx={{
                textTransform:'none', 
                borderRadius: '4px', 
                px: 2,
                backgroundColor: theme.palette.grey[600],
                '&:hover': { backgroundColor: theme.palette.grey[700] }
            }}
            startIcon={<ArrowBackIcon />}
          >
            Kembali
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar untuk notifikasi */}
      {/* Jika sudah ada Snackbar global di AdminLayout, ini bisa di-skip */}
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