'use server';
/**
 * @fileOverview Generates a pre-consultation summary for doctors based on patient symptom input.
 *
 * - generatePreConsultationSummary - A function that generates the pre-consultation summary.
 * - GeneratePreConsultationSummaryInput - The input type for the generatePreConsultationSummary function.
 * - GeneratePreConsultationSummaryOutput - The return type for the generatePreConsultationSummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GeneratePreConsultationSummaryInputSchema = z.object({
  symptoms: z.string().describe('The patient provided symptoms.'),
  patientHistory: z.string().optional().describe('Optional: The patient provided medical history.'),
});
export type GeneratePreConsultationSummaryInput = z.infer<typeof GeneratePreConsultationSummaryInputSchema>;

const GeneratePreConsultationSummaryOutputSchema = z.object({
  summary: z.string().describe('A summary of the patient provided symptoms and history.'),
});
export type GeneratePreConsultationSummaryOutput = z.infer<typeof GeneratePreConsultationSummaryOutputSchema>;

export async function generatePreConsultationSummary(input: GeneratePreConsultationSummaryInput): Promise<GeneratePreConsultationSummaryOutput> {
  return generatePreConsultationSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePreConsultationSummaryPrompt',
  input: { schema: GeneratePreConsultationSummaryInputSchema },
  output: { schema: GeneratePreConsultationSummaryOutputSchema },
  prompt: `You are an AI assistant helping doctors to quickly understand patient concerns.
  Your task is to generate a concise pre-consultation summary in RAW JSON format.

  Generate a concise pre-consultation summary based on the following patient information:

  Symptoms: {{{symptoms}}}

  Medical History (if available): {{{patientHistory}}}

  CRITICAL: You must return ONLY a JSON object. 
  The value for "summary" must be a string.

  EXAMPLE OF VALID OUTPUT:
  {
    "summary": "The patient has a headache and fever for 2 days..."
  }

  DO NOT include any markdown, backticks, or explanatory text.
  DO NOT repeat the schema definition in the output.`,
});

const generatePreConsultationSummaryFlow = ai.defineFlow(
  {
    name: 'generatePreConsultationSummaryFlow',
    inputSchema: GeneratePreConsultationSummaryInputSchema,
    outputSchema: GeneratePreConsultationSummaryOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
