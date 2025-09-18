import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Plus, Trash2, X, Pill } from 'lucide-react-native';
import { Medicine } from '@/types/medical';

interface PrescriptionModalProps {
  visible: boolean;
  onClose: () => void;
  patientName: string;
  onSavePrescription: (medicines: Medicine[], instructions: string) => void;
}

export function PrescriptionModal({ visible, onClose, patientName, onSavePrescription }: PrescriptionModalProps) {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [generalInstructions, setGeneralInstructions] = useState('');

  const addMedicine = () => {
    const newMedicine: Medicine = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      price: 0,
    };
    setMedicines([...medicines, newMedicine]);
  };

  const updateMedicine = (id: string, field: keyof Medicine, value: string | number) => {
    setMedicines(medicines.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const removeMedicine = (id: string) => {
    setMedicines(medicines.filter(med => med.id !== id));
  };

  const handleSave = () => {
    const validMedicines = medicines.filter(med => 
      med.name.trim() && med.dosage.trim() && med.frequency.trim()
    );

    if (validMedicines.length === 0) {
      Alert.alert('Error', 'Please add at least one medicine');
      return;
    }

    onSavePrescription(validMedicines, generalInstructions);
    Alert.alert('Success', 'Prescription saved successfully');
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setMedicines([]);
    setGeneralInstructions('');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Write Prescription</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.patientInfo}>
            <Text style={styles.patientLabel}>Patient:</Text>
            <Text style={styles.patientName}>{patientName}</Text>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Medicines</Text>
                <TouchableOpacity style={styles.addButton} onPress={addMedicine}>
                  <Plus size={20} color="#FFFFFF" />
                  <Text style={styles.addButtonText}>Add Medicine</Text>
                </TouchableOpacity>
              </View>

              {medicines.map((medicine, index) => (
                <View key={medicine.id} style={styles.medicineCard}>
                  <View style={styles.medicineHeader}>
                    <Pill size={20} color="#2563EB" />
                    <Text style={styles.medicineNumber}>Medicine {index + 1}</Text>
                    <TouchableOpacity 
                      onPress={() => removeMedicine(medicine.id)}
                      style={styles.removeButton}
                    >
                      <Trash2 size={16} color="#EF4444" />
                    </TouchableOpacity>
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Medicine name"
                    value={medicine.name}
                    onChangeText={(text) => updateMedicine(medicine.id, 'name', text)}
                  />

                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Dosage (e.g., 500mg)"
                      value={medicine.dosage}
                      onChangeText={(text) => updateMedicine(medicine.id, 'dosage', text)}
                    />
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Frequency"
                      value={medicine.frequency}
                      onChangeText={(text) => updateMedicine(medicine.id, 'frequency', text)}
                    />
                  </View>

                  <View style={styles.inputRow}>
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Duration"
                      value={medicine.duration}
                      onChangeText={(text) => updateMedicine(medicine.id, 'duration', text)}
                    />
                    <TextInput
                      style={[styles.input, styles.halfInput]}
                      placeholder="Price (₹)"
                      value={medicine.price.toString()}
                      onChangeText={(text) => updateMedicine(medicine.id, 'price', parseInt(text) || 0)}
                      keyboardType="numeric"
                    />
                  </View>

                  <TextInput
                    style={styles.input}
                    placeholder="Special instructions"
                    value={medicine.instructions}
                    onChangeText={(text) => updateMedicine(medicine.id, 'instructions', text)}
                  />
                </View>
              ))}

              {medicines.length === 0 && (
                <View style={styles.emptyState}>
                  <Pill size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No medicines added yet</Text>
                  <TouchableOpacity style={styles.firstAddButton} onPress={addMedicine}>
                    <Text style={styles.firstAddButtonText}>Add First Medicine</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>General Instructions</Text>
              <TextInput
                style={styles.instructionsInput}
                placeholder="General instructions for the patient..."
                value={generalInstructions}
                onChangeText={setGeneralInstructions}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                medicines.length === 0 && styles.saveButtonDisabled,
              ]}
              onPress={handleSave}
              disabled={medicines.length === 0}
            >
              <Text style={styles.saveButtonText}>Save Prescription</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 8,
  },
  patientLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  medicineCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  medicineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  medicineNumber: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  removeButton: {
    padding: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfInput: {
    flex: 1,
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  firstAddButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  firstAddButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});