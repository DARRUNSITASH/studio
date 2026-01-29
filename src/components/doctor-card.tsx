import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Doctor } from "@/lib/types";
import { MapPin, User, Stethoscope, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

type DoctorCardProps = {
  doctor: Doctor;
};

export function DoctorCard({ doctor }: DoctorCardProps) {
  const { t } = useTranslation();
  const getAvailabilityBadge = (
    availability: "available" | "soon" | "unavailable"
  ) => {
    switch (availability) {
      case "available":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            {t('availability-available')}
          </Badge>
        );
      case "soon":
        return (
          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
            {t('availability-soon')}
          </Badge>
        );
      case "unavailable":
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-800">
            {t('availability-unavailable')}
          </Badge>
        );
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-40">
          <Image
            src={doctor.avatarUrl}
            alt={`Photo of ${doctor.name}`}
            fill
            className="object-cover object-top"
            data-ai-hint="doctor portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center mt-[-40px] relative">
            <div className="inline-block p-1 bg-background rounded-full">
                <Image
                    src={doctor.avatarUrl}
                    alt={`Avatar of ${doctor.name}`}
                    width={64}
                    height={64}
                    className="rounded-full border-4 border-background"
                    data-ai-hint="doctor avatar"
                />
            </div>
            <h3 className="text-lg font-bold font-headline mt-2">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        </div>
        
        <div className="text-sm space-y-2 text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{doctor.clinic}</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{t('km-away', { distance: doctor.distance })}</span>
             </div>
             <div className="flex items-center gap-2">
                {getAvailabilityBadge(doctor.availability)}
             </div>
        </div>

        <Button className="w-full" variant="secondary">
          {t('book-appointment')}
        </Button>
      </CardContent>
    </Card>
  );
}
