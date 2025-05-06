import React from 'react';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import { CssBaseline } from '@mui/material';
import { UserProvider } from './contexts/UserContext';
import { DashboardProvider } from './contexts/DashboardContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <UserProvider>
      <DashboardProvider>
        <CssBaseline />
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage/users" element={<ManageUsers />} />
            </Routes>
          </MainLayout>
        </Router>
      </DashboardProvider>
    </UserProvider>
  );
}

export default App;
