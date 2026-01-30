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
    console.error('AI Triage Error:', e);

    const provider = process.env.AI_PROVIDER || 'googleai';

    if (provider === 'googleai') {
      if (e.message && (e.message.includes('API key') || e.message.includes('permissionDenied'))) {
        return { error: 'Gemini API Key missing or invalid. Please check your .env.local file.' };
      }
      return { error: `Cloud AI Error: ${e.message || 'Failed to connect to Gemini.'}` };
    }

    if (provider === 'ollama') {
      if (e.message && (e.message.includes('fetch') || e.message.includes('ECONNREFUSED'))) {
        return { error: 'Ollama is not running. Please start Ollama on your machine.' };
      }
      return { error: `Local AI Error (Ollama): ${e.message || 'Ensure you have run "ollama pull llama3".'}` };
    }

    return { error: 'An unexpected error occurred while analyzing symptoms.' };
  }
}
