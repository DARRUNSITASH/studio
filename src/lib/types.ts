export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  clinic: string;
  distance: number;
  availability: 'available' | 'soon' | 'unavailable';
  avatarUrl: string;
};

export type Appointment = {
  id: string;
  doctorName: string;
  specialty: string;
  clinic: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'chat' | 'in-person';
};

export type Prescription = {
  id: string;
  doctorName: string;
  date: string;
  medicines: {
    name: string;
    dosage: string;
    duration: string;
  }[];
};
