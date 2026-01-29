import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Doctor } from "@/lib/types";
import { MapPin, Clock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const nameParts = doctor.name.split(' ');
  const initials = nameParts.length > 1 ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}` : nameParts[0].substring(0, 2);

  return (
    <Card className="transition-all hover:shadow-lg hover:-translate-y-1 text-center">
      <CardContent className="p-6 space-y-4">
        <Avatar className="h-24 w-24 mx-auto mb-4 border-4 border-background">
            <AvatarImage src={doctor.avatarUrl} alt={`Avatar of ${doctor.name}`} data-ai-hint="doctor avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        
        <div className="space-y-1">
            <h3 className="text-lg font-bold font-headline">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
        </div>
        
        <div className="text-sm space-y-2 text-muted-foreground pt-4">
             <div className="flex items-center gap-2 justify-center">
                <MapPin className="h-4 w-4" />
                <span>{doctor.clinic}</span>
             </div>
             <div className="flex items-center gap-2 justify-center">
                <Clock className="h-4 w-4" />
                <span>{t('km-away', { distance: doctor.distance })}</span>
             </div>
             <div className="flex items-center gap-2 justify-center">
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
