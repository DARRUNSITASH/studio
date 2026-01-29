'use client';
import { useState, useMemo, useContext } from 'react';
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DoctorCard } from "@/components/doctor-card";
import { Doctor } from '@/lib/types';
import { Search } from "lucide-react";
import { useTranslation } from "@/hooks/use-translation";
import { AppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { add, format } from 'date-fns';

export default function DiscoverPage() {
  const { t } = useTranslation();
  const { doctors, addAppointment } = useContext(AppContext);
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('all');
  const [selectedDistance, setSelectedDistance] = useState('any');

  const specialties = useMemo(() => 
    ['all', ...new Set(doctors.map((doctor) => doctor.specialty))]
  , [doctors]);

  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Search filter
      const matchesSearch = searchTerm.trim() === '' || 
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.clinic.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Specialty filter
      const matchesSpecialty = selectedSpecialty === 'all' || doctor.specialty === selectedSpecialty;

      // Distance filter
      const matchesDistance = selectedDistance === 'any' || doctor.distance <= parseInt(selectedDistance);

      return matchesSearch && matchesSpecialty && matchesDistance;
    });
  }, [doctors, searchTerm, selectedSpecialty, selectedDistance]);

  const handleBookAppointment = (doctor: Doctor) => {
    const newAppointmentDate = add(new Date(), { days: 1 });
    const newAppointment = {
        id: Math.random().toString(36).substr(2, 9),
        doctorName: doctor.name,
        specialty: doctor.specialty,
        clinic: doctor.clinic,
        date: format(newAppointmentDate, 'yyyy-MM-dd'),
        time: '11:00 AM',
        status: 'upcoming' as const,
        type: 'video' as const,
        meetLink: 'https://meet.google.com/new',
    };
    addAppointment(newAppointment);
    toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${doctor.name} has been scheduled for tomorrow at 11:00 AM.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            placeholder={t('search-doctor-clinic')} 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder={t('filter-by-specialty')} />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((specialty) => (
                <SelectItem key={specialty} value={specialty}>
                  {specialty === 'all' ? t('all-specialties') : specialty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedDistance} onValueChange={setSelectedDistance}>
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
        {filteredDoctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} onBook={handleBookAppointment} />
        ))}
      </div>
    </div>
  );
}
