
"use client";

import React, { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';

interface ScoutEditorViewProps {
  onBack: () => void;
  players: Record<string, Player>;
  onSave: (updatedPlayers: Record<string, Player>) => void;
  team1Lineup: (string | null)[];
  team2Lineup: (string | null)[];
}

const pointsConfig = {
    goal: 8,
    assist: 5,
    cleanSheet: 3, // For GOL, ZAG, LAT
    yellowCard: -2,
    redCard: -5,
};

const StatInput = ({ label, value, onIncrement, onDecrement }: { label: string, value: number, onIncrement: () => void, onDecrement: () => void }) => (
    <div className="flex flex-col items-center">
        <Label className="text-xs mb-1 text-muted-foreground">{label}</Label>
        <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" className="h-6 w-6 rounded-full" onClick={onDecrement}><Minus className="h-3 w-3"/></Button>
            <span className="font-bold text-lg w-6 text-center">{value}</span>
            <Button size="icon" variant="outline" className="h-6 w-6 rounded-full" onClick={onIncrement}><Plus className="h-3 w-3"/></Button>
        </div>
    </div>
);

export default function ScoutEditorView({ onBack, players, onSave, team1Lineup, team2Lineup }: ScoutEditorViewProps) {
  const [playerStats, setPlayerStats] = useState<Record<string, { goals: number; assists: number; cleanSheet: boolean; yellowCards: number; redCards: number }>>(() => {
    const initialStats: Record<string, any> = {};
    Object.keys(players).forEach(playerId => {
      initialStats[playerId] = {
        goals: 0,
        assists: 0,
        cleanSheet: false,
        yellowCards: 0,
        redCards: 0,
      };
    });
    return initialStats;
  });

  const { toast } = useToast();

  const handleStatChange = (playerId: string, stat: keyof typeof playerStats.p1, value: number | boolean) => {
    setPlayerStats(prev => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [stat]: value,
      },
    }));
  };

  const handleSave = () => {
    const updatedPlayers = { ...players };

    Object.keys(playerStats).forEach(playerId => {
      const stats = playerStats[playerId];
      const player = updatedPlayers[playerId];
      if (!player) return;

      let points = 0;
      points += stats.goals * pointsConfig.goal;
      points += stats.assists * pointsConfig.assist;
      points += stats.yellowCards * pointsConfig.yellowCard;
      points += stats.redCards * pointsConfig.redCard;

      if (stats.cleanSheet && ['GOL', 'ZAG', 'LAT'].includes(player.pos)) {
        points += pointsConfig.cleanSheet;
      }
      
      const last_val = points - player.points; // This might not be the right logic, but for now it shows change

      updatedPlayers[playerId] = {
        ...player,
        points: points,
        last_val: last_val,
        games: player.games + 1, // Increment games played
        stats: {
          ...player.stats,
          goals: (player.stats?.goals || 0) + stats.goals,
          assists: (player.stats?.assists || 0) + stats.assists,
          yellowCards: (player.stats?.yellowCards || 0) + stats.yellowCards,
          redCards: (player.stats?.redCards || 0) + stats.redCards,
          // Not calculating wins/losses here, simplifying for now
        }
      };
    });

    onSave(updatedPlayers);
    toast({
      title: "Scouts Salvos!",
      description: "As pontuações dos jogadores foram atualizadas com sucesso.",
    });
  };

  const renderPlayerList = (title: string, lineup: (string | null)[]) => {
    const playerIds = lineup.filter((id): id is string => id !== null);
    
    return (
        <div className="mb-6">
            <h3 className="text-lg font-bold mb-3">{title}</h3>
            <div className="space-y-3">
            {playerIds.map(playerId => {
                const player = players[playerId];
                const stats = playerStats[playerId];
                if (!player || !stats) return null;

                return (
                    <Card key={playerId} className="bg-card">
                        <CardContent className="p-3">
                            <div className="flex items-center gap-3 mb-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" />
                                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-bold text-foreground">{player.name}</p>
                                    <p className="text-sm text-muted-foreground">{player.pos} - {player.team}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-y-4">
                                <StatInput label="Gols" value={stats.goals} 
                                    onIncrement={() => handleStatChange(playerId, 'goals', stats.goals + 1)} 
                                    onDecrement={() => handleStatChange(playerId, 'goals', Math.max(0, stats.goals - 1))}
                                />
                                <StatInput label="Assist." value={stats.assists} 
                                    onIncrement={() => handleStatChange(playerId, 'assists', stats.assists + 1)}
                                    onDecrement={() => handleStatChange(playerId, 'assists', Math.max(0, stats.assists - 1))}
                                />
                                <div className="flex flex-col items-center">
                                    <Label className="text-xs mb-1 text-muted-foreground">Sem sofrer gol</Label>
                                    <Input type="checkbox" className="h-6 w-6" checked={stats.cleanSheet} onChange={(e) => handleStatChange(playerId, 'cleanSheet', e.target.checked)} />
                                </div>
                                <StatInput label="Amarelos" value={stats.yellowCards} 
                                    onIncrement={() => handleStatChange(playerId, 'yellowCards', stats.yellowCards + 1)}
                                    onDecrement={() => handleStatChange(playerId, 'yellowCards', Math.max(0, stats.yellowCards - 1))}
                                />
                                <StatInput label="Vermelhos" value={stats.redCards} 
                                    onIncrement={() => handleStatChange(playerId, 'redCards', stats.redCards + 1)}
                                    onDecrement={() => handleStatChange(playerId, 'redCards', Math.max(0, stats.redCards - 1))}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )
            })}
            </div>
        </div>
    )
  };


  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Editor de Scouts</h2>
        <Button variant="ghost" size="icon" onClick={handleSave} className="hover:bg-accent text-primary">
          <Save className="h-6 w-6" />
        </Button>
      </header>
      
      <main className="p-4">
        <Card className="bg-muted/30 border-primary/20 mb-6">
            <CardHeader>
                <CardTitle>Instruções</CardTitle>
                <CardDescription>
                    Insira os scouts para cada jogador que participou da partida. A pontuação será calculada e atualizada para todos os usuários.
                </CardDescription>
            </CardHeader>
        </Card>
        
        <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="pr-4">
                {renderPlayerList("Time 1", team1Lineup)}
                {renderPlayerList("Time 2", team2Lineup)}
            </div>
        </ScrollArea>
      </main>
       <div className="fixed bottom-0 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-50">
          <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg" onClick={handleSave}>
              <Save className="mr-2 h-5 w-5"/>
              Salvar Scouts e Atualizar Pontuações
          </Button>
      </div>
    </div>
  );
}

// Simple Label component for internal use
const Label = (props: React.LabelHTMLAttributes<HTMLLabelElement>) => (
    <label {...props} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", props.className)} />
);
