import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { tasksApi, jobsApi, Task, Job } from '@/services/api';
import { useAuth } from './AuthContext';
import { TASK_STATUS, JOB_STATUS } from '@/constants/api';

interface DataContextType {
  // Tasks
  tasks: Task[];
  isLoadingTasks: boolean;
  refreshTasks: () => Promise<void>;
  createTask: (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
  }) => Promise<Task | undefined>;
  updateTask: (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: string;
      status?: string;
    }
  ) => Promise<Task | undefined>;
  deleteTask: (taskId: string) => Promise<boolean>;
  
  // Jobs
  jobs: Job[];
  isLoadingJobs: boolean;
  refreshJobs: () => Promise<void>;
  createJob: (jobData: {
    title: string;
    company: string;
    description?: string;
    link?: string;
    deadline?: string;
    status?: string;
  }) => Promise<Job | undefined>;
  updateJob: (
    jobId: string,
    jobData: {
      title?: string;
      company?: string;
      description?: string;
      link?: string;
      deadline?: string;
      status?: string;
    }
  ) => Promise<Job | undefined>;
  deleteJob: (jobId: string) => Promise<boolean>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(false);
  
  // Jobs state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);

  // Load initial data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      refreshTasks();
      refreshJobs();
    } else {
      // Clear data when not authenticated
      setTasks([]);
      setJobs([]);
    }
  }, [isAuthenticated]);

  // Tasks methods
  const refreshTasks = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingTasks(true);
      const fetchedTasks = await tasksApi.getAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      Alert.alert('Error', 'Failed to load tasks. Please try again.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const createTask = async (taskData: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: string;
    status?: string;
  }) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingTasks(true);
      const newTask = await tasksApi.createTask({
        ...taskData,
        status: taskData.status || TASK_STATUS.PENDING,
      });
      
      setTasks((prevTasks) => [...prevTasks, newTask]);
      return newTask;
    } catch (error) {
      console.error('Failed to create task:', error);
      Alert.alert('Error', 'Failed to create task. Please try again.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const updateTask = async (
    taskId: string,
    taskData: {
      title?: string;
      description?: string;
      dueDate?: string;
      priority?: string;
      status?: string;
    }
  ) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingTasks(true);
      const updatedTask = await tasksApi.updateTask(taskId, taskData);
      
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === taskId ? updatedTask : task))
      );
      
      return updatedTask;
    } catch (error) {
      console.error('Failed to update task:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    } finally {
      setIsLoadingTasks(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!isAuthenticated) return false;
    
    try {
      setIsLoadingTasks(true);
      await tasksApi.deleteTask(taskId);
      
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      return true;
    } catch (error) {
      console.error('Failed to delete task:', error);
      Alert.alert('Error', 'Failed to delete task. Please try again.');
      return false;
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // Jobs methods
  const refreshJobs = async () => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingJobs(true);
      const fetchedJobs = await jobsApi.getAllJobs();
      setJobs(fetchedJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      Alert.alert('Error', 'Failed to load jobs. Please try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const createJob = async (jobData: {
    title: string;
    company: string;
    description?: string;
    link?: string;
    deadline?: string;
    status?: string;
  }) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingJobs(true);
      const newJob = await jobsApi.createJob({
        ...jobData,
        status: jobData.status || JOB_STATUS.SAVED,
      });
      
      setJobs((prevJobs) => [...prevJobs, newJob]);
      return newJob;
    } catch (error) {
      console.error('Failed to create job:', error);
      Alert.alert('Error', 'Failed to create job. Please try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const updateJob = async (
    jobId: string,
    jobData: {
      title?: string;
      company?: string;
      description?: string;
      link?: string;
      deadline?: string;
      status?: string;
    }
  ) => {
    if (!isAuthenticated) return;
    
    try {
      setIsLoadingJobs(true);
      const updatedJob = await jobsApi.updateJob(jobId, jobData);
      
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === jobId ? updatedJob : job))
      );
      
      return updatedJob;
    } catch (error) {
      console.error('Failed to update job:', error);
      Alert.alert('Error', 'Failed to update job. Please try again.');
    } finally {
      setIsLoadingJobs(false);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!isAuthenticated) return false;
    
    try {
      setIsLoadingJobs(true);
      await jobsApi.deleteJob(jobId);
      
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      return true;
    } catch (error) {
      console.error('Failed to delete job:', error);
      Alert.alert('Error', 'Failed to delete job. Please try again.');
      return false;
    } finally {
      setIsLoadingJobs(false);
    }
  };

  return (
    <DataContext.Provider
      value={{
        // Tasks
        tasks,
        isLoadingTasks,
        refreshTasks,
        createTask,
        updateTask,
        deleteTask,
        
        // Jobs
        jobs,
        isLoadingJobs,
        refreshJobs,
        createJob,
        updateJob,
        deleteJob,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}; 