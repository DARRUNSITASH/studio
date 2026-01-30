'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Activity, ShieldCheck, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useContext } from 'react';
import { AppContext } from '@/context/AppContext';

export default function MonitoringPage() {
    const { t } = useTranslation();
    const { appointments, prescriptions } = useContext(AppContext);

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('consultation-monitoring')}</h2>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                            <Activity className="mr-2 h-4 w-4" /> Live Consultations
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{appointments.filter(a => a.status === 'upcoming').length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Upcoming consultations</p>
                        <Progress value={75} className="mt-4" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center">
                            <Clock className="mr-2 h-4 w-4" /> Async Queue
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold">{prescriptions.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total prescriptions issued</p>
                        <Progress value={50} className="mt-4" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>System Health</CardTitle>
                    <CardDescription>Real-time status of platform services.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Supabase Realtime</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Supabase PostgreSQL</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">Video Bridge (VPC)</span>
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-sm">AI Triage Engine</span>
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
