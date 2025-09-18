import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { User as UserIcon, Mail, Phone, ChevronDown } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'patient' as 'patient' | 'doctor' | 'pharmacy',
  });
  const [showRolePicker, setShowRolePicker] = useState(false);
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const { t } = useLanguage();

  const roles = [
    { value: 'patient', label: t('auth.patient') },
    { value: 'doctor', label: t('auth.doctor') },
    { value: 'pharmacy', label: t('auth.pharmacy') },
  ];

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const success = await register(formData);
    if (success) {
      Alert.alert('Success', 'Registration successful! Please login.');
      router.replace('/(auth)/login');
    } else {
      Alert.alert('Error', 'Registration failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <StatusBar style="dark" />
      
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join Nabha TeleHealth Connect</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <UserIcon size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder={t('auth.name')}
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
        </View>

        <View style={styles.inputContainer}>
          <Mail size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder={t('auth.email')}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Phone size={20} color="#6B7280" />
          <TextInput
            style={styles.input}
            placeholder={t('auth.phone')}
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity 
          style={styles.inputContainer}
          onPress={() => setShowRolePicker(!showRolePicker)}
        >
          <UserIcon size={20} color="#6B7280" />
          <Text style={[styles.input, { color: formData.role ? '#1F2937' : '#9CA3AF' }]}>
            {roles.find(r => r.value === formData.role)?.label || t('auth.role')}
          </Text>
          <ChevronDown size={20} color="#6B7280" />
        </TouchableOpacity>

        {showRolePicker && (
          <View style={styles.rolePicker}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.value}
                style={styles.roleOption}
                onPress={() => {
                  setFormData({ ...formData, role: role.value as any });
                  setShowRolePicker(false);
                }}
              >
                <Text style={[
                  styles.roleText,
                  formData.role === role.value && styles.selectedRoleText
                ]}>
                  {role.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? t('common.loading') : t('auth.register')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.linkButton}
          onPress={() => router.replace('/(auth)/login')}
        >
          <Text style={styles.linkText}>
            Already have an account? {t('auth.login')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    backgroundColor: '#10B981',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#D1FAE5',
    textAlign: 'center',
    marginTop: 8,
  },
  form: {
    padding: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  rolePicker: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roleOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  roleText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedRoleText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
});