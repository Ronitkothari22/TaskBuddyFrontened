import { API_BASE_URL, ENDPOINTS } from '@/constants/api';
import { getDeviceId } from '@/utils/deviceId';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  deviceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description?: string;
  link?: string;
  deadline?: string;
  status: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// API response types
interface AuthResponse {
  message: string;
  user: User;
}

interface TaskResponse {
  message: string;
  task: Task;
}

interface TasksResponse {
  tasks: Task[];
}

interface JobResponse {
  message: string;
  job: Job;
}

interface JobsResponse {
  jobs: Job[];
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public errors?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const TIMEOUT = 10000; // 10 seconds

// Helper function to delay execution
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Base API request function with authentication and retry logic
 */
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  body?: any,
  requiresAuth: boolean = true,
  retryCount: number = 0
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (requiresAuth) {
      const deviceId = await getDeviceId();
      if (!deviceId) {
        throw new ApiError('No device ID found', 401);
      }
      headers['x-device-id'] = deviceId;
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

<<<<<<< HEAD
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
    }

    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`Making API request to: ${url} (attempt ${retryCount + 1})`);

    try {
      // Make the request with timeout
      const response = await Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), TIMEOUT)
        )
      ]) as Response;

      const data = await response.json();

      // Handle error responses
      if (!response.ok) {
        console.log('API error response:', data);
        throw new ApiError(
          data.message || 'An error occurred',
          response.status,
          data.errors
        );
      }

      console.log('API request successful:', endpoint);
      return data as T;
    } catch (error: any) {
      // Handle network errors with retry logic
      if (retryCount < MAX_RETRIES && (
        error.message === 'Request timeout' || 
        error instanceof TypeError || 
        error.message.includes('Network request failed')
      )) {
        console.log(`Retry attempt ${retryCount + 1} of ${MAX_RETRIES}`);
        await delay(RETRY_DELAY * (retryCount + 1));
        return apiRequest(endpoint, method, body, requiresAuth, retryCount + 1);
      }
      
      if (error.message === 'Request timeout') {
        console.log('Request timed out - likely offline');
        throw new ApiError('Network error', 408);
      }

      throw error;
=======
    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.errors
      );
>>>>>>> refs/remotes/origin/development
    }
  } catch (error: any) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Categorize network errors for better handling
    if ((error instanceof TypeError && error.message.includes('Network request failed')) ||
        error.message.includes('Network request failed')) {
      console.log('Network request failed - device is likely offline');
      throw new ApiError('Network error', 503);
    }
    console.log('General API error:', error);
    throw new ApiError('Network error', 500);
  }
}

// Health check API
export const healthApi = {
  /**
   * Check API server health
   */
  checkHealth: async (): Promise<{ status: string }> => {
    try {
      const response = await apiRequest<{ status: string }>(
        ENDPOINTS.HEALTH,
        'GET',
        undefined,
        false
      );
      return response;
    } catch (error) {
      console.log('Health check failed:', error);
      throw error;
    }
  },
};

// Auth API
export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (email: string, name: string): Promise<User> => {
    const deviceId = await getDeviceId();
    const response = await apiRequest<AuthResponse>(
      ENDPOINTS.SIGNUP,
      'POST',
      { email, name, deviceId },
      false
    );
    return response.user;
  },

  /**
   * Authenticate with device ID
   */
  authenticate: async (): Promise<User> => {
    const deviceId = await getDeviceId();
    const response = await apiRequest<AuthResponse>(
      ENDPOINTS.AUTHENTICATE,
      'POST',
      { deviceId },
      false
    );
    return response.user;
  },
};

// Tasks API
export const tasksApi = {
  /**
   * Get all tasks
   */
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiRequest<TasksResponse>(ENDPOINTS.TASKS);
    return response.tasks;
  },

  /**
   * Get filtered tasks
   */
  getFilteredTasks: async (status?: string, priority?: string): Promise<Task[]> => {
    let endpoint = ENDPOINTS.TASKS_FILTER;
    const params = new URLSearchParams();
    
    if (status) params.append('status', status);
    if (priority) params.append('priority', priority);
    
    const queryString = params.toString();
    if (queryString) {
      endpoint += `?${queryString}`;
    }
    
    const response = await apiRequest<TasksResponse>(endpoint);
    return response.tasks;
  },

  /**
   * Get a task by ID
   */
  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await apiRequest<{ task: Task }>(`${ENDPOINTS.TASKS}/${taskId}`);
    return response.task;
  },

  /**
   * Create a new task
   */
  createTask: async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
  }): Promise<Task> => {
    const response = await apiRequest<TaskResponse>(
      ENDPOINTS.TASKS,
      'POST',
      taskData
    );
    return response.task;
  },

  /**
   * Update a task
   */
  updateTask: async (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: string;
      status?: string;
    }
  ): Promise<Task> => {
    const response = await apiRequest<TaskResponse>(
      `${ENDPOINTS.TASKS}/${taskId}`,
      'PATCH',
      taskData
    );
    return response.task;
  },

  /**
   * Delete a task
   */
  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      `${ENDPOINTS.TASKS}/${taskId}`,
      'DELETE'
    );
  },
};

// Jobs API
export const jobsApi = {
  /**
   * Get all jobs
   */
  getAllJobs: async (): Promise<Job[]> => {
    const response = await apiRequest<JobsResponse>(ENDPOINTS.JOBS);
    return response.jobs;
  },

  /**
   * Get a job by ID
   */
  getJobById: async (jobId: string): Promise<Job> => {
    const response = await apiRequest<{ job: Job }>(`${ENDPOINTS.JOBS}/${jobId}`);
    return response.job;
  },

  /**
   * Create a new job
   */
  createJob: async (jobData: {
    title: string;
    company: string;
    description?: string;
    link?: string;
    deadline?: string;
    status?: string;
  }): Promise<Job> => {
    const response = await apiRequest<JobResponse>(
      ENDPOINTS.JOBS,
      'POST',
      jobData
    );
    return response.job;
  },

  /**
   * Update a job
   */
  updateJob: async (
    jobId: string,
    jobData: {
      title?: string;
      company?: string;
      description?: string;
      link?: string;
      deadline?: string;
      status?: string;
    }
  ): Promise<Job> => {
    const response = await apiRequest<JobResponse>(
      `${ENDPOINTS.JOBS}/${jobId}`,
      'PATCH',
      jobData
    );
    return response.job;
  },

  /**
   * Delete a job
   */
  deleteJob: async (jobId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      `${ENDPOINTS.JOBS}/${jobId}`,
      'DELETE'
    );
  },
}; 
