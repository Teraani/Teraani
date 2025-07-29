

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
}

interface AppData {
  leagues: Record<string, League>;
}

// This is now the initial state for one default league.
export const defaultLeagueData: League = {
    id: 'defaultLeague',
    name: 'Liga Principal Amistosos FC',
    adminId: 'user27',
    modality: 'campo', // Add default modality
    paymentsEnabled: true,
    games: {
        'game_1': { id: 'game_1', date: '01 de Jan - 20:00hs', homeTeam: 'Time 1', awayTeam: 'Time 2', homeScore: 3, awayScore: 2, status: 'Finalizado', scorers: [{player: 'Rafael Ohy', team: 'Time 1'}] },
        'game_2': { id: 'game_2', date: '08 de Jan - 20:00hs', homeTeam: 'Time 1', awayTeam: 'Time 2', homeScore: 1, awayScore: 1, status: 'Finalizado', scorers: [] },
        'game_3': { id: 'game_3', date: '15 de Jan - 20:00hs', homeTeam: 'Time 1', awayTeam: 'Time 2', homeScore: 0, awayScore: 2, status: 'Finalizado', scorers: [] },
    },
    users: {
        'user1': {
            id: 'user1',
            name: 'Felipe',
            email: 'felipe@exemplo.com',
            teamName: "Amistosos FC",
            partialScore: 58.49,
            totalScore: 1154.89,
            valuation: 125.88,
            lineup: ['p9', 'p6', 'p14', 'p15', 'p16', 'p1', 'p5', 'p7', 'p12', 'p4', 'p17'],
            reserves: ['p2', 'p3', 'p8', 'p10', 'p13'],
            role: 'player',
            avatar: 'https://placehold.co/128x128.png',
            paymentDueDate: '2025-08-01',
            playerId: 'p1'
        },
        'user2': { id: 'user2', name: 'Renan Ropeiro', email: 'user2@example.com', teamName: 'User 2 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p2' },
        'user3': { id: 'user3', name: 'André Corsini', email: 'user3@example.com', teamName: 'User 3 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p3' },
        'user4': { id: 'user4', name: 'Rossi', email: 'user4@example.com', teamName: 'User 4 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p4' },
        'user5': { id: 'user5', name: 'Gustavo Rodrigues', email: 'user5@example.com', teamName: 'User 5 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p5' },
        'user6': { id: 'user6', name: 'Vinícius Simão', email: 'user6@example.com', teamName: 'User 6 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p6' },
        'user7': { id: 'user7', name: 'Adriano Carvalho', email: 'user7@example.com', teamName: 'User 7 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p7' },
        'user8': { id: 'user8', name: 'Deyvid Gontarczik Deca', email: 'user8@example.com', teamName: 'User 8 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p8' },
        'user9': { id: 'user9', name: 'Felipe Ropeiro (Cabanhas)', email: 'user9@example.com', teamName: 'User 9 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p9' },
        'user10': { id: 'user10', name: 'Vinícius Abreu', email: 'user10@example.com', teamName: 'User 10 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p10' },
        'user11': { id: 'user11', name: 'Bruno Costa (Bruneca)', email: 'user11@example.com', teamName: 'User 11 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p11' },
        'user12': { id: 'user12', name: 'Felipe Correa', email: 'user12@example.com', teamName: 'User 12 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p12' },
        'user13': { id: 'user13', name: 'Alexandre Santos', email: 'user13@example.com', teamName: 'User 13 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p13' },
        'user14': { id: 'user14', name: 'Vicente Gagliardi (Pizza)', email: 'user14@example.com', teamName: 'User 14 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p14' },
        'user15': { id: 'user15', name: 'Gustavo Reis (Titânio)', email: 'user15@example.com', teamName: 'User 15 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p15' },
        'user16': { id: 'user16', name: 'Isaias Souza', email: 'user16@example.com', teamName: 'User 16 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p16' },
        'user17': { id: 'user17', name: 'Beto', email: 'user17@example.com', teamName: 'User 17 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p17' },
        'user18': { id: 'user18', name: 'Diego Nunes', email: 'user18@example.com', teamName: 'User 18 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p19' },
        'user19': { id: 'user19', name: 'Thiago Santos', email: 'user19@example.com', teamName: 'User 19 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p19' },
        'user20': { id: 'user20', name: 'Carlos Souza', email: 'user20@example.com', teamName: 'User 20 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p20' },
        'user21': { id: 'user21', name: 'Heitor (Totti)', email: 'user21@example.com', teamName: 'User 21 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p21' },
        'user22': { id: 'user22', name: 'Juliano Vello', email: 'user22@example.com', teamName: 'User 22 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p22' },
        'user23': { id: 'user23', name: 'Paulo Fogaça', email: 'user23@example.com', teamName: 'User 23 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p23' },
        'user24': { id: 'user24', name: 'Érico', email: 'user24@example.com', teamName: 'User 24 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p24' },
        'user25': { id: 'user25', name: 'Lucas Limone', email: 'user25@example.com', teamName: 'User 25 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p25' },
        'user26': { id: 'user26', name: 'Lupo', email: 'user26@example.com', teamName: 'User 26 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p26' },
        'user27': { id: 'user27', name: 'Jason (Admin)', email: 'jason.teraani@gmail.com', teamName: 'User 27 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'admin', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user28': { id: 'user28', name: 'Giovani', email: 'user28@example.com', teamName: 'User 28 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p28' },
        'user29': { id: 'user29', name: 'Lucca', email: 'user29@example.com', teamName: 'User 29 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p29' },
        'user30': { id: 'user30', name: 'Pedro Roberto', email: 'user30@example.com', teamName: 'User 30 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p30' },
        'user31': { id: 'user31', name: 'Rafael Ohy', email: 'user31@example.com', teamName: 'User 31 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01', playerId: 'p1' },
        'user32': { id: 'user32', name: 'Novo Convidado', email: 'convidado@example.com', teamName: 'Convidado FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-09-01', playerId: 'p33' },
    },
    editorOfTheRound: null,
    scoutEditor: null,
    paymentEditor: null,
    players: {
      'p1': { name: 'Rafael Ohy', team: 'AVA', pos: 'MEI', value: 49.5, points: 48, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 3, draws: 3, goalsFor: 60, goalsAgainst: 46, goalDifference: 14, performance: 76.19, points: 48, goals: 10, assists: 10, yellowCards: 1, redCards: 0 }, 
        performanceHistory: [
            { round: 1, points: 8, team: 'Time 1', goals: 1, assists: 0, gameId: 'game_1', shirtColor: 'verde' },
            { round: 2, points: 1, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_2', shirtColor: 'amarelo' },
            { round: 3, points: 0, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_3', shirtColor: 'verde' },
            { round: 4, points: 3, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_4', shirtColor: 'branco' },
            { round: 5, points: 9, team: 'Time 2', goals: 1, assists: 1, gameId: 'game_5', shirtColor: 'preto' },
            { round: 6, points: -2, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_6', shirtColor: 'verde' },
            { round: 7, points: 5, team: 'Time 2', goals: 1, assists: 0, gameId: 'game_7', shirtColor: 'amarelo' },
            { round: 8, points: 2.5, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_8', shirtColor: 'branco' },
            { round: 9, points: 1.5, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_9', shirtColor: 'preto' },
            { round: 10, points: 4, team: 'Time 1', goals: 0, assists: 1, gameId: 'game_10', shirtColor: 'verde' },
            { round: 11, points: 3, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_11', shirtColor: 'amarelo' },
            { round: 12, points: 6, team: 'Time 1', goals: 1, assists: 0, gameId: 'game_12', shirtColor: 'verde' },
            { round: 13, points: 0, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_13', shirtColor: 'preto' },
            { round: 14, points: 3.5, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_14', shirtColor: 'branco' },
            { round: 15, points: -1, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_15', shirtColor: 'amarelo' },
            { round: 16, points: 7, team: 'Time 1', goals: 1, assists: 0, gameId: 'game_16', shirtColor: 'verde' },
            { round: 17, points: 8, team: 'Time 2', goals: 1, assists: 1, gameId: 'game_17', shirtColor: 'preto' },
            { round: 18, points: 2, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_18', shirtColor: 'branco' },
            { round: 19, points: 5.5, team: 'Time 2', goals: 1, assists: 0, gameId: 'game_19', shirtColor: 'amarelo' },
            { round: 20, points: 1, team: 'Time 1', goals: 0, assists: 0, gameId: 'game_20', shirtColor: 'verde' },
            { round: 21, points: 3, team: 'Time 2', goals: 0, assists: 0, gameId: 'game_21', shirtColor: 'amarelo' },
        ]},
      'p2': { name: 'Renan Ropeiro', team: 'BOT', pos: 'MEI', value: 27, points: 29, last_val: 0.5, games: 14, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 3, draws: 2, goalsFor: 35, goalsAgainst: 28, goalDifference: 7, performance: 69.05, points: 29, goals: 1, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p3': { name: 'André Corsini', team: 'CAM', pos: 'MEI', value: 46.5, points: 47, last_val: 0.5, games: 25, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 8, draws: 2, goalsFor: 68, goalsAgainst: 53, goalDifference: 15, performance: 62.67, points: 47, goals: 1, assists: 5, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p4': { name: 'Rossi', team: 'FLA', pos: 'VOL', value: 27, points: 28, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 5, draws: 1, goalsFor: 37, goalsAgainst: 37, goalDifference: 0, performance: 62.22, points: 28, goals: 8, assists: 7, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p5': { name: 'Gustavo Rodrigues', team: 'CRI', pos: 'VOL', value: 34.5, points: 28, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 56, goalsAgainst: 50, goalDifference: 6, performance: 46.67, points: 28, goals: 5, assists: 9, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p6': { name: 'Vinícius Simão', team: 'FLU', pos: 'LAT', value: 30, points: 28, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 49, goalsAgainst: 44, goalDifference: 5, performance: 46.67, points: 28, goals: 0, assists: 1, yellowCards: 2, redCards: 0 }, performanceHistory: [] },
      'p7': { name: 'Adriano Carvalho', team: 'FOR', pos: 'ATA', value: 36, points: 31, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 4, goalsFor: 58, goalsAgainst: 52, goalDifference: 6, performance: 46.97, points: 31, goals: 15, assists: 2, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p8': { name: 'Deyvid Gontarczik Deca', team: 'GOI', pos: 'ATA', value: 30, points: 29, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 2, goalsFor: 58, goalsAgainst: 53, goalDifference: 5, performance: 48.33, points: 29, goals: 19, assists: 6, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p9': { name: 'Felipe Ropeiro (Cabanhas)', team: 'JUV', pos: 'MEI', value: 31.5, points: 30, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 10, draws: 3, goalsFor: 53, goalsAgainst: 54, goalDifference: -1, performance: 45.45, points: 30, goals: 8, assists: 5, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p10': { name: 'Vinícius Abreu', team: 'SAN', pos: 'ATA', value: 28.5, points: 26, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 10, draws: 2, goalsFor: 55, goalsAgainst: 58, goalDifference: -3, performance: 43.33, points: 26, goals: 19, assists: 7, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p11': { name: 'Bruno Costa (Bruneca)', team: 'VIT', pos: 'ZAG', value: 27, points: 20, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 2, goalsFor: 46, goalsAgainst: 52, goalDifference: -6, performance: 33.33, points: 20, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p12': { name: 'Felipe Correa', team: 'FLA', pos: 'VOL', value: 19.5, points: 15, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 3, goalsFor: 36, goalsAgainst: 40, goalDifference: -4, performance: 33.33, points: 15, goals: 1, assists: 2, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p13': { name: 'Alexandre Santos', team: 'CRU', pos: 'ZAG', value: 21, points: 20, last_val: 0.5, games: 17, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 9, draws: 2, goalsFor: 40, goalsAgainst: 51, goalDifference: -11, performance: 39.22, points: 20, goals: 0, assists: 1, yellowCards: 3, redCards: 0 }, performanceHistory: [] },
      'p14': { name: 'Vicente Gagliardi (Pizza)', team: 'PAL', pos: 'ATA', value: 13.5, points: 13, last_val: 0.5, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 8, draws: 1, goalsFor: 38, goalsAgainst: 47, goalDifference: -9, performance: 33.33, points: 13, goals: 6, assists: 2, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p15': { name: 'Gustavo Reis (Titânio)', team: 'COR', pos: 'LAT', value: 19.5, points: 21, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 3, goalsFor: 46, goalsAgainst: 58, goalDifference: -12, performance: 33.33, points: 21, goals: 0, assists: 2, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p16': { name: 'Isaias Souza', team: 'INT', pos: 'MEI', value: 18, points: 17, last_val: 0.5, games: 19, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 12, draws: 2, goalsFor: 39, goalsAgainst: 53, goalDifference: -14, performance: 29.82, points: 17, goals: 3, assists: 4, yellowCards: 2, redCards: 0 }, performanceHistory: [] },
      'p17': { name: 'Beto', team: 'GRE', pos: 'MEI', value: 10.5, points: 10, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 11, draws: 1, goalsFor: 35, goalsAgainst: 48, goalDifference: -13, performance: 22.22, points: 10, goals: 3, assists: 4, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p18': { name: 'Diego Nunes', team: 'SAO', pos: 'ATA', value: 4.5, points: 9, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 1, draws: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, performance: 75, points: 9, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p19': { name: 'Thiago Santos', team: 'VAS', pos: 'MEI', value: 4.5, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 50, points: 3, goals: 1, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p20': { name: 'Carlos Souza', team: 'AVA', pos: 'Mei / Lat', value: 4.5, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 50, points: 3, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p21': { name: 'Heitor (Totti)', team: 'BOT', pos: 'ATA', value: 21, points: 18, last_val: 0.5, games: 10, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 0, goalsFor: 25, goalsAgainst: 19, goalDifference: 6, performance: 60, points: 18, goals: 2, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p22': { name: 'Juliano Vello', team: 'CAM', pos: 'LAT', value: 22.5, points: 13, last_val: 0.5, games: 12, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 1, goalsFor: 27, goalsAgainst: 25, goalDifference: 2, performance: 36.11, points: 13, goals: 0, assists: 1, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p23': { name: 'Paulo Fogaça', team: 'CFC', pos: 'MEI', value: 15, points: 15, last_val: 0.5, games: 8, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 3, draws: 0, goalsFor: 21, goalsAgainst: 15, goalDifference: 6, performance: 62.5, points: 15, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p24': { name: 'Érico', team: 'CRI', pos: 'VOL', value: 7.5, points: 6, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 7, goalsAgainst: 5, goalDifference: 2, performance: 50, points: 6, goals: 1, assists: 1, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p25': { name: 'Lucas Limone', team: 'FLU', pos: 'LAT', value: 7.5, points: 6, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 14, goalsAgainst: 13, goalDifference: 1, performance: 50, points: 6, goals: 1, assists: 1, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p26': { name: 'Lupo', team: 'FOR', pos: 'VOL', value: 3, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 6, goalsAgainst: 5, goalDifference: 1, performance: 50, points: 3, goals: 0, assists: 1, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p27': { name: 'Jason', team: 'INT', pos: 'MEI', value: 3, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 50, points: 3, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p28': { name: 'Giovani', team: 'GOI', pos: 'LAT', value: 1.5, points: 3, last_val: 0.5, games: 7, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 6, draws: 0, goalsFor: 12, goalsAgainst: 31, goalDifference: -19, performance: 14.29, points: 3, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p29': { name: 'Lucca', team: 'JUV', pos: 'ATA', value: 7.5, points: 6, last_val: 0.5, games: 5, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 3, draws: 0, goalsFor: 24, goalsAgainst: 31, goalDifference: -7, performance: 40, points: 6, goals: 1, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p30': { name: 'Pedro Roberto', team: 'SAN', pos: 'ATA', value: 4.5, points: 4, last_val: 0.5, games: 9, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 7, draws: 1, goalsFor: 15, goalsAgainst: 28, goalDifference: -13, performance: 14.81, points: 4, goals: 3, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p31': { name: 'Vinícius Conceição', team: 'VAS', pos: 'GOL', value: 5.0, points: 23, last_val: 0, games: 14, img: 'https://placehold.co/60x60', stats: { wins: 7, losses: 5, draws: 2, goalsFor: 0, goalsAgainst: 29, goalDifference: 0, performance: 54.76, points: 23, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
      'p32': { name: 'Walex Leek', team: 'CFC', pos: 'GOL', value: 5.0, points: 27, last_val: 0, games: 19, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 3, goalsFor: 0, goalsAgainst: 44, goalDifference: 0, performance: 47.37, points: 27, goals: 0, assists: 0, yellowCards: 1, redCards: 0 }, performanceHistory: [] },
      'p33': { name: 'Tom', team: 'SAO', pos: 'GOL', value: 5.0, points: 20, last_val: 0, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 5, draws: 2, goalsFor: 0, goalsAgainst: 34, goalDifference: 0, performance: 51.28, points: 20, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }, performanceHistory: [] },
       // Brasil 2002
      'p-marcos': { name: 'Marcos', team: 'BRA', pos: 'GOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-cafu': { name: 'Cafu', team: 'BRA', pos: 'LAT', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-lucio': { name: 'Lúcio', team: 'BRA', pos: 'ZAG', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-roque-junior': { name: 'Roque Junior', team: 'BRA', pos: 'ZAG', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-roberto-carlos': { name: 'Roberto Carlos', team: 'BRA', pos: 'LAT', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-edmilson': { name: 'Edmilson', team: 'BRA', pos: 'VOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-gilberto-silva': { name: 'Gilberto Silva', team: 'BRA', pos: 'VOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-juninho-paulista': { name: 'Juninho Paulista', team: 'BRA', pos: 'MEI', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rivaldo': { name: 'Rivaldo', team: 'BRA', pos: 'MEI', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-ronaldinho': { name: 'Ronaldinho Gaúcho', team: 'BRA', pos: 'ATA', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-ronaldo': { name: 'Ronaldo', team: 'BRA', pos: 'ATA', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      // Brasil 1994
      'p-taffarel': { name: 'Taffarel', team: 'BRA', pos: 'GOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-jorginho': { name: 'Jorginho', team: 'BRA', pos: 'LAT', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-aldair': { name: 'Aldair', team: 'BRA', pos: 'ZAG', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-marcio-santos': { name: 'Márcio Santos', team: 'BRA', pos: 'ZAG', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-branco': { name: 'Branco', team: 'BRA', pos: 'LAT', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mauro-silva': { name: 'Mauro Silva', team: 'BRA', pos: 'VOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-dunga': { name: 'Dunga', team: 'BRA', pos: 'VOL', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mazinho': { name: 'Mazinho', team: 'BRA', pos: 'MEI', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-zinho': { name: 'Zinho', team: 'BRA', pos: 'MEI', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-bebeto': { name: 'Bebeto', team: 'BRA', pos: 'ATA', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-romario': { name: 'Romário', team: 'BRA', pos: 'ATA', value: 10, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
    },
    scalersRanking: {
        'scaler1': { id: 'scaler1', name: 'Gustavo', games: 5, resultsDifference: 5, avgDifference: 1.00 },
        'scaler2': { id: 'scaler2', name: 'Rafael', games: 2, resultsDifference: 2, avgDifference: 1.00 },
        'scaler3': { id: 'scaler3', name: 'Cabanhas', games: 3, resultsDifference: 4, avgDifference: 1.33 },
        'scaler4': { id: 'scaler4', name: 'Pizza', games: 2, resultsDifference: 3, avgDifference: 1.50 },
        'scaler5': { id: 'scaler5', name: 'André', games: 4, resultsDifference: 8, avgDifference: 2.00 },
        'scaler6': { id: 'scaler6', name: 'Isaías', games: 6, resultsDifference: 13, avgDifference: 2.17 },
        'scaler7': { id: 'scaler7', name: 'Deca', games: 3, resultsDifference: 7, avgDifference: 2.33 },
        'scaler8': { id: 'scaler8', name: 'Juliano', games: 2, resultsDifference: 6, avgDifference: 3.00 },
    },
    goalieRanking: {
        'goalie1': { id: 'goalie1', name: 'Vinícius Conceição', games: 14, goalsConceded: 29, avgGoalsConceded: 2.07 },
        'goalie2': { id: 'goalie2', name: 'Walex Leek', games: 19, goalsConceded: 44, avgGoalsConceded: 2.32 },
        'goalie3': { id: 'goalie3', name: 'Tom', games: 13, goalsConceded: 34, avgGoalsConceded: 2.62 },
    }
};

const jasonTestLeague: League = {
    id: 'jasonTestLeague',
    name: 'teste',
    adminId: 'user27', // Jason's user ID
    modality: null, // User needs to select a modality
    paymentsEnabled: true,
    games: {},
    users: {
        'user27': { // Add Jason to his own league
            id: 'user27', 
            name: 'Jason (Admin)', 
            email: 'jason.teraani@gmail.com',
            teamName: 'Jason FC',
            partialScore: 0,
            totalScore: 0,
            valuation: 100,
            lineup: [],
            reserves: [],
            role: 'admin',
            avatar: 'https://placehold.co/128x128.png',
            paymentDueDate: '2025-08-01'
        },
    },
    players: { ...defaultLeagueData.players }, // Start with the same players as the default league
    editorOfTheRound: null,
    scoutEditor: null,
    paymentEditor: null,
    scalersRanking: {},
    goalieRanking: {},
};


export const initialData: AppData = {
    leagues: {
        'defaultLeague': defaultLeagueData,
        'jasonTestLeague': jasonTestLeague,
    }
}
