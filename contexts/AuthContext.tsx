import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  login: (phone: string, otp: string) => Promise<boolean>;
  register: (userData: Partial<User>) => Promise<boolean>;
  logout: () => void;
  sendOtp: (phone: string) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const sendOtp = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, otp: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock user based on phone number for demo
      const mockUser: User = {
        id: '1',
        email: 'demo@nabha.health',
        name: phone === '+919876543210' ? 'Dr. Preet Singh' : 'Amarjit Kaur',
        phone,
        role: phone === '+919876543210' ? 'doctor' : 'patient',
        isVerified: true,
        createdAt: new Date().toISOString(),
        patientProfile: phone !== '+919876543210' ? {
          dateOfBirth: '1985-06-15',
          gender: 'female',
          address: 'Village Nabha, Punjab',
          emergencyContact: '+919876543211',
          bloodGroup: 'B+',
          allergies: ['Penicillin'],
          chronicConditions: ['Diabetes'],
          healthId: 'NBH' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        } : undefined,
        doctorProfile: phone === '+919876543210' ? {
          specialty: 'General Medicine',
          licenseNumber: 'PMC12345',
          experience: 8,
          qualifications: ['MBBS', 'MD General Medicine'],
          consultationFee: 300,
          availability: [
            { day: 'Monday', startTime: '09:00', endTime: '17:00' },
            { day: 'Tuesday', startTime: '09:00', endTime: '17:00' },
          ],
          rating: 4.8,
          isAvailable: true,
        } : undefined,
      };

      setUser(mockUser);
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>): Promise<boolean> => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    } catch (error) {
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      sendOtp,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}