'use client';

import { useRouter } from 'next/navigation';
import { useTranslation } from '@/hooks/use-translation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Logo } from '@/components/icons';

export default function LanguageSelectionPage() {
  const router = useRouter();
  const { setLocale, t } = useTranslation();

  const handleLanguageSelect = (locale: 'en' | 'hi' | 'ta') => {
    setLocale(locale);
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Logo className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">Medcord</h1>
          </div>
          <CardTitle className="text-2xl">{t('select-language')}</CardTitle>
          <CardDescription>{t('select-language-desc')}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 p-6">
          <Button onClick={() => handleLanguageSelect('en')} size="lg" variant='outline'>
            English
          </Button>
          <Button onClick={() => handleLanguageSelect('hi')} size="lg" variant='outline'>
            हिन्दी (Hindi)
          </Button>
          <Button onClick={() => handleLanguageSelect('ta')} size="lg" variant='outline'>
            தமிழ் (Tamil)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
