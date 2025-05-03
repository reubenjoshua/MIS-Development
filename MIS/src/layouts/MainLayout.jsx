import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

const MainLayout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      minHeight: '100vh',
      width: '100vw',
      backgroundColor: '#f9fafb'
    }}>
      <Sidebar />
      <TopBar />
      <Box 
        component="main" 
        sx={{
          flexGrow: 1,
          marginLeft: '240px',
          marginTop: '80px', // Increased from 48px to add space
          padding: '16px',
          minHeight: 'calc(100vh - 80px)', // Adjusted to account for new top margin
          width: 'calc(100vw - 240px)',
          background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
          overflow: 'auto'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout; 