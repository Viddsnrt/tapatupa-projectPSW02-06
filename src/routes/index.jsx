import React from 'react'; // Perlu import React jika ada JSX di file ini
import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom';
import LoginPage from '../pages/Auth/LoginPage';
import AdminLayout from '../components/layout/AdminLayout';
import DashboardPage from '../pages/DashboardPage';
import JenisPermohonanPage from '../pages/JenisPermohonan/JenisPermohonanPage';
import JenisJangkaWaktuPage from '../pages/JenisJangkaWaktu/JenisJangkaWaktuPage';
import LokasiObjekRetribusiPage from '../pages/LokasiObjekRetribusi/LokasiObjekRetribusiPage';
import JenisObjekRetribusiPage from '../pages/JenisObjekRetribusi/JenisObjekRetribusiPage';
import JenisStatusPage from '../pages/JenisStatus/JenisStatusPage';
import WajibRetribusiPage from '../pages/WajibRetribusi/WajibRetribusiPage';
import JangkaWaktuSewaPage from '../pages/JangkaWaktuSewa/JangkaWaktuSewaPage';
import StatusPage from '../pages/Status/StatusPage';
import UserPage from '../pages/User/UserPage';
import PeruntukanSewaPage from '../pages/PeruntukanSewa/PeruntukanSewaPage';
import ObjekRetribusiPage from '../pages/ObjekRetribusi/ObjekRetribusiPage'; 
import TarifObjekRetribusiPage from '../pages/TarifObjekRetribusi/TarifObjekRetribusiPage';
import PermohonanSewaPage from '../pages/PermohonanSewa/PermohonanSewaPage';

const ProtectedRoute = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <AdminLayout>
      <Outlet /> {/* Konten halaman akan dirender di dalam AdminLayout */}
    </AdminLayout>
  );
};

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'jenis-permohonan', element: <JenisPermohonanPage /> },
      { path: 'jenis-jangka-waktu', element: <JenisJangkaWaktuPage /> },
       { path: 'lokasi-objek-retribusi', element: <LokasiObjekRetribusiPage /> },
       { path: 'jenis-objek-retribusi', element: <JenisObjekRetribusiPage /> },
       { path: 'jenis-status', element: <JenisStatusPage /> },
        { path: 'wajib-retribusi', element: <WajibRetribusiPage /> },
        { path: 'jangka-waktu-sewa', element: <JangkaWaktuSewaPage /> },
        { path: 'statuses', element: <StatusPage /> },
         { path: 'users', element: <UserPage /> },
         { path: 'peruntukan-sewa', element: <PeruntukanSewaPage /> },
         { path: 'objek-retribusi', element: <ObjekRetribusiPage /> },
         { path: 'tarif-objek-retribusi', element: <TarifObjekRetribusiPage /> },
         { path: 'permohonan-sewa', element: <PermohonanSewaPage /> },

      // Tambahkan route lain di sini nanti
      // { path: 'users', element: <UserPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" /> } // Untuk path yang tidak dikenal
]);

export const AppRoutes = () => <RouterProvider router={router} />;