'use server';
/**
 * @fileOverview AI-powered lineup generation.
 *
 * - generateBalancedTeam - A function that generates a random but balanced lineup.
 * - GenerateBalancedTeamInput - The input type for the generateBalancedTeam function.
 * - GenerateBalancedTeamOutput - The return type for the generateBalancedTeam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBalancedTeamInputSchema = z.object({
  availablePlayers: z.record(z.string(), z.object({
    name: z.string(),
    team: z.string(),
    pos: z.string(),
    value: z.number(),
    points: z.number(),
  })).describe('A map of available players with their details. The key is the player ID.'),
  teamBudget: z.number().describe('The maximum budget for the team.'),
});
export type GenerateBalancedTeamInput = z.infer<typeof GenerateBalancedTeamInputSchema>;

const GenerateBalancedTeamOutputSchema = z.object({
    lineup: z.array(z.string()).describe('An array of 11 player IDs for the main lineup.'),
    reserves: z.array(z.string()).describe('An array of 5 player IDs for the reserves.'),
    reasoning: z.string().describe('A brief explanation of the team selection strategy.')
});
export type GenerateBalancedTeamOutput = z.infer<typeof GenerateBalancedTeamOutputSchema>;


export async function generateBalancedTeam(input: GenerateBalancedTeamInput): Promise<GenerateBalancedTeamOutput> {
  return generateBalancedTeamFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBalancedTeamPrompt',
  input: {schema: GenerateBalancedTeamInputSchema},
  output: {schema: GenerateBalancedTeamOutputSchema},
  prompt: `You are an AI assistant specializing in creating balanced fantasy football lineups.
Your task is to generate a random, yet competitive and balanced, full team (11 starting players and 5 reserves) from the list of available players, while respecting the team budget.

**Constraints:**
1.  **Total Budget:** The total value of all 16 selected players (11 lineup + 5 reserves) must not exceed the provided \`teamBudget\`.
2.  **Formation (Lineup):** The 11-player lineup must strictly follow a 4-3-3 formation:
    - 1 Goalkeeper (GOL)
    - 4 Defenders (ZAG or LAT)
    - 3 Midfielders (MEI or VOL)
    - 3 Forwards (ATA)
3.  **Reserves:** Select 5 additional players for the bench. Try to pick one for each general position type (Goalkeeper, Defender, Midfielder, Forward) and one extra.
4.  **Balancing:** Do not just pick the most expensive players. Create a balanced team by mixing high-value star players with cost-effective, high-potential players. The team should be competitive based on their points, but also random enough to be interesting.
5.  **Uniqueness:** Ensure all selected player IDs are unique across the lineup and reserves.

**Input Data:**
-   **Available Players:** A map of player objects, where the key is the player's unique ID. Each player has a name, position (\`pos\`), value (\`value\`), and total points (\`points\`).
-   **Team Budget:** {{{teamBudget}}}

Based on the provided list of \`availablePlayers\` and the \`teamBudget\`, return a JSON object containing the generated \`lineup\` (11 player IDs), \`reserves\` (5 player IDs), and a brief \`reasoning\` for your choices.
`,
});

const generateBalancedTeamFlow = ai.defineFlow(
  {
    name: 'generateBalancedTeamFlow',
    inputSchema: GenerateBalancedTeamInputSchema,
    outputSchema: GenerateBalancedTeamOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
