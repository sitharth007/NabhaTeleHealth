export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'video' | 'voice' | 'chat';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  symptoms: string;
  notes?: string;
  prescription?: Prescription;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: 'consultation' | 'test' | 'vaccination' | 'surgery';
  diagnosis: string;
  symptoms: string[];
  treatment: string;
  prescription?: Prescription;
  attachments?: string[];
  notes: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  instructions: string;
  issuedDate: string;
  validUntil: string;
  status: 'active' | 'dispensed' | 'expired';
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  price: number;
}

export interface PharmacyStock {
  id: string;
  pharmacyId: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  batchNumber: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image' | 'file';
  isRead: boolean;
}