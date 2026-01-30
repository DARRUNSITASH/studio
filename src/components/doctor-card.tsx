import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { Doctor } from "@/lib/types";
import { MapPin, Clock, CalendarClock } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type DoctorCardProps = {
  doctor: Doctor;
  onBook: (doctor: Doctor, selectedTime: string) => void;
};

export function DoctorCard({ doctor, onBook }: DoctorCardProps) {
  const { t } = useTranslation();
  const [selectedTime, setSelectedTime] = useState<string>("09:00 AM");

  const timeSlots = [
    "09:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"
  ];

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
      <CardHeader className="items-center text-center p-6">
        <CardTitle>{doctor.name}</CardTitle>
        <CardDescription>{doctor.specialty}</CardDescription>
      </CardHeader>
      <CardContent className="pt-0 space-y-4 text-sm px-6 pb-6">
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

        <div className="space-y-2">
          <Label className="text-xs font-semibold flex items-center gap-1">
            <CalendarClock className="h-3 w-3" /> Select Time
          </Label>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-full h-8 text-xs">
              <SelectValue placeholder="Choose time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time} className="text-xs">
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between pt-2">
          {getAvailabilityBadge(doctor.availability)}
          <Button size="sm" onClick={() => onBook(doctor, selectedTime)} disabled={doctor.availability === 'unavailable'}>
            {t('book-appointment')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
