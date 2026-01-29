import Link from 'next/link';
import {
  ArrowRight,
  HeartPulse,
  Stethoscope,
  Users,
  FileText,
  Video,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const featureCards = [
  {
    title: 'AI Symptom Checker',
    description: 'Get a preliminary assessment of your symptoms and find the right care.',
    icon: HeartPulse,
    href: '/dashboard/triage',
    cta: 'Check Symptoms',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Find a Doctor',
    description: 'Search for doctors and clinics near you and book appointments.',
    icon: Stethoscope,
    href: '/dashboard/discover',
    cta: 'Find Doctor',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'My Appointments',
    description: 'View your upcoming and past appointments with healthcare providers.',
    icon: Users,
    href: '/dashboard/appointments',
    cta: 'View Appointments',
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'My Prescriptions',
    description: 'Access your digital prescriptions and medication schedules.',
    icon: FileText,
    href: '/dashboard/prescriptions',
    cta: 'View Prescriptions',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-4">
          <CardTitle>Welcome to MedCord!</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            Need a quick consultation? Start a video call with an available doctor now.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Video className="mr-2 h-4 w-4" /> Start Teleconsultation
          </Button>
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
    </div>
  );
}
