'use client';
import { createContext, useState, useMemo, ReactNode, Dispatch, SetStateAction, useEffect } from 'react';
import { doctors as initialDoctors, initialAppointments, prescriptions as initialPrescriptions, initialCases } from '@/lib/data';
import { Doctor, Appointment, User, UserRole, Prescription, CareCase, CaseMessage } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { syncService, type SyncState } from '@/lib/sync-service';


type AppContextType = {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  doctors: Doctor[];
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
  addAppointment: (appointment: Appointment) => void;
  prescriptions: Prescription[];
  setPrescriptions: Dispatch<SetStateAction<Prescription[]>>;
  addPrescription: (prescription: Prescription) => void;
  cases: CareCase[];
  setCases: Dispatch<SetStateAction<CareCase[]>>;
  addCase: (careCase: CareCase) => void;
  updateCase: (caseId: string, updates: Partial<CareCase>) => void;
  addMessageToCase: (caseId: string, message: CaseMessage) => void;
  switchRole: (role: UserRole) => void;
  syncState: SyncState;
  triggerSync: () => void;
};

export const AppContext = createContext<AppContextType>({
  user: null,
  setUser: () => { },
  doctors: [],
  appointments: [],
  setAppointments: () => { },
  addAppointment: () => { },
  prescriptions: [],
  setPrescriptions: () => { },
  addPrescription: () => { },
  cases: [],
  setCases: () => { },
  addCase: () => { },
  updateCase: () => { },
  addMessageToCase: () => { },
  switchRole: () => { },
  syncState: { status: 'idle', lastSyncTime: null, pendingCount: 0, error: null },
  triggerSync: () => { },
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [cases, setCases] = useState<CareCase[]>(initialCases);
  const [syncState, setSyncState] = useState<SyncState>({
    status: 'idle',
    lastSyncTime: null,
    pendingCount: 0,
    error: null,
  });

  // Auth check removed - no authentication required
  // Users are set directly from login page

  // Load from LocalStorage on mount
  useEffect(() => {
    const localAppointments = localStorage.getItem('medcord_appointments');
    const localPrescriptions = localStorage.getItem('medcord_prescriptions');
    const localCases = localStorage.getItem('medcord_cases');

    if (localAppointments) {
      try {
        const parsed = JSON.parse(localAppointments);
        setAppointments(prev => {
          const combined = [...initialAppointments];
          parsed.forEach((apt: Appointment) => {
            if (!combined.find(c => c.id === apt.id)) combined.push(apt);
          });
          return combined;
        });
      } catch (e) {
        console.error('Failed to parse local appointments', e);
      }
    }

    if (localPrescriptions) {
      try {
        const parsed = JSON.parse(localPrescriptions);
        setPrescriptions(prev => {
          const combined = [...initialPrescriptions];
          parsed.forEach((pr: Prescription) => {
            if (!combined.find(c => c.id === pr.id)) combined.push(pr);
          });
          return combined;
        });
      } catch (e) {
        console.error('Failed to parse local prescriptions', e);
      }
    }

    if (localCases) {
      try {
        const parsed = JSON.parse(localCases);
        setCases(prev => {
          const combined = [...initialCases];
          parsed.forEach((cs: CareCase) => {
            if (!combined.find(c => c.id === cs.id)) combined.push(cs);
          });
          return combined;
        });
      } catch (e) {
        console.error('Failed to parse local cases', e);
      }
    }
  }, []);

  // Subscribe to sync state changes
  useEffect(() => {
    const unsubscribe = syncService.subscribe((state) => {
      setSyncState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Start automatic sync and sync with Supabase
  useEffect(() => {
    if (!user) return;

    // Start background sync every 30 seconds
    syncService.startAutoSync(30000);

    // Initial sync
    const performSync = async () => {
      const synced = await syncService.syncAll(user.id, cases);
      setCases(synced);
    };

    performSync();

    return () => {
      syncService.stopAutoSync();
    };
  }, [user?.id]);

  // Trigger sync when cases change locally
  useEffect(() => {
    if (!user) return;

    const syncCases = async () => {
      await syncService.syncPendingMessages(cases);
    };

    syncCases();
  }, [cases, user]);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!supabase) return;

      try {
        // Fetch Doctors
        const { data: dbDoctors, error: doctorsError } = await supabase
          .from('doctors')
          .select('*')
          .order('created_at', { ascending: false });

        if (doctorsError) {
          console.error('Error fetching doctors:', doctorsError);
        } else if (dbDoctors && dbDoctors.length > 0) {
          setDoctors(dbDoctors.map((d: any) => ({
            id: d.id,
            name: d.name,
            specialty: d.specialty,
            experience: d.experience,
            rating: d.rating,
            patientsCount: d.patients_count,
            image: d.image,
            available: d.available,
          })));
        }

        // Fetch Appointments for current user
        if (user) {
          const { data: dbAppointments, error: appointmentsError } = await supabase
            .from('appointments')
            .select('*')
            .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

          if (appointmentsError) {
            console.error('Error fetching appointments:', appointmentsError);
          } else if (dbAppointments && dbAppointments.length > 0) {
            setAppointments(dbAppointments.map((a: any) => ({
              id: a.id,
              patientId: a.patient_id,
              patientName: a.patient_name,
              doctorId: a.doctor_id,
              doctorName: a.doctor_name,
              date: a.date,
              time: a.time,
              status: a.status,
              type: a.type,
            })));
          }

          // Fetch Prescriptions for current user
          const { data: dbPrescriptions, error: prescriptionsError } = await supabase
            .from('prescriptions')
            .select('*')
            .or(`patient_id.eq.${user.id},doctor_id.eq.${user.id}`)
            .order('created_at', { ascending: false });

          if (prescriptionsError) {
            console.error('Error fetching prescriptions:', prescriptionsError);
          } else if (dbPrescriptions && dbPrescriptions.length > 0) {
            setPrescriptions(dbPrescriptions.map((p: any) => ({
              id: p.id,
              patientId: p.patient_id,
              doctorId: p.doctor_id,
              date: p.date,
              medicines: p.medicines,
            })));
          }
        }
      } catch (error) {
        console.error('Error fetching data from Supabase:', error);
      }
    };

    fetchData();
  }, [user?.id]);

  const addAppointment = async (appointment: Appointment) => {
    setAppointments(prev => {
      const next = [...prev, appointment];
      localStorage.setItem('medcord_appointments', JSON.stringify(next.filter((a: Appointment) => !initialAppointments.find(ia => ia.id === a.id))));
      return next;
    });

    // Persist to Supabase if configured
    if (supabase) {
      const { error } = await supabase.from('appointments').insert([{
        patient_id: appointment.patientId,
        patient_name: appointment.patientName,
        doctor_id: appointment.doctorId,
        doctor_name: appointment.doctorName,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        type: appointment.type,
      }]);

      if (error) {
        console.error('Error creating appointment:', error);
      }
    }
  };

  const addPrescription = async (prescription: Prescription) => {
    setPrescriptions(prev => {
      const next = [prescription, ...prev];
      localStorage.setItem('medcord_prescriptions', JSON.stringify(next.filter((p: Prescription) => !initialPrescriptions.find(ip => ip.id === p.id))));
      return next;
    });

    if (supabase) {
      const { error } = await supabase.from('prescriptions').insert([{
        patient_id: prescription.patientId,
        doctor_id: prescription.doctorId,
        date: prescription.date,
        medicines: prescription.medicines
      }]);

      if (error) {
        console.error('Error creating prescription:', error);
      }
    }
  };

  const addCase = (careCase: CareCase) => {
    setCases(prev => {
      const next = [careCase, ...prev];
      localStorage.setItem('medcord_cases', JSON.stringify(next.filter(c => !initialCases.find(ic => ic.id === c.id))));
      return next;
    });
  };

  const updateCase = (caseId: string, updates: Partial<CareCase>) => {
    setCases(prev => {
      const next = prev.map(c => c.id === caseId ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c);
      localStorage.setItem('medcord_cases', JSON.stringify(next.filter(c => !initialCases.find(ic => ic.id === c.id))));
      return next;
    });
  };

  const addMessageToCase = (caseId: string, message: CaseMessage) => {
    setCases(prev => {
      const next = prev.map(c => c.id === caseId ? {
        ...c,
        messages: [...c.messages, message],
        updatedAt: new Date().toISOString()
      } : c);
      localStorage.setItem('medcord_cases', JSON.stringify(next.filter(c => !initialCases.find(ic => ic.id === c.id))));
      return next;
    });
  };

  const switchRole = (role: UserRole) => {
    setUser(prev => prev ? { ...prev, role } : null);
  };

  const triggerSync = async () => {
    if (!user) return;
    const synced = await syncService.syncAll(user.id, cases);
    setCases(synced);
  };

  const value = useMemo(
    () => ({
      user,
      setUser,
      doctors,
      appointments,
      setAppointments,
      addAppointment,
      prescriptions,
      setPrescriptions,
      addPrescription,
      cases,
      setCases,
      addCase,
      updateCase,
      addMessageToCase,
      switchRole,
      syncState,
      triggerSync,
    }),
    [user, doctors, appointments, prescriptions, cases, syncState]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
