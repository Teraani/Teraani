'use server';
/**
 * @fileOverview AI-powered player replacement suggestions for the user's lineup.
 *
 * - suggestPlayerReplacements - A function that suggests player replacements based on real-time data.
 * - SuggestPlayerReplacementsInput - The input type for the suggestPlayerReplacements function.
 * - SuggestPlayerReplacementsOutput - The return type for the suggestPlayerReplacements function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlayerReplacementsInputSchema = z.object({
  teamName: z.string().describe('The name of the user\s team.'),
  currentLineup: z.array(z.string()).describe('Array of player IDs in the current lineup.'),
  availablePlayers: z.record(z.string(), z.object({
    name: z.string(),
    team: z.string(),
    pos: z.string(),
    value: z.number(),
    points: z.number(),
    last_val: z.number(),
    games: z.number(),
    img: z.string(),
  })).describe('A map of available players with their details.'),
  teamBudget: z.number().describe('The remaining budget for the team.'),
  upcomingMatchDifficulty: z.string().describe('Difficulty of the upcoming match (e.g., easy, medium, hard).'),
});
export type SuggestPlayerReplacementsInput = z.infer<typeof SuggestPlayerReplacementsInputSchema>;

const SuggestPlayerReplacementsOutputSchema = z.array(z.object({
  playerToReplaceId: z.string().describe('The ID of the player to replace in the lineup.'),
  suggestedReplacementPlayerId: z.string().describe('The ID of the suggested replacement player.'),
  reasoning: z.string().describe('The detailed reasoning behind the suggested replacement.'),
}));
export type SuggestPlayerReplacementsOutput = z.infer<typeof SuggestPlayerReplacementsOutputSchema>;

export async function suggestPlayerReplacements(input: SuggestPlayerReplacementsInput): Promise<SuggestPlayerReplacementsOutput> {
  return suggestPlayerReplacementsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlayerReplacementsPrompt',
  input: {schema: SuggestPlayerReplacementsInputSchema},
  output: {schema: SuggestPlayerReplacementsOutputSchema},
  prompt: `You are an AI assistant specializing in providing suggestions for player replacements in a fantasy football lineup.

  Given the current lineup, available players, team budget, and upcoming match difficulty, provide a list of suggested player replacements with detailed reasoning for each suggestion.

  Team Name: {{{teamName}}}
Current Lineup: {{#each currentLineup}}{{{this}}}, {{/each}}
Available Players: {{#each (toArray availablePlayers)}}{{{this.name}}} ({{{this.pos}}}), {{/each}}
Team Budget: {{{teamBudget}}}
Upcoming Match Difficulty: {{{upcomingMatchDifficulty}}}

  Consider factors such as player form, recent performance, upcoming match difficulty, player value, and team budget when making suggestions.

  Format your response as a JSON array of objects, where each object contains the playerToReplaceId, suggestedReplacementPlayerId, and a detailed reasoning for the replacement. The availablePlayers parameter is a map of player ids to player objects, and the currentLineup is an array of player ids.

  Example:
  [
    {
      "playerToReplaceId": "p4",
      "suggestedReplacementPlayerId": "p2",
      "reasoning": "M. DEPAY has been underperforming with a recent negative valuation. Replacing him with K. JORGE, who has shown better form and a positive valuation, could improve the team's overall performance."
    }
  ]
  `,
});

const suggestPlayerReplacementsFlow = ai.defineFlow(
  {
    name: 'suggestPlayerReplacementsFlow',
    inputSchema: SuggestPlayerReplacementsInputSchema,
    outputSchema: SuggestPlayerReplacementsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
