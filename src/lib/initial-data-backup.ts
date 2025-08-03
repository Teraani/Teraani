

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
      'p-mc-haaland': { name: 'Haaland', team: 'Man City', pos: 'ATA', value: 18.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=EH', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-de-bruyne': { name: 'De Bruyne', team: 'Man City', pos: 'MEI', value: 17.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=KB', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-foden': { name: 'Foden', team: 'Man City', pos: 'MEI', value: 16.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=PF', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-rodri': { name: 'Rodri', team: 'Man City', pos: 'VOL', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=R', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-dias': { name: 'Rúben Dias', team: 'Man City', pos: 'ZAG', value: 14.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=RD', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-walker': { name: 'Walker', team: 'Man City', pos: 'LAT', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=KW', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-ederson': { name: 'Ederson', team: 'Man City', pos: 'GOL', value: 12.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=E', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-silva': { name: 'Bernardo Silva', team: 'Man City', pos: 'MEI', value: 15.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=BS', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-gvardiol': { name: 'Gvardiol', team: 'Man City', pos: 'ZAG', value: 13.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JG', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-stones': { name: 'Stones', team: 'Man City', pos: 'ZAG', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JS', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-mc-grealish': { name: 'Grealish', team: 'Man City', pos: 'ATA', value: 14.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JG', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },

      'p-rm-bellingham': { name: 'Bellingham', team: 'Real Madrid', pos: 'MEI', value: 18.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=JB', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-vinicius': { name: 'Vinícius Jr.', team: 'Real Madrid', pos: 'ATA', value: 17.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=VJ', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-valverde': { name: 'Valverde', team: 'Real Madrid', pos: 'MEI', value: 16.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=FV', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-modric': { name: 'Modrić', team: 'Real Madrid', pos: 'MEI', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=LM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-rudiger': { name: 'Rüdiger', team: 'Real Madrid', pos: 'ZAG', value: 14.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=AR', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-carvajal': { name: 'Carvajal', team: 'Real Madrid', pos: 'LAT', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=DC', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-courtois': { name: 'Courtois', team: 'Real Madrid', pos: 'GOL', value: 12.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=TC', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-rodrygo': { name: 'Rodrygo', team: 'Real Madrid', pos: 'ATA', value: 16.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=R', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-militao': { name: 'Militão', team: 'Real Madrid', pos: 'ZAG', value: 14.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=EM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-tchouameni': { name: 'Tchouaméni', team: 'Real Madrid', pos: 'VOL', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=AT', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
      'p-rm-mendy': { name: 'Mendy', team: 'Real Madrid', pos: 'LAT', value: 12.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=FM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },

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
    }
}
