'use client';
import Link from 'next/link';
import { useContext, useMemo } from 'react';
import {
  AppointmentStatusChart,
  SpecialtyDistributionChart,
  DoctorAvailabilityChart,
  AppointmentTrendChart,
  SpecialtyDemandChart,
  PlatformCapacityChart
} from '@/components/admin/data-charts';
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Users,
  FileText,
  Video,
  Clock,
  Calendar,
  Activity,
  UserPlus,
  Settings,
  Globe,
  BarChart3,
  ClipboardList,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/use-translation';
import { AppContext } from '@/context/AppContext';
import { UserRole } from '@/lib/types';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { user, appointments, cases } = useContext(AppContext);
  const userRole: UserRole = user?.role || 'patient';

  const upcomingAppointment = useMemo(() => {
    const filtered = appointments.filter(a => a.status === 'upcoming');
    // For patients, show their next appointment. For doctors, show their queue.
    return filtered[0] || null;
  }, [appointments]);

  const getFeatureCards = (role: UserRole) => {
    switch (role) {
      case 'doctor':
        const pendingCases = cases.filter(c => c.doctorId === user?.id && c.status === 'pending');
        return [
          {
            title: t('todays-schedule'),
            description: "View and manage your appointments for today.",
            icon: Calendar,
            href: '/dashboard/appointments',
            cta: "View Schedule",
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: t('offline-messages'),
            description: pendingCases.length > 0
              ? `You have ${pendingCases.length} new patient cases to review.`
              : "Review and respond to asynchronous patient cases.",
            icon: Clock,
            href: '/dashboard/cases',
            cta: "Process Cases",
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
          },
          {
            title: t('patient-records'),
            description: "Access historical patient data and prescriptions.",
            icon: ClipboardList,
            href: '/dashboard/records',
            cta: "Open Records",
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            title: t('create-manage-prescriptions'),
            description: "Issue and manage digital prescriptions.",
            icon: FileText,
            href: '/dashboard/prescriptions',
            cta: "Manage Prescriptions",
            color: 'text-green-500',
            bgColor: 'bg-green-50',
          },
        ];
      case 'admin':
        return [
          {
            title: t('user-management'),
            description: t('manage-patients') + " & " + t('manage-doctors'),
            icon: Users,
            href: '/dashboard/users',
            cta: "Manage Users",
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: t('consultation-monitoring'),
            description: t('status-tracking') + " for all platforms activity.",
            icon: Activity,
            href: '/dashboard/monitoring',
            cta: "Monitor Activity",
            color: 'text-red-500',
            bgColor: 'bg-red-50',
          },
          {
            title: t('language-management'),
            description: t('enable-disable-languages'),
            icon: Globe,
            href: '/dashboard/languages',
            cta: "Manage Languages",
            color: 'text-green-500',
            bgColor: 'bg-green-50',
          },
          {
            title: t('reports-logs'),
            description: t('usage-reports') + " & " + t('system-logs'),
            icon: BarChart3,
            href: '/dashboard/reports',
            cta: "View Reports",
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
          },
        ];
      case 'patient':
      default:
        return [
          {
            title: t('ai-symptom-checker'),
            description: t('ai-symptom-checker-desc'),
            icon: HeartPulse,
            href: '/dashboard/triage',
            cta: t('check-symptoms'),
            color: 'text-red-500',
            bgColor: 'bg-red-50',
          },
          {
            title: t('find-a-doctor'),
            description: t('find-a-doctor-desc'),
            icon: Stethoscope,
            href: '/dashboard/discover',
            cta: t('find-doctor'),
            color: 'text-blue-500',
            bgColor: 'bg-blue-50',
          },
          {
            title: t('my-appointments'),
            description: t('my-appointments-desc'),
            icon: Users,
            href: '/dashboard/appointments',
            cta: t('view-appointments'),
            color: 'text-green-500',
            bgColor: 'bg-green-50',
          },
          {
            title: t('my-prescriptions'),
            description: t('my-prescriptions-desc'),
            icon: FileText,
            href: '/dashboard/prescriptions',
            cta: t('view-prescriptions'),
            color: 'text-purple-500',
            bgColor: 'bg-purple-50',
          },
          {
            title: t('offline-messages'),
            description: "View and reply to doctor messages even without internet.",
            icon: Clock,
            href: '/dashboard/cases',
            cta: "Open Inbox",
            color: 'text-orange-500',
            bgColor: 'bg-orange-50',
          },
        ];
    }
  };

  const featureCards = getFeatureCards(userRole);

  const getWelcomeContent = (role: UserRole) => {
    switch (role) {
      case 'doctor':
        return {
          title: "Doctor Dashboard",
          desc: upcomingAppointment
            ? `Next appointment: ${upcomingAppointment.patientName} at ${upcomingAppointment.time}`
            : "No pending consultations today.",
          cta: upcomingAppointment ? "Join Next Consultation" : "View Queue",
          icon: Video,
          href: upcomingAppointment?.meetLink || "/dashboard/appointments"
        };
      case 'admin':
        return {
          title: "Admin Control Center",
          desc: "System status is healthy. Platform monitoring active.",
          cta: "System Health",
          icon: Settings,
          href: "/dashboard/monitoring"
        };
      case 'patient':
      default:
        return {
          title: t('welcome-to-medcord'),
          desc: upcomingAppointment
            ? `Reminder: You have an appointment with ${upcomingAppointment.doctorName} at ${upcomingAppointment.time}.`
            : t('teleconsultation-prompt'),
          cta: upcomingAppointment ? "Join Call" : t('find-doctor'),
          icon: upcomingAppointment ? Video : Stethoscope,
          href: upcomingAppointment?.meetLink || "/dashboard/discover"
        };
    }
  };

  const welcome = getWelcomeContent(userRole);

  return (
    <div className="flex-1 space-y-4">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-4">
          <CardTitle>{welcome.title}</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {welcome.desc}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={welcome.href} target={welcome.href.startsWith('http') ? "_blank" : "_self"} rel="noopener noreferrer">
            <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <welcome.icon className="mr-2 h-4 w-4" /> {welcome.cta}
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {featureCards.map((feature) => (
          <Card key={feature.title} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1.5">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <div className={`p-2 rounded-full ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="mt-auto">
              <Link href={feature.href}>
                <Button className="w-full">
                  {feature.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {userRole === 'admin' && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Status Distribution</CardTitle>
              <CardDescription>Overview of all appointments across the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentStatusChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Doctor Specialty Distribution</CardTitle>
              <CardDescription>Breakdown of available medical expertise.</CardDescription>
            </CardHeader>
            <CardContent>
              <SpecialtyDistributionChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Doctor Availability</CardTitle>
              <CardDescription>Current status of platform medical staff.</CardDescription>
            </CardHeader>
            <CardContent>
              <DoctorAvailabilityChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Platform Capacity</CardTitle>
              <CardDescription>Available vs total medical personnel capacity.</CardDescription>
            </CardHeader>
            <CardContent>
              <PlatformCapacityChart />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Specialty Demand</CardTitle>
              <CardDescription>Most requested medical specialties by patients.</CardDescription>
            </CardHeader>
            <CardContent>
              <SpecialtyDemandChart />
            </CardContent>
          </Card>
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Appointment Trends</CardTitle>
              <CardDescription>Frequency of medical consultations over time.</CardDescription>
            </CardHeader>
            <CardContent>
              <AppointmentTrendChart />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
