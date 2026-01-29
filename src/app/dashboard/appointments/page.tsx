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
import { appointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { Video, MessageSquare, Building, Calendar, Clock, Check, X } from 'lucide-react';
import { format } from 'date-fns';

const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'upcoming':
        return <Badge className="bg-blue-100 text-blue-800">{status}</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">{status}</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">{status}</Badge>;
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
            <span>{appointment.type} Consultation</span>
        </div>
      </CardContent>
      {appointment.status === 'upcoming' && (
        <CardFooter className="flex gap-2">
          <Button className="w-full">
            <Check className="mr-2 h-4 w-4" /> Join Call
          </Button>
          <Button variant="outline" className="w-full">
            <X className="mr-2 h-4 w-4" /> Cancel
          </Button>
        </CardFooter>
      )}
       {appointment.status === 'completed' && (
        <CardFooter>
          <Button variant="secondary" className="w-full">View Details</Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default function AppointmentsPage() {
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'upcoming'
  );
  const pastAppointments = appointments.filter(
    (a) => a.status === 'completed' || a.status === 'cancelled'
  );

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <TabsList>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="past">Past</TabsTrigger>
      </TabsList>
      <TabsContent value="upcoming">
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You have no upcoming appointments.</p>
        )}
      </TabsContent>
      <TabsContent value="past">
       {pastAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastAppointments.map((app) => (
              <AppointmentCard key={app.id} appointment={app} />
            ))}
          </div>
        ) : (
             <p className="text-muted-foreground">You have no past appointments.</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
