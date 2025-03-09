import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { authApi, User } from '@/services/api';
import { getDeviceId, clearDeviceId } from '@/utils/deviceId';

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

  // Check for existing authentication on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if we have a device ID
        const deviceId = await getDeviceId();
        if (deviceId) {
          // Try to authenticate with the device ID
          await authenticate();
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signUp = async (email: string, name: string) => {
    try {
      setIsLoading(true);
      const newUser = await authApi.signup(email, name);
      setUser(newUser);
      router.replace('/(app)/home');
    } catch (error) {
      console.error('Sign up failed:', error);
      Alert.alert('Sign Up Failed', 'Could not create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async () => {
    try {
      setIsLoading(true);
      const authenticatedUser = await authApi.authenticate();
      setUser(authenticatedUser);
      return authenticatedUser;
    } catch (error) {
      console.error('Authentication failed:', error);
      // Clear any existing device ID if authentication fails
      await clearDeviceId();
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearDeviceId();
      setUser(null);
      router.replace('/');
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
        isAuthenticated: !!user,
        signUp,
        authenticate,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 