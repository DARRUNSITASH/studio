'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Users, UserPlus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UsersPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('user-management')}</h2>
                <Button size="sm">
                    <UserPlus className="mr-2 h-4 w-4" /> Add User
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">12,450</div>
                        <p className="text-xs text-muted-foreground">+180 this month</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Active Doctors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84</div>
                        <p className="text-xs text-muted-foreground">5 currently online</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">4</div>
                        <p className="text-xs text-muted-foreground">System-level access</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Registrations</CardTitle>
                    <CardDescription>Verify and approve new medical staff applications.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2].map(i => (
                            <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                <div className="flex items-center space-x-3">
                                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">D</div>
                                    <div>
                                        <div className="text-sm font-bold">Dr. Sarah Jenkins</div>
                                        <div className="text-xs text-muted-foreground">Cardiology · MD from AIIMS</div>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm">Review Docs</Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
