'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { prescriptions } from '@/lib/data';
import type { Prescription } from '@/lib/types';
import { Download, Calendar, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';

export default function PrescriptionsPage() {
  const { t } = useTranslation();

  const handleDownload = (prescription: Prescription) => {
    const prescriptionContent = `
Prescription from: ${prescription.doctorName}
Date: ${format(new Date(prescription.date), 'MMMM dd, yyyy')}

------------------------------------
Medications:
------------------------------------
${prescription.medicines
  .map(
    (med) => `
- Medication: ${med.name}
  Dosage: ${med.dosage}
  Duration: ${med.duration}
`
  )
  .join('\n')}

------------------------------------
This is a digitally generated prescription from MedCord.
    `;

    const blob = new Blob([prescriptionContent.trim()], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medcord-prescription-${prescription.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {prescriptions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {prescriptions.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>{t('prescription-from', { doctorName: p.doctorName })}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 
                    <span>{format(new Date(p.date), 'MMMM dd, yyyy')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <h4 className="font-semibold">{t('medications')}</h4>
                    <ul className="space-y-3">
                        {p.medicines.map((med, index) => (
                            <li key={index} className="text-sm">
                                <div className="flex items-start gap-3">
                                    <Pill className="h-4 w-4 mt-1 text-primary"/>
                                    <div>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-muted-foreground">{t('dosage-for-duration', { dosage: med.dosage, duration: med.duration })}</p>
                                    </div>
                                </div>
                                {index < p.medicines.length - 1 && <Separator className="my-3"/>}
                            </li>
                        ))}
                    </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={() => handleDownload(p)}>
                  <Download className="mr-2 h-4 w-4" /> {t('download-prescription')}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-6">
                 <p className="text-muted-foreground text-center">{t('no-prescriptions')}</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
