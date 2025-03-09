import { Platform } from 'react-native';

// Your machine's actual IP address
const LOCAL_IP = '192.168.122.166';

// Get the API URL based on the environment
const getApiUrl = () => {
  if (__DEV__) {
    // Check if running in Expo tunnel mode
    if (process.env.EXPO_PUBLIC_API_URL) {
      return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // For USB debugging on Android
    if (Platform.OS === 'android') {
      // Try using adb reverse first
      return 'http://localhost:3000';
    }
    
    // For iOS and other cases
    return `http://${LOCAL_IP}:3000`;
  }
  
  // Production URL
  return `http://${LOCAL_IP}:3000`;
};

// Export the API URL
export const API_BASE_URL = getApiUrl();

// Auth endpoints
export const ENDPOINTS = {
  // Health check
  HEALTH: '/health',
  
  // Auth
  SIGNUP: '/api/users/signup',
  AUTHENTICATE: '/api/users/authenticate',
  
  // Tasks
  TASKS: '/api/tasks',
  TASKS_FILTER: '/api/tasks/filter',
  
  // Jobs
  JOBS: '/api/jobs',
};

// Task status and priority constants
export const TASK_STATUS = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
};

export const TASK_PRIORITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
};

// Job status constants
export const JOB_STATUS = {
  SAVED: 'SAVED',
  APPLIED: 'APPLIED',
  REJECTED: 'REJECTED',
  INTERVIEW: 'INTERVIEW',
  OFFER: 'OFFER',
};

// Map job status to colors
export const JOB_STATUS_COLORS = {
  SAVED: '#FFD700', // Yellow
  APPLIED: '#00FFD1', // Teal
  REJECTED: '#FF4D6D', // Red
  INTERVIEW: '#00CCAA', // Green-blue
  OFFER: '#00FF7F', // Green
}; 
