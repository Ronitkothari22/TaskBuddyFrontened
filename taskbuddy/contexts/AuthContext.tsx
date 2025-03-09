import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { authApi, User } from '@/services/api';
import { getDeviceId, clearDeviceId, storeUserData, getUserData, clearUserData } from '@/utils/deviceId';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, name: string) => Promise<void>;
  authenticate: () => Promise<User | void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLocalAuthComplete, setIsLocalAuthComplete] = useState(false);

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        
        // First try to load cached user data
        const cachedUser = await getUserData();
        
        if (cachedUser) {
          setUser(cachedUser);
          console.log('Found cached user, requiring local auth');
          // Don't set isLoading to false here - wait for local auth
          router.replace('/(auth)/auth');
          return;
        }
        
        // If no cached data, user needs to sign up
        console.log('No cached user, redirecting to signup');
        router.replace('/(auth)/signup');
      } catch (error) {
        console.log('Auth check failed - user needs to sign up');
        router.replace('/(auth)/signup');
      } finally {
        setIsLoading(false);
      }
    };

    // Execute the auth check
    checkAuth();
  }, []);

  const signUp = async (email: string, name: string) => {
    try {
      setIsLoading(true);
      
      const newUser = await authApi.signup(email, name);
      setUser(newUser);
      
      // Save user data for offline use
      await storeUserData(newUser);
      
      // After signup, redirect to local auth setup
      router.replace('/(auth)/auth');
    } catch (error: any) {
      console.error('Sign up failed:', error);
      Alert.alert('Sign Up Failed', 'Could not create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      
      // Check if we have cached user data first
      const cachedUser = await getUserData();
      if (cachedUser) {
        setUser(cachedUser);
        setIsLocalAuthComplete(true);
        return cachedUser;
      }
      
      // If no cached user, try to authenticate with the server
      const authenticatedUser = await authApi.authenticate();
      setUser(authenticatedUser);
      
      // Save user data for offline use
      await storeUserData(authenticatedUser);
      setIsLocalAuthComplete(true);
      
      return authenticatedUser;
    } catch (error: any) {
      if (error.message === 'User not found') {
        // Clear any stale data and redirect to signup
        await clearDeviceId();
        await clearUserData();
        setUser(null);
        router.replace('/(auth)/signup');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearDeviceId();
      await clearUserData();
      setUser(null);
      setIsLocalAuthComplete(false);
      router.replace('/(auth)/signup');
    } catch (error) {
      console.error('Logout failed:', error);
      Alert.alert('Logout Failed', 'Could not log out. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user && isLocalAuthComplete,
        signUp,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 