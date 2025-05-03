import React from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import { CssBaseline } from '@mui/material';
import { UserProvider } from './contexts/UserContext';
import { DashboardProvider } from './contexts/DashboardContext';

function App() {
  return (
    <UserProvider>
      <DashboardProvider>
        <CssBaseline />
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </DashboardProvider>
    </UserProvider>
  );
}

export default App;
