'use server';
/**
 * @fileOverview Player lineup generation.
 *
 * - generateBalancedTeam - A function that generates a random but balanced lineup.
 * - GenerateBalancedTeamInput - The input type for the generateBalancedTeam function.
 * - GenerateBalancedTeamOutput - The return type for the generateBalancedTeam function.
 */

import {z} from 'zod';
import type { Player } from '@/lib/data';

const GenerateBalancedTeamInputSchema = z.object({
  availablePlayers: z.record(z.string(), z.object({
    name: z.string(),
    team: z.string(),
    pos: z.string(),
    value: z.number(),
    points: z.number(),
    img: z.string().optional(),
    stats: z.any().optional(),
    last_val: z.number().optional(),
    games: z.number().optional(),
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
    const { availablePlayers } = input;

    const allPlayersWithId = Object.entries(availablePlayers).map(([id, player]) => ({ id, ...player }));

    // Sort players by value in descending order to get the "best" players first.
    const sortedPlayers = allPlayersWithId.sort((a, b) => b.value - a.value);

    const teamA: string[] = [];
    const teamB: string[] = [];

    // Distribute players between Team A and Team B in a snake draft pattern
    // to ensure teams are as balanced as possible by value.
    sortedPlayers.forEach((player, index) => {
        if (Math.floor(index / 2) % 2 === 0) { // Snake draft logic
            if (index % 2 === 0) {
                teamA.push(player.id);
            } else {
                teamB.push(player.id);
            }
        } else {
            if (index % 2 === 0) {
                teamB.push(player.id);
            } else {
                teamA.push(player.id);
            }
        }
    });

    // The first team generated (Team A) will be returned. The caller will handle generating the second team.
    // We split the generated team into lineup and reserves.
    const lineup = teamA.slice(0, 11);
    const reserves = teamA.slice(11, 16); // Up to 5 reserves

    return {
        lineup,
        reserves,
        reasoning: 'Este time foi gerado de forma balanceada, distribuindo os melhores jogadores disponíveis para criar confrontos equilibrados.'
    };
}
