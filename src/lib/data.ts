

import type { ShirtColor } from "@/components/views/lineup-view";

export interface PlayerPerformance {
  round: number;
  points: number;
  team: string;
  goals: number;
  assists: number;
  gameId: string; // To link to the specific game
  shirtColor: ShirtColor;
}

export interface Player {
  name: string;
  team: string;
  pos: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA' | 'VOL' | 'Mei / Lat';
  value: number;
  points: number;
  last_val: number;
  games: number;
  img: string;
  stats?: PlayerStats;
  performanceHistory: PlayerPerformance[];
}

export interface PlayerStats {
  wins: number;
  losses: number;
  draws: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  performance: number;
  points: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  teamName: string;
  partialScore: number;
  totalScore: number;
  valuation: number;
  lineup: string[];
  reserves: string[];
  role: 'admin' | 'player';
  avatar?: string;
  paymentDueDate: string; // YYYY-MM-DD
  playerId?: string; // Explicit link to a player ID
  joinedAt?: string; // ISO 8601 date string
  pos?: Player['pos'];
}

export interface Ranking {
    id: string;
    name: string;
    games: number;
    resultsDifference: number;
    avgDifference: number;
}

export interface GoalieRanking {
    id: string;
    name: string;
    games: number;
    goalsConceded: number;
    avgGoalsConceded: number;
}

export interface Game {
    id: string;
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    status: 'Finalizado' | 'Em andamento' | 'Agendado';
    scorers: { player: string; team: string }[];
}

export interface League {
    id: string;
    name: string;
    adminId: string;
    users: Record<string, User>;
    players: Record<string, Player>;
    games: Record<string, Game>;
    editorOfTheRound: string | null;
    scoutEditor: string | null;
    paymentEditor: string | null;
    scalersRanking: Record<string, Ranking>;
    goalieRanking: Record<string, GoalieRanking>;
    modality: 'campo' | 'society' | 'futsal' | null;
    paymentsEnabled: boolean;
    team1Lineup: (string | null)[];
    team2Lineup: (string | null)[];
    team1Reserves: (string | null)[];
    team2Reserves: (string | null)[];
}

    