import { config } from 'dotenv';
config();

import '@/ai/flows/generate-pre-consultation-summary.ts';
import '@/ai/flows/ai-symptom-triage.ts';