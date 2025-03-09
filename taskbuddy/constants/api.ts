export const API_BASE_URL = 'http://localhost:3000'; // Replace with your actual API base URL

// Auth endpoints
export const ENDPOINTS = {
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