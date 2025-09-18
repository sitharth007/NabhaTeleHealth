export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'patient' | 'doctor' | 'pharmacy' | 'admin';
  avatar?: string;
  isVerified: boolean;
  createdAt: string;
  // Role-specific fields
  patientProfile?: PatientProfile;
  doctorProfile?: DoctorProfile;
  pharmacyProfile?: PharmacyProfile;
}

export interface PatientProfile {
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
  healthId: string;
}

export interface DoctorProfile {
  specialty: string;
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  consultationFee: number;
  availability: {
    day: string;
    startTime: string;
    endTime: string;
  }[];
  rating: number;
  isAvailable: boolean;
}

export interface PharmacyProfile {
  name: string;
  address: string;
  licenseNumber: string;
  contactNumber: string;
  operatingHours: {
    open: string;
    close: string;
  };
}