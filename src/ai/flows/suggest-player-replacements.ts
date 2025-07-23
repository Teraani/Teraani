
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
    team1: z.array(z.string()).describe('An array of player IDs for team 1.'),
    team2: z.array(z.string()).describe('An array of player IDs for team 2.'),
    reasoning: z.string().describe('A brief explanation of the team selection strategy.')
});
export type GenerateBalancedTeamOutput = z.infer<typeof GenerateBalancedTeamOutputSchema>;


export async function generateBalancedTeam(input: GenerateBalancedTeamInput): Promise<GenerateBalancedTeamOutput> {
    const { availablePlayers } = input;

    const allPlayersWithId = Object.entries(availablePlayers).map(([id, player]) => ({ id, ...player }));

    // Separate goalkeepers and field players
    const goalkeepers = allPlayersWithId.filter(p => p.pos === 'GOL').sort((a, b) => b.value - a.value);
    const fieldPlayers = allPlayersWithId.filter(p => p.pos !== 'GOL').sort((a, b) => b.value - a.value);

    const teamA: string[] = [];
    const teamB: string[] = [];
    
    // Assign goalkeepers first
    if (goalkeepers.length > 0) teamA.push(goalkeepers.shift()!.id);
    if (goalkeepers.length > 0) teamB.push(goalkeepers.shift()!.id);
    

    // Distribute the top 20 field players between Team A and Team B in a snake draft pattern
    fieldPlayers.slice(0, 20).forEach((player, index) => {
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
    
    return {
        team1: teamA,
        team2: teamB,
        reasoning: 'Estes times foram gerados de forma balanceada, distribuindo os melhores goleiros e jogadores de linha disponíveis para criar confrontos equilibrados.'
    };
}
