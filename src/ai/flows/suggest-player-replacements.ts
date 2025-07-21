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
    const { availablePlayers, teamBudget } = input;

    const allPlayersWithId = Object.entries(availablePlayers).map(([id, player]) => ({ id, ...player }));

    // Helper to shuffle array
    const shuffle = <T>(array: T[]): T[] => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };
    
    const lineup: string[] = [];
    const reserves: string[] = [];
    const selectedIds = new Set<string>();
    let currentCost = 0;

    const shuffledPlayers = shuffle(allPlayersWithId);

    // Select 11 for lineup
    for (const player of shuffledPlayers) {
        if (lineup.length >= 11) break;
        if (!selectedIds.has(player.id) && currentCost + player.value <= teamBudget) {
            lineup.push(player.id);
            selectedIds.add(player.id);
            currentCost += player.value;
        }
    }

    // Select 5 for reserves
    for (const player of shuffledPlayers) {
        if (reserves.length >= 5) break;
        if (!selectedIds.has(player.id) && currentCost + player.value <= teamBudget) {
            reserves.push(player.id);
            selectedIds.add(player.id);
            currentCost += player.value;
        }
    }

    // If we couldn't fill the teams due to budget, we stop. 
    // The UI should handle cases with fewer than 11 or 5 players.

    return {
        lineup,
        reserves,
        reasoning: 'Este time foi gerado de forma aleatória, aproveitando o orçamento disponível sem restrição de posição.'
    };
}
