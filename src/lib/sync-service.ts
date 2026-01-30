import { supabase } from '@/lib/supabase';
import type { CareCase, CaseMessage } from '@/lib/types';

export type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

export interface SyncState {
    status: SyncStatus;
    lastSyncTime: string | null;
    pendingCount: number;
    error: string | null;
}

class SyncService {
    private syncInterval: NodeJS.Timeout | null = null;
    private realtimeChannel: any = null;
    private listeners: Set<(state: SyncState) => void> = new Set();
    private syncState: SyncState = {
        status: 'idle',
        lastSyncTime: null,
        pendingCount: 0,
        error: null,
    };

    constructor() {
        // Monitor online/offline status
        if (typeof window !== 'undefined') {
            window.addEventListener('online', () => this.handleOnline());
            window.addEventListener('offline', () => this.handleOffline());
        }
    }

    // Subscribe to sync state changes
    subscribe(listener: (state: SyncState) => void) {
        this.listeners.add(listener);
        listener(this.syncState); // Send current state immediately
        return () => this.listeners.delete(listener);
    }

    private notifyListeners() {
        this.listeners.forEach(listener => listener(this.syncState));
    }

    private updateSyncState(updates: Partial<SyncState>) {
        this.syncState = { ...this.syncState, ...updates };
        this.notifyListeners();
    }

    private handleOnline() {
        console.log('[SyncService] Device is online, triggering sync...');
        this.updateSyncState({ status: 'idle', error: null });
        this.syncAll();
    }

    private handleOffline() {
        console.log('[SyncService] Device is offline');
        this.updateSyncState({ status: 'offline' });
    }

    // Start automatic background sync
    startAutoSync(intervalMs: number = 30000) {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(() => {
            if (navigator.onLine) {
                this.syncAll();
            }
        }, intervalMs);

        // Initial sync
        if (navigator.onLine) {
            this.syncAll();
        }
    }

    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Upload pending messages to Supabase
    async syncPendingMessages(cases: CareCase[]): Promise<void> {
        if (!supabase) {
            console.warn('[SyncService] Supabase client not available');
            return;
        }

        try {
            // Find all pending messages across all cases
            const pendingMessages: Array<{ caseId: string; message: CaseMessage }> = [];

            cases.forEach(c => {
                c.messages.forEach(msg => {
                    // Check if message needs syncing (doesn't exist in Supabase yet)
                    if (msg.id.startsWith('m') || msg.id.startsWith('c')) {
                        pendingMessages.push({ caseId: c.id, message: msg });
                    }
                });
            });

            this.updateSyncState({ pendingCount: pendingMessages.length });

            if (pendingMessages.length === 0) {
                return;
            }

            console.log(`[SyncService] Uploading ${pendingMessages.length} pending messages...`);

            // Upload messages in batches
            for (const { caseId, message } of pendingMessages) {
                const { error } = await supabase
                    .from('case_messages')
                    .insert({
                        case_id: caseId,
                        sender_id: message.senderId,
                        sender_name: message.senderName,
                        content: message.content,
                        timestamp: message.timestamp,
                        sync_status: 'synced',
                    });

                if (error) {
                    console.error('[SyncService] Error uploading message:', error);
                    throw error;
                }
            }

            console.log('[SyncService] Successfully uploaded pending messages');
        } catch (error) {
            console.error('[SyncService] Sync error:', error);
            this.updateSyncState({
                status: 'error',
                error: error instanceof Error ? error.message : 'Sync failed'
            });
        }
    }

    // Fetch new messages from Supabase
    async fetchNewMessages(userId: string, lastSyncTime: string | null): Promise<CareCase[]> {
        if (!supabase) {
            console.warn('[SyncService] Supabase client not available');
            return [];
        }

        try {
            // Fetch cases where user is involved
            let casesQuery = supabase
                .from('care_cases')
                .select('*')
                .or(`patient_id.eq.${userId},doctor_id.eq.${userId}`);

            if (lastSyncTime) {
                casesQuery = casesQuery.gte('updated_at', lastSyncTime);
            }

            const { data: casesData, error: casesError } = await casesQuery;

            if (casesError) {
                console.error('[SyncService] Error fetching cases:', casesError);
                throw casesError;
            }

            if (!casesData || casesData.length === 0) {
                return [];
            }

            // Fetch messages for these cases
            const caseIds = casesData.map((c: any) => c.id);
            const { data: messagesData, error: messagesError } = await supabase
                .from('case_messages')
                .select('*')
                .in('case_id', caseIds)
                .order('timestamp', { ascending: true });

            if (messagesError) {
                console.error('[SyncService] Error fetching messages:', messagesError);
                throw messagesError;
            }

            // Transform to CareCase format
            const cases: CareCase[] = casesData.map((c: any) => {
                const caseMessages = (messagesData || [])
                    .filter((m: any) => m.case_id === c.id)
                    .map((m: any) => ({
                        id: m.id,
                        senderId: m.sender_id,
                        senderName: m.sender_name,
                        content: m.content,
                        timestamp: m.timestamp,
                    }));

                return {
                    id: c.id,
                    patientId: c.patient_id,
                    patientName: c.patient_name,
                    doctorId: c.doctor_id,
                    doctorName: c.doctor_name,
                    status: c.status as 'pending' | 'reviewed' | 'resolved',
                    subject: c.subject,
                    description: c.description,
                    urgency: c.urgency as 'low' | 'medium' | 'emergency',
                    createdAt: c.created_at,
                    updatedAt: c.updated_at,
                    messages: caseMessages,
                };
            });

            return cases;
        } catch (error) {
            console.error('[SyncService] Fetch error:', error);
            this.updateSyncState({
                status: 'error',
                error: error instanceof Error ? error.message : 'Fetch failed'
            });
            return [];
        }
    }

    // Merge remote cases with local cases
    mergeCases(localCases: CareCase[], remoteCases: CareCase[]): CareCase[] {
        const merged = new Map<string, CareCase>();

        // Add all local cases
        localCases.forEach(c => merged.set(c.id, c));

        // Merge remote cases (remote wins on conflict)
        remoteCases.forEach(remoteCase => {
            const localCase = merged.get(remoteCase.id);

            if (!localCase) {
                // New case from server
                merged.set(remoteCase.id, remoteCase);
            } else {
                // Merge messages (combine and deduplicate)
                const allMessages = [...localCase.messages, ...remoteCase.messages];
                const uniqueMessages = Array.from(
                    new Map(allMessages.map(m => [m.id, m])).values()
                ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

                // Use remote case data but keep merged messages
                merged.set(remoteCase.id, {
                    ...remoteCase,
                    messages: uniqueMessages,
                });
            }
        });

        return Array.from(merged.values());
    }

    // Full sync: upload pending + download new
    async syncAll(userId?: string, localCases?: CareCase[]): Promise<CareCase[]> {
        if (!navigator.onLine) {
            this.updateSyncState({ status: 'offline' });
            return localCases || [];
        }

        this.updateSyncState({ status: 'syncing', error: null });

        try {
            // Upload pending messages
            if (localCases) {
                await this.syncPendingMessages(localCases);
            }

            // Fetch new data
            const lastSync = this.syncState.lastSyncTime;
            const remoteCases = userId ? await this.fetchNewMessages(userId, lastSync) : [];

            // Merge
            const mergedCases = localCases
                ? this.mergeCases(localCases, remoteCases)
                : remoteCases;

            this.updateSyncState({
                status: 'idle',
                lastSyncTime: new Date().toISOString(),
                pendingCount: 0,
            });

            return mergedCases;
        } catch (error) {
            console.error('[SyncService] Sync all error:', error);
            this.updateSyncState({
                status: 'error',
                error: error instanceof Error ? error.message : 'Sync failed'
            });
            return localCases || [];
        }
    }

    // Subscribe to real-time updates for a specific case
    subscribeToCase(caseId: string, onUpdate: (message: CaseMessage) => void) {
        if (!supabase) return () => { };

        const channel = supabase
            .channel(`case:${caseId}`)
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
                    onUpdate({
                        id: msg.id,
                        senderId: msg.sender_id,
                        senderName: msg.sender_name,
                        content: msg.content,
                        timestamp: msg.timestamp,
                    });
                }
            )
            .subscribe();

        return () => {
            channel.unsubscribe();
        };
    }
}

// Singleton instance
export const syncService = new SyncService();
