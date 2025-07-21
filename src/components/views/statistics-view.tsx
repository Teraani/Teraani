
"use client";

import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowUpRight, Shield, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
}

const StatItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex flex-col items-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg text-foreground">{value ?? '–'}</p>
    </div>
);

const PlayerStatsCard = ({ player, rank }: { player: Player, rank: number }) => (
  <Card className="bg-card shadow-sm">
      <AccordionItem value={`item-${rank}`} className="border-b-0">
          <AccordionTrigger className="p-4 hover:no-underline">
              <div className="flex items-center gap-4 w-full">
                  <span className={cn(
                      "font-bold text-lg w-6 text-center",
                      rank === 1 && "text-amber-400",
                      rank === 2 && "text-slate-400",
                      rank === 3 && "text-amber-600"
                  )}>
                      {rank}
                  </span>
                  <Avatar>
                      <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" />
                      <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                      <p className="font-bold text-base text-foreground">{player.name}</p>
                      <p className="text-sm text-muted-foreground">{player.pos}</p>
                  </div>
                  <div className="text-right">
                      <p className="font-extrabold text-xl text-primary">{player.points?.toFixed(1) ?? 'N/A'}</p>
                      <p className="text-xs text-muted-foreground">Pontos</p>
                  </div>
              </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
              <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg grid grid-cols-3 sm:grid-cols-4 gap-y-4 text-center">
                  <StatItem label="Jogos" value={player.games} />
                  <StatItem label="Vitórias" value={player.stats?.wins} />
                  <StatItem label="Derrotas" value={player.stats?.losses} />
                  <StatItem label="Empates" value={player.stats?.draws} />
                  <StatItem label="Gols" value={player.stats?.goals} />
                  <StatItem label="Assist." value={player.stats?.assists} />
                  <StatItem label="SG" value={player.stats?.goalDifference} />
                  <StatItem label="Aprov." value={`${player.stats?.performance?.toFixed(0) ?? '0'}%`} />
                  <StatItem label="CA" value={player.stats?.yellowCards} />
                  <StatItem label="CV" value={player.stats?.redCards} />
              </div>
          </AccordionContent>
      </AccordionItem>
  </Card>
);

export default function StatisticsView({ players, onBack }: StatisticsViewProps) {
  const sortedPlayers = useMemo(() => {
    return Object.values(players)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  }, [players]);

  return (
    <div className="bg-background min-h-screen">
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Estatísticas</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-3">
          <Accordion type="single" collapsible className="w-full space-y-2">
            {sortedPlayers.map((player, index) => (
                <PlayerStatsCard key={player.name} player={player} rank={index + 1} />
            ))}
          </Accordion>
      </main>
    </div>
  );
}
