'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { FileText, Search, User, Activity } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function RecordsPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('patient-records')}</h2>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search patients by name or ID..."
                    className="pl-8"
                />
            </div>
            <div className="grid gap-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <CardTitle className="text-lg">Patient Record #{1000 + i}</CardTitle>
                                <div className="text-sm text-muted-foreground">Last visit: 15 Oct 2025</div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex space-x-2 mt-2">
                                <div className="flex items-center text-xs bg-muted px-2 py-1 rounded">
                                    <FileText className="mr-1 h-3 w-3" /> 5 Documents
                                </div>
                                <div className="flex items-center text-xs bg-muted px-2 py-1 rounded">
                                    <Activity className="mr-1 h-3 w-3" /> Vital Signs History
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
