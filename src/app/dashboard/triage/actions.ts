'use server';

import { aiSymptomTriage, type AISymptomTriageOutput } from '@/ai/flows/ai-symptom-triage';

export async function getTriageSuggestion(symptoms: string): Promise<AISymptomTriageOutput | { error: string }> {
  if (!symptoms) {
    return { error: 'Symptoms cannot be empty.' };
  }

  try {
    const result = await aiSymptomTriage({ symptoms });
    return result;
  } catch (e) {
    console.error(e);
    return { error: 'Failed to get suggestion from AI. Please try again later.' };
  }
}
