import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, MapPin, SlidersHorizontal as Filter } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { MedicineCard } from '@/components/MedicineCard';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';

export default function MedicinesScreen() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { pharmacyStock, reserveMedicine } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'inStock' | 'lowStock' | 'outOfStock'>('all');

  if (!user) return null;

  const filteredMedicines = pharmacyStock.filter(stock => {
    const matchesSearch = stock.medicineName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'inStock') return stock.currentStock > stock.minStock;
    if (filter === 'lowStock') return stock.currentStock > 0 && stock.currentStock <= stock.minStock;
    if (filter === 'outOfStock') return stock.currentStock === 0;
    
    return true;
  });

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'inStock', label: 'Available' },
    { key: 'lowStock', label: 'Low Stock' },
    { key: 'outOfStock', label: 'Out of Stock' },
  ];

  const handleReserveMedicine = (stock: any) => {
    Alert.alert(
      'Reserve Medicine',
      `Reserve ${stock.medicineName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reserve', 
          onPress: () => {
            const success = reserveMedicine(stock.id, 1);
            if (success) {
              Alert.alert('Success', 'Medicine reserved successfully!');
            } else {
              Alert.alert('Error', 'Unable to reserve medicine');
            }
          }
        }
      ]
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title={t('nav.medicines')} />
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('medicine.search')}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={20} color="#2563EB" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.locationButton}>
          <MapPin size={20} color="#2563EB" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterChip,
              filter === option.key && styles.activeFilterChip,
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

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredMedicines.length > 0 ? (
          filteredMedicines.map((stock) => (
            <MedicineCard
              key={stock.id}
              stock={stock}
              onReserve={() => handleReserveMedicine(stock)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No medicines found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search or filter criteria
            </Text>
          </View>
        )}

        <View style={styles.helpSection}>
          <Text style={styles.helpTitle}>Need help finding medicine?</Text>
          <Text style={styles.helpText}>
            Contact our AI assistant or call our helpline for medicine availability
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            onPress={() => Alert.alert('Help', 'AI Assistant will help you find medicines')}
          >
            <Text style={styles.helpButtonText}>Get Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationButton: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    maxHeight: 40,
    paddingHorizontal: 12,
    paddingVertical: 6,
  
  },
  filterChip: {
    paddingHorizontal: 8,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginRight: 4,
    marginLeft: 4,
    marginTop: 10,
    textAlign: 'center',
    justifyContent: 'center',
  },
  activeFilterChip: {
    backgroundColor: '#10B981',
  },
  filterText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
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
  helpSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  helpButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});