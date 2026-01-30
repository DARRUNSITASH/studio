'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useContext, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { AppContext } from '@/context/AppContext';
import { useTranslation } from '@/hooks/use-translation';
import { UserRole } from '@/lib/types';
import { Check, Globe } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function UnifiedLoginPage() {
  const router = useRouter();
  const { t, locale, setLocale } = useTranslation();
  const { setUser } = useContext(AppContext);
  const [role, setRole] = useState<UserRole>('patient');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: role === 'patient' ? 'John Patient' : role === 'doctor' ? 'Dr. Smith' : 'Admin User',
      email: `${role}@medcord.com`,
      role: role,
    });
    router.push('/dashboard');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi (हिंदी)' },
    { code: 'ta', label: 'Tamil (தமிழ்)' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-2 mb-8 text-center">
        <div className="flex items-center gap-3">
          <Logo className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold font-headline">Medcord</h1>
        </div>
        <p className="text-muted-foreground uppercase tracking-widest text-xs font-bold">save lives at instant</p>
      </div>

      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
        <CardHeader className="space-y-1 pb-6 text-center">
          <CardTitle className="text-2xl font-bold">{t('login') || 'Login'}</CardTitle>
          <CardDescription>
            Choose your language and role to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Globe className="h-3 w-3" /> Select Language
            </Label>
            <div className="grid grid-cols-3 gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang.code}
                  variant={locale === lang.code ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs h-9"
                  onClick={() => setLocale(lang.code as any)}
                >
                  {lang.label}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Role</Label>
              <RadioGroup
                defaultValue="patient"
                className="grid grid-cols-3 gap-2"
                onValueChange={(v) => setRole(v as UserRole)}
              >
                <div>
                  <RadioGroupItem value="patient" id="patient" className="peer sr-only" />
                  <Label
                    htmlFor="patient"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs font-medium">Patient</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="doctor" id="doctor" className="peer sr-only" />
                  <Label
                    htmlFor="doctor"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs font-medium">Doctor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="admin" id="admin" className="peer sr-only" />
                  <Label
                    htmlFor="admin"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    <span className="text-xs font-medium">Admin</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="email">{t('email') || 'Email'}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{t('password') || 'Password'}</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                {t('login') || 'Login'}
              </Button>
            </div>
          </form>

          <div className="text-center text-sm text-neutral-500">
            {t('dont-have-account') || "Don't have an account?"}{' '}
            <Link href="/signup" className="underline font-medium text-primary">
              {t('signup') || 'Sign up'}
            </Link>
          </div>
        </CardContent>
      </Card>

      <footer className="mt-8 text-muted-foreground text-xs">
        © 2026 Medcord Health Systems · Build v1.0.4
      </footer>
    </div>
  );
}
