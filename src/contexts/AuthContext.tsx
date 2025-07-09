
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  hasFaceData: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithFace: (faceData: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored user data on app load
    const storedUser = localStorage.getItem('faceSecureUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user data - in real app, this would come from backend
      const userData: User = {
        id: '1',
        email,
        name: 'Demo User',
        hasFaceData: Math.random() > 0.5 // Random for demo
      };
      
      setUser(userData);
      localStorage.setItem('faceSecureUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithFace = async (faceData: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate face recognition API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful face recognition (80% success rate for demo)
      const success = Math.random() > 0.2;
      
      if (success) {
        const userData: User = {
          id: '1',
          email: 'demo@facesecure.com',
          name: 'Demo User',
          hasFaceData: true
        };
        
        setUser(userData);
        localStorage.setItem('faceSecureUser', JSON.stringify(userData));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Face login failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData: User = {
        id: Date.now().toString(),
        email,
        name,
        hasFaceData: false
      };
      
      setUser(userData);
      localStorage.setItem('faceSecureUser', JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Signup failed:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('faceSecureUser');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      loginWithFace,
      signup,
      logout,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};
