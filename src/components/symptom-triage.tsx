'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Lightbulb, Stethoscope } from 'lucide-react';
import { getTriageSuggestion } from '@/app/dashboard/triage/actions';
import type { AISymptomTriageOutput } from '@/ai/flows/ai-symptom-triage';
import { useTranslation } from '@/hooks/use-translation';

export function SymptomTriage() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISymptomTriageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

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
                <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> {t('urgency-level')}</h3>
                <Badge variant={getUrgencyBadgeVariant(result.urgency)} className="text-base capitalize px-4 py-1">
                  {result.urgency}
                </Badge>
                <p className={`text-sm ${getUrgencyColor(result.urgency)}`}>
                    {getUrgencyDescription(result.urgency)}
                </p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5"/> {t('suggested-specialist')}</h3>
                <p className="text-base">{result.suggestedSpecialist}</p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5"/> {t('pre-consultation-summary')}</h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border">{result.preConsultationSummary}</p>
                <p className="text-xs text-muted-foreground">{t('share-summary-doctor')}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
