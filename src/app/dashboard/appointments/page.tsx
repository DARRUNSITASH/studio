'use client';
import { useState, useContext } from 'react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '@/lib/types';
import { Video, MessageSquare, Building, Calendar, Clock, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import { useTranslation } from '@/hooks/use-translation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppContext } from '@/context/AppContext';

const AppointmentCard = ({
  appointment,
  onCancelClick,
  onViewDetailsClick,
}: {
  appointment: Appointment;
  onCancelClick: () => void;
  onViewDetailsClick: () => void;
}) => {
  const { t } = useTranslation();
  const getStatusBadge = (status: Appointment['status']) => {
    const statusKey = `status-${status}`;
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">{t(statusKey)}</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">{t(statusKey)}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">{t(statusKey)}</Badge>;
    }
  };

  const getConsultationIcon = (type: Appointment['type']) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      case 'in-person':
        return <Building className="h-4 w-4" />;
    }
  };

  const getConsultationType = (type: Appointment['type']) => {
    const typeKey = `${type}-consultation`;
    return t(typeKey);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>{appointment.doctorName}</CardTitle>
                <CardDescription>{appointment.specialty}</CardDescription>
            </div>
            {getStatusBadge(appointment.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(new Date(appointment.date), 'MMMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{appointment.time}</span>
        </div>
        <div className="flex items-center gap-2 capitalize">
            {getConsultationIcon(appointment.type)}
            <span>{getConsultationType(appointment.type)}</span>
        </div>
      </CardContent>
      {appointment.status === 'upcoming' && (
        <CardFooter className="flex gap-2">
          {appointment.type !== 'in-person' && appointment.meetLink ? (
            <Button className="w-full" asChild>
              <Link href={appointment.meetLink} target="_blank" rel="noopener noreferrer">
                <Check className="mr-2 h-4 w-4" /> {t('join-call')}
              </Link>
            </Button>
          ) : (
             <Button className="w-full" disabled>
                <Check className="mr-2 h-4 w-4" /> {t('join-call')}
              </Button>
          )}
          <Button variant="outline" className="w-full" onClick={onCancelClick}>
            <X className="mr-2 h-4 w-4" /> {t('cancel-appointment')}
          </Button>
        </CardFooter>
      )}
       {appointment.status === 'completed' && (
        <CardFooter>
          <Button variant="secondary" className="w-full" onClick={onViewDetailsClick}>{t('view-details')}</Button>
        </CardFooter>
      )}
      {appointment.status === 'cancelled' && (
        <CardFooter>
          <Button variant="ghost" disabled className="w-full text-muted-foreground">{t('status-cancelled')}</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const { appointments, setAppointments } = useContext(AppContext);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const handleCancel = (appointmentToCancel: Appointment) => {
    setSelectedAppointment(appointmentToCancel);
    setIsCancelDialogOpen(true);
  };
  
  const handleConfirmCancel = () => {
    if (!selectedAppointment) return;
    setAppointments(currentAppointments => 
      currentAppointments.map(app => 
        app.id === selectedAppointment.id ? { ...app, status: 'cancelled' } : app
      )
    );
    setIsCancelDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleViewDetails = (appointmentToView: Appointment) => {
    setSelectedAppointment(appointmentToView);
    setIsDetailsDialogOpen(true);
  };

  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'upcoming'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );
  
    const getConsultationType = (type: Appointment['type']) => {
    const typeKey = `${type}-consultation`;
    return t(typeKey);
  }


  return (
    <>
      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">{t('upcoming-appointments')}</TabsTrigger>
          <TabsTrigger value="past">{t('past-appointments')}</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((app) => (
                <AppointmentCard 
                  key={app.id} 
                  appointment={app} 
                  onCancelClick={() => handleCancel(app)}
                  onViewDetailsClick={() => {}}
                />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">{t('no-upcoming-appointments')}</p>
          )}
        </TabsContent>
        <TabsContent value="past">
        {pastAppointments.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map((app) => (
                <AppointmentCard 
                  key={app.id} 
                  appointment={app} 
                  onCancelClick={() => {}}
                  onViewDetailsClick={() => handleViewDetails(app)}
                />
              ))}
            </div>
          ) : (
              <p className="text-muted-foreground">{t('no-past-appointments')}</p>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to cancel?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently cancel your appointment with {selectedAppointment?.doctorName}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedAppointment(null)}>Back</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} className="bg-destructive hover:bg-destructive/90">Confirm Cancellation</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={(isOpen) => {
        setIsDetailsDialogOpen(isOpen);
        if (!isOpen) setSelectedAppointment(null);
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            {selectedAppointment && (
              <DialogDescription>
                Details for your {selectedAppointment.status} appointment with {selectedAppointment.doctorName}.
              </DialogDescription>
            )}
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4 py-4 text-sm">
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName} ({selectedAppointment.specialty})</p>
              <p><strong>Clinic:</strong> {selectedAppointment.clinic}</p>
              <p><strong>Date:</strong> {format(new Date(selectedAppointment.date), 'MMMM dd, yyyy')} at {selectedAppointment.time}</p>
              <p><strong>Type:</strong> <span className="capitalize">{getConsultationType(selectedAppointment.type)}</span></p>
              <p><strong>Status:</strong> <span className="capitalize">{t(`status-${selectedAppointment.status}`)}</span></p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
