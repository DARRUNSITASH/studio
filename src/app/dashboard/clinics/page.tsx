'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Stethoscope, MapPin, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ClinicsPage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">{t('clinics')}</h2>
                <Button size="sm">Add Clinic</Button>
            </div>

            <div className="grid gap-4">
                {[
                    { name: 'Adyar Primary Health Centre', location: 'Chennai', status: 'Active', doctors: 12 },
                    { name: 'Madurai North Local Clinic', location: 'Madurai', status: 'Active', doctors: 8 },
                    { name: 'Coimbatore West Clinic', location: 'Coimbatore', status: 'Maintenance', doctors: 15 },
                ].map((clinic, i) => (
                    <Card key={i}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between">
                                <CardTitle className="text-lg flex items-center">
                                    <Building2 className="mr-2 h-5 w-5 text-muted-foreground" />
                                    {clinic.name}
                                </CardTitle>
                                <span className={`text-xs px-2 py-1 rounded-full ${clinic.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {clinic.status}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground mb-2">
                                <MapPin className="mr-1 h-4 w-4" /> {clinic.location}
                            </div>
                            <div className="flex items-center text-sm font-medium">
                                <Stethoscope className="mr-1 h-4 w-4" /> {clinic.doctors} registered practitioners
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
