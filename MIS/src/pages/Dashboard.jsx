import React from 'react';
import { Box, Paper, Typography, Grid, Skeleton } from '@mui/material';
import { 
  Person, 
  Business,
  LocationOn,
  CheckCircle
} from '@mui/icons-material';
import { useDashboard } from '../contexts/DashboardContext';

const StatCard = ({ icon, title, value, isLoading }) => (
  <Paper 
    elevation={0}
    sx={{
      p: 2.5,
      display: 'flex',
      alignItems: 'center',
      gap: 2,
      backgroundColor: '#fff',
      borderRadius: 2,
      height: '100%',
      transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }
    }}
  >
    <Box sx={{ color: '#000000' }}>
      {icon}
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {isLoading ? (
        <Skeleton width="60%" height={32} />
      ) : (
        <Typography variant="h6" sx={{ color: '#000000', mt: 0.5 }}>
          {value}
        </Typography>
      )}
    </Box>
  </Paper>
);

const Dashboard = () => {
  const { stats } = useDashboard();

  const statsConfig = [
    {
      icon: <Person sx={{ fontSize: 28 }} />,
      title: "Active Users",
      value: stats.activeUsers
    },
    {
      icon: <Business sx={{ fontSize: 28 }} />,
      title: "Branches",
      value: stats.branches
    },
    {
      icon: <LocationOn sx={{ fontSize: 28 }} />,
      title: "Areas",
      value: stats.areas
    },
    {
      icon: <CheckCircle sx={{ fontSize: 28 }} />,
      title: "Approved",
      value: stats.approved
    }
  ];

  return (
    <Box sx={{ 
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          backgroundColor: '#E5E7EB',
          borderRadius: '12px',
          p: 2.5,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography variant="h5" sx={{ mb: 2.5, px: 1 }}>
          Dashboard Overview
        </Typography>
        <Grid 
          container 
          spacing={2.5} 
          sx={{ 
            width: '100%',
            m: 0
          }}
        >
          {statsConfig.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatCard 
                {...stat} 
                isLoading={stats.isLoading}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 