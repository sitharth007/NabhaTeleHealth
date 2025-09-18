import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Globe, Menu, X, Chrome as Home, Calendar, FileText, MessageCircle, User, Stethoscope, Pill, Users, Package, ShoppingCart, Bot, LogOut } from 'lucide-react-native';
import { NotificationPanel } from '@/components/NotificationPanel';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

interface HeaderProps {
  title: string;
  showNotifications?: boolean;
  showLanguageSwitch?: boolean;
}

export function Header({ 
  title, 
  showNotifications = true, 
  showLanguageSwitch = true,
}: HeaderProps) {
  const { language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { unreadCount } = useApp();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  const toggleLanguage = () => {
    const languages: ('en' | 'hi' | 'pa')[] = ['en', 'hi', 'pa'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  const getMenuItems = () => {
    if (!user) return [];

    const commonItems = [
      { icon: Home, label: 'Home', route: '/(tabs)' },
      { icon: User, label: 'Profile', route: '/(tabs)/profile' },
    ];

    switch (user.role) {
      case 'patient':
        return [
          ...commonItems.slice(0, 1),
          { icon: Calendar, label: 'Appointments', route: '/(tabs)/appointments' },
          { icon: FileText, label: 'Health Records', route: '/(tabs)/health' },
          { icon: Pill, label: 'Medicines', route: '/(tabs)/medicines' },
          { icon: Stethoscope, label: 'Find Doctors', route: '/(tabs)/doctors' },
          { icon: MessageCircle, label: 'Chat', route: '/(tabs)/chat' },
          { icon: Bot, label: 'AI Assistant', route: '/ai-assistant' },
          ...commonItems.slice(1),
        ];
      case 'doctor':
        return [
          ...commonItems.slice(0, 1),
          { icon: Calendar, label: 'Appointments', route: '/(tabs)/appointments' },
          { icon: Users, label: 'My Patients', route: '/(tabs)/patients' },
          { icon: MessageCircle, label: 'Chat', route: '/(tabs)/chat' },
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

  const userRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'User';

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false);
    router.push(route as any);
  };

  const handleLogout = () => {
    setMenuVisible(false);
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <View>
            <Text style={styles.title}>{title}</Text>
            {user && (
              <Text style={styles.subtitle}>
                {user.role === 'patient' ? 'Patient Portal' : 
                 user.role === 'doctor' ? 'Doctor Portal' :
                 user.role === 'pharmacy' ? 'Pharmacy Portal' : 'Admin Portal'}
              </Text>
            )}
          </View>
        </View>
        
        <View style={styles.rightSection}>
          {showLanguageSwitch && (
            <TouchableOpacity onPress={toggleLanguage} style={styles.languageButton}>
              <Globe size={20} color="#6B7280" />
              <Text style={styles.languageText}>
                {language.toUpperCase()}
              </Text>
            </TouchableOpacity>
          )}
          
          {showNotifications && (
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setNotificationsVisible(true)}
            >
              <Bell size={24} color="#6B7280" />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.menuButton}
            onPress={() => setMenuVisible(true)}
          >
            <Menu size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={menuVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.userInfo}>
                <View style={styles.userAvatar}>
                  <Text style={styles.userAvatarText}>
                    {user?.name.split(' ').map(n => n[0]).join('') || 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={styles.userName}>{user?.name || 'User'}</Text>
                  <Text style={styles.userRole}>
                    {userRole}
                  </Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setMenuVisible(false)}
              >
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuItems}>
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
              
              <TouchableOpacity
                style={styles.logoutItem}
                onPress={handleLogout}
              >
                <LogOut size={24} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <NotificationPanel
        visible={notificationsVisible}
        onClose={() => setNotificationsVisible(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    position: 'relative',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    gap: 4,
  },
  languageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  menuButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
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
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  userRole: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  menuItems: {
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