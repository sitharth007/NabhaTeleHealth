import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { QrCode, Download, Share } from 'lucide-react-native';
import { PatientProfile } from '@/types/user';

interface HealthIDCardProps {
  patientProfile: PatientProfile;
  patientName: string;
}

export function HealthIDCard({ patientProfile, patientName }: HealthIDCardProps) {
  const handleDownloadCard = () => {
    console.log('Downloading Health ID card');
  };

  const handleShareCard = () => {
    console.log('Sharing Health ID card');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleSection}>
          <Text style={styles.title}>Digital Health ID</Text>
          <Text style={styles.subtitle}>Government of India</Text>
        </View>
        <View style={styles.qrSection}>
          <QrCode size={60} color="#2563EB" />
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.idSection}>
          <Text style={styles.idLabel}>Health ID</Text>
          <Text style={styles.idNumber}>{patientProfile.healthId}</Text>
        </View>

        <View style={styles.patientInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name:</Text>
            <Text style={styles.infoValue}>{patientName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>DOB:</Text>
            <Text style={styles.infoValue}>{patientProfile.dateOfBirth}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{patientProfile.gender}</Text>
          </View>
          {patientProfile.bloodGroup && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Blood Group:</Text>
              <Text style={styles.infoValue}>{patientProfile.bloodGroup}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownloadCard}>
          <Download size={16} color="#2563EB" />
          <Text style={styles.actionText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShareCard}>
          <Share size={16} color="#2563EB" />
          <Text style={styles.actionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  qrSection: {
    padding: 8,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
  },
  content: {
    marginBottom: 20,
  },
  idSection: {
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
  },
  idLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
    letterSpacing: 2,
  },
  patientInfo: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
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
    fontWeight: '600',
  },
});