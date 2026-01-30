'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { ShieldCheck, UserCog, Bell, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('system-settings')}</h2>

            <div className="grid gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <ShieldCheck className="mr-2 h-5 w-5" /> Security & Access Control
                        </CardTitle>
                        <CardDescription>Manage global security policies and role permissions.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="mfa">Enforce 2FA for all medical staff</Label>
                            <Switch id="mfa" checked />
                        </div>
                        <div className="flex items-center justify-between">
                            <Label htmlFor="logs">Enable detailed audit logging</Label>
                            <Switch id="logs" checked />
                        </div>
                        <Button variant="outline" className="w-full mt-4">Edit Role Permissions</Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="mr-2 h-5 w-5" /> Data & Storage
                        </CardTitle>
                        <CardDescription>Configure data retention and backup settings.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                            <span>Monthly Backup</span>
                            <span className="text-green-600 font-bold italic">Scheduled: Nov 1st</span>
                        </div>
                        <Button variant="secondary" className="w-full">Run Manual Backup</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
