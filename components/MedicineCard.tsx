import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Pill, MapPin, Clock, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { PharmacyStock } from '@/types/medical';

interface MedicineCardProps {
  stock: PharmacyStock;
  onReserve?: () => void;
}

export function MedicineCard({ stock, onReserve }: MedicineCardProps) {
  const getStockStatus = () => {
    if (stock.currentStock === 0) {
      return { text: 'Out of Stock', color: '#EF4444' };
    } else if (stock.currentStock <= stock.minStock) {
      return { text: 'Low Stock', color: '#F59E0B' };
    } else {
      return { text: 'In Stock', color: '#10B981' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.medicineInfo}>
          <View style={styles.pillIcon}>
            <Pill size={20} color="#2563EB" />
          </View>
          <View style={styles.nameSection}>
            <Text style={styles.medicineName}>{stock.medicineName}</Text>
            <Text style={styles.batchNumber}>Batch: {stock.batchNumber}</Text>
          </View>
        </View>
        
        <View style={[styles.statusBadge, { backgroundColor: stockStatus.color + '20' }]}>
          <Text style={[styles.statusText, { color: stockStatus.color }]}>
            {stockStatus.text}
          </Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <View style={styles.stockInfo}>
            <Text style={styles.stockCount}>{stock.currentStock}</Text>
            <Text style={styles.stockLabel}>Available</Text>
          </View>
          <View style={styles.priceInfo}>
            <Text style={styles.price}>₹{stock.price}</Text>
            <Text style={styles.priceLabel}>per unit</Text>
          </View>
        </View>

        <View style={styles.metaInfo}>
          <View style={styles.metaRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.metaText}>Expires: {stock.expiryDate}</Text>
          </View>
          <View style={styles.metaRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.metaText}>Pharmacy ID: {stock.pharmacyId}</Text>
          </View>
        </View>
      </View>

      {stock.currentStock > 0 && onReserve && (
        <TouchableOpacity style={styles.reserveButton} onPress={onReserve}>
          <Text style={styles.reserveButtonText}>Reserve Medicine</Text>
        </TouchableOpacity>
      )}

      {stock.currentStock <= stock.minStock && stock.currentStock > 0 && (
        <View style={styles.warningSection}>
          <AlertTriangle size={16} color="#F59E0B" />
          <Text style={styles.warningText}>Limited stock available</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  pillIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nameSection: {
    flex: 1,
  },
  medicineName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  batchNumber: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockInfo: {
    alignItems: 'center',
  },
  stockCount: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  stockLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceInfo: {
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#059669',
  },
  priceLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  metaInfo: {
    gap: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  reserveButton: {
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  warningSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
  },
  warningText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
});