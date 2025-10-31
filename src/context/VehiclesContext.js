import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const VehiclesContext = createContext(null);

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const { user } = useAuth();

  // Get auth token
  const getAuthHeaders = () => {
    const token = localStorage.getItem('fleetfox_token');
    if (process.env.NODE_ENV !== 'production') {
      console.log('🔑 Token from localStorage:', token ? 'Token exists' : 'No token found');
    }
    
    if (!token) {
      console.error('❌ No authentication token found in localStorage');
      throw new Error('Authentication token not found. Please log in again.');
    }
    
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Fetch all vehicles
  const fetchVehicles = async () => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      setError('Authentication required');
      return;
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicles');
      }

      const data = await response.json();
      setVehicles(data.vehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch vehicle statistics
  const fetchStats = async () => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/stats/overview`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle statistics');
      }

      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching vehicle stats:', error);
    }
  };

  // Create new vehicle
  const createVehicle = async (vehicleData) => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create vehicle');
      }

      // Add new vehicle to the list
      setVehicles(prevVehicles => [data.vehicle, ...prevVehicles]);
      
      // Refresh server data to include server-populated fields (e.g., driver)
      try { await fetchVehicles(); } catch (_) {}
      // Refresh stats
      fetchStats();
      
      return data.vehicle;
    } catch (error) {
      console.error('Error creating vehicle:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update vehicle
  const updateVehicle = async (id, vehicleData) => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(vehicleData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update vehicle');
      }

      // Update vehicle in the list
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.id === id ? data.vehicle : vehicle
        )
      );
      // Refresh server data to ensure latest fields
      try { await fetchVehicles(); } catch (_) {}
      
      return data.vehicle;
    } catch (error) {
      console.error('Error updating vehicle:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Delete vehicle
  const deleteVehicle = async (id) => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      setError('Authentication required');
      throw new Error('Authentication required');
    }
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete vehicle');
      }

      // Remove vehicle from the list
      setVehicles(prevVehicles => 
        prevVehicles.filter(vehicle => vehicle.id !== id)
      );
      
      // Refresh stats
      fetchStats();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get single vehicle
  const getVehicle = async (id) => {
    const token = localStorage.getItem('fleetfox_token');
    if (!token) {
      throw new Error('Authentication required');
    }
    try {
      const response = await fetch(`${API_BASE_URL}/vehicles/${id}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch vehicle');
      }

      const data = await response.json();
      return data.vehicle;
    } catch (error) {
      console.error('Error fetching vehicle:', error);
      throw error;
    }
  };

  // Load vehicles and stats when component mounts
  useEffect(() => {
    if (user) {
      fetchVehicles();
      fetchStats();
    }
  }, [user]);

  const clearError = () => {
    setError(null);
  };

  return (
    <VehiclesContext.Provider value={{
      vehicles,
      loading,
      error,
      stats,
      fetchVehicles,
      createVehicle,
      updateVehicle,
      deleteVehicle,
      getVehicle,
      fetchStats,
      clearError
    }}>
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehicles = () => {
  const context = useContext(VehiclesContext);
  if (!context) {
    throw new Error('useVehicles must be used within a VehiclesProvider');
  }
  return context;
};
