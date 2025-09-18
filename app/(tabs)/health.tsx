import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Plus, Download, Filter } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { HealthRecordCard } from '@/components/HealthRecordCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { mockHealthRecords } from '@/data/mockData';

export default function HealthRecordsScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'consultation' | 'test' | 'vaccination'>('all');

  if (!user) return null;

  const filteredRecords = mockHealthRecords.filter(record => {
    if (filter === 'all') return true;
    return record.type === filter;
  });

  const filterOptions = [
    { key: 'all', label: 'All Records' },
    { key: 'consultation', label: 'Consultations' },
    { key: 'test', label: 'Tests' },
    { key: 'vaccination', label: 'Vaccinations' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('nav.health')} />
      
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

        <TouchableOpacity style={styles.downloadButton}>
          <Download size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {user.patientProfile && (
        <View style={styles.healthIdSection}>
          <Text style={styles.healthIdLabel}>Your Health ID:</Text>
          <Text style={styles.healthIdValue}>{user.patientProfile.healthId}</Text>
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <HealthRecordCard
              key={record.id}
              record={record}
              onDownload={() => {
                console.log('Downloading record:', record.id);
              }}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No health records found</Text>
            <Text style={styles.emptySubtitle}>
              Your medical history will appear here after consultations
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
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthIdSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  healthIdLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  healthIdValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563EB',
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