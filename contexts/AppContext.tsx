import React, { createContext, useContext, useState } from 'react';
import { Appointment, HealthRecord, Medicine, PharmacyStock } from '@/types/medical';
import { User } from '@/types/user';
import { mockAppointments, mockHealthRecords, mockMedicines, mockPharmacyStock, mockDoctors } from '@/data/mockData';

interface AppContextType {
  // Appointments
  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  
  // Health Records
  healthRecords: HealthRecord[];
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  
  // Medicines & Stock
  medicines: Medicine[];
  pharmacyStock: PharmacyStock[];
  updateStock: (medicineId: string, newStock: number) => void;
  reserveMedicine: (stockId: string, quantity: number) => boolean;
  
  // Doctors
  doctors: User[];
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'appointment' | 'medicine' | 'health' | 'system';
  isRead: boolean;
  timestamp: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(mockHealthRecords);
  const [medicines] = useState<Medicine[]>(mockMedicines);
  const [pharmacyStock, setPharmacyStock] = useState<PharmacyStock[]>(mockPharmacyStock);
  const [doctors] = useState<User[]>(mockDoctors);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Preet Singh is in 1 hour',
      type: 'appointment',
      isRead: false,
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Medicine Available',
      message: 'Paracetamol is now available at nearby pharmacy',
      type: 'medicine',
      isRead: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: '3',
      title: 'Health Record Updated',
      message: 'New consultation record added to your profile',
      type: 'health',
      isRead: true,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
    },
  ]);

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
    
    // Add notification
    addNotification({
      title: 'Appointment Booked',
      message: `Your appointment with ${appointmentData.doctorName} is confirmed for ${appointmentData.date} at ${appointmentData.time}`,
      type: 'appointment',
      isRead: false,
    });
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === id ? { ...apt, status } : apt
      )
    );

    if (status === 'completed') {
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment) {
        // Auto-generate health record
        addHealthRecord({
          patientId: appointment.patientId,
          doctorId: appointment.doctorId,
          date: new Date().toISOString().split('T')[0],
          type: 'consultation',
          diagnosis: 'Consultation completed',
          symptoms: [appointment.symptoms],
          treatment: 'Treatment plan discussed during consultation',
          notes: appointment.notes || 'Consultation completed successfully',
        });
      }
    }
  };

  const addHealthRecord = (recordData: Omit<HealthRecord, 'id'>) => {
    const newRecord: HealthRecord = {
      ...recordData,
      id: Date.now().toString(),
    };
    setHealthRecords(prev => [...prev, newRecord]);
    
    addNotification({
      title: 'Health Record Added',
      message: 'New medical record has been added to your profile',
      type: 'health',
      isRead: false,
    });
  };

  const updateStock = (medicineId: string, newStock: number) => {
    setPharmacyStock(prev => 
      prev.map(stock => 
        stock.medicineId === medicineId 
          ? { ...stock, currentStock: newStock }
          : stock
      )
    );
  };

  const reserveMedicine = (stockId: string, quantity: number): boolean => {
    const stock = pharmacyStock.find(s => s.id === stockId);
    if (!stock || stock.currentStock < quantity) {
      return false;
    }

    setPharmacyStock(prev => 
      prev.map(s => 
        s.id === stockId 
          ? { ...s, currentStock: s.currentStock - quantity }
          : s
      )
    );

    addNotification({
      title: 'Medicine Reserved',
      message: `${quantity} units of ${stock.medicineName} reserved successfully`,
      type: 'medicine',
      isRead: false,
    });

    return true;
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, isRead: true } : notif
      )
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, isRead: true }))
    );
  };
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <AppContext.Provider value={{
      appointments,
      addAppointment,
      updateAppointmentStatus,
      healthRecords,
      addHealthRecord,
      medicines,
      pharmacyStock,
      updateStock,
      reserveMedicine,
      doctors,
      notifications,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      unreadCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}