import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Package, Clock, CircleCheck as CheckCircle, Circle as XCircle } from 'lucide-react-native';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';

interface Order {
  id: string;
  patientName: string;
  doctorName: string;
  medicines: string[];
  status: 'pending' | 'processing' | 'ready' | 'completed' | 'cancelled';
  date: string;
  totalAmount: number;
}

export default function OrdersScreen() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'completed'>('pending');

  if (!user || user.role !== 'pharmacy') return null;

  const mockOrders: Order[] = [
    {
      id: '1',
      patientName: 'Amarjit Kaur',
      doctorName: 'Dr. Preet Singh',
      medicines: ['Paracetamol 500mg', 'Crocin Advance'],
      status: 'pending',
      date: '2025-01-14',
      totalAmount: 65,
    },
    {
      id: '2',
      patientName: 'Harpreet Singh',
      doctorName: 'Dr. Simran Kaur',
      medicines: ['Amoxicillin 250mg'],
      status: 'ready',
      date: '2025-01-13',
      totalAmount: 120,
    },
  ];

  const filteredOrders = mockOrders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color="#F59E0B" />;
      case 'processing':
        return <Package size={20} color="#2563EB" />;
      case 'ready':
        return <CheckCircle size={20} color="#10B981" />;
      case 'completed':
        return <CheckCircle size={20} color="#6B7280" />;
      case 'cancelled':
        return <XCircle size={20} color="#EF4444" />;
      default:
        return <Package size={20} color="#6B7280" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'processing':
        return '#2563EB';
      case 'ready':
        return '#10B981';
      case 'completed':
        return '#6B7280';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const filterOptions = [
    { key: 'pending', label: 'Pending' },
    { key: 'ready', label: 'Ready' },
    { key: 'completed', label: 'Completed' },
    { key: 'all', label: 'All Orders' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Header title="Orders" />
      
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
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {filteredOrders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.patientName}>{order.patientName}</Text>
                <Text style={styles.doctorName}>Prescribed by {order.doctorName}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status.toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.medicinesSection}>
              <Text style={styles.medicinesTitle}>Medicines:</Text>
              {order.medicines.map((medicine, index) => (
                <Text key={index} style={styles.medicineItem}>• {medicine}</Text>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalAmount}>Total: ₹{order.totalAmount}</Text>
              
              {order.status === 'pending' && (
                <TouchableOpacity style={styles.processButton}>
                  <Text style={styles.processButtonText}>Process Order</Text>
                </TouchableOpacity>
              )}
              
              {order.status === 'ready' && (
                <TouchableOpacity style={styles.completeButton}>
                  <Text style={styles.completeButtonText}>Mark Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {filteredOrders.length === 0 && (
          <View style={styles.emptyState}>
            <Package size={48} color="#6B7280" />
            <Text style={styles.emptyTitle}>No orders found</Text>
            <Text style={styles.emptySubtitle}>
              {filter === 'pending' ? 'No pending orders' : 'No orders match your filter'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  doctorName: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  orderDate: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  medicinesSection: {
    marginBottom: 12,
  },
  medicinesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  medicineItem: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
  },
  processButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  processButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  completeButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
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
});