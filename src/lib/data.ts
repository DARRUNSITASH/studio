import type { Doctor, Appointment, Prescription, CareCase } from './types';

export const initialCases: CareCase[] = [
  {
    id: 'c1',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    doctorId: '1',
    doctorName: 'Dr. Priya Mani',
    status: 'pending',
    subject: 'Persistent cough and fever',
    description: 'I have been having a dry cough and mild fever for the past 3 days. It gets worse at night.',
    urgency: 'medium',
    createdAt: '2024-08-14T10:00:00Z',
    updatedAt: '2024-08-14T10:00:00Z',
    messages: [
      {
        id: 'm1',
        senderId: 'p1',
        senderName: 'Arun Kumar',
        content: 'I have been having a dry cough and mild fever for the past 3 days. It gets worse at night.',
        timestamp: '2024-08-14T10:00:00Z'
      }
    ]
  },
  {
    id: 'c2',
    patientId: 'p2',
    patientName: 'Meena Subramanian',
    doctorId: '4',
    doctorName: 'Dr. Vikram Selvam',
    status: 'reviewed',
    subject: 'Skin rash on arm',
    description: 'Noticed a red itchy rash on my left forearm this morning. No known allergies.',
    urgency: 'low',
    createdAt: '2024-08-13T14:00:00Z',
    updatedAt: '2024-08-13T16:30:00Z',
    messages: [
      {
        id: 'm2',
        senderId: 'p2',
        senderName: 'Meena Subramanian',
        content: 'Noticed a red itchy rash on my left forearm this morning. No known allergies.',
        timestamp: '2024-08-13T14:00:00Z'
      },
      {
        id: 'm3',
        senderId: '4',
        senderName: 'Dr. Vikram Selvam',
        content: 'Apply some calamine lotion and let me know if it spreads.',
        timestamp: '2024-08-13T16:30:00Z'
      }
    ]
  }
];
import { PlaceHolderImages } from './placeholder-images';

const getAvatarUrl = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Mani',
    specialty: 'General Physician',
    clinic: 'Kovai Family Clinic, Coimbatore',
    distance: 2.5,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-1'),
    role: 'doctor',
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kannan',
    specialty: 'Cardiologist',
    clinic: 'Chennai Health Centre, Adyar',
    distance: 5.1,
    availability: 'soon',
    avatarUrl: getAvatarUrl('doctor-avatar-2'),
    role: 'doctor',
  },
  {
    id: '3',
    name: 'Dr. Anjali Devi',
    specialty: 'Dermatologist',
    clinic: 'Madurai Neighborhood Clinic',
    distance: 1.8,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-3'),
    role: 'doctor',
  },
  {
    id: '4',
    name: 'Dr. Vikram Selvam',
    specialty: 'Pediatrician',
    clinic: 'Vellore Community Care',
    distance: 7.3,
    availability: 'unavailable',
    avatarUrl: getAvatarUrl('doctor-avatar-4'),
    role: 'doctor',
  },
  {
    id: '5',
    name: 'Dr. Sunita Ramasamy',
    specialty: 'General Physician',
    clinic: 'Trichy Care Clinic',
    distance: 4.2,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-5'),
    role: 'doctor',
  },
  {
    id: '6',
    name: 'Dr. Amit Chandran',
    specialty: 'Orthopedist',
    clinic: 'Peelamedu Ortho Clinic, Coimbatore',
    distance: 8.9,
    availability: 'soon',
    avatarUrl: getAvatarUrl('doctor-avatar-6'),
    role: 'doctor',
  },
];

export const initialAppointments: Appointment[] = [
  {
    id: '1',
    doctorId: '1',
    doctorName: 'Dr. Priya Mani',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    specialty: 'General Physician',
    clinic: 'Kovai Family Clinic, Coimbatore',
    date: '2024-08-15',
    time: '10:30 AM',
    status: 'upcoming',
    type: 'video',
    meetLink: 'https://meet.google.com/new',
  },
  {
    id: '2',
    doctorId: '3',
    doctorName: 'Dr. Anjali Devi',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    specialty: 'Dermatologist',
    clinic: 'Madurai Neighborhood Clinic',
    date: '2024-08-16',
    time: '02:00 PM',
    status: 'upcoming',
    type: 'chat',
    meetLink: 'https://meet.google.com/new',
  },
  {
    id: '3',
    doctorId: '2',
    doctorName: 'Dr. Rajesh Kannan',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    specialty: 'Cardiologist',
    clinic: 'Chennai Health Centre, Adyar',
    date: '2024-07-20',
    time: '11:00 AM',
    status: 'completed',
    type: 'video',
    meetLink: 'https://meet.google.com/new',
  },
  {
    id: '4',
    doctorId: '4',
    doctorName: 'Dr. Vikram Selvam',
    patientId: 'p2',
    patientName: 'Meena Subramanian',
    specialty: 'Pediatrician',
    clinic: 'Vellore Community Care',
    date: '2024-07-18',
    time: '09:00 AM',
    status: 'completed',
    type: 'in-person',
  },
  {
    id: '5',
    doctorId: '1',
    doctorName: 'Dr. Priya Mani',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    specialty: 'General Physician',
    clinic: 'Kovai Family Clinic, Coimbatore',
    date: '2024-07-10',
    time: '04:30 PM',
    status: 'cancelled',
    type: 'video',
    meetLink: 'https://meet.google.com/new',
  },
];

export const prescriptions: Prescription[] = [
  {
    id: '1',
    doctorId: '2',
    doctorName: 'Dr. Rajesh Kannan',
    patientId: 'p1',
    patientName: 'Arun Kumar',
    date: '2024-07-20',
    medicines: [
      { name: 'Aspirin', dosage: '81mg once daily', duration: '30 days' },
      { name: 'Lisinopril', dosage: '10mg once daily', duration: '90 days' },
    ],
  },
  {
    id: '2',
    doctorId: '4',
    doctorName: 'Dr. Vikram Selvam',
    patientId: 'p2',
    patientName: 'Meena Subramanian',
    date: '2024-07-18',
    medicines: [
      { name: 'Amoxicillin', dosage: '250mg three times daily', duration: '7 days' },
      { name: 'Ibuprofen', dosage: 'as needed for fever', duration: '7 days' },
    ],
  },
];
