import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Search, Plus, TriangleAlert as AlertTriangle, Package, X } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { MedicineCard } from '@/components/MedicineCard';
import { useAuth } from '@/contexts/AuthContext';
import { useApp } from '@/contexts/AppContext';

export default function StockScreen() {
  const { user } = useAuth();
  const { pharmacyStock, updateStock } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'lowStock' | 'outOfStock'>('all');
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    stock: '',
    price: '',
    minStock: '',
    expiryDate: '',
    batchNumber: '',
  });

  if (!user || user.role !== 'pharmacy') return null;

  const filteredStock = pharmacyStock.filter(stock => {
    const matchesSearch = stock.medicineName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filter === 'lowStock') return stock.currentStock > 0 && stock.currentStock <= stock.minStock;
    if (filter === 'outOfStock') return stock.currentStock === 0;
    
    return true;
  });

  const lowStockCount = pharmacyStock.filter(s => s.currentStock > 0 && s.currentStock <= s.minStock).length;
  const outOfStockCount = pharmacyStock.filter(s => s.currentStock === 0).length;

  const filterOptions = [
    { key: 'all', label: 'All Stock', count: pharmacyStock.length },
    { key: 'lowStock', label: 'Low Stock', count: lowStockCount },
    { key: 'outOfStock', label: 'Out of Stock', count: outOfStockCount },
  ];

  const handleUpdateStock = (medicineId: string, currentStock: number) => {
    Alert.prompt(
      'Update Stock',
      'Enter new stock quantity:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: (newStock) => {
            const quantity = parseInt(newStock || '0');
            if (quantity >= 0) {
              updateStock(medicineId, quantity);
              Alert.alert('Success', 'Stock updated successfully');
            }
          }
        }
      ],
      'plain-text',
      currentStock.toString()
    );
  };

  const handleAddMedicine = () => {
    if (!newMedicine.name || !newMedicine.stock || !newMedicine.price) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // In a real app, this would add to the database
    Alert.alert('Success', 'Medicine added to inventory');
    setShowAddMedicine(false);
    setNewMedicine({
      name: '',
      stock: '',
      price: '',
      minStock: '',
      expiryDate: '',
      batchNumber: '',
    });
  };
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Stock Management" />
      
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddMedicine(true)}
        >
          <Plus size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <View style={styles.alertsSection}>
          <View style={styles.alertHeader}>
            <AlertTriangle size={20} color="#F59E0B" />
            <Text style={styles.alertTitle}>Stock Alerts</Text>
          </View>
          <Text style={styles.alertText}>
            {lowStockCount} medicines low in stock, {outOfStockCount} out of stock
          </Text>
        </View>
      )}

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
      >
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[
              styles.filterButton,
              filter === option.key && styles.activeFilterButton,
            ]}
            onPress={() => setFilter(option.key as any)}
          >
            <Text style={[
              styles.filterText,
              filter === option.key && styles.activeFilterText,
            ]}>
              {option.label} ({option.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredStock.length > 0 ? (
          filteredStock.map((stock) => (
            <MedicineCard
              key={stock.id}
              stock={stock}
              onReserve={() => handleUpdateStock(stock.medicineId, stock.currentStock)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Package size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No medicines found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try adjusting your search' : 'Add medicines to your inventory'}
            </Text>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showAddMedicine}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddMedicine(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Medicine</Text>
              <TouchableOpacity onPress={() => setShowAddMedicine(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <TextInput
                style={styles.input}
                placeholder="Medicine Name *"
                value={newMedicine.name}
                onChangeText={(text) => setNewMedicine({...newMedicine, name: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Initial Stock *"
                value={newMedicine.stock}
                onChangeText={(text) => setNewMedicine({...newMedicine, stock: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Price per unit *"
                value={newMedicine.price}
                onChangeText={(text) => setNewMedicine({...newMedicine, price: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Minimum Stock Level"
                value={newMedicine.minStock}
                onChangeText={(text) => setNewMedicine({...newMedicine, minStock: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Expiry Date (YYYY-MM-DD)"
                value={newMedicine.expiryDate}
                onChangeText={(text) => setNewMedicine({...newMedicine, expiryDate: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Batch Number"
                value={newMedicine.batchNumber}
                onChangeText={(text) => setNewMedicine({...newMedicine, batchNumber: text})}
              />

              <TouchableOpacity style={styles.addMedicineButton} onPress={handleAddMedicine}>
                <Text style={styles.addMedicineButtonText}>Add Medicine</Text>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertsSection: {
    backgroundColor: '#FEF3C7',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  alertText: {
    fontSize: 14,
    color: '#92400E',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '80%',
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
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  addMedicineButton: {
    backgroundColor: '#10B981',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  addMedicineButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});