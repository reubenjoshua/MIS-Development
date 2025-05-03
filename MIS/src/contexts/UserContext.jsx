import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, userService } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await userService.getProfile();
          setUser(userData);
        }
      } catch (err) {
        setError(err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (userData) => {
    try {
      setLoading(true);
      const updatedUser = await userService.updateProfile(userData);
      setUser(updatedUser);
      setError(null);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider 
      value={{ 
        user, 
        setUser, 
        loading, 
        error, 
        login, 
        logout, 
        updateProfile 
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext; 