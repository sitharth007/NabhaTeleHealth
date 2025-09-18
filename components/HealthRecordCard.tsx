import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FileText, Download, Calendar } from 'lucide-react-native';
import { HealthRecord } from '@/types/medical';

interface HealthRecordCardProps {
  record: HealthRecord;
  onDownload?: () => void;
}

export function HealthRecordCard({ record, onDownload }: HealthRecordCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation':
        return '#2563EB';
      case 'test':
        return '#059669';
      case 'vaccination':
        return '#7C3AED';
      case 'surgery':
        return '#DC2626';
      default:
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.typeSection}>
          <View style={[styles.typeIcon, { backgroundColor: getTypeColor(record.type) + '20' }]}>
            <FileText size={20} color={getTypeColor(record.type)} />
          </View>
          <View>
            <Text style={styles.type}>
              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
            </Text>
            <View style={styles.dateRow}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.date}>{record.date}</Text>
            </View>
          </View>
        </View>
        
        {onDownload && (
          <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
            <Download size={20} color="#2563EB" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.diagnosis}>{record.diagnosis}</Text>
      
      {record.symptoms.length > 0 && (
        <View style={styles.symptomsSection}>
          <Text style={styles.sectionTitle}>Symptoms:</Text>
          <Text style={styles.symptoms}>
            {record.symptoms.join(', ')}
          </Text>
        </View>
      )}

      <View style={styles.treatmentSection}>
        <Text style={styles.sectionTitle}>Treatment:</Text>
        <Text style={styles.treatment}>{record.treatment}</Text>
      </View>

      {record.notes && (
        <View style={styles.notesSection}>
          <Text style={styles.sectionTitle}>Notes:</Text>
          <Text style={styles.notes}>{record.notes}</Text>
        </View>
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
  typeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  typeIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
  downloadButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  diagnosis: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  symptomsSection: {
    marginBottom: 12,
  },
  treatmentSection: {
    marginBottom: 12,
  },
  notesSection: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  symptoms: {
    fontSize: 14,
    color: '#6B7280',
  },
  treatment: {
    fontSize: 14,
    color: '#6B7280',
  },
  notes: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});