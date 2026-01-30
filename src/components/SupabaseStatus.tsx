'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wifi, WifiOff, Database, AlertCircle } from 'lucide-react';

export function SupabaseStatus() {
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        // Check Supabase connection
        const checkConnection = async () => {
            if (!supabase) {
                setIsConnected(false);
                return;
            }

            try {
                const { error } = await supabase.from('profiles').select('count').limit(1);
                setIsConnected(!error);
            } catch {
                setIsConnected(false);
            }
        };

        checkConnection();

        // Monitor online/offline status
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    if (isConnected === null) {
        return null; // Loading
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border shadow-lg">
                {!isOnline ? (
                    <>
                        <WifiOff className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Offline Mode</span>
                    </>
                ) : isConnected ? (
                    <>
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Connected</span>
                    </>
                ) : (
                    <>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-muted-foreground">DB Error</span>
                    </>
                )}
            </div>
        </div>
    );
}
