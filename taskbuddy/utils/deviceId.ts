import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@/services/api';

const DEVICE_ID_KEY = 'taskbuddy_device_id';
const USER_DATA_KEY = 'taskbuddy_user_data';

/**
 * Generates a unique device ID or retrieves the existing one from storage
 */
export const getDeviceId = async (): Promise<string> => {
  try {
    // Try to get the existing device ID
    const storedDeviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
    
    if (storedDeviceId) {
      return storedDeviceId;
    }
    
    // Generate a new device ID if none exists
    const newDeviceId = generateDeviceId();
    await AsyncStorage.setItem(DEVICE_ID_KEY, newDeviceId);
    return newDeviceId;
  } catch (error) {
    console.error('Error accessing device ID:', error);
    // Fallback to a new ID if storage fails
    return generateDeviceId();
  }
};

/**
 * Generates a unique device ID
 */
const generateDeviceId = (): string => {
  // Generate a UUID v4
  return uuidv4();
};

/**
 * Clears the stored device ID (for logout)
 */
export const clearDeviceId = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(DEVICE_ID_KEY);
  } catch (error) {
    console.error('Error clearing device ID:', error);
  }
};

/**
 * Stores user data in AsyncStorage
 */
export const storeUserData = async (userData: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Error storing user data:', error);
  }
};

/**
 * Retrieves user data from AsyncStorage
 */
export const getUserData = async (): Promise<User | null> => {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Clears stored user data (for logout)
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}; 