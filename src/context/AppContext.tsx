'use client';

import { createContext, useState, useMemo, ReactNode, Dispatch, SetStateAction } from 'react';
import type { Doctor, Appointment } from '@/lib/types';
import { doctors as initialDoctors, initialAppointments } from '@/lib/data';


type AppContextType = {
  doctors: Doctor[];
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Appointment) => void;
};

export const AppContext = createContext<AppContextType>({
    doctors: [],
    appointments: [],
    setAppointments: () => {},
    addAppointment: () => {},
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const value = useMemo(
    () => ({
      doctors,
      appointments,
      setAppointments,
      addAppointment
    }),
    [doctors, appointments]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
