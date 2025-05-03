import React from 'react';
import { Box, Typography } from '@mui/material';

const TopBar = () => {
  return (
    <Box
      sx={{
        width: 'calc(100vw - 272px)', // 240px sidebar + 32px total margin
        height: '48px',
        backgroundColor: '#E5E7EB',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        px: 3,
        position: 'fixed',
        top: '16px',
        right: '16px',
        left: '256px', // 240px + 16px margin
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ color: '#111827', fontSize: '1.1rem' }}>
       
      </Typography>
    </Box>
  );
};

export default TopBar; 