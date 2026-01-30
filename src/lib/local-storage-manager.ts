/**
 * LocalStorage Manager for Offline Messages
 * Provides localStorage-based storage as fallback and for simple data
 */

import type { CaseMessage, CareCase } from './types';

const STORAGE_KEYS = {
    MESSAGES_PREFIX: 'medcord_messages_',
    CASES_PREFIX: 'medcord_cases_',
    PENDING_MESSAGES: 'medcord_pending_messages',
    USER_CASES: 'medcord_user_cases',
    LAST_SYNC: 'medcord_last_sync',
    OFFLINE_QUEUE: 'medcord_offline_queue',
};

export interface StoredMessage extends CaseMessage {
    caseId: string;
    syncStatus: 'pending' | 'synced' | 'failed';
}

export interface StoredCase extends CareCase {
    lastSyncedAt?: string;
}

export class LocalStorageManager {
    /**
     * Save message to localStorage
     */
    saveMessage(caseId: string, message: StoredMessage): void {
        try {
            const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${caseId}`;
            const existing = this.getMessages(caseId);

            // Add or update message
            const messageIndex = existing.findIndex(m => m.id === message.id);
            if (messageIndex >= 0) {
                existing[messageIndex] = message;
            } else {
                existing.push(message);
            }

            // Sort by timestamp
            existing.sort((a, b) =>
                new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
            );

            localStorage.setItem(key, JSON.stringify(existing));

            // If pending, add to pending queue
            if (message.syncStatus === 'pending') {
                this.addToPendingQueue(message);
            }
        } catch (error) {
            console.error('Error saving message to localStorage:', error);
        }
    }

    /**
     * Get all messages for a case
     */
    getMessages(caseId: string): StoredMessage[] {
        try {
            const key = `${STORAGE_KEYS.MESSAGES_PREFIX}${caseId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting messages from localStorage:', error);
            return [];
        }
    }

    /**
     * Save case to localStorage
     */
    saveCase(caseData: StoredCase): void {
        try {
            const key = `${STORAGE_KEYS.CASES_PREFIX}${caseData.id}`;
            const caseWithSync = {
                ...caseData,
                lastSyncedAt: new Date().toISOString(),
            };
            localStorage.setItem(key, JSON.stringify(caseWithSync));

            // Update user cases index
            this.updateUserCasesIndex(caseData);
        } catch (error) {
            console.error('Error saving case to localStorage:', error);
        }
    }

    /**
     * Get case by ID
     */
    getCase(caseId: string): StoredCase | null {
        try {
            const key = `${STORAGE_KEYS.CASES_PREFIX}${caseId}`;
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting case from localStorage:', error);
            return null;
        }
    }

    /**
     * Get all cases for a user
     */
    getUserCases(userId: string, userRole: 'patient' | 'doctor'): StoredCase[] {
        try {
            const index = this.getUserCasesIndex();
            const userCaseIds = index[userId] || [];

            return userCaseIds
                .map(caseId => this.getCase(caseId))
                .filter((c): c is StoredCase => c !== null)
                .filter(c => {
                    if (userRole === 'patient') {
                        return c.patientId === userId;
                    } else {
                        return c.doctorId === userId;
                    }
                })
                .sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
        } catch (error) {
            console.error('Error getting user cases:', error);
            return [];
        }
    }

    /**
     * Update user cases index
     */
    private updateUserCasesIndex(caseData: StoredCase): void {
        try {
            const index = this.getUserCasesIndex();

            // Add to patient's cases
            if (!index[caseData.patientId]) {
                index[caseData.patientId] = [];
            }
            if (!index[caseData.patientId].includes(caseData.id)) {
                index[caseData.patientId].push(caseData.id);
            }

            // Add to doctor's cases
            if (!index[caseData.doctorId]) {
                index[caseData.doctorId] = [];
            }
            if (!index[caseData.doctorId].includes(caseData.id)) {
                index[caseData.doctorId].push(caseData.id);
            }

            localStorage.setItem(STORAGE_KEYS.USER_CASES, JSON.stringify(index));
        } catch (error) {
            console.error('Error updating user cases index:', error);
        }
    }

    /**
     * Get user cases index
     */
    private getUserCasesIndex(): Record<string, string[]> {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.USER_CASES);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * Add message to pending sync queue
     */
    private addToPendingQueue(message: StoredMessage): void {
        try {
            const queue = this.getPendingQueue();
            const exists = queue.find(m => m.id === message.id);

            if (!exists) {
                queue.push(message);
                localStorage.setItem(STORAGE_KEYS.PENDING_MESSAGES, JSON.stringify(queue));
            }
        } catch (error) {
            console.error('Error adding to pending queue:', error);
        }
    }

    /**
     * Get pending sync queue
     */
    getPendingQueue(): StoredMessage[] {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.PENDING_MESSAGES);
            return data ? JSON.parse(data) : [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Remove message from pending queue
     */
    removeFromPendingQueue(messageId: string): void {
        try {
            const queue = this.getPendingQueue();
            const filtered = queue.filter(m => m.id !== messageId);
            localStorage.setItem(STORAGE_KEYS.PENDING_MESSAGES, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error removing from pending queue:', error);
        }
    }

    /**
     * Update message sync status
     */
    updateMessageStatus(caseId: string, messageId: string, status: 'pending' | 'synced' | 'failed'): void {
        try {
            const messages = this.getMessages(caseId);
            const message = messages.find(m => m.id === messageId);

            if (message) {
                message.syncStatus = status;
                this.saveMessage(caseId, message);

                if (status === 'synced') {
                    this.removeFromPendingQueue(messageId);
                }
            }
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    }

    /**
     * Set last sync time
     */
    setLastSyncTime(userId: string): void {
        try {
            const syncTimes = this.getLastSyncTimes();
            syncTimes[userId] = new Date().toISOString();
            localStorage.setItem(STORAGE_KEYS.LAST_SYNC, JSON.stringify(syncTimes));
        } catch (error) {
            console.error('Error setting last sync time:', error);
        }
    }

    /**
     * Get last sync time for user
     */
    getLastSyncTime(userId: string): string | null {
        try {
            const syncTimes = this.getLastSyncTimes();
            return syncTimes[userId] || null;
        } catch (error) {
            return null;
        }
    }

    /**
     * Get all last sync times
     */
    private getLastSyncTimes(): Record<string, string> {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            return {};
        }
    }

    /**
     * Clear all offline data for a user
     */
    clearUserData(userId: string): void {
        try {
            // Get user's cases
            const index = this.getUserCasesIndex();
            const userCaseIds = index[userId] || [];

            // Delete messages for each case
            userCaseIds.forEach(caseId => {
                localStorage.removeItem(`${STORAGE_KEYS.MESSAGES_PREFIX}${caseId}`);
                localStorage.removeItem(`${STORAGE_KEYS.CASES_PREFIX}${caseId}`);
            });

            // Remove from index
            delete index[userId];
            localStorage.setItem(STORAGE_KEYS.USER_CASES, JSON.stringify(index));

            // Clear pending messages
            const queue = this.getPendingQueue();
            const filtered = queue.filter(m => m.senderId !== userId);
            localStorage.setItem(STORAGE_KEYS.PENDING_MESSAGES, JSON.stringify(filtered));
        } catch (error) {
            console.error('Error clearing user data:', error);
        }
    }

    /**
     * Get storage usage info
     */
    getStorageInfo(): { used: number; available: number; percentage: number } {
        try {
            let used = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    used += localStorage[key].length + key.length;
                }
            }

            // localStorage typically has 5-10MB limit
            const available = 10 * 1024 * 1024; // 10MB
            const percentage = (used / available) * 100;

            return {
                used,
                available,
                percentage: Math.round(percentage * 100) / 100,
            };
        } catch (error) {
            return { used: 0, available: 0, percentage: 0 };
        }
    }

    /**
     * Cleanup old synced messages
     */
    cleanupOldMessages(daysToKeep: number = 30): void {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

            // Get all message keys
            const messageKeys = Object.keys(localStorage).filter(key =>
                key.startsWith(STORAGE_KEYS.MESSAGES_PREFIX)
            );

            messageKeys.forEach(key => {
                const messages = JSON.parse(localStorage.getItem(key) || '[]') as StoredMessage[];
                const filtered = messages.filter(m => {
                    if (m.syncStatus !== 'synced') return true; // Keep pending/failed
                    return new Date(m.timestamp) >= cutoffDate;
                });

                if (filtered.length > 0) {
                    localStorage.setItem(key, JSON.stringify(filtered));
                } else {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('Error cleaning up old messages:', error);
        }
    }
}

// Singleton instance
export const localStorageManager = new LocalStorageManager();
