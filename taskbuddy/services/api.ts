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
const delay = (ms: number): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

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
  const url = `${API_BASE_URL}${endpoint}`;
  console.log(`Making API request to: ${url} (attempt ${retryCount + 1})`);

  try {
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

    const options: RequestInit = {
      method,
      headers,
      body: body && method !== 'GET' ? JSON.stringify(body) : undefined
    };

    // Make the request with timeout
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), TIMEOUT)
    );

    const fetchPromise = fetch(url, options);
    const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
    const data = await response.json();

    if (!response.ok) {
      console.log('API error response:', data);
      throw new ApiError(
        data.message || 'An error occurred',
        response.status,
        data.errors
      );
    }

    console.log('API request successful:', endpoint, data);
    return data as T;

  } catch (error: any) {
    console.log('API request error:', error.message);

    // Handle network errors with retry logic
    if (retryCount < MAX_RETRIES && (
      error.message === 'Request timeout' || 
      error instanceof TypeError || 
      error.message.includes('Network request failed')
    )) {
      console.log(`Retrying request (${retryCount + 1}/${MAX_RETRIES})`);
      await delay(RETRY_DELAY * (retryCount + 1));
      return apiRequest(endpoint, method, body, requiresAuth, retryCount + 1);
    }

    if (error instanceof ApiError) {
      throw error;
    }

    // Throw appropriate error based on the situation
    if (error.message === 'Request timeout') {
      throw new ApiError('Request timed out', 408);
    }

    if (error.message.includes('Network request failed')) {
      throw new ApiError('Cannot connect to server', 503);
    }

    throw new ApiError('An unexpected error occurred', 500);
  }
}

/*
export const healthApi = {
  checkHealth: async (): Promise<{ status: string }> => {
    try {
      return await apiRequest<{ status: string }>(
        ENDPOINTS.HEALTH,
        'GET',
        undefined,
        false
      );
    } catch (error) {
      console.log('Health check failed:', error);
      throw error;
    }
  },
};
*/

export const authApi = {
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

  authenticate: async (): Promise<User> => {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      throw new ApiError('No device ID found', 401);
    }
    const response = await apiRequest<AuthResponse>(
      ENDPOINTS.AUTHENTICATE,
      'POST',
      { deviceId },
      false
    );
    return response.user;
  },
};

export const tasksApi = {
  getAllTasks: async (): Promise<Task[]> => {
    const response = await apiRequest<TasksResponse>(ENDPOINTS.TASKS);
    return response.tasks;
  },

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

  getTaskById: async (taskId: string): Promise<Task> => {
    const response = await apiRequest<{ task: Task }>(`${ENDPOINTS.TASKS}/${taskId}`);
    return response.task;
  },

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

  deleteTask: async (taskId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      `${ENDPOINTS.TASKS}/${taskId}`,
      'DELETE'
    );
  },
};

export const jobsApi = {
  getAllJobs: async (): Promise<Job[]> => {
    const response = await apiRequest<JobsResponse>(ENDPOINTS.JOBS);
    return response.jobs;
  },

  getJobById: async (jobId: string): Promise<Job> => {
    const response = await apiRequest<{ job: Job }>(`${ENDPOINTS.JOBS}/${jobId}`);
    return response.job;
  },

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

  deleteJob: async (jobId: string): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(
      `${ENDPOINTS.JOBS}/${jobId}`,
      'DELETE'
    );
  },
};
