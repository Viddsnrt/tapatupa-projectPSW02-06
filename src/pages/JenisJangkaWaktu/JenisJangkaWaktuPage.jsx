// src/pages/JenisJangkaWaktu/JenisJangkaWaktuPage.jsx

import React, { useEffect, useState, useCallback } from 'react';
import apiClient from '../../services/apiClient'; // Sesuaikan path jika perlu
import {
  Box, Button, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
  IconButton, CircularProgress, Alert, TextField, Dialog, DialogActions, DialogContent,
  DialogTitle, Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
// import PropTypes from 'prop-types'; // Jika menggunakan prop-types

const initialFormData = {
  jenisJangkaWaktu: '',
  keterangan: '',
};

const JenisJangkaWaktuPage = () => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [openForm, setOpenForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get('/jenis-jangka-waktu'); // Endpoint API
      setDataList(response.data.data || []);
    } catch (err) {
      setError('Gagal mengambil data Jenis Jangka Waktu.');
      console.error("Error fetching Jenis Jangka Waktu:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOpenForm = (item = null) => {
    setEditingItem(item);
    if (item) {
      setFormData({
        idJenisJangkaWaktu: item.idJenisJangkaWaktu, // Pastikan nama PK benar
        jenisJangkaWaktu: item.jenisJangkaWaktu,
        keterangan: item.keterangan || '',
      });
    } else {
      setFormData(initialFormData);
    }
    setError(null);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingItem(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.jenisJangkaWaktu) {
        setError("Jenis Jangka Waktu wajib diisi.");
        return;
    }
    // Indikator loading spesifik untuk submit, agar tidak mengganggu loading tabel utama
    const submitButton = document.getElementById('submit-button-jenis-jangka-waktu');
    if(submitButton) submitButton.disabled = true;
    setError(null);

    try {
      console.log("Data yang dikirim ke API (Jenis Jangka Waktu):", formData);

      if (editingItem && formData.idJenisJangkaWaktu) {
        await apiClient.put(`/jenis-jangka-waktu/${formData.idJenisJangkaWaktu}`, formData);
      } else {
        // Hapus idJenisJangkaWaktu dari formData saat create jika backend tidak mengharapkannya
        const { idJenisJangkaWaktu, ...createData } = formData;
        await apiClient.post('/jenis-jangka-waktu', createData);
      }
      fetchData();
      handleCloseForm();
    } catch (err) {
      console.error("Error saat menyimpan Jenis Jangka Waktu:", err);
      if (err.response) {
        console.error("Response data error:", err.response.data);
        if (err.response.data && err.response.data.errors) {
          const backendErrors = Object.values(err.response.data.errors).flat().join('\n');
          setError(`Gagal menyimpan: ${backendErrors}`);
        } else if (err.response.data && err.response.data.message) {
          setError(`Gagal menyimpan: ${err.response.data.message}`);
        } else {
          setError('Gagal menyimpan data. Cek konsol untuk detail.');
        }
      } else {
        setError('Gagal menyimpan data. Periksa koneksi atau backend.');
      }
    } finally {
      if(submitButton) submitButton.disabled = false;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus item ini?')) {
      // Indikator loading bisa ditambahkan di sini juga jika proses delete lama
      setError(null);
      try {
        await apiClient.delete(`/jenis-jangka-waktu/${id}`);
        fetchData();
      } catch (err) {
        console.error("Error menghapus Jenis Jangka Waktu:", err);
        setError('Gagal menghapus data.');
      }
    }
  };

  if (loading && dataList.length === 0) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Paper sx={{ p: 2, m:1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5">Manajemen Jenis Jangka Waktu</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenForm()}>
          Tambah Baru
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Jenis Jangka Waktu</TableCell>
              <TableCell>Keterangan</TableCell>
              <TableCell align="right">Aksi</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.length === 0 && !loading ? (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        Tidak ada data.
                    </TableCell>
                </TableRow>
            ) : (
                dataList.map((item) => (
                <TableRow hover key={item.idJenisJangkaWaktu}> {/* Pastikan PK benar */}
                    <TableCell>{item.idJenisJangkaWaktu}</TableCell>
                    <TableCell>{item.jenisJangkaWaktu}</TableCell>
                    <TableCell>{item.keterangan || '-'}</TableCell>
                    <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenForm(item)} color="primary" aria-label="edit">
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDelete(item.idJenisJangkaWaktu)} color="error" aria-label="delete">
                        <DeleteIcon />
                    </IconButton>
                    </TableCell>
                </TableRow>
                ))
            )}
            {loading && dataList.length > 0 && (
                <TableRow>
                    <TableCell colSpan={4} align="center">
                        <CircularProgress size={24} />
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Edit' : 'Tambah'} Jenis Jangka Waktu</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}
          <Grid container spacing={2} sx={{mt: 1}}>
            <Grid item xs={12}>
              <TextField
                autoFocus
                name="jenisJangkaWaktu"
                label="Jenis Jangka Waktu"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.jenisJangkaWaktu}
                onChange={handleChange}
                required
                // Sederhanakan error display, error global sudah cukup
                // error={!formData.jenisJangkaWaktu && !!error}
                // helperText={!formData.jenisJangkaWaktu && !!error ? "Wajib diisi" : ""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="keterangan"
                label="Keterangan"
                type="text"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                value={formData.keterangan}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Batal</Button>
          <Button id="submit-button-jenis-jangka-waktu" onClick={handleSubmit} variant="contained">
            Simpan
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default JenisJangkaWaktuPage;