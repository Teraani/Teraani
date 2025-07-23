
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
}

export interface Friend {
  id: string;
  name: string;
  teamName: string;
  score: number | null;
  playersPlayed: number;
  totalPlayers: number;
  isPro: boolean;
  crest: string;
  avatar: string;
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
    date: string;
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    status: 'Finalizado' | 'Em andamento' | 'Agendado';
    scorers: { player: string; team: string }[];
}

interface AppData {
  users: Record<string, User>;
  editorOfTheRound: string | null;
  scoutEditor: string | null;
  paymentEditor: string | null;
  players: Record<string, Player>;
  friends: Friend[];
  scalersRanking: Record<string, Ranking>;
  goalieRanking: Record<string, GoalieRanking>;
}

export const data: AppData = {
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
        },
        'user2': { id: 'user2', name: 'Renan Ropeiro', email: 'user2@example.com', teamName: 'User 2 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user3': { id: 'user3', name: 'André Corsini', email: 'user3@example.com', teamName: 'User 3 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user4': { id: 'user4', name: 'Rossi', email: 'user4@example.com', teamName: 'User 4 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user5': { id: 'user5', name: 'Gustavo Rodrigues', email: 'user5@example.com', teamName: 'User 5 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user6': { id: 'user6', name: 'Vinícius Simão', email: 'user6@example.com', teamName: 'User 6 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user7': { id: 'user7', name: 'Adriano Carvalho', email: 'user7@example.com', teamName: 'User 7 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user8': { id: 'user8', name: 'Deyvid Gontarczik Deca', email: 'user8@example.com', teamName: 'User 8 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user9': { id: 'user9', name: 'Felipe Ropeiro (Cabanhas)', email: 'user9@example.com', teamName: 'User 9 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user10': { id: 'user10', name: 'Vinícius Abreu', email: 'user10@example.com', teamName: 'User 10 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user11': { id: 'user11', name: 'Bruno Costa (Bruneca)', email: 'user11@example.com', teamName: 'User 11 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user12': { id: 'user12', name: 'Felipe Correa', email: 'user12@example.com', teamName: 'User 12 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user13': { id: 'user13', name: 'Alexandre Santos', email: 'user13@example.com', teamName: 'User 13 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user14': { id: 'user14', name: 'Vicente Gagliardi (Pizza)', email: 'user14@example.com', teamName: 'User 14 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user15': { id: 'user15', name: 'Gustavo Reis (Titânio)', email: 'user15@example.com', teamName: 'User 15 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user16': { id: 'user16', name: 'Isaias Souza', email: 'user16@example.com', teamName: 'User 16 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user17': { id: 'user17', name: 'Beto', email: 'user17@example.com', teamName: 'User 17 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user18': { id: 'user18', name: 'Diego Nunes', email: 'user18@example.com', teamName: 'User 18 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user19': { id: 'user19', name: 'Thiago Santos', email: 'user19@example.com', teamName: 'User 19 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user20': { id: 'user20', name: 'Carlos Souza', email: 'user20@example.com', teamName: 'User 20 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user21': { id: 'user21', name: 'Heitor (Totti)', email: 'user21@example.com', teamName: 'User 21 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user22': { id: 'user22', name: 'Juliano Vello', email: 'user22@example.com', teamName: 'User 22 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user23': { id: 'user23', name: 'Paulo Fogaça', email: 'user23@example.com', teamName: 'User 23 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user24': { id: 'user24', name: 'Érico', email: 'user24@example.com', teamName: 'User 24 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user25': { id: 'user25', name: 'Lucas Limone', email: 'user25@example.com', teamName: 'User 25 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user26': { id: 'user26', name: 'Lupo', email: 'user26@example.com', teamName: 'User 26 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user27': { id: 'user27', name: 'Jason (Admin)', email: 'jason.teraani@gmail.com', teamName: 'User 27 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'admin', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user28': { id: 'user28', name: 'Giovani', email: 'user28@example.com', teamName: 'User 28 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user29': { id: 'user29', name: 'Lucca', email: 'user29@example.com', teamName: 'User 29 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user30': { id: 'user30', name: 'Pedro Roberto', email: 'user30@example.com', teamName: 'User 30 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
        'user31': { id: 'user31', name: 'Rafael Ohy', email: 'user31@example.com', teamName: 'User 31 FC', partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player', avatar: 'https://placehold.co/128x128.png', paymentDueDate: '2025-08-01' },
    },
    editorOfTheRound: null,
    scoutEditor: null,
    paymentEditor: null,
    players: {
      'p1': { name: 'Rafael Ohy', team: 'AVA', pos: 'MEI', value: 49.5, points: 49.5, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 3, draws: 3, goalsFor: 60, goalsAgainst: 46, goalDifference: 14, performance: 78.57, points: 49.5, goals: 10, assists: 10, yellowCards: 1, redCards: 0 } },
      'p2': { name: 'Renan Ropeiro', team: 'BOT', pos: 'MEI', value: 27, points: 27, last_val: 0.5, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 3, draws: 2, goalsFor: 35, goalsAgainst: 28, goalDifference: 7, performance: 69.23, points: 27, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
      'p3': { name: 'André Corsini', team: 'CAM', pos: 'MEI', value: 46.5, points: 46.5, last_val: 0.5, games: 25, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 8, draws: 2, goalsFor: 68, goalsAgainst: 53, goalDifference: 15, performance: 62, points: 46.5, goals: 1, assists: 5, yellowCards: 0, redCards: 0 } },
      'p4': { name: 'Rossi', team: 'FLA', pos: 'VOL', value: 27, points: 27, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 5, draws: 1, goalsFor: 37, goalsAgainst: 37, goalDifference: 0, performance: 60, points: 27, goals: 8, assists: 7, yellowCards: 1, redCards: 0 } },
      'p5': { name: 'Gustavo Rodrigues', team: 'CRI', pos: 'VOL', value: 34.5, points: 34.5, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 56, goalsAgainst: 50, goalDifference: 6, performance: 57.5, points: 34.5, goals: 5, assists: 9, yellowCards: 1, redCards: 0 } },
      'p6': { name: 'Vinícius Simão', team: 'FLU', pos: 'LAT', value: 30, points: 30, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 49, goalsAgainst: 44, goalDifference: 5, performance: 55.56, points: 30, goals: 0, assists: 1, yellowCards: 2, redCards: 0 } },
      'p7': { name: 'Adriano Carvalho', team: 'FOR', pos: 'ATA', value: 36, points: 36, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 4, goalsFor: 58, goalsAgainst: 52, goalDifference: 6, performance: 54.55, points: 36, goals: 15, assists: 2, yellowCards: 0, redCards: 0 } },
      'p8': { name: 'Deyvid Gontarczik Deca', team: 'GOI', pos: 'ATA', value: 30, points: 30, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 2, goalsFor: 58, goalsAgainst: 53, goalDifference: 5, performance: 50, points: 30, goals: 19, assists: 6, yellowCards: 1, redCards: 0 } },
      'p9': { name: 'Felipe Ropeiro (Cabanhas)', team: 'JUV', pos: 'MEI', value: 31.5, points: 31.5, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 10, draws: 3, goalsFor: 53, goalsAgainst: 54, goalDifference: -1, performance: 47.73, points: 31.5, goals: 8, assists: 5, yellowCards: 1, redCards: 0 } },
      'p10': { name: 'Vinícius Abreu', team: 'SAN', pos: 'ATA', value: 28.5, points: 28.5, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 10, draws: 2, goalsFor: 55, goalsAgainst: 58, goalDifference: -3, performance: 45.24, points: 28.5, goals: 19, assists: 7, yellowCards: 0, redCards: 0 } },
      'p11': { name: 'Bruno Costa (Bruneca)', team: 'VIT', pos: 'ZAG', value: 27, points: 27, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 2, goalsFor: 46, goalsAgainst: 52, goalDifference: -6, performance: 45, points: 27, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p12': { name: 'Felipe Correa', team: 'FLA', pos: 'VOL', value: 19.5, points: 19.5, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 3, goalsFor: 36, goalsAgainst: 40, goalDifference: -4, performance: 43.33, points: 19.5, goals: 1, assists: 2, yellowCards: 0, redCards: 0 } },
      'p13': { name: 'Alexandre Santos', team: 'CRU', pos: 'ZAG', value: 21, points: 21, last_val: 0.5, games: 17, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 9, draws: 2, goalsFor: 40, goalsAgainst: 51, goalDifference: -11, performance: 41.18, points: 21, goals: 0, assists: 1, yellowCards: 3, redCards: 0 } },
      'p14': { name: 'Vicente Gagliardi (Pizza)', team: 'PAL', pos: 'ATA', value: 13.5, points: 13.5, last_val: 0.5, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 8, draws: 1, goalsFor: 38, goalsAgainst: 47, goalDifference: -9, performance: 34.62, points: 13.5, goals: 6, assists: 2, yellowCards: 0, redCards: 0 } },
      'p15': { name: 'Gustavo Reis (Titânio)', team: 'COR', pos: 'LAT', value: 19.5, points: 19.5, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 3, goalsFor: 46, goalsAgainst: 58, goalDifference: -12, performance: 34.21, points: 19.5, goals: 0, assists: 2, yellowCards: 0, redCards: 0 } },
      'p16': { name: 'Isaias Souza', team: 'INT', pos: 'MEI', value: 18, points: 18, last_val: 0.5, games: 19, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 12, draws: 2, goalsFor: 39, goalsAgainst: 53, goalDifference: -14, performance: 31.58, points: 18, goals: 3, assists: 4, yellowCards: 2, redCards: 0 } },
      'p17': { name: 'Beto', team: 'GRE', pos: 'MEI', value: 10.5, points: 10.5, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 11, draws: 1, goalsFor: 35, goalsAgainst: 48, goalDifference: -13, performance: 23.33, points: 10.5, goals: 3, assists: 4, yellowCards: 1, redCards: 0 } },
      'p18': { name: 'Diego Nunes', team: 'SAO', pos: 'ATA', value: 4.5, points: 4.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 1, draws: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, performance: 75, points: 4.5, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p19': { name: 'Thiago Santos', team: 'VAS', pos: 'MEI', value: 4.5, points: 4.5, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 75, points: 4.5, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
      'p20': { name: 'Carlos Souza', team: 'AVA', pos: 'Mei / Lat', value: 4.5, points: 4.5, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 75, points: 4.5, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p21': { name: 'Heitor (Totti)', team: 'BOT', pos: 'ATA', value: 21, points: 21, last_val: 0.5, games: 10, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 0, goalsFor: 25, goalsAgainst: 19, goalDifference: 6, performance: 70, points: 21, goals: 2, assists: 0, yellowCards: 0, redCards: 0 } },
      'p22': { name: 'Juliano Vello', team: 'CAM', pos: 'LAT', value: 22.5, points: 22.5, last_val: 0.5, games: 12, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 1, goalsFor: 27, goalsAgainst: 25, goalDifference: 2, performance: 65, points: 22.5, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
      'p23': { name: 'Paulo Fogaça', team: 'CFC', pos: 'MEI', value: 15, points: 15, last_val: 0.5, games: 8, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 3, draws: 0, goalsFor: 21, goalsAgainst: 15, goalDifference: 6, performance: 62.5, points: 15, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p24': { name: 'Érico', team: 'CRI', pos: 'VOL', value: 7.5, points: 7.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 7, goalsAgainst: 5, goalDifference: 2, performance: 62.5, points: 7.5, goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
      'p25': { name: 'Lucas Limone', team: 'FLU', pos: 'LAT', value: 7.5, points: 7.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 14, goalsAgainst: 13, goalDifference: 1, performance: 62.5, points: 7.5, goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
      'p26': { name: 'Lupo', team: 'FOR', pos: 'VOL', value: 3, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 6, goalsAgainst: 5, goalDifference: 1, performance: 50, points: 3, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
      'p27': { name: 'Jason', team: 'INT', pos: 'MEI', value: 3, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 50, points: 3, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p28': { name: 'Giovani', team: 'GOI', pos: 'LAT', value: 1.5, points: 1.5, last_val: 0.5, games: 7, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 6, draws: 0, goalsFor: 12, goalsAgainst: 31, goalDifference: -19, performance: 21.43, points: 1.5, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p29': { name: 'Lucca', team: 'JUV', pos: 'ATA', value: 7.5, points: 7.5, last_val: 0.5, games: 5, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 3, draws: 0, goalsFor: 24, goalsAgainst: 31, goalDifference: -7, performance: 45.83, points: 7.5, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
      'p30': { name: 'Pedro Roberto', team: 'SAN', pos: 'ATA', value: 4.5, points: 4.5, last_val: 0.5, games: 9, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 7, draws: 1, goalsFor: 15, goalsAgainst: 28, goalDifference: -13, performance: 16.67, points: 4.5, goals: 3, assists: 0, yellowCards: 0, redCards: 0 } },
      'p31': { name: 'Vinícius Conceição', team: 'VAS', pos: 'GOL', value: 5.0, points: 22, last_val: 0, games: 14, img: 'https://placehold.co/60x60', stats: { wins: 7, losses: 5, draws: 2, goalsFor: 0, goalsAgainst: 29, goalDifference: 0, performance: 50, points: 22, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
      'p32': { name: 'Walex Leek', team: 'CFC', pos: 'GOL', value: 5.0, points: 25, last_val: 0, games: 19, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 3, goalsFor: 0, goalsAgainst: 44, goalDifference: 0, performance: 42, points: 25, goals: 0, assists: 0, yellowCards: 1, redCards: 0 } },
      'p33': { name: 'Tom', team: 'SAO', pos: 'GOL', value: 5.0, points: 20, last_val: 0, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 5, draws: 2, goalsFor: 0, goalsAgainst: 34, goalDifference: 0, performance: 46, points: 20, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
    },
    friends: [],
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


