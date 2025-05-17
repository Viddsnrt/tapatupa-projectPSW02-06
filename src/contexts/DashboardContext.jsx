// src/contexts/DashboardContext.js
import React, { createContext, useState, useCallback, useContext } from 'react';
import apiClient from '../services/apiClient'; // Sesuaikan path

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [dashboardData, setDashboardData] = useState({
    stats: {
      permohonanAktif: undefined,
      penggunaTerdaftar: undefined,
      objekRetribusi: undefined,
      totalTransaksiBulanIni: undefined,
    },
    recentActivities: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    console.log("DashboardContext: Fetching dashboard data..."); // Logging
    try {
      const statsPromise = apiClient.get('/dashboard/summary-stats');
      const activitiesPromise = apiClient.get('/dashboard/recent-activities?limit=5');

      const [statsRes, activitiesRes] = await Promise.all([statsPromise, activitiesPromise]);
      
      console.log("DashboardContext: Stats Response", statsRes.data); // Logging
      console.log("DashboardContext: Activities Response", activitiesRes.data); // Logging

      setDashboardData({
        stats: {
          permohonanAktif: statsRes.data.data?.activeApplications ?? 0,
          penggunaTerdaftar: statsRes.data.data?.registeredUsers ?? 0,
          objekRetribusi: statsRes.data.data?.retributionObjects ?? 0,
          totalTransaksiBulanIni: statsRes.data.data?.currentMonthTransactions ?? 0,
        },
        recentActivities: activitiesRes.data.data || [],
      });
    } catch (err) {
      console.error("DashboardContext: Error fetching dashboard data:", err); // Logging
      setError("Gagal memuat data dashboard dari context.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Fungsi ini akan dipanggil dari halaman CRUD setelah operasi berhasil
  const refreshDashboardData = () => {
    fetchDashboardData();
  };

  const value = {
    dashboardData,
    loading,
    error,
    fetchDashboardData, // Bisa dipanggil dari DashboardPage juga saat mount
    refreshDashboardData, // Untuk dipanggil dari halaman CRUD
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};