'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslation } from '@/hooks/use-translation';
import { Video, User, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LivePage() {
    const { t } = useTranslation();

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">{t('live-consultation')}</h2>
            <Card className="border-primary bg-primary/5">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Video className="mr-2 h-5 w-5 text-primary" />
                        Active Queue
                    </CardTitle>
                    <CardDescription>There are currently 2 patients waiting in the queue.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-background border rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-bold">Amit Patel</div>
                                <div className="text-xs text-muted-foreground">General Consultation</div>
                            </div>
                        </div>
                        <Button size="sm" asChild>
                            <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer">Accept Call</a>
                        </Button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-background border rounded-lg opacity-60">
                        <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="font-bold">Sita Devi</div>
                                <div className="text-xs text-muted-foreground">Follow-up</div>
                            </div>
                        </div>
                        <Button size="sm" variant="outline">Next in Queue</Button>
                    </div>
                </CardContent>
            </Card>
            <div className="text-center p-8 border-2 border-dashed rounded-xl text-muted-foreground">
                <Activity className="mx-auto h-12 w-12 mb-4 opacity-20" />
                <p>Your camera and microphone are ready for the next consultation.</p>
            </div>
        </div>
    );
}
