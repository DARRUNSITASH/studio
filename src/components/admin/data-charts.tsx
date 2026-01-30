'use client';

import { useMemo, useContext } from 'react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
    RadialBarChart,
    RadialBar,
} from 'recharts';
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    ChartConfig,
} from '@/components/ui/chart';
import { AppContext } from '@/context/AppContext';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function AppointmentStatusChart() {
    const { appointments } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            acc[app.status] = (acc[app.status] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [appointments]);

    const config = {
        upcoming: { label: 'Upcoming', color: '#3b82f6' },
        completed: { label: 'Completed', color: '#10b981' },
        cancelled: { label: 'Cancelled', color: '#ef4444' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
            </PieChart>
        </ChartContainer>
    );
}

export function ConsultationTypeChart() {
    const { appointments } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            acc[app.type] = (acc[app.type] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name: name.charAt(0).toUpperCase() + name.slice(1), value }));
    }, [appointments]);

    const config = {
        value: { label: 'Count', color: '#3b82f6' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

export function SpecialtyDistributionChart() {
    const { doctors } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = doctors.reduce((acc, doc) => {
            acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [doctors]);

    const config = {
        value: { label: 'Doctors', color: '#8b5cf6' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} fontSize={10} />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

export function AppointmentTrendChart() {
    const { appointments } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            acc[app.date] = (acc[app.date] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [appointments]);

    const config = {
        count: { label: 'Appointments', color: '#10b981' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Area type="monotone" dataKey="count" stroke="#10b981" fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
        </ChartContainer>
    );
}

export function MedicationPopularityChart() {
    const { prescriptions } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = prescriptions.flatMap(p => p.medicines).reduce((acc, med) => {
            acc[med.name] = (acc[med.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [prescriptions]);

    const config = {
        value: { label: 'Prescribed', color: '#f59e0b' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

export function DoctorAvailabilityChart() {
    const { doctors } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = doctors.reduce((acc, doc) => {
            acc[doc.availability] = (acc[doc.availability] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [doctors]);

    const config = {
        available: { label: 'Available', color: '#10b981' },
        soon: { label: 'Coming Soon', color: '#f59e0b' },
        unavailable: { label: 'Unavailable', color: '#ef4444' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={entry.name === 'available' ? '#10b981' : entry.name === 'soon' ? '#f59e0b' : '#ef4444'}
                        />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
            </PieChart>
        </ChartContainer>
    );
}

export function PatientClinicDistributionChart() {
    const { appointments } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            const clinicName = app.clinic.split(',')[0]; // Get the clinic name part
            acc[clinicName] = (acc[clinicName] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [appointments]);

    const config = {
        value: { label: 'Appointments', color: '#3b82f6' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={10} interval={0} />
                <YAxis />
                <Tooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ChartContainer>
    );
}

export function SpecialtyDemandChart() {
    const { appointments } = useContext(AppContext);
    const data = useMemo(() => {
        const counts = appointments.reduce((acc, app) => {
            acc[app.specialty] = (acc[app.specialty] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(counts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [appointments]);

    const config = {
        value: { label: 'Bookings', color: '#10b981' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={<ChartTooltipContent />} />
                <Legend />
            </PieChart>
        </ChartContainer>
    );
}

export function PlatformCapacityChart() {
    const { doctors } = useContext(AppContext);
    const data = useMemo(() => {
        const total = doctors.length;
        const available = doctors.filter(d => d.availability === 'available').length;

        return [
            {
                name: 'Available',
                value: available,
                fill: '#10b981',
            },
            {
                name: 'Total',
                value: total,
                fill: '#e5e7eb',
            },
        ];
    }, [doctors]);

    const config = {
        value: { label: 'Capacity' },
    } satisfies ChartConfig;

    return (
        <ChartContainer config={config} className="h-[300px] w-full">
            <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="100%"
                barSize={20}
                data={data}
                startAngle={180}
                endAngle={0}
            >
                <RadialBar
                    label={{ position: 'insideStart', fill: '#000' }}
                    background
                    dataKey="value"
                />
                <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
                <Tooltip content={<ChartTooltipContent />} />
            </RadialBarChart>
        </ChartContainer>
    );
}
