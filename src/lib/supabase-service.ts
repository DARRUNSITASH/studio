import { supabase } from './supabase';
import type { Doctor, Appointment, Prescription, CareCase, CaseMessage } from './types';

/**
 * Supabase database service for all data operations
 */

// ============================================================================
// DOCTORS
// ============================================================================

export async function fetchDoctors(): Promise<Doctor[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('doctors')
        .select('*, profiles(name)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching doctors:', error);
        return [];
    }

    return data.map((d: any) => ({
        id: d.id,
        name: d.profiles?.name || d.name,
        specialty: d.specialty,
        experience: d.experience,
        rating: d.rating,
        patientsCount: d.patients_count,
        image: d.image,
        available: d.available,
    }));
}

export async function createDoctor(doctor: Omit<Doctor, 'id'> & { userId?: string }) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('doctors')
        .insert([
            {
                user_id: doctor.userId,
                name: doctor.name,
                specialty: doctor.specialty,
                experience: doctor.experience,
                rating: doctor.rating,
                patients_count: doctor.patientsCount,
                image: doctor.image,
                available: doctor.available,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================================================
// APPOINTMENTS
// ============================================================================

export async function fetchAppointments(userId?: string): Promise<Appointment[]> {
    if (!supabase) return [];

    let query = supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }

    return data.map((a: any) => ({
        id: a.id,
        patientId: a.patient_id,
        patientName: a.patient_name,
        doctorId: a.doctor_id,
        doctorName: a.doctor_name,
        date: a.date,
        time: a.time,
        status: a.status,
        type: a.type,
        notes: a.notes,
    }));
}

export async function createAppointment(appointment: Omit<Appointment, 'id'>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('appointments')
        .insert([
            {
                patient_id: appointment.patientId,
                patient_name: appointment.patientName,
                doctor_id: appointment.doctorId,
                doctor_name: appointment.doctorName,
                date: appointment.date,
                time: appointment.time,
                status: appointment.status,
                type: appointment.type,
                notes: appointment.notes,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateAppointment(id: string, updates: Partial<Appointment>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('appointments')
        .update({
            status: updates.status,
            notes: updates.notes,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================================================
// PRESCRIPTIONS
// ============================================================================

export async function fetchPrescriptions(userId?: string): Promise<Prescription[]> {
    if (!supabase) return [];

    let query = supabase
        .from('prescriptions')
        .select('*')
        .order('created_at', { ascending: false });

    if (userId) {
        query = query.or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching prescriptions:', error);
        return [];
    }

    return data.map((p: any) => ({
        id: p.id,
        patientId: p.patient_id,
        doctorId: p.doctor_id,
        date: p.date,
        medicines: p.medicines,
        notes: p.notes,
    }));
}

export async function createPrescription(prescription: Omit<Prescription, 'id'>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('prescriptions')
        .insert([
            {
                patient_id: prescription.patientId,
                doctor_id: prescription.doctorId,
                date: prescription.date,
                medicines: prescription.medicines,
                notes: prescription.notes,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================================================
// CARE CASES
// ============================================================================

export async function fetchCases(userId?: string): Promise<CareCase[]> {
    if (!supabase) return [];

    let query = supabase
        .from('care_cases')
        .select('*, case_messages(*)')
        .order('updated_at', { ascending: false });

    if (userId) {
        query = query.or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching cases:', error);
        return [];
    }

    return data.map((c: any) => ({
        id: c.id,
        patientId: c.patient_id,
        patientName: c.patient_name,
        doctorId: c.doctor_id,
        doctorName: c.doctor_name,
        status: c.status,
        subject: c.subject,
        description: c.description,
        urgency: c.urgency,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        messages: (c.case_messages || []).map((m: any) => ({
            id: m.id,
            senderId: m.sender_id,
            senderName: m.sender_name,
            content: m.content,
            timestamp: m.timestamp,
            syncStatus: m.sync_status,
        })),
    }));
}

export async function createCase(careCase: Omit<CareCase, 'id' | 'createdAt' | 'updatedAt' | 'messages'>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('care_cases')
        .insert([
            {
                patient_id: careCase.patientId,
                patient_name: careCase.patientName,
                doctor_id: careCase.doctorId,
                doctor_name: careCase.doctorName,
                status: careCase.status,
                subject: careCase.subject,
                description: careCase.description,
                urgency: careCase.urgency,
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateCase(id: string, updates: Partial<CareCase>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('care_cases')
        .update({
            status: updates.status,
            description: updates.description,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function addMessageToCase(caseId: string, message: Omit<CaseMessage, 'id' | 'timestamp'>) {
    if (!supabase) throw new Error('Supabase not configured');

    const { data, error } = await supabase
        .from('case_messages')
        .insert([
            {
                case_id: caseId,
                sender_id: message.senderId,
                sender_name: message.senderName,
                content: message.content,
                sync_status: message.syncStatus || 'synced',
            },
        ])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// ============================================================================
// REALTIME SUBSCRIPTIONS
// ============================================================================

export function subscribeToCaseMessages(caseId: string, callback: (message: CaseMessage) => void) {
    if (!supabase) return () => { };

    const subscription = supabase
        .channel(`case_messages:${caseId}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'case_messages',
                filter: `case_id=eq.${caseId}`,
            },
            (payload: any) => {
                const msg = payload.new as any;
                callback({
                    id: msg.id,
                    senderId: msg.sender_id,
                    senderName: msg.sender_name,
                    content: msg.content,
                    timestamp: msg.timestamp,
                    syncStatus: msg.sync_status,
                });
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}

export function subscribeToCases(userId: string, callback: (careCase: CareCase) => void) {
    if (!supabase) return () => { };

    const subscription = supabase
        .channel(`care_cases:${userId}`)
        .on(
            'postgres_changes',
            {
                event: '*',
                schema: 'public',
                table: 'care_cases',
            },
            async (payload: any) => {
                // Fetch the full case with messages
                const { data } = await supabase
                    .from('care_cases')
                    .select('*, case_messages(*)')
                    .eq('id', payload.new.id)
                    .single();

                if (data) {
                    callback({
                        id: data.id,
                        patientId: data.patient_id,
                        patientName: data.patient_name,
                        doctorId: data.doctor_id,
                        doctorName: data.doctor_name,
                        status: data.status,
                        subject: data.subject,
                        description: data.description,
                        urgency: data.urgency,
                        createdAt: data.created_at,
                        updatedAt: data.updated_at,
                        messages: (data.case_messages || []).map((m: any) => ({
                            id: m.id,
                            senderId: m.sender_id,
                            senderName: m.sender_name,
                            content: m.content,
                            timestamp: m.timestamp,
                            syncStatus: m.sync_status,
                        })),
                    });
                }
            }
        )
        .subscribe();

    return () => {
        subscription.unsubscribe();
    };
}
