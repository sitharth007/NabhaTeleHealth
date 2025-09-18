import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Filter, Calendar } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { AppointmentCard } from '@/components/AppointmentCard';
import { BookAppointmentModal } from '@/components/BookAppointmentModal';
import { VideoCallModal } from '@/components/VideoCallModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { mockDoctors } from '@/data/mockData';

export default function AppointmentsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { appointments, updateAppointmentStatus } = useApp();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  if (!user) return null;

  const userAppointments = appointments.filter(appointment => 
    appointment.patientId === user.id || appointment.doctorId === user.id
  );

  const filteredAppointments = userAppointments.filter(appointment => {
    if (filter === 'upcoming') {
      return appointment.status === 'scheduled' || appointment.status === 'in-progress';
    }
    if (filter === 'completed') {
      return appointment.status === 'completed';
    }
    return true;
  });

  const filterOptions = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'completed', label: 'Completed' },
    { key: 'all', label: 'All' },
  ];

  const handleJoinCall = (appointment: any) => {
    setSelectedAppointment(appointment);
    updateAppointmentStatus(appointment.id, 'in-progress');
    setShowVideoCall(true);
  };

  const handleEndCall = () => {
    if (selectedAppointment) {
      updateAppointmentStatus(selectedAppointment.id, 'completed');
    }
    setShowVideoCall(false);
    setSelectedAppointment(null);
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('nav.appointments')} />
      
      <View style={styles.actionBar}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
        >
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.filterButton,
                filter === option.key && styles.activeFilterButton,
              ]}
              onPress={() => setFilter(option.key as any)}
            >
              <Text style={[
                styles.filterText,
                filter === option.key && styles.activeFilterText,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {user.role === 'patient' && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowBookingModal(true)}
          >
            <Plus size={20} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              userRole={user.role as 'patient' | 'doctor'}
              onJoinCall={() => handleJoinCall(appointment)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No appointments found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'upcoming' ? 'You have no upcoming appointments' : 'No appointments match your filter'}
            </Text>
          </View>
        )}
      </ScrollView>

      <BookAppointmentModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDoctor={mockDoctors[0]}
      />

      <VideoCallModal
        visible={showVideoCall}
        onClose={handleEndCall}
        participantName={
          selectedAppointment 
            ? (user.role === 'patient' ? selectedAppointment.doctorName : selectedAppointment.patientName)
            : 'Participant'
        }
        isDoctor={user.role === 'doctor'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  filterContainer: {
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#2563EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
  },
});