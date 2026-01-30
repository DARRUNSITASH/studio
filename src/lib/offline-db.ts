/**
 * IndexedDB Storage for Offline Messages
 * Provides persistent storage for messages with offline support
 */

const DB_NAME = 'medcord_offline_db';
const DB_VERSION = 1;
const STORES = {
    MESSAGES: 'messages',
    CASES: 'cases',
    PENDING_SYNC: 'pending_sync',
};

export interface OfflineMessage {
    id: string;
    caseId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    syncStatus: 'pending' | 'synced' | 'failed';
    attachments?: string[];
}

export interface OfflineCase {
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
    lastSyncedAt?: string;
}

class OfflineDB {
    private db: IDBDatabase | null = null;

    /**
     * Initialize IndexedDB
     */
    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                resolve();
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Messages store
                if (!db.objectStoreNames.contains(STORES.MESSAGES)) {
                    const messageStore = db.createObjectStore(STORES.MESSAGES, { keyPath: 'id' });
                    messageStore.createIndex('caseId', 'caseId', { unique: false });
                    messageStore.createIndex('syncStatus', 'syncStatus', { unique: false });
                    messageStore.createIndex('timestamp', 'timestamp', { unique: false });
                }

                // Cases store
                if (!db.objectStoreNames.contains(STORES.CASES)) {
                    const caseStore = db.createObjectStore(STORES.CASES, { keyPath: 'id' });
                    caseStore.createIndex('patientId', 'patientId', { unique: false });
                    caseStore.createIndex('doctorId', 'doctorId', { unique: false });
                    caseStore.createIndex('status', 'status', { unique: false });
                    caseStore.createIndex('updatedAt', 'updatedAt', { unique: false });
                }

                // Pending sync queue
                if (!db.objectStoreNames.contains(STORES.PENDING_SYNC)) {
                    const syncStore = db.createObjectStore(STORES.PENDING_SYNC, { keyPath: 'id' });
                    syncStore.createIndex('timestamp', 'timestamp', { unique: false });
                    syncStore.createIndex('type', 'type', { unique: false });
                }
            };
        });
    }

    /**
     * Save message to IndexedDB
     */
    async saveMessage(message: OfflineMessage): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.MESSAGES], 'readwrite');
            const store = transaction.objectStore(STORES.MESSAGES);
            const request = store.put(message);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get messages for a specific case
     */
    async getMessagesByCase(caseId: string): Promise<OfflineMessage[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.MESSAGES], 'readonly');
            const store = transaction.objectStore(STORES.MESSAGES);
            const index = store.index('caseId');
            const request = index.getAll(caseId);

            request.onsuccess = () => {
                const messages = request.result.sort((a, b) =>
                    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
                );
                resolve(messages);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get all pending messages (not synced)
     */
    async getPendingMessages(): Promise<OfflineMessage[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.MESSAGES], 'readonly');
            const store = transaction.objectStore(STORES.MESSAGES);
            const index = store.index('syncStatus');
            const request = index.getAll('pending');

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Update message sync status
     */
    async updateMessageStatus(messageId: string, status: 'pending' | 'synced' | 'failed'): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.MESSAGES], 'readwrite');
            const store = transaction.objectStore(STORES.MESSAGES);
            const getRequest = store.get(messageId);

            getRequest.onsuccess = () => {
                const message = getRequest.result;
                if (message) {
                    message.syncStatus = status;
                    const putRequest = store.put(message);
                    putRequest.onsuccess = () => resolve();
                    putRequest.onerror = () => reject(putRequest.error);
                } else {
                    resolve();
                }
            };
            getRequest.onerror = () => reject(getRequest.error);
        });
    }

    /**
     * Save case to IndexedDB
     */
    async saveCase(caseData: OfflineCase): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.CASES], 'readwrite');
            const store = transaction.objectStore(STORES.CASES);
            const request = store.put({
                ...caseData,
                lastSyncedAt: new Date().toISOString(),
            });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get cases for a user (patient or doctor)
     */
    async getCasesByUser(userId: string, userRole: 'patient' | 'doctor'): Promise<OfflineCase[]> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.CASES], 'readonly');
            const store = transaction.objectStore(STORES.CASES);
            const indexName = userRole === 'patient' ? 'patientId' : 'doctorId';
            const index = store.index(indexName);
            const request = index.getAll(userId);

            request.onsuccess = () => {
                const cases = request.result.sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );
                resolve(cases);
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Get a specific case by ID
     */
    async getCaseById(caseId: string): Promise<OfflineCase | null> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.CASES], 'readonly');
            const store = transaction.objectStore(STORES.CASES);
            const request = store.get(caseId);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Delete old synced messages (cleanup)
     */
    async cleanupOldMessages(daysToKeep: number = 30): Promise<void> {
        if (!this.db) await this.init();

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction([STORES.MESSAGES], 'readwrite');
            const store = transaction.objectStore(STORES.MESSAGES);
            const index = store.index('timestamp');
            const request = index.openCursor();

            request.onsuccess = (event) => {
                const cursor = (event.target as IDBRequest).result;
                if (cursor) {
                    const message = cursor.value as OfflineMessage;
                    if (
                        message.syncStatus === 'synced' &&
                        new Date(message.timestamp) < cutoffDate
                    ) {
                        cursor.delete();
                    }
                    cursor.continue();
                } else {
                    resolve();
                }
            };
            request.onerror = () => reject(request.error);
        });
    }

    /**
     * Clear all data (for testing or logout)
     */
    async clearAll(): Promise<void> {
        if (!this.db) await this.init();

        return new Promise((resolve, reject) => {
            const transaction = this.db!.transaction(
                [STORES.MESSAGES, STORES.CASES, STORES.PENDING_SYNC],
                'readwrite'
            );

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);

            transaction.objectStore(STORES.MESSAGES).clear();
            transaction.objectStore(STORES.CASES).clear();
            transaction.objectStore(STORES.PENDING_SYNC).clear();
        });
    }
}

// Singleton instance
export const offlineDB = new OfflineDB();
