import { Platform } from 'react-native';

// Your machine's actual IP address
const LOCAL_IP = '192.168.0.102';

// Get the API URL based on the environment
const getApiUrl = () => {
  if (__DEV__) {
    // For physical devices using Expo Go
    return `http://${LOCAL_IP}:3000`;
  }
  
  // Production URL
  return 'https://your-production-api.com';
};

export const API_BASE_URL = getApiUrl();

export const ENDPOINTS = {
  HEALTH: '/health',
  SIGNUP: '/api/users/signup',
  AUTHENTICATE: '/api/users/authenticate',
  TASKS: '/api/tasks',
  TASKS_FILTER: '/api/tasks/filter',
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
