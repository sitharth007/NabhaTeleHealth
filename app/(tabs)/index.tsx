import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Video, Phone, MessageCircle, Bot, Calendar, Pill, CircleAlert as AlertCircle, Heart, Activity, Stethoscope } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { QuickActionCard } from '@/components/QuickActionCard';
import { HealthIDCard } from '@/components/HealthIDCard';
import { BookAppointmentModal } from '@/components/BookAppointmentModal';
import { VideoCallModal } from '@/components/VideoCallModal';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { mockDoctors } from '@/data/mockData';

export default function HomeScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { appointments } = useApp();
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = React.useState(false);
  const [showVideoCall, setShowVideoCall] = React.useState(false);
  const [selectedDoctor, setSelectedDoctor] = React.useState(mockDoctors[0]);

  if (!user) return null;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getPatientQuickActions = () => [
    {
      title: t('home.bookConsultation'),
      subtitle: 'Connect with doctors instantly',
      icon: Video,
      color: '#2563EB',
      onPress: () => setShowBookingModal(true),
    },
    {
      title: t('home.emergencyCall'),
      subtitle: 'Get immediate help',
      icon: Phone,
      color: '#EF4444',
      onPress: () => Alert.alert('Emergency', 'Calling emergency services...', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call Now', onPress: () => console.log('Emergency call initiated') }
      ]),
    },
    {
      title: t('home.findMedicine'),
      subtitle: 'Check pharmacy availability',
      icon: Pill,
      color: '#10B981',
      onPress: () => router.push('/medicines'),
    },
    {
      title: 'Find Doctors',
      subtitle: 'Browse available specialists',
      icon: Stethoscope,
      color: '#7C3AED',
      onPress: () => router.push('/(tabs)/doctors'),
    },
    {
      title: t('home.aiAssistant'),
      subtitle: 'Get health guidance 24/7',
      icon: Bot,
      color: '#F59E0B',
      onPress: () => router.push('/ai-assistant'),
    },
  ];

  const getDoctorQuickActions = () => [
    {
      title: 'Today\'s Appointments',
      subtitle: 'View and manage consultations',
      icon: Calendar,
      color: '#2563EB',
      onPress: () => router.push('/appointments'),
    },
    {
      title: 'Patient Records',
      subtitle: 'Access health histories',
      icon: Activity,
      color: '#10B981',
      onPress: () => router.push('/patients'),
    },
    {
      title: 'Chat with Patients',
      subtitle: 'Continue conversations',
      icon: MessageCircle,
      color: '#14B8A6',
      onPress: () => router.push('/chat'),
    },
    {
      title: 'Emergency Cases',
      subtitle: 'Priority consultations',
      icon: AlertCircle,
      color: '#EF4444',
      onPress: () => Alert.alert('Emergency Cases', 'No emergency cases at the moment'),
    },
  ];

  const getPharmacyQuickActions = () => [
    {
      title: 'Stock Management',
      subtitle: 'Update medicine inventory',
      icon: Pill,
      color: '#10B981',
      onPress: () => router.push('/stock'),
    },
    {
      title: 'New Orders',
      subtitle: 'Process prescriptions',
      icon: Calendar,
      color: '#2563EB',
      onPress: () => router.push('/orders'),
    },
    {
      title: 'Low Stock Alerts',
      subtitle: 'Manage inventory alerts',
      icon: AlertCircle,
      color: '#F59E0B',
      onPress: () => Alert.alert('Stock Alerts', 'Check stock management for detailed alerts'),
    },
  ];

  const getQuickActions = () => {
    switch (user.role) {
      case 'doctor':
        return getDoctorQuickActions();
      case 'pharmacy':
        return getPharmacyQuickActions();
      default:
        return getPatientQuickActions();
    }
  };

  const todayAppointments = appointments.filter(apt => 
    apt.date === new Date().toISOString().split('T')[0] && 
    (apt.patientId === user.id || apt.doctorId === user.id)
  );
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Nabha TeleHealth" />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
        </View>

        {user.role === 'patient' && user.patientProfile && (
          <HealthIDCard 
            patientProfile={user.patientProfile}
            patientName={user.name}
          />
        )}

        {todayAppointments.length > 0 && (
          <View style={styles.todaySection}>
            <Text style={styles.sectionTitle}>Today's Appointments</Text>
            {todayAppointments.slice(0, 2).map((appointment) => (
              <View key={appointment.id} style={styles.appointmentPreview}>
                <View style={styles.appointmentInfo}>
                  <Text style={styles.appointmentTime}>{appointment.time}</Text>
                  <Text style={styles.appointmentWith}>
                    {user.role === 'patient' ? appointment.doctorName : appointment.patientName}
                  </Text>
                </View>
                <TouchableOpacity 
                  style={styles.joinButton}
                  onPress={() => setShowVideoCall(true)}
                >
                  <Video size={16} color="#FFFFFF" />
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          {getQuickActions().map((action, index) => (
            <QuickActionCard
              key={index}
              title={action.title}
              subtitle={action.subtitle}
              icon={action.icon}
              color={action.color}
              onPress={action.onPress}
            />
          ))}
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user.role === 'patient' ? todayAppointments.length : 
                 user.role === 'doctor' ? todayAppointments.length : '15'}
              </Text>
              <Text style={styles.statLabel}>
                {user.role === 'patient' ? 'Appointments' : 
                 user.role === 'doctor' ? 'Consultations' : 'Orders'}
              </Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {user.role === 'patient' ? '5' : user.role === 'doctor' ? '24' : '89'}
              </Text>
              <Text style={styles.statLabel}>
                {user.role === 'patient' ? 'Medicines' : 
                 user.role === 'doctor' ? 'Patients' : 'Medicines'}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BookAppointmentModal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        selectedDoctor={selectedDoctor}
      />

      <VideoCallModal
        visible={showVideoCall}
        onClose={() => setShowVideoCall(false)}
        participantName={user.role === 'patient' ? selectedDoctor.name : 'Amarjit Kaur'}
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
  content: {
    flex: 1,
  },
  welcomeSection: {
    padding: 24,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#2563EB',
    marginTop: 8,
  },
  todaySection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  appointmentPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    marginBottom: 8,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentTime: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  appointmentWith: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 4,
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsSection: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});