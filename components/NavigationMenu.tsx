import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Chrome as Home, Calendar, FileText, MessageCircle, User, Stethoscope, Pill, Users, Package, ShoppingCart, Bot, LogOut, X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface NavigationMenuProps {
  visible: boolean;
  onClose: () => void;
}

export function NavigationMenu({ visible, onClose }: NavigationMenuProps) {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  if (!visible || !user) return null;

  const getMenuItems = () => {
    const commonItems = [
      { icon: Home, label: t('nav.home'), route: '/(tabs)' },
      { icon: User, label: t('nav.profile'), route: '/(tabs)/profile' },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...commonItems.slice(0, 1),
          { icon: Calendar, label: t('nav.appointments'), route: '/(tabs)/appointments' },
          { icon: FileText, label: t('nav.health'), route: '/(tabs)/health' },
          { icon: Pill, label: t('nav.medicines'), route: '/(tabs)/medicines' },
          { icon: Stethoscope, label: t('nav.doctors'), route: '/(tabs)/doctors' },
          { icon: MessageCircle, label: t('nav.chat'), route: '/(tabs)/chat' },
          { icon: Bot, label: t('ai.askQuestion'), route: '/ai-assistant' },
          ...commonItems.slice(1),
        ];
      case 'doctor':
        return [
          ...commonItems.slice(0, 1),
          { icon: Calendar, label: t('nav.appointments'), route: '/(tabs)/appointments' },
          { icon: Users, label: 'My Patients', route: '/(tabs)/patients' },
          { icon: MessageCircle, label: t('nav.chat'), route: '/(tabs)/chat' },
          ...commonItems.slice(1),
        ];
      case 'pharmacy':
        return [
          ...commonItems.slice(0, 1),
          { icon: Package, label: 'Stock Management', route: '/(tabs)/stock' },
          { icon: ShoppingCart, label: 'Orders', route: '/(tabs)/orders' },
          ...commonItems.slice(1),
        ];
      default:
        return commonItems;
    }
  };

  const menuItems = getMenuItems();

  const handleMenuItemPress = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleLogout = () => {
    onClose();
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.overlay}>
      <TouchableOpacity style={styles.backdrop} onPress={onClose} />
      
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <View style={styles.userInfo}>
            <View style={styles.userAvatar}>
              <Text style={styles.userAvatarText}>
                {user.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userRole}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContent} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => handleMenuItemPress(item.route)}
            >
              <item.icon size={24} color="#374151" />
              <Text style={styles.menuItemText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
          
          <View style={styles.menuDivider} />
          
          <TouchableOpacity style={styles.logoutItem} onPress={handleLogout}>
            <LogOut size={24} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: 280,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  userRole: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  menuContent: {
    flex: 1,
    padding: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  logoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    gap: 16,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
  },
});