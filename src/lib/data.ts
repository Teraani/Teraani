export interface Player {
  name: string;
  team: string;
  pos: 'GOL' | 'ZAG' | 'LAT' | 'MEI' | 'ATA';
  value: number;
  points: number;
  last_val: number;
  games: number;
  img: string;
}

export interface User {
  teamName: string;
  partialScore: number;
  totalScore: number;
  valuation: number;
  lineup: string[];
  reserves: string[];
}

interface AppData {
  user: User;
  players: Record<string, Player>;
}

export const data: AppData = {
    user: {
        teamName: "Time Verde",
        partialScore: 58.49,
        totalScore: 1154.89,
        valuation: 125.88,
        lineup: ['p9', 'p6', 'p14', 'p15', 'p16', 'p1', 'p5', 'p7', 'p12', 'p4', 'p17'],
        reserves: ['p2', 'p3', 'p8', 'p10', 'p13']
    },
    players: {
        'p1': { name: 'Jason', team: 'FLA', pos: 'MEI', value: 15.00, points: 9.70, last_val: 0.50, games: 11, img: 'https://placehold.co/60x60' },
        'p2': { name: 'K. JORGE', team: 'CRU', pos: 'ATA', value: 8.50, points: 5.10, last_val: 0.25, games: 9, img: 'https://placehold.co/60x60' },
        'p3': { name: 'A. CABRAL', team: 'PAL', pos: 'ATA', value: 11.20, points: 7.80, last_val: 1.10, games: 12, img: 'https://placehold.co/60x60' },
        'p4': { name: 'M. DEPAY', team: 'COR', pos: 'ATA', value: 9.70, points: 1.70, last_val: -0.80, games: 10, img: 'https://placehold.co/60x60' },
        'p5': { name: 'A. PATRICK', team: 'INT', pos: 'MEI', value: 12.60, points: 12.60, last_val: 1.46, games: 15, img: 'https://placehold.co/60x60' },
        'p6': { name: 'BERNABÉ', team: 'INT', pos: 'ZAG', value: 6.40, points: 6.40, last_val: 0.80, games: 14, img: 'https://placehold.co/60x60' },
        'p7': { name: 'V. GABRIEL', team: 'INT', pos: 'MEI', value: 7.70, points: 7.70, last_val: 0.90, games: 11, img: 'https://placehold.co/60x60' },
        'p8': { name: 'VILLALBA', team: 'CRU', pos: 'MEI', value: 13.00, points: 13.00, last_val: 1.10, games: 15, img: 'https://placehold.co/60x60' },
        'p9': { name: 'ROSSI', team: 'FLA', pos: 'GOL', value: 8.00, points: 8.00, last_val: 0.75, games: 15, img: 'https://placehold.co/60x60' },
        'p10': { name: 'R. GUANAES', team: 'GRE', pos: 'ZAG', value: 8.29, points: 8.29, last_val: 0.60, games: 13, img: 'https://placehold.co/60x60' },
        'p11': { name: 'WEVERTON', team: 'PAL', pos: 'GOL', value: 10.50, points: 6.50, last_val: 0.40, games: 15, img: 'https://placehold.co/60x60' },
        'p12': { name: 'LUCIANO', team: 'SAO', pos: 'ATA', value: 20.30, points: 20.30, last_val: 0.86, games: 15, img: 'https://placehold.co/60x60' },
        'p13': { name: 'WENDELL', team: 'SAO', pos: 'LAT', value: 19.30, points: 19.30, last_val: 3.35, games: 14, img: 'https://placehold.co/60x60' },
        'p14': { name: 'FERRARESI', team: 'SAO', pos: 'ZAG', value: 14.20, points: 14.20, last_val: 1.26, games: 15, img: 'https://placehold.co/60x60' },
        'p15': { name: 'ARBOLEDA', team: 'SAO', pos: 'ZAG', value: 12.30, points: 12.30, last_val: 1.24, games: 15, img: 'https://placehold.co/60x60' },
        'p16': { name: 'LUCAS FREITAS', team: 'VAS', pos: 'LAT', value: 11.50, points: 11.50, last_val: 1.98, games: 13, img: 'https://placehold.co/60x60' },
        'p17': { name: 'Rafael', team: 'SAO', pos: 'ATA', value: 10.0, points: 5.0, last_val: 0.5, games: 10, img: 'https://placehold.co/60x60' }
    }
};
