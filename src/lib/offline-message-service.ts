/**
 * Offline Message Service
 * Unified service that uses both IndexedDB and localStorage
 * with automatic fallback and sync capabilities
 */

import { offlineDB, type OfflineMessage, type OfflineCase } from './offline-db';
import { localStorageManager, type StoredMessage, type StoredCase } from './local-storage-manager';
import type { CaseMessage, CareCase } from './types';

export interface MessageServiceConfig {
    userId: string;
    userRole: 'patient' | 'doctor';
    userName: string;
}

export class OfflineMessageService {
    private config: MessageServiceConfig | null = null;
    private useIndexedDB: boolean = true;
    private syncInProgress: boolean = false;

    /**
     * Initialize the service
     */
    async init(config: MessageServiceConfig): Promise<void> {
        this.config = config;

        try {
            await offlineDB.init();
            this.useIndexedDB = true;
            console.log('✅ IndexedDB initialized for offline messages');
        } catch (error) {
            console.warn('⚠️ IndexedDB not available, falling back to localStorage', error);
            this.useIndexedDB = false;
        }

        // Start periodic sync if online
        this.startPeriodicSync();
    }

    /**
     * Send a message (works offline)
     */
    async sendMessage(caseId: string, content: string): Promise<CaseMessage> {
        if (!this.config) throw new Error('Service not initialized');

        const message: CaseMessage = {
            id: this.generateId(),
            senderId: this.config.userId,
            senderName: this.config.userName,
            content,
            timestamp: new Date().toISOString(),
            syncStatus: navigator.onLine ? 'pending' : 'pending',
        };

        // Save to both storages
        await this.saveMessageToStorage(caseId, message);

        // Try to sync immediately if online
        if (navigator.onLine) {
            this.syncPendingMessages().catch(console.error);
        }

        return message;
    }

    /**
     * Get messages for a case
     */
    async getMessages(caseId: string): Promise<CaseMessage[]> {
        try {
            if (this.useIndexedDB) {
                const messages = await offlineDB.getMessagesByCase(caseId);
                return messages.map(this.convertToMessage);
            } else {
                const messages = localStorageManager.getMessages(caseId);
                return messages.map(this.convertToMessage);
            }
        } catch (error) {
            console.error('Error getting messages:', error);
            return [];
        }
    }

    /**
     * Save case (works offline)
     */
    async saveCase(caseData: CareCase): Promise<void> {
        try {
            if (this.useIndexedDB) {
                await offlineDB.saveCase(this.convertToOfflineCase(caseData));
            }
            localStorageManager.saveCase(this.convertToStoredCase(caseData));
        } catch (error) {
            console.error('Error saving case:', error);
        }
    }

    /**
     * Get cases for current user
     */
    async getUserCases(): Promise<CareCase[]> {
        if (!this.config) return [];

        try {
            if (this.useIndexedDB) {
                const cases = await offlineDB.getCasesByUser(
                    this.config.userId,
                    this.config.userRole
                );
                return cases.map(this.convertToCase);
            } else {
                const cases = localStorageManager.getUserCases(
                    this.config.userId,
                    this.config.userRole
                );
                return cases.map(this.convertToCase);
            }
        } catch (error) {
            console.error('Error getting user cases:', error);
            return [];
        }
    }

    /**
     * Get a specific case
     */
    async getCase(caseId: string): Promise<CareCase | null> {
        try {
            if (this.useIndexedDB) {
                const caseData = await offlineDB.getCaseById(caseId);
                return caseData ? this.convertToCase(caseData) : null;
            } else {
                const caseData = localStorageManager.getCase(caseId);
                return caseData ? this.convertToCase(caseData) : null;
            }
        } catch (error) {
            console.error('Error getting case:', error);
            return null;
        }
    }

    /**
     * Sync pending messages with server
     */
    async syncPendingMessages(): Promise<void> {
        if (this.syncInProgress || !navigator.onLine) return;

        this.syncInProgress = true;

        try {
            const pendingMessages = this.useIndexedDB
                ? await offlineDB.getPendingMessages()
                : localStorageManager.getPendingQueue();

            console.log(`🔄 Syncing ${pendingMessages.length} pending messages...`);

            for (const message of pendingMessages) {
                try {
                    // Here you would call your Supabase service to sync
                    // For now, we'll just mark as synced
                    await this.updateMessageStatus(
                        message.caseId,
                        message.id,
                        'synced'
                    );
                } catch (error) {
                    console.error('Failed to sync message:', message.id, error);
                    await this.updateMessageStatus(
                        message.caseId,
                        message.id,
                        'failed'
                    );
                }
            }

            if (this.config) {
                localStorageManager.setLastSyncTime(this.config.userId);
            }

            console.log('✅ Sync completed');
        } catch (error) {
            console.error('Error syncing messages:', error);
        } finally {
            this.syncInProgress = false;
        }
    }

    /**
     * Get pending message count
     */
    async getPendingCount(): Promise<number> {
        try {
            if (this.useIndexedDB) {
                const messages = await offlineDB.getPendingMessages();
                return messages.length;
            } else {
                return localStorageManager.getPendingQueue().length;
            }
        } catch (error) {
            return 0;
        }
    }

    /**
     * Check if offline mode is active
     */
    isOffline(): boolean {
        return !navigator.onLine;
    }

    /**
     * Get last sync time
     */
    getLastSyncTime(): string | null {
        if (!this.config) return null;
        return localStorageManager.getLastSyncTime(this.config.userId);
    }

    /**
     * Clear all offline data
     */
    async clearAllData(): Promise<void> {
        if (!this.config) return;

        try {
            if (this.useIndexedDB) {
                await offlineDB.clearAll();
            }
            localStorageManager.clearUserData(this.config.userId);
            console.log('✅ Offline data cleared');
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    }

    /**
     * Get storage info
     */
    getStorageInfo() {
        return localStorageManager.getStorageInfo();
    }

    // Private helper methods

    private async saveMessageToStorage(caseId: string, message: CaseMessage): Promise<void> {
        const offlineMessage: OfflineMessage = {
            ...message,
            caseId,
            syncStatus: message.syncStatus || 'pending',
        };

        const storedMessage: StoredMessage = {
            ...message,
            caseId,
            syncStatus: message.syncStatus || 'pending',
        };

        if (this.useIndexedDB) {
            await offlineDB.saveMessage(offlineMessage);
        }
        localStorageManager.saveMessage(caseId, storedMessage);
    }

    private async updateMessageStatus(
        caseId: string,
        messageId: string,
        status: 'pending' | 'synced' | 'failed'
    ): Promise<void> {
        if (this.useIndexedDB) {
            await offlineDB.updateMessageStatus(messageId, status);
        }
        localStorageManager.updateMessageStatus(caseId, messageId, status);
    }

    private convertToMessage(msg: OfflineMessage | StoredMessage): CaseMessage {
        return {
            id: msg.id,
            senderId: msg.senderId,
            senderName: msg.senderName,
            content: msg.content,
            timestamp: msg.timestamp,
            syncStatus: msg.syncStatus,
        };
    }

    private convertToCase(caseData: OfflineCase | StoredCase): CareCase {
        return {
            id: caseData.id,
            patientId: caseData.patientId,
            patientName: caseData.patientName,
            doctorId: caseData.doctorId,
            doctorName: caseData.doctorName,
            status: caseData.status,
            subject: caseData.subject,
            description: caseData.description,
            urgency: caseData.urgency,
            createdAt: caseData.createdAt,
            updatedAt: caseData.updatedAt,
            messages: [],
        };
    }

    private convertToOfflineCase(caseData: CareCase): OfflineCase {
        return {
            id: caseData.id,
            patientId: caseData.patientId,
            patientName: caseData.patientName,
            doctorId: caseData.doctorId,
            doctorName: caseData.doctorName,
            status: caseData.status,
            subject: caseData.subject,
            description: caseData.description,
            urgency: caseData.urgency,
            createdAt: caseData.createdAt,
            updatedAt: caseData.updatedAt,
        };
    }

    private convertToStoredCase(caseData: CareCase): StoredCase {
        return {
            ...caseData,
            lastSyncedAt: new Date().toISOString(),
        };
    }

    private generateId(): string {
        return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    private startPeriodicSync(): void {
        // Sync every 30 seconds if online
        setInterval(() => {
            if (navigator.onLine && !this.syncInProgress) {
                this.syncPendingMessages().catch(console.error);
            }
        }, 30000);

        // Listen for online/offline events
        window.addEventListener('online', () => {
            console.log('🌐 Back online, syncing messages...');
            this.syncPendingMessages().catch(console.error);
        });

        window.addEventListener('offline', () => {
            console.log('📴 Offline mode activated');
        });
    }
}

// Singleton instance
export const offlineMessageService = new OfflineMessageService();
