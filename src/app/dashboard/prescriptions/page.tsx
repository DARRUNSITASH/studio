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
import { Download, Calendar, Pill } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '@/components/ui/separator';

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6">
      {prescriptions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {prescriptions.map((p) => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle>Prescription from {p.doctorName}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> 
                    <span>{format(new Date(p.date), 'MMMM dd, yyyy')}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                    <h4 className="font-semibold">Medications</h4>
                    <ul className="space-y-3">
                        {p.medicines.map((med, index) => (
                            <li key={index} className="text-sm">
                                <div className="flex items-start gap-3">
                                    <Pill className="h-4 w-4 mt-1 text-primary"/>
                                    <div>
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-muted-foreground">{med.dosage} for {med.duration}</p>
                                    </div>
                                </div>
                                {index < p.medicines.length - 1 && <Separator className="my-3"/>}
                            </li>
                        ))}
                    </ul>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Prescription
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
            <CardContent className="p-6">
                 <p className="text-muted-foreground text-center">You have no prescriptions.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
