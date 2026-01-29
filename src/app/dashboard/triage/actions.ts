'use server';

import { aiSymptomTriage, type AISymptomTriageOutput } from '@/ai/flows/ai-symptom-triage';

export async function getTriageSuggestion(symptoms: string): Promise<AISymptomTriageOutput | { error: string }> {
  if (!symptoms) {
    return { error: 'Symptoms cannot be empty.' };
  }

  try {
    const result = await aiSymptomTriage({ symptoms });
    return result;
  } catch (e: any) {
    console.error(e);
    if (e.message && (e.message.includes('API key') || e.message.includes('permissionDenied'))) {
        return { error: 'There seems to be an issue with your Gemini API key. Please make sure it is set correctly in the .env file and has the correct permissions.' };
    }
    return { error: 'Failed to get suggestion from AI. Please try again later.' };
  }
}
