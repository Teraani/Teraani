
"use client";

import { useState, useMemo } from 'react';
import type { Player, User } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';


interface PartialScoreViewProps {
  user: User;
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
}

export default function PartialScoreView({ user, players, onBack, onPlayerSelect }: PartialScoreViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const lineupPlayers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return user.lineup
      .map(id => ({ ...players[id], id }))
      .filter(player => player.name.toLowerCase().includes(lowerCaseSearch))
      .sort((a, b) => b.points - a.points);
  }, [searchTerm, user.lineup, players]);

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <header className="bg-white dark:bg-zinc-800 p-4 shadow-md flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-gray-800 dark:text-gray-100">Parcial dos Jogadores</h2>
        <div className="w-9 h-9" />
      </header>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-10 h-10 bg-gray-200 dark:bg-zinc-700">
             <AvatarFallback className="text-xs text-gray-600 dark:text-gray-300">Buscar</AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="Nome do atleta"
            className="w-full bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {lineupPlayers.map((player) => (
            <Card 
              key={player.id} 
              className="p-3 flex items-center justify-between cursor-pointer bg-gray-200 dark:bg-zinc-800 border-none"
              onClick={() => onPlayerSelect(player.id)}
            >
              <div className="flex items-center space-x-3">
                 <Image src={player.img} alt={player.name} width={40} height={40} data-ai-hint="player portrait" className="rounded-full" />
                <div>
                  <p className="font-bold text-gray-800 dark:text-gray-100">{player.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{player.pos} - {player.team}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{player.points.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
