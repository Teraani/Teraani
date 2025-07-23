
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import type { Game } from '@/lib/data';

interface GamesViewProps {
  onBack: () => void;
  gamesData: Record<string, Game[]>;
}

const teamColors: { [key: string]: string } = {
  'Time 1': 'bg-green-500',
  'Time 2': 'bg-yellow-400',
  // Keep original colors as fallbacks
  'Verde': 'bg-green-500',
  'Amarelo': 'bg-yellow-400',
  'Azul': 'bg-blue-500',
  'Vermelho': 'bg-red-500',
};

type Round = keyof GamesViewProps['gamesData'];

export default function GamesView({ onBack, gamesData }: GamesViewProps) {
  const rounds = Object.keys(gamesData);
  const [activeTab, setActiveTab] = useState<Round>(rounds.length > 0 ? rounds[0] : '1');

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
            <ScrollArea className="w-full whitespace-nowrap">
              <TabsList className="bg-card px-4 gap-2">
                  {rounds.map(round => (
                      <TabsTrigger key={round} value={round} className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-4">
                          Rodada {round}
                      </TabsTrigger>
                  ))}
              </TabsList>
            </ScrollArea>
            
            <div className="p-4">
              {Object.entries(gamesData).map(([round, games]) => (
                <TabsContent key={round} value={round} className="mt-0">
                  <div className="space-y-3">
                    {games.map((game, index) => (
                      <Card key={index} className="bg-card border border-border">
                        <CardContent className="p-4">
                            <div className="flex justify-between items-center text-center">
                                <div className="flex flex-col items-center gap-2 w-1/3">
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", teamColors[game.homeTeam])}>
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
                                    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", teamColors[game.awayTeam])}>
                                        <Shield className="w-6 h-6 text-white"/>
                                    </div>
                                    <span className="font-semibold text-sm text-foreground">{game.awayTeam}</span>
                                </div>
                            </div>
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
