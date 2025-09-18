import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert } from 'react-native';
import { Calendar, Clock, Video, Phone, MessageCircle, X, User as UserIcon, CreditCard, MapPin, Star } from 'lucide-react-native';
import { User } from '@/types/user';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/contexts/AuthContext';

interface BookAppointmentModalProps {
  visible: boolean;
  onClose: () => void;
  selectedDoctor: User | null;
}

export function BookAppointmentModal({ visible, onClose, selectedDoctor }: BookAppointmentModalProps) {
  const { user } = useAuth();
  const { addAppointment } = useApp();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [consultationType, setConsultationType] = useState<'video' | 'voice' | 'chat'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cash' | 'insurance'>('online');
  const [notes, setNotes] = useState('');

  const timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30'
  ];

  const consultationTypes = [
    { type: 'video' as const, icon: Video, label: 'Video Call', price: 300, description: 'HD video consultation with screen sharing' },
    { type: 'voice' as const, icon: Phone, label: 'Voice Call', price: 250, description: 'Audio-only consultation for privacy' },
    { type: 'chat' as const, icon: MessageCircle, label: 'Chat Only', price: 200, description: 'Text-based consultation with file sharing' },
  ];

  const urgencyLevels = [
    { level: 'routine', label: 'Routine', color: '#10B981', description: 'Regular check-up or follow-up' },
    { level: 'urgent', label: 'Urgent', color: '#F59E0B', description: 'Needs attention within 24 hours' },
    { level: 'emergency', label: 'Emergency', color: '#EF4444', description: 'Immediate medical attention required' },
  ];

  const paymentMethods = [
    { method: 'online', label: 'Online Payment', description: 'Pay securely with card/UPI' },
    { method: 'cash', label: 'Cash Payment', description: 'Pay at the time of consultation' },
    { method: 'insurance', label: 'Insurance', description: 'Use health insurance coverage' },
  ];

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !symptoms.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    const selectedConsultation = consultationTypes.find(t => t.type === consultationType);
    const appointmentData = {
      patientId: user!.id,
      doctorId: selectedDoctor.id,
      patientName: user!.name,
      doctorName: selectedDoctor.name,
      date: selectedDate,
      time: selectedTime,
      type: consultationType,
      status: 'scheduled' as const,
      symptoms: symptoms.trim(),
      notes: `${consultationType} consultation - ${urgencyLevel} priority. Payment: ${paymentMethod}. ${notes}`,
    };

    addAppointment(appointmentData);
    
    Alert.alert(
      'Appointment Booked Successfully!',
      `Your ${selectedConsultation?.label} appointment with ${selectedDoctor.name} is confirmed for ${selectedDate} at ${selectedTime}.\n\nTotal: ₹${selectedConsultation?.price}\nPayment: ${paymentMethod}`,
      [
        { text: 'OK', onPress: () => {
          onClose();
          resetForm();
        }}
      ]
    );
  };

  const resetForm = () => {
    setSelectedDate('');
    setSelectedTime('');
    setConsultationType('video');
    setSymptoms('');
    setUrgencyLevel('routine');
    setPaymentMethod('online');
    setNotes('');
  };

  const generateDateOptions = () => {
    const dates = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const selectedConsultation = consultationTypes.find(t => t.type === consultationType);
  const selectedUrgency = urgencyLevels.find(u => u.level === urgencyLevel);

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
            <Text style={styles.modalTitle}>Book Appointment</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {selectedDoctor && (
              <View style={styles.doctorSection}>
                <View style={styles.doctorInfo}>
                  <View style={styles.doctorAvatar}>
                    <UserIcon size={24} color="#2563EB" />
                  </View>
                  <View style={styles.doctorDetails}>
                    <Text style={styles.doctorName}>{selectedDoctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>
                      {selectedDoctor.doctorProfile?.specialty}
                    </Text>
                    <View style={styles.doctorMeta}>
                      <Star size={14} color="#F59E0B" fill="#F59E0B" />
                      <Text style={styles.doctorRating}>
                        {selectedDoctor.doctorProfile?.rating} • {selectedDoctor.doctorProfile?.experience} years
                      </Text>
                    </View>
                  </View>
                  <View style={styles.doctorFee}>
                    <Text style={styles.feeAmount}>₹{selectedDoctor.doctorProfile?.consultationFee}</Text>
                    <Text style={styles.feeLabel}>Base Fee</Text>
                  </View>
                </View>
              </View>
            )}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Urgency Level</Text>
              <View style={styles.urgencyLevels}>
                {urgencyLevels.map((level) => (
                  <TouchableOpacity
                    key={level.level}
                    style={[
                      styles.urgencyOption,
                      urgencyLevel === level.level && { borderColor: level.color, backgroundColor: level.color + '10' },
                    ]}
                    onPress={() => setUrgencyLevel(level.level as any)}
                  >
                    <View style={[styles.urgencyDot, { backgroundColor: level.color }]} />
                    <View style={styles.urgencyText}>
                      <Text style={[
                        styles.urgencyLabel,
                        urgencyLevel === level.level && { color: level.color, fontWeight: '600' },
                      ]}>
                        {level.label}
                      </Text>
                      <Text style={styles.urgencyDescription}>{level.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Consultation Type</Text>
              <View style={styles.consultationTypes}>
                {consultationTypes.map((type) => (
                  <TouchableOpacity
                    key={type.type}
                    style={[
                      styles.consultationOption,
                      consultationType === type.type && styles.selectedConsultationOption,
                    ]}
                    onPress={() => setConsultationType(type.type)}
                  >
                    <type.icon size={20} color={consultationType === type.type ? '#FFFFFF' : '#6B7280'} />
                    <View style={styles.consultationText}>
                      <Text style={[
                        styles.consultationLabel,
                        consultationType === type.type && styles.selectedConsultationLabel,
                      ]}>
                        {type.label}
                      </Text>
                      <Text style={[
                        styles.consultationDescription,
                        consultationType === type.type && styles.selectedConsultationDescription,
                      ]}>
                        {type.description}
                      </Text>
                    </View>
                    <Text style={[
                      styles.consultationPrice,
                      consultationType === type.type && styles.selectedConsultationPrice,
                    ]}>
                      ₹{type.price}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
                {generateDateOptions().map((date) => (
                  <TouchableOpacity
                    key={date}
                    style={[
                      styles.dateOption,
                      selectedDate === date && styles.selectedDateOption,
                    ]}
                    onPress={() => setSelectedDate(date)}
                  >
                    <Text style={[
                      styles.dateText,
                      selectedDate === date && styles.selectedDateText,
                    ]}>
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </Text>
                    <Text style={[
                      styles.dayText,
                      selectedDate === date && styles.selectedDayText,
                    ]}>
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Available Time Slots</Text>
              <View style={styles.timeGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeOption,
                      selectedTime === time && styles.selectedTimeOption,
                    ]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Clock size={14} color={selectedTime === time ? '#FFFFFF' : '#6B7280'} />
                    <Text style={[
                      styles.timeText,
                      selectedTime === time && styles.selectedTimeText,
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Describe Your Symptoms *</Text>
              <TextInput
                style={styles.symptomsInput}
                placeholder="Please describe your symptoms, medical history, and reason for consultation in detail..."
                value={symptoms}
                onChangeText={setSymptoms}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Notes (Optional)</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Any additional information or special requests..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={2}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Method</Text>
              <View style={styles.paymentMethods}>
                {paymentMethods.map((method) => (
                  <TouchableOpacity
                    key={method.method}
                    style={[
                      styles.paymentOption,
                      paymentMethod === method.method && styles.selectedPaymentOption,
                    ]}
                    onPress={() => setPaymentMethod(method.method as any)}
                  >
                    <CreditCard size={20} color={paymentMethod === method.method ? '#2563EB' : '#6B7280'} />
                    <View style={styles.paymentText}>
                      <Text style={[
                        styles.paymentLabel,
                        paymentMethod === method.method && styles.selectedPaymentLabel,
                      ]}>
                        {method.label}
                      </Text>
                      <Text style={styles.paymentDescription}>{method.description}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Consultation Type:</Text>
                <Text style={styles.summaryValue}>{selectedConsultation?.label}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Date & Time:</Text>
                <Text style={styles.summaryValue}>{selectedDate} at {selectedTime}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Urgency:</Text>
                <Text style={[styles.summaryValue, { color: selectedUrgency?.color }]}>
                  {selectedUrgency?.label}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Payment:</Text>
                <Text style={styles.summaryValue}>{paymentMethods.find(p => p.method === paymentMethod)?.label}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Amount:</Text>
                <Text style={styles.totalValue}>₹{selectedConsultation?.price}</Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.bookButton,
                (!selectedDate || !selectedTime || !symptoms.trim()) && styles.bookButtonDisabled,
              ]}
              onPress={handleBookAppointment}
              disabled={!selectedDate || !selectedTime || !symptoms.trim()}
            >
              <Text style={styles.bookButtonText}>
                Confirm Booking - ₹{selectedConsultation?.price}
              </Text>
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
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%',
    width: '100%',
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
  modalContent: {
    
    padding: 20,
  },
  doctorSection: {
    marginBottom: 24,
  },
  doctorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  doctorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  doctorRating: {
    fontSize: 12,
    color: '#6B7280',
  },
  doctorFee: {
    alignItems: 'flex-end',
  },
  feeAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  feeLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  urgencyLevels: {
    gap: 8,
  },
  urgencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    gap: 12,
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  urgencyText: {
    flex: 1,
  },
  urgencyLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  urgencyDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  consultationTypes: {
    gap: 8,
  },
  consultationOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    gap: 12,
  },
  selectedConsultationOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  consultationText: {
    flex: 1,
  },
  consultationLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedConsultationLabel: {
    color: '#FFFFFF',
  },
  consultationDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedConsultationDescription: {
    color: '#DBEAFE',
  },
  consultationPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  selectedConsultationPrice: {
    color: '#FFFFFF',
  },
  dateScroll: {
    marginBottom: 8,
  },
  dateOption: {
    alignItems: 'center',
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    minWidth: 80,
  },
  selectedDateOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  dayText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedDayText: {
    color: '#DBEAFE',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    minWidth: 80,
    gap: 4,
  },
  selectedTimeOption: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedTimeText: {
    color: '#FFFFFF',
  },
  symptomsInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 100,
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#1F2937',
    minHeight: 60,
  },
  paymentMethods: {
    gap: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    gap: 12,
  },
  selectedPaymentOption: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  paymentText: {
    flex: 1,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedPaymentLabel: {
    color: '#2563EB',
  },
  paymentDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  summarySection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 8,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#059669',
  },
  bookButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});