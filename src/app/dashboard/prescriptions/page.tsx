'use client';
import { useContext } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Prescription } from '@/lib/types';
import { Download, Calendar, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from '@/hooks/use-translation';
import { AppContext } from '@/context/AppContext';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

function CreatePrescriptionDialog() {
  const { t } = useTranslation();
  const { user, appointments, addPrescription } = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', duration: '' }]);

  const activePatients = useMemo(() => {
    const doctorAppointments = appointments.filter(a => a.doctorId === user?.id || !a.doctorId); // Fallback for mock
    // Unique patients
    const patientMap = new Map();
    doctorAppointments.forEach(a => {
      if (a.patientId && a.patientName) {
        patientMap.set(a.patientId, a.patientName);
      }
    });
    return Array.from(patientMap.entries()).map(([id, name]) => ({ id, name }));
  }, [appointments, user]);

  const addMedicineRow = () => {
    setMedicines([...medicines, { name: '', dosage: '', duration: '' }]);
  };

  const removeMedicineRow = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index: number, field: string, value: string) => {
    const newMedicines = [...medicines];
    (newMedicines[index] as any)[field] = value;
    setMedicines(newMedicines);
  };

  const handleSave = () => {
    if (!selectedPatientId || medicines.some(m => !m.name)) return;

    const patientName = activePatients.find(p => p.id === selectedPatientId)?.name || 'Patient';

    addPrescription({
      id: Math.random().toString(36).substr(2, 9),
      patientId: selectedPatientId,
      patientName,
      doctorId: user?.id || '1',
      doctorName: user?.name || 'Doctor',
      date: new Date().toISOString(),
      medicines: medicines.filter(m => m.name),
    });

    setOpen(false);
    setSelectedPatientId('');
    setMedicines([{ name: '', dosage: '', duration: '' }]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> {t('create-prescription')}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t('create-prescription')}</DialogTitle>
          <DialogDescription>
            Add medications for your patient. Fill in all the details carefully.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>{t('select-patient')}</Label>
            <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
              <SelectTrigger>
                <SelectValue placeholder={t('select-patient')} />
              </SelectTrigger>
              <SelectContent>
                {activePatients.length > 0 ? (
                  activePatients.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))
                ) : (
                  <p className="p-2 text-sm text-muted-foreground">{t('no-patients-found')}</p>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>{t('medications')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={addMedicineRow}>
                <Plus className="mr-1 h-3 w-3" /> {t('add-medication')}
              </Button>
            </div>
            {medicines.map((med, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end border p-3 rounded-lg bg-muted/30">
                <div className="col-span-5 space-y-1.5">
                  <Label className="text-xs">{t('medication-name')}</Label>
                  <Input
                    value={med.name}
                    onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                    placeholder="e.g. Paracetamol"
                  />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label className="text-xs">{t('dosage')}</Label>
                  <Input
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                    placeholder="e.g. 500mg"
                  />
                </div>
                <div className="col-span-3 space-y-1.5">
                  <Label className="text-xs">{t('duration')}</Label>
                  <Input
                    value={med.duration}
                    onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                    placeholder="e.g. 5 days"
                  />
                </div>
                <div className="col-span-1 pb-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive"
                    onClick={() => removeMedicineRow(index)}
                    disabled={medicines.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>{t('cancel')}</Button>
          <Button onClick={handleSave} disabled={!selectedPatientId || medicines.some(m => !m.name)}>
            {t('save-prescription')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function PrescriptionsPage() {
  const { t } = useTranslation();
  const { user, prescriptions } = useContext(AppContext);
  const isDoctor = user?.role === 'doctor';

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
This is a digitally generated prescription from Medcord.
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('prescriptions')}</h2>
        {isDoctor && <CreatePrescriptionDialog />}
      </div>
      {prescriptions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {prescriptions.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>
                  {isDoctor
                    ? t('prescription-for', { patientName: p.patientName || 'Patient' })
                    : t('prescription-from', { doctorName: p.doctorName })}
                </CardTitle>
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
                          <Pill className="h-4 w-4 mt-1 text-primary" />
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-muted-foreground">{t('dosage-for-duration', { dosage: med.dosage, duration: med.duration })}</p>
                          </div>
                        </div>
                        {index < p.medicines.length - 1 && <Separator className="my-3" />}
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
