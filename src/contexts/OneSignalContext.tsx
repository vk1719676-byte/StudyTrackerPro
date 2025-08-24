import React, { createContext, useContext, useEffect, useState } from 'react';
import OneSignalService from '../services/OneSignalService';
import { useAuth } from './AuthContext';

interface OneSignalContextType {
  isInitialized: boolean;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  oneSignalService: OneSignalService;
}

const OneSignalContext = createContext<OneSignalContextType | undefined>(undefined);

export const useOneSignal = () => {
  const context = useContext(OneSignalContext);
  if (context === undefined) {
    throw new Error('useOneSignal must be used within a OneSignalProvider');
  }
  return context;
};

interface OneSignalProviderProps {
  children: React.ReactNode;
  appId: string;
}

export const OneSignalProvider: React.FC<OneSignalProviderProps> = ({ children, appId }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const { user } = useAuth();
  const oneSignalService = OneSignalService.getInstance();

  useEffect(() => {
    const initializeOneSignal = async () => {
      try {
        await oneSignalService.initialize(appId);
        setIsInitialized(true);

        // Check current permission status
        const permission = await checkPermissionStatus();
        setHasPermission(permission);

        // Set user ID if authenticated
        if (user?.email) {
          await oneSignalService.setUserId(user.email);
        }
      } catch (error) {
        console.error('OneSignal initialization failed:', error);
      }
    };

    if (appId) {
      initializeOneSignal();
    }
  }, [appId, user, oneSignalService]);

  const checkPermissionStatus = async (): Promise<boolean> => {
    try {
      return 'Notification' in window && Notification.permission === 'granted';
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      const granted = await oneSignalService.requestPermission();
      setHasPermission(granted);
      return granted;
    } catch (error) {
      console.error('Error requesting permission:', error);
      return false;
    }
  };

  const value: OneSignalContextType = {
    isInitialized,
    hasPermission,
    requestPermission,
    oneSignalService,
  };

  return (
    <OneSignalContext.Provider value={value}>
      {children}
    </OneSignalContext.Provider>
  );
};
