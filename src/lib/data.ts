import type { Doctor, Appointment, Prescription } from './types';
import { PlaceHolderImages } from './placeholder-images';

const getAvatarUrl = (id: string) => {
    const image = PlaceHolderImages.find(img => img.id === id);
    return image ? image.imageUrl : 'https://picsum.photos/seed/placeholder/100/100';
}

export const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    clinic: 'Apollo Clinic, Bangalore',
    distance: 2.5,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-1'),
  },
  {
    id: '2',
    name: 'Dr. Rohan Gupta',
    specialty: 'Cardiologist',
    clinic: 'Fortis Hospital, Delhi',
    distance: 5.1,
    availability: 'soon',
    avatarUrl: getAvatarUrl('doctor-avatar-2'),
  },
  {
    id: '3',
    name: 'Dr. Anjali Patel',
    specialty: 'Dermatologist',
    clinic: 'Kaya Skin Clinic, Mumbai',
    distance: 1.8,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-3'),
  },
  {
    id: '4',
    name: 'Dr. Vikram Singh',
    specialty: 'Pediatrician',
    clinic: 'Manipal Hospital, Jaipur',
    distance: 7.3,
    availability: 'unavailable',
    avatarUrl: getAvatarUrl('doctor-avatar-4'),
  },
    {
    id: '5',
    name: 'Dr. Sunita Rao',
    specialty: 'General Physician',
    clinic: 'Max Healthcare, Chennai',
    distance: 4.2,
    availability: 'available',
    avatarUrl: getAvatarUrl('doctor-avatar-5'),
  },
  {
    id: '6',
    name: 'Dr. Amit Kumar',
    specialty: 'Orthopedist',
    clinic: 'Indraprastha Apollo, Hyderabad',
    distance: 8.9,
    availability: 'soon',
    avatarUrl: getAvatarUrl('doctor-avatar-6'),
  },
];

export const appointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    clinic: 'Apollo Clinic, Bangalore',
    date: '2024-08-15',
    time: '10:30 AM',
    status: 'upcoming',
    type: 'video',
  },
  {
    id: '2',
    doctorName: 'Dr. Anjali Patel',
    specialty: 'Dermatologist',
    clinic: 'Kaya Skin Clinic, Mumbai',
    date: '2024-08-16',
    time: '02:00 PM',
    status: 'upcoming',
    type: 'chat',
  },
  {
    id: '3',
    doctorName: 'Dr. Rohan Gupta',
    specialty: 'Cardiologist',
    clinic: 'Fortis Hospital, Delhi',
    date: '2024-07-20',
    time: '11:00 AM',
    status: 'completed',
    type: 'video',
  },
    {
    id: '4',
    doctorName: 'Dr. Vikram Singh',
    specialty: 'Pediatrician',
    clinic: 'Manipal Hospital, Jaipur',
    date: '2024-07-18',
    time: '09:00 AM',
    status: 'completed',
    type: 'in-person',
  },
    {
    id: '5',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    clinic: 'Apollo Clinic, Bangalore',
    date: '2024-07-10',
    time: '04:30 PM',
    status: 'cancelled',
    type: 'video',
  },
];

export const prescriptions: Prescription[] = [
  {
    id: '1',
    doctorName: 'Dr. Rohan Gupta',
    date: '2024-07-20',
    medicines: [
      { name: 'Aspirin', dosage: '81mg once daily', duration: '30 days' },
      { name: 'Lisinopril', dosage: '10mg once daily', duration: '90 days' },
    ],
  },
  {
    id: '2',
    doctorName: 'Dr. Vikram Singh',
    date: '2024-07-18',
    medicines: [
      { name: 'Amoxicillin', dosage: '250mg three times daily', duration: '7 days' },
      { name: 'Ibuprofen', dosage: 'as needed for fever', duration: '7 days' },
    ],
  },
];
