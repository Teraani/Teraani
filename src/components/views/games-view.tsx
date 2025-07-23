

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Goal, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { Game } from '@/lib/data';
import { Separator } from '../ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface GamesViewProps {
  onBack: () => void;
  gamesData: Record<string, Game[]>;
}

const teamColors: { [key: string]: string } = {
  'Time 1': 'bg-green-500',
  'Time 2': 'bg-yellow-400',
  'Verde': 'bg-green-500',
  'Amarelo': 'bg-yellow-400',
  'Azul': 'bg-blue-500',
  'Vermelho': 'bg-red-500',
};

type Round = keyof GamesViewProps['gamesData'];

export default function GamesView({ onBack, gamesData }: GamesViewProps) {
  const rounds = Object.keys(gamesData);
  const [activeTab, setActiveTab] = useState<Round>(rounds.length > 0 ? rounds[rounds.length - 1] : '1');

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Jogos da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <main>
        {rounds.length > 0 ? (
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Round)} className="w-full">
            <div className="px-4 pt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    Rodada {activeTab}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                  {rounds.map(round => (
                    <DropdownMenuItem key={round} onSelect={() => setActiveTab(round)}>
                      Rodada {round}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="p-4">
              {Object.entries(gamesData).map(([round, games]) => (
                <TabsContent key={round} value={round} className="mt-0">
                  <div className="space-y-3">
                    {games.map((game, index) => (
                      <Card key={index} className="bg-card border border-border">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center text-center">
                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", teamColors[game.homeTeam] || 'bg-gray-400')}>
                                        <Shield className="w-6 h-6 text-white"/>
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">{game.homeTeam}</span>
                                </div>

                                <div className="flex flex-col items-center">
                                    <span className="text-xs text-muted-foreground">{game.date}</span>
                                    <div className="flex items-center gap-3 my-1">
                                        <span className="text-2xl font-bold text-foreground">{game.homeScore}</span>
                                        <span className="text-muted-foreground">x</span>
                                        <span className="text-2xl font-bold text-foreground">{game.awayScore}</span>
                                    </div>
                                    <span className="text-xs font-semibold text-primary">{game.status}</span>
                                </div>

                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", teamColors[game.awayTeam] || 'bg-gray-400')}>
                                        <Shield className="w-6 h-6 text-white"/>
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">{game.awayTeam}</span>
                                </div>
                            </div>
                             {game.scorers && game.scorers.length > 0 && (
                                <>
                                    <Separator className="my-3" />
                                    <div className="flex justify-around text-xs">
                                        <div className="w-1/2 text-left pr-2 space-y-1">
                                            {game.scorers.filter(s => s.team === game.homeTeam).map((scorer, i) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <Goal className="w-3 h-3" />
                                                    <span>{scorer.player}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="w-1/2 text-right pl-2 space-y-1">
                                           {game.scorers.filter(s => s.team === game.awayTeam).map((scorer, i) => (
                                                <div key={i} className="flex items-center justify-end gap-1.5">
                                                    <Goal className="w-3 h-3" />
                                                    <span>{scorer.player}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </div>
          </Tabs>
        ) : (
          <div className="text-center p-10 text-muted-foreground">
            <p className="text-lg">Nenhum jogo foi registrado ainda.</p>
            <p className="text-sm">Finalize uma partida ao vivo para ver os resultados aqui.</p>
          </div>
        )}
      </main>
    </div>
  );
}
