
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
    <div>
      <header className="bg-card p-4 shadow-md flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Parcial dos Jogadores</h2>
        <div className="w-9 h-9" />
      </header>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="w-10 h-10 bg-muted">
             <AvatarFallback className="text-xs text-muted-foreground">Buscar</AvatarFallback>
          </Avatar>
          <Input
            type="text"
            placeholder="Nome do atleta"
            className="w-full bg-background border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          {lineupPlayers.map((player) => (
            <Card 
              key={player.id} 
              className="p-3 flex items-center justify-between cursor-pointer bg-card border-none"
              onClick={() => onPlayerSelect(player.id)}
            >
              <div className="flex items-center space-x-3">
                 <Image src={player.img} alt={player.name} width={40} height={40} data-ai-hint="player portrait" className="rounded-full" />
                <div>
                  <p className="font-bold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.pos} - {player.team}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{player.points.toFixed(2)}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
