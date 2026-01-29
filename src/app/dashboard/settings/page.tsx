'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useTranslation } from "@/hooks/use-translation";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const { t } = useTranslation();

    return (
        <div className="grid gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t('settings')}</CardTitle>
                    <CardDescription>Manage your account and application settings.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                         <div className="space-y-1 mb-4 sm:mb-0">
                            <p className="font-medium">Theme</p>
                            <p className="text-sm text-muted-foreground">Customize the application's appearance.</p>
                        </div>
                        <ThemeToggle />
                    </div>
                    <Separator />
                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1 mb-4 sm:mb-0">
                            <p className="font-medium">Language</p>
                            <p className="text-sm text-muted-foreground">Choose your preferred language.</p>
                        </div>
                        <LanguageSwitcher />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
