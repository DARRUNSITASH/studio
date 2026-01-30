'use client';

import { useState, useContext } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Lightbulb, Stethoscope, MessageSquare, ArrowRight } from 'lucide-react';
import { getTriageSuggestion } from '@/app/dashboard/triage/actions';
import type { AISymptomTriageOutput } from '@/ai/flows/ai-symptom-triage';
import { useTranslation } from '@/hooks/use-translation';
import { AppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { CareCase } from '@/lib/types';

export function SymptomTriage() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISymptomTriageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const { user, doctors, addCase } = useContext(AppContext);
  const router = useRouter();

  // Detect provider from environment
  const isLocalAI = process.env.NEXT_PUBLIC_AI_PROVIDER === 'ollama';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await getTriageSuggestion(symptoms);

    if ('error' in response) {
      setError(response.error);
    } else {
      setResult(response);
    }

    setLoading(false);
  };

  const getUrgencyBadgeVariant = (urgency: 'low' | 'medium' | 'emergency') => {
    switch (urgency) {
      case 'emergency':
        return 'destructive';
      case 'medium':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getUrgencyColor = (urgency: 'low' | 'medium' | 'emergency') => {
    switch (urgency) {
      case 'emergency':
        return 'text-destructive';
      case 'medium':
        return 'text-yellow-600';
      default:
        return 'text-green-600';
    }
  };

  const getUrgencyDescription = (urgency: 'low' | 'medium' | 'emergency') => {
    const key = `urgency-${urgency}-desc`;
    return t(key);
  }

  const handleStartCase = (doctorId: string) => {
    if (!result || !user) return;
    const doctor = doctors.find(d => d.id === doctorId);

    const newCase: CareCase = {
      id: 'c' + Date.now(),
      patientId: user.id,
      patientName: user.name,
      doctorId: doctorId,
      doctorName: doctor?.name || 'Unknown',
      status: 'pending',
      subject: `Triage: ${result.suggestedSpecialist}`,
      description: result.preConsultationSummary,
      urgency: result.urgency,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [{
        id: 'm1',
        senderId: user.id,
        senderName: user.name,
        content: `I've performed an AI triage for my symptoms: "${symptoms}". \n\nAssessment: ${result.preConsultationSummary}`,
        timestamp: new Date().toISOString()
      }]
    };

    addCase(newCase);
    router.push('/dashboard/cases');
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder={t('symptom-triage-placeholder')}
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !symptoms.trim()} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('analyzing')}
            </>
          ) : (
            t('analyze-symptoms')
          )}
        </Button>
        <div className="flex items-center gap-2 mt-2">
          <div className={`h-2 w-2 rounded-full ${isLocalAI ? 'bg-green-500' : 'bg-blue-500'}`} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {isLocalAI ? 'Local AI Mode (Ollama)' : 'Cloud AI Mode (Gemini)'}
          </span>
        </div>
      </form>

      {error && (
        <Card className="border-destructive/50">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
            <AlertCircle className="h-6 w-6 text-destructive" />
            <div>
              <CardTitle className="text-destructive">{t('error')}</CardTitle>
              <CardDescription className="text-destructive/90">{error}</CardDescription>
            </div>
          </CardHeader>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>{t('preliminary-assessment')}</CardTitle>
            <CardDescription>{t('preliminary-assessment-desc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5" /> {t('urgency-level')}</h3>
              <Badge variant={getUrgencyBadgeVariant(result.urgency)} className="text-base capitalize px-4 py-1">
                {result.urgency}
              </Badge>
              <p className={`text-sm ${getUrgencyColor(result.urgency)}`}>
                {getUrgencyDescription(result.urgency)}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5" /> {t('suggested-specialist')}</h3>
              <p className="text-base">{result.suggestedSpecialist}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5" /> {t('pre-consultation-summary')}</h3>
              <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border">{result.preConsultationSummary}</p>
              <p className="text-xs text-muted-foreground">{t('share-summary-doctor')}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {result && user?.role === 'patient' && (
        <Card className="border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Asynchronous Consultation
            </CardTitle>
            <CardDescription>
              Submit this assessment to a doctor for a professional review. They will respond when they are online.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {doctors.slice(0, 4).map(doctor => (
                <Card key={doctor.id} className="p-4 flex flex-col justify-between hover:border-primary transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {doctor.name.charAt(4)}
                    </div>
                    <div>
                      <div className="text-sm font-bold">{doctor.name}</div>
                      <div className="text-[10px] text-muted-foreground">{doctor.specialty}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => handleStartCase(doctor.id)}>
                    Send to Doctor <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </Card>
              ))}
            </div>
            <div className="text-center">
              <Button variant="link" onClick={() => router.push('/dashboard/discover')}>
                View all doctors
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
