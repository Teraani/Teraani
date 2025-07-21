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
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface User {
  teamName: string;
  partialScore: number;
  totalScore: number;
  valuation: number;
  lineup: string[];
  reserves: string[];
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

interface AppData {
  user: User;
  players: Record<string, Player>;
  friends: Friend[];
}

export const data: AppData = {
    user: {
        teamName: "AmistososAI FC",
        partialScore: 58.49,
        totalScore: 1154.89,
        valuation: 125.88,
        lineup: ['p9', 'p6', 'p14', 'p15', 'p16', 'p1', 'p5', 'p7', 'p12', 'p4', 'p17'],
        reserves: ['p2', 'p3', 'p8', 'p10', 'p13']
    },
    players: {
        'p1': { name: 'Jason', team: 'FLA', pos: 'MEI', value: 3, points: 3, last_val: 0.50, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 50, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p2': { name: 'K. JORGE', team: 'CRU', pos: 'ATA', value: 8.50, points: 5.10, last_val: 0.25, games: 9, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 3, draws: 2, goalsFor: 20, goalsAgainst: 15, goalDifference: 5, performance: 55.56, goals: 5, assists: 2, yellowCards: 1, redCards: 0 } },
        'p3': { name: 'A. CABRAL', team: 'PAL', pos: 'ATA', value: 11.20, points: 7.80, last_val: 1.10, games: 12, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 2, goalsFor: 25, goalsAgainst: 20, goalDifference: 5, performance: 58.33, goals: 7, assists: 3, yellowCards: 0, redCards: 0 } },
        'p4': { name: 'M. DEPAY', team: 'COR', pos: 'ATA', value: 9.70, points: 1.70, last_val: -0.80, games: 10, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 5, draws: 2, goalsFor: 15, goalsAgainst: 18, goalDifference: -3, performance: 40, goals: 2, assists: 1, yellowCards: 2, redCards: 0 } },
        'p5': { name: 'A. PATRICK', team: 'INT', pos: 'MEI', value: 12.60, points: 12.60, last_val: 1.46, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 3, draws: 4, goalsFor: 30, goalsAgainst: 20, goalDifference: 10, performance: 66.67, goals: 12, assists: 6, yellowCards: 1, redCards: 0 } },
        'p6': { name: 'BERNABÉ', team: 'INT', pos: 'ZAG', value: 6.40, points: 6.40, last_val: 0.80, games: 14, img: 'https://placehold.co/60x60', stats: { wins: 7, losses: 4, draws: 3, goalsFor: 18, goalsAgainst: 15, goalDifference: 3, performance: 50, goals: 1, assists: 0, yellowCards: 4, redCards: 1 } },
        'p7': { name: 'V. GABRIEL', team: 'INT', pos: 'MEI', value: 7.70, points: 7.70, last_val: 0.90, games: 11, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 3, draws: 3, goalsFor: 22, goalsAgainst: 18, goalDifference: 4, performance: 59.09, goals: 7, assists: 4, yellowCards: 2, redCards: 0 } },
        'p8': { name: 'VILLALBA', team: 'CRU', pos: 'MEI', value: 13.00, points: 13.00, last_val: 1.10, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 3, draws: 4, goalsFor: 33, goalsAgainst: 23, goalDifference: 10, performance: 66.67, goals: 13, assists: 8, yellowCards: 1, redCards: 0 } },
        'p9': { name: 'ROSSI', team: 'FLA', pos: 'GOL', value: 27, points: 27, last_val: 0.75, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 5, draws: 1, goalsFor: 37, goalsAgainst: 37, goalDifference: 0, performance: 60, goals: 8, assists: 2, yellowCards: 1, redCards: 0 } },
        'p10': { name: 'R. GUANAES', team: 'GRE', pos: 'ZAG', value: 8.29, points: 8.29, last_val: 0.60, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 3, goalsFor: 20, goalsAgainst: 18, goalDifference: 2, performance: 56.41, goals: 2, assists: 1, yellowCards: 3, redCards: 0 } },
        'p11': { name: 'WEVERTON', team: 'PAL', pos: 'GOL', value: 10.50, points: 6.50, last_val: 0.40, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 5, draws: 2, goalsFor: 25, goalsAgainst: 18, goalDifference: 7, performance: 60, goals: 0, assists: 0, yellowCards: 0, redCards: 0 } },
        'p12': { name: 'LUCIANO', team: 'SAO', pos: 'ATA', value: 20.30, points: 20.30, last_val: 0.86, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 3, draws: 3, goalsFor: 40, goalsAgainst: 25, goalDifference: 15, performance: 70, goals: 20, assists: 10, yellowCards: 2, redCards: 0 } },
        'p13': { name: 'WENDELL', team: 'SAO', pos: 'LAT', value: 19.30, points: 19.30, last_val: 3.35, games: 14, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 2, draws: 4, goalsFor: 28, goalsAgainst: 15, goalDifference: 13, performance: 66.67, goals: 3, assists: 5, yellowCards: 3, redCards: 0 } },
        'p14': { name: 'FERRARESI', team: 'SAO', pos: 'ZAG', value: 14.20, points: 14.20, last_val: 1.26, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 4, draws: 3, goalsFor: 25, goalsAgainst: 18, goalDifference: 7, performance: 62.22, goals: 2, assists: 1, yellowCards: 5, redCards: 0 } },
        'p15': { name: 'ARBOLEDA', team: 'SAO', pos: 'ZAG', value: 12.30, points: 12.30, last_val: 1.24, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 7, losses: 5, draws: 3, goalsFor: 22, goalsAgainst: 20, goalDifference: 2, performance: 55.56, goals: 1, assists: 0, yellowCards: 6, redCards: 1 } },
        'p16': { name: 'LUCAS FREITAS', team: 'VAS', pos: 'LAT', value: 11.50, points: 11.50, last_val: 1.98, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 3, goalsFor: 20, goalsAgainst: 15, goalDifference: 5, performance: 56.41, goals: 4, assists: 4, yellowCards: 2, redCards: 0 } },
        'p17': { name: 'Rafael', team: 'SAO', pos: 'ATA', value: 10.0, points: 5.0, last_val: 0.5, games: 10, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 3, draws: 2, goalsFor: 18, goalsAgainst: 12, goalDifference: 6, performance: 60, goals: 5, assists: 3, yellowCards: 1, redCards: 0 } },
        'p18': { name: 'Rafael Ohy', team: 'AVA', pos: 'MEI', value: 49.5, points: 49.5, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 3, draws: 3, goalsFor: 60, goalsAgainst: 46, goalDifference: 14, performance: 78.57, goals: 10, assists: 9, yellowCards: 1, redCards: 0 } },
        'p19': { name: 'Renan Ropeiro', team: 'BOT', pos: 'MEI', value: 27, points: 27, last_val: 0.5, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 3, draws: 2, goalsFor: 35, goalsAgainst: 28, goalDifference: 7, performance: 69.23, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p20': { name: 'André Corsini', team: 'CAM', pos: 'MEI', value: 46.5, points: 46.5, last_val: 0.5, games: 25, img: 'https://placehold.co/60x60', stats: { wins: 15, losses: 8, draws: 2, goalsFor: 68, goalsAgainst: 53, goalDifference: 15, performance: 62, goals: 1, assists: 5, yellowCards: 0, redCards: 0 } },
        'p21': { name: 'Gustavo Rodrigues', team: 'CRI', pos: 'VOL', value: 34.5, points: 34.5, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 56, goalsAgainst: 50, goalDifference: 6, performance: 57.5, goals: 5, assists: 9, yellowCards: 1, redCards: 0 } },
        'p22': { name: 'Vinícius Simão', team: 'FLU', pos: 'LAT', value: 30, points: 30, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 8, draws: 4, goalsFor: 49, goalsAgainst: 44, goalDifference: 5, performance: 55.56, goals: 0, assists: 1, yellowCards: 2, redCards: 0 } },
        'p23': { name: 'Adriano Carvalho', team: 'FOR', pos: 'ATA', value: 36, points: 36, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 4, goalsFor: 58, goalsAgainst: 52, goalDifference: 6, performance: 54.55, goals: 0, assists: 2, yellowCards: 0, redCards: 0 } },
        'p24': { name: 'Deyvid Gontarczik (Deca)', team: 'GOI', pos: 'ATA', value: 30, points: 30, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 9, draws: 2, goalsFor: 58, goalsAgainst: 53, goalDifference: 5, performance: 50, goals: 15, assists: 5, yellowCards: 1, redCards: 0 } },
        'p25': { name: 'Felipe Ropeiro (Cabanhas)', team: 'JUV', pos: 'MEI', value: 31.5, points: 31.5, last_val: 0.5, games: 22, img: 'https://placehold.co/60x60', stats: { wins: 9, losses: 10, draws: 3, goalsFor: 53, goalsAgainst: 54, goalDifference: -1, performance: 47.73, goals: 7, assists: 5, yellowCards: 1, redCards: 0 } },
        'p26': { name: 'Vinícius Abreu', team: 'SAN', pos: 'ATA', value: 28.5, points: 28.5, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 8, losses: 10, draws: 2, goalsFor: 55, goalsAgainst: 58, goalDifference: -3, performance: 45.24, goals: 18, assists: 7, yellowCards: 0, redCards: 0 } },
        'p27': { name: 'Bruno Costa (Bruneca)', team: 'VIT', pos: 'ZAG', value: 27, points: 27, last_val: 0.5, games: 20, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 2, goalsFor: 46, goalsAgainst: 52, goalDifference: -6, performance: 45, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
        'p28': { name: 'Felipe Correa', team: 'FLA', pos: 'VOL', value: 19.5, points: 19.5, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 3, goalsFor: 36, goalsAgainst: 40, goalDifference: -4, performance: 43.33, goals: 1, assists: 2, yellowCards: 0, redCards: 0 } },
        'p29': { name: 'Alexandre Santos', team: 'CRU', pos: 'ZAG', value: 21, points: 21, last_val: 0.5, games: 17, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 9, draws: 2, goalsFor: 40, goalsAgainst: 51, goalDifference: -11, performance: 41.18, goals: 1, assists: 1, yellowCards: 3, redCards: 0 } },
        'p30': { name: 'Vicente Gagliardi (Pizza)', team: 'PAL', pos: 'ATA', value: 13.5, points: 13.5, last_val: 0.5, games: 13, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 8, draws: 1, goalsFor: 38, goalsAgainst: 47, goalDifference: -9, performance: 34.62, goals: 6, assists: 2, yellowCards: 0, redCards: 0 } },
        'p31': { name: 'Gustavo Reis (Titânio)', team: 'COR', pos: 'LAT', value: 19.5, points: 19.5, last_val: 0.5, games: 21, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 12, draws: 3, goalsFor: 46, goalsAgainst: 58, goalDifference: -12, performance: 34.21, goals: 0, assists: 2, yellowCards: 0, redCards: 0 } },
        'p32': { name: 'Isaias Souza', team: 'INT', pos: 'MEI', value: 18, points: 18, last_val: 0.5, games: 19, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 12, draws: 2, goalsFor: 39, goalsAgainst: 53, goalDifference: -14, performance: 31.58, goals: 3, assists: 4, yellowCards: 2, redCards: 0 } },
        'p33': { name: 'Beto', team: 'GRE', pos: 'MEI', value: 10.5, points: 10.5, last_val: 0.5, games: 15, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 11, draws: 1, goalsFor: 35, goalsAgainst: 48, goalDifference: -13, performance: 23.33, goals: 3, assists: 2, yellowCards: 1, redCards: 0 } },
        'p34': { name: 'Diego Nunes', team: 'SAO', pos: 'ATA', value: 4.5, points: 4.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 3, losses: 1, draws: 0, goalsFor: 5, goalsAgainst: 1, goalDifference: 4, performance: 75, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p35': { name: 'Thiago Santos', team: 'VAS', pos: 'MEI', value: 4.5, points: 4.5, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 75, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p36': { name: 'Carlos Souza', team: 'AVA', pos: 'Mei / Lat', value: 4.5, points: 4.5, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 4, goalsAgainst: 3, goalDifference: 1, performance: 75, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p37': { name: 'Heitor (Totti)', team: 'BOT', pos: 'ATA', value: 21, points: 21, last_val: 0.5, games: 10, img: 'https://placehold.co/60x60', stats: { wins: 6, losses: 4, draws: 0, goalsFor: 25, goalsAgainst: 19, goalDifference: 6, performance: 70, goals: 2, assists: 0, yellowCards: 0, redCards: 0 } },
        'p38': { name: 'Juliano Vello', team: 'CAM', pos: 'LAT', value: 22.5, points: 22.5, last_val: 0.5, games: 12, img: 'https://placehold.co/60x60', stats: { wins: 4, losses: 7, draws: 1, goalsFor: 27, goalsAgainst: 25, goalDifference: 2, performance: 65, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
        'p39': { name: 'Paulo Fogaça', team: 'CFC', pos: 'MEI', value: 15, points: 15, last_val: 0.5, games: 8, img: 'https://placehold.co/60x60', stats: { wins: 5, losses: 3, draws: 0, goalsFor: 21, goalsAgainst: 15, goalDifference: 6, performance: 62.5, goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
        'p40': { name: 'Érico', team: 'CRI', pos: 'VOL', value: 7.5, points: 7.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 7, goalsAgainst: 5, goalDifference: 2, performance: 62.5, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
        'p41': { name: 'Lucas Limone', team: 'FLU', pos: 'LAT', value: 7.5, points: 7.5, last_val: 0.5, games: 4, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 2, draws: 0, goalsFor: 14, goalsAgainst: 13, goalDifference: 1, performance: 62.5, goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
        'p42': { name: 'Lupo', team: 'FOR', pos: 'VOL', value: 3, points: 3, last_val: 0.5, games: 2, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 1, draws: 0, goalsFor: 6, goalsAgainst: 5, goalDifference: 1, performance: 50, goals: 0, assists: 1, yellowCards: 0, redCards: 0 } },
        'p43': { name: 'Giovani', team: 'GOI', pos: 'LAT', value: 1.5, points: 1.5, last_val: 0.5, games: 7, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 6, draws: 0, goalsFor: 12, goalsAgainst: 31, goalDifference: -19, performance: 21.43, goals: 1, assists: 1, yellowCards: 0, redCards: 0 } },
        'p44': { name: 'Lucca', team: 'JUV', pos: 'ATA', value: 7.5, points: 7.5, last_val: 0.5, games: 5, img: 'https://placehold.co/60x60', stats: { wins: 2, losses: 3, draws: 0, goalsFor: 24, goalsAgainst: 31, goalDifference: -7, performance: 45.83, goals: 1, assists: 0, yellowCards: 0, redCards: 0 } },
        'p45': { name: 'Pedro Roberto', team: 'SAN', pos: 'ATA', value: 4.5, points: 4.5, last_val: 0.5, games: 9, img: 'https://placehold.co/60x60', stats: { wins: 1, losses: 7, draws: 1, goalsFor: 15, goalsAgainst: 28, goalDifference: -13, performance: 16.67, goals: 3, assists: 0, yellowCards: 0, redCards: 0 } }
    },
    friends: []
};
