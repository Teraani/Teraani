
"use client";

import { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PartialScoreViewProps {
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
}

export default function PartialScoreView({ players, onBack, onPlayerSelect }: PartialScoreViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allPlayersSorted = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return Object.entries(players)
      .map(([id, player]) => ({ ...player, id }))
      .filter(player => player.name.toLowerCase().includes(lowerCaseSearch))
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  }, [searchTerm, players]);

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
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por nome do atleta..."
            className="w-full bg-background border-border pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[calc(100vh-180px)]">
            <div className="space-y-2 pr-2">
            {allPlayersSorted.map((player) => (
                <Card 
                key={player.id} 
                className="p-3 flex items-center justify-between cursor-pointer bg-card hover:bg-muted/50"
                onClick={() => onPlayerSelect(player.id)}
                >
                <div className="flex items-center space-x-3">
                    <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" className="rounded-full w-10 h-10 object-cover" />
                    <div>
                    <p className="font-bold">{player.name}</p>
                    <p className="text-sm text-muted-foreground">{player.pos} - {player.team}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-bold text-lg text-primary">{player.points.toFixed(2)}</p>
                </div>
                </Card>
            ))}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
