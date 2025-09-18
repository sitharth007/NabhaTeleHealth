import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar, Clock, Video, Phone, MessageCircle } from 'lucide-react-native';
import { Appointment } from '@/types/medical';

interface AppointmentCardProps {
  appointment: Appointment;
  onJoinCall?: () => void;
  userRole: 'patient' | 'doctor';
}

export function AppointmentCard({ appointment, onJoinCall, userRole }: AppointmentCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#2563EB';
      case 'in-progress':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={20} color="#2563EB" />;
      case 'voice':
        return <Phone size={20} color="#2563EB" />;
      case 'chat':
        return <MessageCircle size={20} color="#2563EB" />;
      default:
        return <Video size={20} color="#2563EB" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>
            {userRole === 'patient' ? appointment.doctorName : appointment.patientName}
          </Text>
          <Text style={styles.role}>
            {userRole === 'patient' ? 'Doctor' : 'Patient'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(appointment.status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(appointment.status) }]}>
            {appointment.status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Calendar size={16} color="#6B7280" />
          <Text style={styles.detailText}>{appointment.date}</Text>
        </View>
        <View style={styles.detailRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.detailText}>{appointment.time}</Text>
        </View>
        <View style={styles.detailRow}>
          {getTypeIcon(appointment.type)}
          <Text style={styles.detailText}>
            {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)} Consultation
          </Text>
        </View>
      </View>

      <Text style={styles.symptoms}>{appointment.symptoms}</Text>

      {appointment.status === 'scheduled' && onJoinCall && (
        <TouchableOpacity style={styles.joinButton} onPress={onJoinCall}>
          <Video size={20} color="#FFFFFF" />
          <Text style={styles.joinButtonText}>Join Consultation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  role: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#4B5563',
  },
  symptoms: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});