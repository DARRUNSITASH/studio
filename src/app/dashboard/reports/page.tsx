'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { BarChart3, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { ConsultationTypeChart, MedicationPopularityChart, PatientClinicDistributionChart } from '@/components/admin/data-charts';

export default function ReportsPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('reports-logs')}</h2>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export All
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Consultation Types Distribution</CardTitle>
                        <CardDescription>Breakdown of video, chat, and in-person sessions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ConsultationTypeChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Top Prescribed Medications</CardTitle>
                        <CardDescription>Most frequent medicines across all prescriptions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MedicationPopularityChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Clinic Activity Breakdown</CardTitle>
                        <CardDescription>Number of appointments at each local clinic.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PatientClinicDistributionChart />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Recent Audit Logs</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {[
                            { event: 'Admin Login', user: 'Admin #1', time: '5m ago' },
                            { event: 'New Doctor Approved', user: 'Admin #2', time: '1h ago' },
                            { event: 'System Config Updated', user: 'Admin #1', time: '3h ago' },
                        ].map((log, i) => (
                            <div key={i} className="flex justify-between text-xs border-b pb-2 last:border-0 last:pb-0">
                                <div>
                                    <div className="font-bold">{log.event}</div>
                                    <div className="text-muted-foreground">{log.user}</div>
                                </div>
                                <div className="text-muted-foreground">{log.time}</div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
