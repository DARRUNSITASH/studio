import { config } from 'dotenv';
config();

import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import { ollama } from 'genkitx-ollama';

const provider = (process.env.AI_PROVIDER || 'googleai').toLowerCase();
const model = process.env.AI_MODEL || (provider === 'ollama' ? 'llama3' : 'gemini-1.5-flash');

console.log(`[Genkit Initializing] Provider: ${provider}, Model: ${model}`);

const plugins = [];
// Only load Google AI if explicitly requested as provider AND we have a key
if (provider === 'googleai') {
  const key = process.env.GOOGLE_GENAI_API_KEY || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (key) {
    plugins.push(googleAI({ apiKey: key }));
  } else {
    console.warn('[Genkit] Google AI provider selected but no API key found. Plugin not loaded.');
  }
}

if (provider === 'ollama') {
  console.log('[Genkit] Loading Ollama plugin...');
  plugins.push(ollama({
    serverAddress: process.env.OLLAMA_SERVER_ADDRESS || 'http://127.0.0.1:11434',
  }));
}

export const ai = genkit({
  plugins,
  model: provider === 'ollama' ? `ollama/${model}` : `googleai/${model}`,
});
