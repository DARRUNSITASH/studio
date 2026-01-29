'use client';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/doctor-card";
import { doctors } from "@/lib/data";
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";

export default function DiscoverPage() {
  const { t } = useTranslation();
  const specialties = [
    ...new Set(doctors.map((doctor) => doctor.specialty)),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder={t('search-doctor-clinic')} className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Select>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t('filter-by-specialty')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('all-specialties')}</SelectItem>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('filter-by-distance')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">{t('any-distance')}</SelectItem>
              <SelectItem value="5">{t('under-5km')}</SelectItem>
              <SelectItem value="10">{t('under-10km')}</SelectItem>
              <SelectItem value="20">{t('under-20km')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
}
