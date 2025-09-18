import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { User as UserIcon, Star, Clock, Video } from 'lucide-react-native';
import { User } from '@/types/user';

interface DoctorCardProps {
  doctor: User;
  onBookAppointment: () => void;
}

export function DoctorCard({ doctor, onBookAppointment }: DoctorCardProps) {
  const profile = doctor.doctorProfile!;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <UserIcon size={24} color="#2563EB" />
        </View>
        <View style={styles.doctorInfo}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.specialty}>{profile.specialty}</Text>
          <View style={styles.ratingRow}>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.rating}>{profile.rating}</Text>
            <Text style={styles.experience}>• {profile.experience} years exp</Text>
          </View>
        </View>
        
        <View style={[styles.statusDot, { 
          backgroundColor: profile.isAvailable ? '#10B981' : '#6B7280' 
        }]} />
      </View>

      <View style={styles.qualifications}>
        <Text style={styles.qualificationsText}>
          {profile.qualifications.join(', ')}
        </Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.feeSection}>
          <Text style={styles.fee}>₹{profile.consultationFee}</Text>
          <Text style={styles.feeLabel}>Consultation Fee</Text>
        </View>

        <TouchableOpacity 
          style={[styles.bookButton, { 
            backgroundColor: profile.isAvailable ? '#2563EB' : '#9CA3AF' 
          }]}
          onPress={onBookAppointment}
          disabled={!profile.isAvailable}
        >
          <Video size={16} color="#FFFFFF" />
          <Text style={styles.bookButtonText}>
            {profile.isAvailable ? 'Book Now' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  experience: {
    fontSize: 12,
    color: '#6B7280',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  qualifications: {
    marginBottom: 12,
  },
  qualificationsText: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  feeSection: {
    alignItems: 'flex-start',
  },
  fee: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  feeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});