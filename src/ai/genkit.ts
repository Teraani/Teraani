import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import { firebase } from '@genkit-ai/firebase';
import { app } from '@/lib/firebase-config';

export const ai = genkit({
  plugins: [
    firebase({
      firebaseApp: app
    }),
    googleAI()
  ],
  model: 'googleai/gemini-2.0-flash',
});
