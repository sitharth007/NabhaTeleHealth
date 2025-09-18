import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Filter, User as UserIcon, Calendar, FileText, Phone } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

export default function PatientsScreen() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  if (!user || user.role !== 'doctor') return null;

  const mockPatients = [
    {
      id: '1',
      name: 'Amarjit Kaur',
      age: 38,
      gender: 'Female',
      lastVisit: '2025-01-12',
      condition: 'Diabetes, Hypertension',
      phone: '+919876543211',
    },
    {
      id: '2',
      name: 'Harpreet Singh',
      age: 45,
      gender: 'Male',
      lastVisit: '2025-01-10',
      condition: 'Viral Fever',
      phone: '+919876543212',
    },
  ];

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="My Patients" />
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search patients..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredPatients.map((patient) => (
          <View key={patient.id} style={styles.patientCard}>
            <View style={styles.patientHeader}>
              <View style={styles.avatar}>
                <UserIcon size={24} color="#2563EB" />
              </View>
              <View style={styles.patientInfo}>
                <Text style={styles.patientName}>{patient.name}</Text>
                <Text style={styles.patientMeta}>
                  {patient.age} years • {patient.gender}
                </Text>
                <Text style={styles.patientCondition}>{patient.condition}</Text>
              </View>
            </View>

            <View style={styles.patientDetails}>
              <View style={styles.detailRow}>
                <Calendar size={16} color="#6B7280" />
                <Text style={styles.detailText}>Last visit: {patient.lastVisit}</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.detailText}>{patient.phone}</Text>
              </View>
            </View>

            <View style={styles.patientActions}>
              <TouchableOpacity style={styles.actionButton}>
                <FileText size={16} color="#2563EB" />
                <Text style={styles.actionText}>View Records</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryActionButton}>
                <Calendar size={16} color="#FFFFFF" />
                <Text style={styles.primaryActionText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {filteredPatients.length === 0 && (
          <View style={styles.emptyState}>
            <UserIcon size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No patients found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Your patients will appear here'}
            </Text>
          </View>
        )}
      </ScrollView>
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  patientCard: {
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
  patientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  patientMeta: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  patientCondition: {
    fontSize: 12,
    color: '#059669',
    marginTop: 4,
  },
  patientDetails: {
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
  patientActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    gap: 6,
  },
  actionText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#2563EB',
    borderRadius: 8,
    gap: 6,
  },
  primaryActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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