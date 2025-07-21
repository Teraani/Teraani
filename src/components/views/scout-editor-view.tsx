
"use client";

import React, { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Plus, Minus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';


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

const PlayerStatEditorCard = ({ player, stats, handleStatChange }: {
    player: Player & { id: string };
    stats: any;
    handleStatChange: (playerId: string, stat: string, value: any) => void;
}) => {
    if (!player || !stats) return null;
    return (
        <Card className="bg-card">
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
                        onIncrement={() => handleStatChange(player.id, 'goals', stats.goals + 1)} 
                        onDecrement={() => handleStatChange(player.id, 'goals', Math.max(0, stats.goals - 1))}
                    />
                    <StatInput label="Assist." value={stats.assists} 
                        onIncrement={() => handleStatChange(player.id, 'assists', stats.assists + 1)}
                        onDecrement={() => handleStatChange(player.id, 'assists', Math.max(0, stats.assists - 1))}
                    />
                    <div className="flex flex-col items-center">
                        <Label className="text-xs mb-1 text-muted-foreground">Sem sofrer gol</Label>
                        <Input type="checkbox" className="h-6 w-6" checked={stats.cleanSheet} onChange={(e) => handleStatChange(player.id, 'cleanSheet', e.target.checked)} />
                    </div>
                    <StatInput label="Amarelos" value={stats.yellowCards} 
                        onIncrement={() => handleStatChange(player.id, 'yellowCards', stats.yellowCards + 1)}
                        onDecrement={() => handleStatChange(player.id, 'yellowCards', Math.max(0, stats.yellowCards - 1))}
                    />
                    <StatInput label="Vermelhos" value={stats.redCards} 
                        onIncrement={() => handleStatChange(player.id, 'redCards', stats.redCards + 1)}
                        onDecrement={() => handleStatChange(player.id, 'redCards', Math.max(0, stats.redCards - 1))}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

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
  
  const [searchTerm, setSearchTerm] = useState('');
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

      const hasPlayed = Object.values(stats).some(val => (typeof val === 'number' && val > 0) || val === true);
      if (!hasPlayed) return; // Only update players who had stats entered

      let pointsFromGame = 0;
      pointsFromGame += stats.goals * pointsConfig.goal;
      pointsFromGame += stats.assists * pointsConfig.assist;
      pointsFromGame += stats.yellowCards * pointsConfig.yellowCard;
      pointsFromGame += stats.redCards * pointsConfig.redCard;

      if (stats.cleanSheet && ['GOL', 'ZAG', 'LAT'].includes(player.pos)) {
        pointsFromGame += pointsConfig.cleanSheet;
      }
      
      const newTotalPoints = player.points + pointsFromGame;
      const last_val = pointsFromGame;
      
      const currentStats = player.stats ?? {
        wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
        performance: 0, points: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0
      };

      updatedPlayers[playerId] = {
        ...player,
        points: newTotalPoints,
        last_val: last_val,
        games: player.games + 1,
        stats: {
          ...currentStats,
          goals: currentStats.goals + stats.goals,
          assists: currentStats.assists + stats.assists,
          yellowCards: currentStats.yellowCards + stats.yellowCards,
          redCards: currentStats.redCards + stats.redCards,
        }
      };
    });

    onSave(updatedPlayers);
    toast({
      title: "Scouts Salvos!",
      description: "As pontuações dos jogadores foram atualizadas com sucesso.",
    });
  };
  
  const { team1Players, team2Players, otherPlayers } = useMemo(() => {
    const team1Ids = new Set(team1Lineup.filter(Boolean));
    const team2Ids = new Set(team2Lineup.filter(Boolean));
    const lowerCaseSearch = searchTerm.toLowerCase();

    const all = Object.entries(players)
      .map(([id, p]) => ({ ...p, id }))
      .filter(p => p.name.toLowerCase().includes(lowerCaseSearch));

    return {
        team1Players: all.filter(p => team1Ids.has(p.id)),
        team2Players: all.filter(p => team2Ids.has(p.id)),
        otherPlayers: all.filter(p => !team1Ids.has(p.id) && !team2Ids.has(p.id)),
    }
  }, [players, team1Lineup, team2Lineup, searchTerm]);

  return (
    <div className="pb-40">
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
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar jogador pelo nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/30 border-border"
            />
        </div>
        
        <ScrollArea className="h-[calc(100vh-280px)]">
            <Accordion type="multiple" defaultValue={['time1', 'time2', 'outros']} className="pr-4 space-y-4">
                <AccordionItem value="time1" className="border rounded-lg overflow-hidden bg-card">
                    <AccordionTrigger className="p-4 text-lg font-bold hover:no-underline">Time 1</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 space-y-3">
                        {team1Players.length > 0 ? (
                            team1Players.map(p => <PlayerStatEditorCard key={p.id} player={p} stats={playerStats[p.id]} handleStatChange={handleStatChange} />)
                        ) : (
                            <p className="text-muted-foreground text-center p-4">Nenhum jogador escalado neste time.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="time2" className="border rounded-lg overflow-hidden bg-card">
                    <AccordionTrigger className="p-4 text-lg font-bold hover:no-underline">Time 2</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 space-y-3">
                        {team2Players.length > 0 ? (
                           team2Players.map(p => <PlayerStatEditorCard key={p.id} player={p} stats={playerStats[p.id]} handleStatChange={handleStatChange} />)
                        ) : (
                            <p className="text-muted-foreground text-center p-4">Nenhum jogador escalado neste time.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="outros" className="border rounded-lg overflow-hidden bg-card">
                    <AccordionTrigger className="p-4 text-lg font-bold hover:no-underline">Outros Jogadores</AccordionTrigger>
                    <AccordionContent className="p-4 pt-0 space-y-3">
                        {otherPlayers.length > 0 ? (
                            otherPlayers.map(p => <PlayerStatEditorCard key={p.id} player={p} stats={playerStats[p.id]} handleStatChange={handleStatChange} />)
                        ) : (
                             <p className="text-muted-foreground text-center p-4">Nenhum outro jogador encontrado.</p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </ScrollArea>
      </main>
       <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-50">
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

    