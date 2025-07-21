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
    
    const playersByPos: Record<string, ({ id: string } & Player)[]> = {
        'GOL': [],
        'DEF': [], // ZAG or LAT
        'MEI': [], // MEI or VOL
        'ATA': []
    };

    allPlayersWithId.forEach(p => {
        if (p.pos === 'GOL') playersByPos['GOL'].push(p);
        else if (['ZAG', 'LAT'].includes(p.pos)) playersByPos['DEF'].push(p);
        else if (['MEI', 'VOL'].includes(p.pos)) playersByPos['MEI'].push(p);
        else if (p.pos === 'ATA') playersByPos['ATA'].push(p);
    });

    for (const pos in playersByPos) {
        shuffle(playersByPos[pos]);
    }

    const lineup: string[] = [];
    const reserves: string[] = [];
    const selectedIds = new Set<string>();
    let currentCost = 0;

    const formation = {
        'GOL': 1,
        'DEF': 4,
        'MEI': 3,
        'ATA': 3
    };

    const reserveFormation = {
        'GOL': 1,
        'DEF': 1,
        'MEI': 1,
        'ATA': 1,
        'ANY': 1
    };

    const selectPlayers = (count: number, from: ({ id: string } & Player)[]) => {
        const selected = [];
        for (const player of from) {
            if (selected.length >= count) break;
            if (!selectedIds.has(player.id) && currentCost + player.value <= teamBudget) {
                selected.push(player.id);
                selectedIds.add(player.id);
                currentCost += player.value;
            }
        }
        return selected;
    };

    // Select lineup
    lineup.push(...selectPlayers(formation.GOL, playersByPos.GOL));
    lineup.push(...selectPlayers(formation.DEF, playersByPos.DEF));
    lineup.push(...selectPlayers(formation.MEI, playersByPos.MEI));
    lineup.push(...selectPlayers(formation.ATA, playersByPos.ATA));


    // Select reserves
    reserves.push(...selectPlayers(reserveFormation.GOL, playersByPos.GOL));
    reserves.push(...selectPlayers(reserveFormation.DEF, playersByPos.DEF));
    reserves.push(...selectPlayers(reserveFormation.MEI, playersByPos.MEI));
    reserves.push(...selectPlayers(reserveFormation.ATA, playersByPos.ATA));
    
    // Select one more any player for reserve
    const remainingPlayers = allPlayersWithId.filter(p => !selectedIds.has(p.id));
    reserves.push(...selectPlayers(reserveFormation.ANY, shuffle(remainingPlayers)));

    // Fill up if not enough players were selected due to budget
    const fillSlots = (targetArray: string[], targetCount: number) => {
        while(targetArray.length < targetCount) {
             const randomPlayer = shuffle(allPlayersWithId.filter(p => !selectedIds.has(p.id)))[0];
             if(randomPlayer && !selectedIds.has(randomPlayer.id) && currentCost + randomPlayer.value <= teamBudget) {
                targetArray.push(randomPlayer.id);
                selectedIds.add(randomPlayer.id);
                currentCost += randomPlayer.value;
             } else {
                 break; // Cannot add more players
             }
        }
    }
    
    fillSlots(lineup, 11);
    fillSlots(reserves, 5);


    return {
        lineup,
        reserves,
        reasoning: 'Este time foi gerado de forma aleatória, buscando um bom equilíbrio entre as posições e o aproveitamento do orçamento disponível.'
    };
}
