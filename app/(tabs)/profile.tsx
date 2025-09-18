import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { User as UserIcon, Mail, Phone, MapPin, Calendar, Heart, Shield, Settings, LogOut, CreditCard as Edit, Star, Award, X, Save, Lock, Eye, EyeOff, Bell, Globe, Smartphone, Wifi } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showAppSettings, setShowAppSettings] = React.useState(false);
  const [showPrivacySettings, setShowPrivacySettings] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [appSettings, setAppSettings] = React.useState({
    notifications: true,
    autoSync: true,
    dataUsage: 'medium',
    theme: 'system',
  });
  const [privacySettings, setPrivacySettings] = React.useState({
    shareData: false,
    analytics: true,
    locationTracking: false,
    biometricAuth: false,
  });

  if (!user) return null;

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            logout();
            router.replace('/(auth)/login');
          }
        },
      ]
    );
  };

  const languageOptions = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  ];

  const handleSaveProfile = () => {
    Alert.alert('Profile Updated', 'Your profile has been updated successfully');
    setShowEditModal(false);
  };

  const handleSaveAppSettings = () => {
    Alert.alert('Settings Saved', 'Your app settings have been updated');
    setShowAppSettings(false);
  };

  const handleSavePrivacySettings = () => {
    Alert.alert('Privacy Settings Updated', 'Your privacy preferences have been saved');
    setShowPrivacySettings(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('nav.profile')} showNotifications={false} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <UserIcon size={40} color="#2563EB" />
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userRole}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Text>
          {user.isVerified && (
            <View style={styles.verifiedBadge}>
              <Shield size={16} color="#10B981" />
              <Text style={styles.verifiedText}>Verified Account</Text>
            </View>
          )}
        </View>

        {/* Basic Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <View style={styles.infoRow}>
            <Mail size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user.phone}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.editButton}>
            <Edit size={16} color="#2563EB" />
            <Text style={styles.editButtonText} onPress={() => setShowEditModal(true)}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Role-specific Information */}
        {user.patientProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            
            <View style={styles.infoRow}>
              <Heart size={20} color="#EF4444" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Health ID</Text>
                <Text style={styles.infoValue}>{user.patientProfile.healthId}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{user.patientProfile.dateOfBirth}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <MapPin size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Address</Text>
                <Text style={styles.infoValue}>{user.patientProfile.address}</Text>
              </View>
            </View>

            {user.patientProfile.bloodGroup && (
              <View style={styles.infoRow}>
                <Heart size={20} color="#EF4444" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Blood Group</Text>
                  <Text style={styles.infoValue}>{user.patientProfile.bloodGroup}</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {user.doctorProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Doctor Information</Text>
            
            <View style={styles.infoRow}>
              <Award size={20} color="#7C3AED" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Specialty</Text>
                <Text style={styles.infoValue}>{user.doctorProfile.specialty}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Star size={20} color="#F59E0B" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Rating</Text>
                <Text style={styles.infoValue}>{user.doctorProfile.rating}/5.0</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <Calendar size={20} color="#6B7280" />
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Experience</Text>
                <Text style={styles.infoValue}>{user.doctorProfile.experience} years</Text>
              </View>
            </View>
          </View>
        )}

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language Preferences</Text>
          
          {languageOptions.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageOption,
                language === lang.code && styles.activeLanguageOption,
              ]}
              onPress={() => setLanguage(lang.code as any)}
            >
              <Text style={[
                styles.languageText,
                language === lang.code && styles.activeLanguageText,
              ]}>
                {lang.nativeName} ({lang.name})
              </Text>
              {language === lang.code && (
                <View style={styles.activeDot} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingRow} onPress={() => setShowAppSettings(true)}>
            <Settings size={20} color="#6B7280" />
            <Text style={styles.settingText}>App Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingRow} onPress={() => setShowPrivacySettings(true)}>
            <Shield size={20} color="#6B7280" />
            <Text style={styles.settingText}>Privacy & Security</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.name}
                  onChangeText={(text) => setEditForm({...editForm, name: text})}
                  placeholder="Enter your full name"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.email}
                  onChangeText={(text) => setEditForm({...editForm, email: text})}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                />
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editForm.phone}
                  onChangeText={(text) => setEditForm({...editForm, phone: text})}
                  placeholder="Enter your phone number"
                  keyboardType="phone-pad"
                />
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* App Settings Modal */}
      <Modal
        visible={showAppSettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAppSettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>App Settings</Text>
              <TouchableOpacity onPress={() => setShowAppSettings(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.settingGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Bell size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Push Notifications</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, appSettings.notifications && styles.toggleActive]}
                    onPress={() => setAppSettings({...appSettings, notifications: !appSettings.notifications})}
                  >
                    <View style={[styles.toggleThumb, appSettings.notifications && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Wifi size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Auto Sync</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, appSettings.autoSync && styles.toggleActive]}
                    onPress={() => setAppSettings({...appSettings, autoSync: !appSettings.autoSync})}
                  >
                    <View style={[styles.toggleThumb, appSettings.autoSync && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Smartphone size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Data Usage</Text>
                  </View>
                  <View style={styles.dataUsageOptions}>
                    {['low', 'medium', 'high'].map((option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dataOption,
                          appSettings.dataUsage === option && styles.dataOptionActive,
                        ]}
                        onPress={() => setAppSettings({...appSettings, dataUsage: option})}
                      >
                        <Text style={[
                          styles.dataOptionText,
                          appSettings.dataUsage === option && styles.dataOptionTextActive,
                        ]}>
                          {option.charAt(0).toUpperCase() + option.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSaveAppSettings}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Privacy & Security Modal */}
      <Modal
        visible={showPrivacySettings}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPrivacySettings(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy & Security</Text>
              <TouchableOpacity onPress={() => setShowPrivacySettings(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalContent}>
              <View style={styles.settingGroup}>
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Shield size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Share Anonymous Data</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, privacySettings.shareData && styles.toggleActive]}
                    onPress={() => setPrivacySettings({...privacySettings, shareData: !privacySettings.shareData})}
                  >
                    <View style={[styles.toggleThumb, privacySettings.shareData && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Eye size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Analytics & Insights</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, privacySettings.analytics && styles.toggleActive]}
                    onPress={() => setPrivacySettings({...privacySettings, analytics: !privacySettings.analytics})}
                  >
                    <View style={[styles.toggleThumb, privacySettings.analytics && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <MapPin size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Location Tracking</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, privacySettings.locationTracking && styles.toggleActive]}
                    onPress={() => setPrivacySettings({...privacySettings, locationTracking: !privacySettings.locationTracking})}
                  >
                    <View style={[styles.toggleThumb, privacySettings.locationTracking && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.settingItem}>
                  <View style={styles.settingItemLeft}>
                    <Lock size={20} color="#6B7280" />
                    <Text style={styles.settingItemText}>Biometric Authentication</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.toggle, privacySettings.biometricAuth && styles.toggleActive]}
                    onPress={() => setPrivacySettings({...privacySettings, biometricAuth: !privacySettings.biometricAuth})}
                  >
                    <View style={[styles.toggleThumb, privacySettings.biometricAuth && styles.toggleThumbActive]} />
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.privacyInfo}>
                <Text style={styles.privacyInfoTitle}>Data Protection</Text>
                <Text style={styles.privacyInfoText}>
                  Your health data is encrypted and stored securely. We comply with HIPAA and GDPR regulations to protect your privacy.
                </Text>
              </View>
              
              <TouchableOpacity style={styles.saveButton} onPress={handleSavePrivacySettings}>
                <Save size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>Save Privacy Settings</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  profileHeader: {
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    padding: 24,
    marginBottom: 8,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  infoContent: {
    flex: 0,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2563EB',
    borderRadius: 8,
    gap: 8,
  },
  editButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  languageOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activeLanguageOption: {
    backgroundColor: '#EFF6FF',
  },
  languageText: {
    fontSize: 16,
    color: '#1F2937',
  },
  activeLanguageText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#1F2937',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  logoutText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '85%',
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1F2937',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 20,
    gap: 8,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  settingGroup: {
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingItemText: {
    fontSize: 16,
    color: '#1F2937',
  },
  toggle: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D1D5DB',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: '#10B981',
  },
  toggleThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
  },
  toggleThumbActive: {
    alignSelf: 'flex-end',
  },
  dataUsageOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  dataOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
  dataOptionActive: {
    backgroundColor: '#2563EB',
  },
  dataOptionText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  dataOptionTextActive: {
    color: '#FFFFFF',
  },
  privacyInfo: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  privacyInfoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  privacyInfoText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
  },
});