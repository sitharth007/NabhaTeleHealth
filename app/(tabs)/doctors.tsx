import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, SlidersHorizontal as Filter, Star } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { DoctorCard } from '@/components/DoctorCard';
import { BookAppointmentModal } from '@/components/BookAppointmentModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockDoctors } from '@/data/mockData';
import { User } from '@/types/user';

export default function DoctorsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);

  if (!user) return null;

  const specialties = ['All', 'General', 'Pediatrics', 'Cardiology'];
  
  const filteredDoctors = mockDoctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.doctorProfile?.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSpecialty = specialtyFilter === 'All' || 
                           doctor.doctorProfile?.specialty === specialtyFilter;
    
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor: User) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      'Emergency Call',
      'This will connect you to our 24/7 emergency helpline',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => console.log('Emergency call initiated') }
      ]
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('nav.doctors')} />
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search doctors..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.specialtyContainer}
      >
        {specialties.map((specialty) => (
          <TouchableOpacity
            key={specialty}
            style={[
              styles.specialtyButton,
              specialtyFilter === specialty && styles.activeSpecialtyButton,
            ]}
            onPress={() => setSpecialtyFilter(specialty)}
          >
            <Text style={[
              styles.specialtyText,
              specialtyFilter === specialty && styles.activeSpecialtyText,
            ]}>
              {specialty}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            doctor={doctor}
            onBookAppointment={() => handleBookAppointment(doctor)}
          />
        ))}

        {filteredDoctors.length === 0 && (
          <View style={styles.emptyState}>
            <Star size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No doctors found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need Emergency Care?</Text>
          <Text style={styles.helpText}>
            Call our 24/7 emergency helpline for immediate medical assistance
          </Text>
          <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyCall}>
            <Text style={styles.emergencyButtonText}>Emergency Call</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BookAppointmentModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDoctor={selectedDoctor}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialtyContainer: {
   maxHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  specialtyButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 4,
  },
  activeSpecialtyButton: {
    backgroundColor: '#2563EB',
  },
  specialtyText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeSpecialtyText: {
    color: '#FFFFFF',
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
  helpSection: {
    backgroundColor: '#FEF2F2',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#7F1D1D',
    marginBottom: 12,
  },
  emergencyButton: {
    backgroundColor: '#EF4444',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});