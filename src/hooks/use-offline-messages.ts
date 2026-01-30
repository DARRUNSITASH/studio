/**
 * React Hook for Offline Messages
 * Easy-to-use hook for components to interact with offline message service
 */

import { useState, useEffect, useCallback, useContext } from 'react';
import { offlineMessageService } from '@/lib/offline-message-service';
import { AppContext } from '@/context/AppContext';
import type { CaseMessage, CareCase } from '@/lib/types';

export interface UseOfflineMessagesResult {
    messages: CaseMessage[];
    cases: CareCase[];
    sendMessage: (caseId: string, content: string) => Promise<void>;
    loadMessages: (caseId: string) => Promise<void>;
    loadCases: () => Promise<void>;
    pendingCount: number;
    isOffline: boolean;
    isSyncing: boolean;
    lastSyncTime: string | null;
    syncNow: () => Promise<void>;
    storageInfo: { used: number; available: number; percentage: number };
}

export function useOfflineMessages(caseId?: string): UseOfflineMessagesResult {
    const { user } = useContext(AppContext);
    const [messages, setMessages] = useState<CaseMessage[]>([]);
    const [cases, setCases] = useState<CareCase[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
    const [storageInfo, setStorageInfo] = useState({ used: 0, available: 0, percentage: 0 });

    // Initialize service
    useEffect(() => {
        if (user) {
            offlineMessageService.init({
                userId: user.id,
                userRole: user.role,
                userName: user.name,
            }).then(() => {
                console.log('✅ Offline message service initialized');
                loadCases();
                updateStatus();
            });
        }
    }, [user]);

    // Load messages for specific case
    const loadMessages = useCallback(async (targetCaseId: string) => {
        try {
            const msgs = await offlineMessageService.getMessages(targetCaseId);
            setMessages(msgs);
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }, []);

    // Load cases for current user
    const loadCases = useCallback(async () => {
        try {
            const userCases = await offlineMessageService.getUserCases();
            setCases(userCases);
        } catch (error) {
            console.error('Error loading cases:', error);
        }
    }, []);

    // Send a message
    const sendMessage = useCallback(async (targetCaseId: string, content: string) => {
        try {
            const newMessage = await offlineMessageService.sendMessage(targetCaseId, content);

            // Update messages if viewing this case
            if (caseId === targetCaseId) {
                setMessages(prev => [...prev, newMessage]);
            }

            // Update pending count
            updateStatus();
        } catch (error) {
            console.error('Error sending message:', error);
            throw error;
        }
    }, [caseId]);

    // Sync now
    const syncNow = useCallback(async () => {
        if (isSyncing) return;

        setIsSyncing(true);
        try {
            await offlineMessageService.syncPendingMessages();

            // Reload messages and update status
            if (caseId) {
                await loadMessages(caseId);
            }
            await updateStatus();
        } catch (error) {
            console.error('Error syncing:', error);
        } finally {
            setIsSyncing(false);
        }
    }, [caseId, isSyncing, loadMessages]);

    // Update status (pending count, sync time, etc.)
    const updateStatus = useCallback(async () => {
        try {
            const count = await offlineMessageService.getPendingCount();
            setPendingCount(count);

            const syncTime = offlineMessageService.getLastSyncTime();
            setLastSyncTime(syncTime);

            const storage = offlineMessageService.getStorageInfo();
            setStorageInfo(storage);
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }, []);

    // Load messages when caseId changes
    useEffect(() => {
        if (caseId) {
            loadMessages(caseId);
        }
    }, [caseId, loadMessages]);

    // Listen for online/offline events
    useEffect(() => {
        const handleOnline = () => {
            setIsOffline(false);
            syncNow();
        };

        const handleOffline = () => {
            setIsOffline(true);
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, [syncNow]);

    // Update status periodically
    useEffect(() => {
        const interval = setInterval(updateStatus, 10000); // Every 10 seconds
        return () => clearInterval(interval);
    }, [updateStatus]);

    return {
        messages,
        cases,
        sendMessage,
        loadMessages,
        loadCases,
        pendingCount,
        isOffline,
        isSyncing,
        lastSyncTime,
        syncNow,
        storageInfo,
    };
}
