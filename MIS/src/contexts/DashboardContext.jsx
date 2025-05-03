import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardContext = createContext();

const API_BASE_URL = 'http://localhost:5000'; // Adjust this to match your Flask backend URL

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState({
    activeUsers: 0,
    branches: 0,
    areas: 0,
    approved: 0,
    isLoading: true
  });

  const fetchDashboardStats = async () => {
    try {
      setStats(prev => ({ ...prev, isLoading: true }));
      
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Fetch data from actual backend endpoints with authentication
      const fetchWithAuth = (url) => fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      const responses = await Promise.all([
        fetchWithAuth(`${API_BASE_URL}/users`),
        fetchWithAuth(`${API_BASE_URL}/branches`),
        fetchWithAuth(`${API_BASE_URL}/areas`),
        fetchWithAuth(`${API_BASE_URL}/daily-reports`)
      ]);

      const [users, branches, areas, reports] = await Promise.all(
        responses.map(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
      );

      // Process the data
      const activeUsers = users.filter(user => user.isActive).length;
      const activeBranches = branches?.filter(branch => branch?.isActive)?.length || 0;
      const activeAreas = areas?.filter(area => area?.isActive)?.length || 0;
      const approvedReports = reports?.filter(report => report?.status?.statusName === 'Approved')?.length || 0;

      setStats({
        activeUsers,
        branches: activeBranches,
        areas: activeAreas,
        approved: approvedReports,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Set to 0 if there's an error
      setStats({
        activeUsers: 0,
        branches: 0,
        areas: 0,
        approved: 0,
        isLoading: false
      });
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Set up periodic refresh every 30 seconds
  useEffect(() => {
    const intervalId = setInterval(fetchDashboardStats, 30000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <DashboardContext.Provider value={{ 
      stats, 
      refreshStats: fetchDashboardStats,
      isLoading: stats.isLoading 
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

export default DashboardContext; 