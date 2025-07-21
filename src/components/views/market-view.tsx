
"use client";

import { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft } from 'lucide-react';
import PlayerListItem from '@/components/market/player-list-item';
import type { Position } from '@/app/page';

interface MarketViewProps {
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
  onBack: () => void;
  position: Position;
}

export default function MarketView({ players, onPlayerSelect, onBack, position }: MarketViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const groupedPlayers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    const allPlayers = Object.entries(players)
      .filter(([_, player]) => player.name.toLowerCase().includes(lowerCaseSearch))
      .sort((a, b) => b[1].value - a[1].value);

    if (lowerCaseSearch) {
      return { 'Resultados da Busca': allPlayers.map(([id, p]) => ({ ...p, id })) };
    }
    
    const groups: Record<string, ({id: string} & Player)[]> = {
      'ATA': [],
      'MEI': [],
      'LAT': [],
      'ZAG': [],
      'GOL': [],
    };

    allPlayers.forEach(([id, player]) => {
      const p = { ...player, id };
      if (groups[p.pos]) {
        groups[p.pos].push(p);
      }
    });

    const orderedGroups: Record<string, ({id: string} & Player)[]> = {};
    const order: (keyof typeof groups)[] = ['ATA', 'MEI', 'LAT', 'ZAG', 'GOL'];
    
    order.forEach(pos => {
        if (groups[pos]) {
            orderedGroups[pos] = groups[pos];
        }
    });
    
    return orderedGroups;

  }, [searchTerm, players]);

  return (
    <div>
      <header className="bg-white dark:bg-zinc-800 p-4 shadow-md flex items-center sticky top-0 z-20">
         <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-gray-800 dark:text-gray-100">Mercado de Atletas</h2>
        <div className="w-9 h-9" />
      </header>
      <div className="p-4">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Aqui você pode buscar, filtrar e analisar todos os jogadores disponíveis para escalar no seu time.
        </p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            id="market-search"
            placeholder="Buscar por nome do atleta..."
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {Object.entries(groupedPlayers).map(([pos, playerList]) => {
            if (playerList.length === 0) return null;
            return (
              <div key={pos}>
                <h3 className="font-bold text-lg mb-2 text-gray-800 dark:text-gray-100">{pos}</h3>
                <div className="space-y-2">
                  {playerList.map((player) => (
                    <PlayerListItem key={player.id} player={player} onPlayerSelect={() => onPlayerSelect(player.id)} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
