import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Doctor } from "@/lib/types";
import { MapPin, Clock } from "lucide-react";
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
    <Card className="transition-all hover:shadow-lg overflow-hidden group">
      <div className="relative w-full h-48">
        <Image
          src={doctor.avatarUrl}
          alt={`Portrait of ${doctor.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          data-ai-hint="doctor portrait"
        />
      </div>
      <CardHeader>
          <CardTitle>{doctor.name}</CardTitle>
          <CardDescription>{doctor.specialty}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4 text-sm">
        <div className="space-y-2 text-muted-foreground">
             <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{doctor.clinic}</span>
             </div>
             <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{t('km-away', { distance: doctor.distance })}</span>
             </div>
        </div>
        <div className="flex items-center justify-between pt-2">
            {getAvailabilityBadge(doctor.availability)}
            <Button size="sm">
              {t('book-appointment')}
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
