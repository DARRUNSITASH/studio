'use server';
/**
 * @fileOverview AI-assisted symptom triage flow.
 *
 * - aiSymptomTriage - A function that performs symptom triage and suggests a local clinic or doctor.
 * - AISymptomTriageInput - The input type for the aiSymptomTriage function.
 * - AISymptomTriageOutput - The return type for the aiSymptomTriage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

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
  input: {schema: AISymptomTriageInputSchema},
  output: {schema: AISymptomTriageOutputSchema},
  prompt: `You are an AI assistant designed to provide preliminary symptom triage.

  Based on the patient's description of symptoms, assess the urgency of their condition as low, medium, or emergency.
  Also, suggest the most appropriate local clinic or doctor to consult, and generate a pre-consultation summary for the doctor.

  Symptoms: {{{symptoms}}}

  Considerations:
  - Prioritize local healthcare providers.
  - Optimize for low-bandwidth environments.
  - Support multilingual interactions.`,
});

const aiSymptomTriageFlow = ai.defineFlow(
  {
    name: 'aiSymptomTriageFlow',
    inputSchema: AISymptomTriageInputSchema,
    outputSchema: AISymptomTriageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
