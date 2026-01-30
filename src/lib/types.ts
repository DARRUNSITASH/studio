export type UserRole = 'patient' | 'doctor' | 'admin';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic?: string;
  distance?: number;
  availability?: 'available' | 'soon' | 'unavailable';
  avatarUrl?: string;
  role?: 'doctor';
  // Database fields
  experience?: number;
  rating?: number;
  patientsCount?: number;
  image?: string;
  available?: boolean;
};

export type Appointment = {
  id: string;
  patientId?: string;
  doctorId: string;
  doctorName: string;
  patientName?: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'chat' | 'in-person';
  meetLink?: string;
  notes?: string;
};

export type Prescription = {
  id: string;
  patientId: string;
  patientName?: string;
  doctorId: string;
  doctorName: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    duration: string;
  }[];
  notes?: string;
};

export type CaseMessage = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  syncStatus?: 'pending' | 'synced' | 'failed';
};

export type CareCase = {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  status: 'pending' | 'reviewed' | 'resolved';
  subject: string;
  description: string;
  urgency: 'low' | 'medium' | 'emergency';
  createdAt: string;
  updatedAt: string;
  messages: CaseMessage[];
};
