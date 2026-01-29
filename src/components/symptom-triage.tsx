'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, AlertCircle, Lightbulb, Stethoscope } from 'lucide-react';
import { getTriageSuggestion } from '@/app/dashboard/triage/actions';
import type { AISymptomTriageOutput } from '@/ai/flows/ai-symptom-triage';

export function SymptomTriage() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AISymptomTriageOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Textarea
          placeholder="e.g., I have a headache, fever, and a sore throat for the last 2 days."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
          disabled={loading}
        />
        <Button type="submit" disabled={loading || !symptoms.trim()} className="w-full sm:w-auto">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            'Analyze Symptoms'
          )}
        </Button>
      </form>

      {error && (
        <Card className="border-destructive/50">
          <CardHeader className="flex-row items-center gap-4 space-y-0">
             <AlertCircle className="h-6 w-6 text-destructive" />
             <div>
                <CardTitle className="text-destructive">Error</CardTitle>
                <CardDescription className="text-destructive/90">{error}</CardDescription>
             </div>
          </CardHeader>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Preliminary Assessment</CardTitle>
            <CardDescription>Based on the symptoms you provided, here is our AI's suggestion.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Urgency Level</h3>
                <Badge variant={getUrgencyBadgeVariant(result.urgency)} className="text-base capitalize px-4 py-1">
                  {result.urgency}
                </Badge>
                <p className={`text-sm ${getUrgencyColor(result.urgency)}`}>
                    {result.urgency === 'emergency' && 'This may be a medical emergency. Please seek immediate medical attention.'}
                    {result.urgency === 'medium' && 'We recommend consulting a doctor soon.'}
                    {result.urgency === 'low' && 'Your symptoms appear to be non-urgent, but consulting a doctor is advised.'}
                </p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Stethoscope className="h-5 w-5"/> Suggested Specialist</h3>
                <p className="text-base">{result.suggestedSpecialist}</p>
            </div>
             <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2"><Lightbulb className="h-5 w-5"/> Pre-Consultation Summary</h3>
                <p className="text-sm text-muted-foreground p-4 bg-muted rounded-lg border">{result.preConsultationSummary}</p>
                <p className="text-xs text-muted-foreground">You can share this summary with your doctor.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
