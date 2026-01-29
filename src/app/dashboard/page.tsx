'use client';
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
import { useTranslation } from '@/hooks/use-translation';

export default function DashboardPage() {
  const { t } = useTranslation();

  const featureCards = [
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
  ];

  return (
    <div className="flex-1 space-y-4">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="pb-4">
          <CardTitle>{t('welcome-to-medcord')}</CardTitle>
          <CardDescription className="text-primary-foreground/80">
            {t('teleconsultation-prompt')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="secondary" className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Video className="mr-2 h-4 w-4" /> {t('start-teleconsultation')}
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
