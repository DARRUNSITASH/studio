'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { I18nContext } from '@/context/I18nProvider';
import { useContext } from 'react';

export default function LanguagesPage() {
    const { t } = useTranslation();
    const i18n = useContext(I18nContext);

    if (!i18n) return null;

    const { enabledLocales, toggleLocale, setLocale, locale } = i18n;

    const handleToggle = (code: 'en' | 'hi' | 'ta') => {
        // Toggle the enable/disable status
        toggleLocale(code);

        // If it's being enabled, also switch to it to "Switch between language"
        if (!enabledLocales.includes(code)) {
            setLocale(code);
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('language-management')}</h2>
            <Card>
                <CardHeader>
                    <CardTitle>{t('enable-disable-languages')}</CardTitle>
                    <CardDescription>Control which languages are available and switch the system language.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="en" className="flex flex-col space-y-1">
                            <span>English</span>
                            <span className="font-normal text-xs text-muted-foreground">Default system language</span>
                        </Label>
                        <Switch
                            id="en"
                            checked={enabledLocales.includes('en')}
                            onCheckedChange={() => {
                                setLocale('en');
                            }}
                            disabled={locale === 'en'}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="hi" className="flex flex-col space-y-1">
                            <span>Hindi (हिंदी)</span>
                            <span className="font-normal text-xs text-muted-foreground">Available for Patient/Doctor dashboards</span>
                        </Label>
                        <Switch
                            id="hi"
                            checked={enabledLocales.includes('hi')}
                            onCheckedChange={() => handleToggle('hi')}
                        />
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                        <Label htmlFor="ta" className="flex flex-col space-y-1">
                            <span>Tamil (தமிழ்)</span>
                            <span className="font-normal text-xs text-muted-foreground">Available for Patient/Doctor dashboards</span>
                        </Label>
                        <Switch
                            id="ta"
                            checked={enabledLocales.includes('ta')}
                            onCheckedChange={() => handleToggle('ta')}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-muted/50 border-dashed">
                <CardHeader>
                    <CardTitle className="text-sm">Active Language Usage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xs space-y-2">
                        <div className="flex justify-between"><span>English</span><span>65%</span></div>
                        <div className="flex justify-between"><span>Hindi</span><span>25%</span></div>
                        <div className="flex justify-between"><span>Tamil</span><span>10%</span></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
