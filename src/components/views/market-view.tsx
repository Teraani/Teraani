"use client";

import { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import PlayerListItem from '@/components/market/player-list-item';

interface MarketViewProps {
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
}

export default function MarketView({ players, onPlayerSelect }: MarketViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return Object.entries(players)
      .filter(([_, player]) => player.name.toLowerCase().includes(lowerCaseSearch))
      .sort((a, b) => b[1].value - a[1].value); // Sort by value desc
  }, [searchTerm, players]);

  return (
    <div>
      <header className="bg-gray-800 dark:bg-zinc-800 text-white p-4 shadow-md sticky top-0 z-20">
        <h2 className="text-xl font-bold text-center">Mercado de Atletas</h2>
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
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {filteredPlayers.map(([id, player]) => (
            <PlayerListItem key={id} player={{...player, id}} onPlayerSelect={onPlayerSelect} />
          ))}
        </div>
      </div>
    </div>
  );
}
