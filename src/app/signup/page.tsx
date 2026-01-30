'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { UserRole } from '@/lib/types';

export default function SignupPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // NO AUTHENTICATION - Just show success
      setSuccess(true);

      // Redirect to login after 1 second
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } catch (err: any) {
      console.error('Signup error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Medcord</h1>
          </div>
          <CardTitle className="text-2xl">{t('signup')}</CardTitle>
          <CardDescription>
            {t('signup-desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="p-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md text-center">
              <p className="font-semibold">Account created successfully!</p>
              <p className="mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <form onSubmit={handleSignup}>
              <div className="grid gap-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {error}
                  </div>
                )}

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Select Role
                  </Label>
                  <RadioGroup
                    defaultValue="patient"
                    className="grid grid-cols-3 gap-2"
                    onValueChange={(v) => setRole(v as UserRole)}
                  >
                    <div>
                      <RadioGroupItem value="patient" id="patient-signup" className="peer sr-only" />
                      <Label
                        htmlFor="patient-signup"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="text-xs font-medium">Patient</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="doctor" id="doctor-signup" className="peer sr-only" />
                      <Label
                        htmlFor="doctor-signup"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="text-xs font-medium">Doctor</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="admin" id="admin-signup" className="peer sr-only" />
                      <Label
                        htmlFor="admin-signup"
                        className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                      >
                        <span className="text-xs font-medium">Admin</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full-name">{t('full-name')}</Label>
                    <Input
                      id="full-name"
                      placeholder="Max Robinson"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">{t('email')}</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">{t('password')}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={6}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating account...' : (t('create-account'))}
                </Button>
              </div>
            </form>
          )}
          <div className="mt-4 text-center text-sm">
            {t('already-have-account')}{' '}
            <Link href="/" className="underline">
              {t('login')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
