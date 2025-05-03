import React from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemButton,
  Typography,
  Box,
  Skeleton
} from '@mui/material';
import { useUser } from '../contexts/UserContext';

const Sidebar = () => {
  const { user, loading } = useUser();
  
  const menuItems = [
    {
      header: 'Manage',
      items: [
        { text: 'Manage User', path: '/manage/users' },
        { text: 'Manage Branch', path: '/manage/branches' }
      ]
    },
    {
      header: 'Forms',
      items: [
        { text: 'Monthly', path: '/forms/monthly' },
        { text: 'Daily', path: '/forms/daily' },
        { text: 'Approve Data', path: '/forms/approve' }
      ]
    },
    {
      header: 'User',
      items: [
        { text: 'Profile', path: '/profile' }
      ]
    }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        '& .MuiDrawer-paper': {
          width: '240px',
          boxSizing: 'border-box',
          backgroundColor: '#E5E7EB',
          borderRight: 'none',
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }
      }}
    >
      {/* Header Section */}
      <Box sx={{ p: 3, textAlign: 'center' }}>
        {loading ? (
          <>
            <Skeleton width="80%" height={24} sx={{ mx: 'auto', mb: 0.5 }} />
            <Skeleton width="60%" height={20} sx={{ mx: 'auto' }} />
          </>
        ) : user ? (
          <>
            <Typography 
              variant="h6" 
              sx={{ 
                fontSize: '1.1rem',
                fontWeight: 'normal',
                color: 'black',
                mb: 0.5
              }}
            >
              Hello {user.userName}!
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: '0.9rem',
                color: 'black'
              }}
            >
              {user.role}
            </Typography>
          </>
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              fontSize: '0.9rem',
              color: 'black'
            }}
          >
            Please log in
          </Typography>
        )}
      </Box>

      {/* Navigation Menu */}
      <List>
        {menuItems.map((section, index) => (
          <React.Fragment key={index}>
            <Typography 
              sx={{
                px: 2,
                pt: 2,
                pb: 1,
                fontSize: '0.875rem',
                color: 'black',
                textAlign: 'left',
                ml: 2
              }}
            >
              {section.header}
            </Typography>
            <List>
              {section.items.map((item, itemIndex) => (
                <ListItem key={itemIndex} disablePadding>
                  <ListItemButton
                    sx={{
                      py: 0.75,
                      justifyContent: 'center',
                      '&:hover': {
                        backgroundColor: '#D1D5DB'
                      },
                      minHeight: '40px'
                    }}
                  >
                    <ListItemText 
                      primary={item.text}
                      sx={{
                        textAlign: 'center',
                        margin: 0,
                        '& .MuiTypography-root': {
                          fontSize: '0.875rem',
                          fontWeight: 'normal',
                          color: 'black'
                        }
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </React.Fragment>
        ))}
      </List>

      {/* Sign Out Button */}
      <Box sx={{ p: 2, mt: 'auto' }}>
        <ListItemButton
          sx={{
            backgroundColor: '#1F2937',
            color: 'white',
            borderRadius: '6px',
            justifyContent: 'center',
            py: 1.5,
            '&:hover': {
              backgroundColor: '#374151'
            }
          }}
        >
          <ListItemText
            primary="Sign out"
            sx={{
              textAlign: 'center',
              margin: 0,
              '& .MuiTypography-root': {
                fontSize: '0.875rem',
                fontWeight: 'normal'
              }
            }}
          />
        </ListItemButton>
      </Box>
    </Drawer>
  );
};

export default Sidebar; 