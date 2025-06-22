
import {genkit, type GenkitPlugin} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

const plugins: GenkitPlugin[] = [];

if (process.env.GOOGLE_API_KEY) {
  plugins.push(googleAI());
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'GOOGLE_API_KEY environment variable not set. Genkit AI features will be disabled.'
    );
  }
}

export const ai = genkit({
  plugins,
  model: 'googleai/gemini-2.0-flash',
});
