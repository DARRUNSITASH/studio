'use server';
/**
 * @fileOverview AI-assisted symptom triage flow.
 *
 * - aiSymptomTriage - A function that performs symptom triage and suggests a local clinic or doctor.
 * - AISymptomTriageInput - The input type for the aiSymptomTriage function.
 * - AISymptomTriageOutput - The return type for the aiSymptomTriage function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AISymptomTriageInputSchema = z.object({
  symptoms: z
    .string()
    .describe('The symptoms described by the patient, can be text or voice input.'),
});
export type AISymptomTriageInput = z.infer<typeof AISymptomTriageInputSchema>;

const AISymptomTriageOutputSchema = z.object({
  urgency: z
    .enum(['low', 'medium', 'emergency'])
    .describe('The urgency level of the patient condition.'),
  suggestedSpecialist: z
    .string()
    .describe('The suggested local clinic or doctor to consult.'),
  preConsultationSummary: z
    .string()
    .describe('A brief summary of the symptoms for the doctor.'),
});
export type AISymptomTriageOutput = z.infer<typeof AISymptomTriageOutputSchema>;

export async function aiSymptomTriage(input: AISymptomTriageInput): Promise<AISymptomTriageOutput> {
  return aiSymptomTriageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomTriagePrompt',
  input: { schema: AISymptomTriageInputSchema },
  output: { schema: AISymptomTriageOutputSchema },
  prompt: `You are an AI assistant designed to provide preliminary symptom triage for patients in Tamil Nadu, India.
  Your task is to analyze the patient's symptoms and provide a structured response in RAW JSON format.

  Based on the patient's description of symptoms, assess the urgency of their condition as low, medium, or emergency.
  Also, suggest the most appropriate local clinic or doctor in Tamil Nadu (e.g., Chennai, Coimbatore, Madurai, Trichy, Vellore) to consult, and generate a pre-consultation summary for the doctor.

  Symptoms: {{{symptoms}}}

  CRITICAL: You must return ONLY a JSON object. 
  The values must be strings, NOT nested objects or schema definitions.
  
  EXAMPLE OF VALID OUTPUT:
  {
    "urgency": "medium",
    "suggestedSpecialist": "General Physician at Apollo Clinic, Chennai",
    "preConsultationSummary": "Patient reports mild fever and cough..."
  }

  DO NOT include any markdown, backticks, or explanatory text.
  DO NOT repeat the schema definition in the output.

  Considerations:
  - Prioritize local healthcare providers within Tamil Nadu.
  - Optimize for low-bandwidth environments.
  - Support multilingual interactions (English and Tamil).`,
});

const aiSymptomTriageFlow = ai.defineFlow(
  {
    name: 'aiSymptomTriageFlow',
    inputSchema: AISymptomTriageInputSchema,
    outputSchema: AISymptomTriageOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
