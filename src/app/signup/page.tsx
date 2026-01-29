'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/icons';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from '@/hooks/use-translation';

export default function SignupPage() {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-center min-h-screen bg-background relative">
        <div className="absolute top-4 right-4">
             <LanguageSwitcher />
        </div>
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">MedCord</h1>
          </div>
          <CardTitle className="text-2xl">{t('signup')}</CardTitle>
          <CardDescription>
            {t('signup-desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="full-name">{t('full-name')}</Label>
                <Input id="full-name" placeholder="Max Robinson" required />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('password')}</Label>
              <Input id="password" type="password" />
            </div>
            <Button type="submit" className="w-full">
              {t('create-account')}
            </Button>
          </div>
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
