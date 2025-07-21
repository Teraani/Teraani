
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

interface GamesViewProps {
  onBack: () => void;
}

const gamesData = {
  '1': [
    { date: '26 de junho - 19:00hs', homeTeam: 'Verde', awayTeam: 'Amarelo', homeScore: 1, awayScore: 3, status: 'Finalizado' },
    { date: '26 de junho - 21:00hs', homeTeam: 'Azul', awayTeam: 'Vermelho', homeScore: 2, awayScore: 2, status: 'Finalizado' },
  ],
  '2': [
    { date: '03 de julho - 19:00hs', homeTeam: 'Verde', awayTeam: 'Azul', homeScore: 0, awayScore: 1, status: 'Finalizado' },
    { date: '03 de julho - 21:00hs', homeTeam: 'Amarelo', awayTeam: 'Vermelho', homeScore: 2, awayScore: 0, status: 'Finalizado' },
  ],
  '3': [
    { date: '10 de julho - 19:00hs', homeTeam: 'Vermelho', awayTeam: 'Verde', homeScore: 1, awayScore: 1, status: 'Finalizado' },
    { date: '10 de julho - 21:00hs', homeTeam: 'Azul', awayTeam: 'Amarelo', homeScore: 3, awayScore: 1, status: 'Finalizado' },
  ],
  '4': [
    { date: '17 de julho - 19:00hs', homeTeam: 'Verde', awayTeam: 'Amarelo', homeScore: 2, awayScore: 0, status: 'Finalizado' },
    { date: '17 de julho - 21:00hs', homeTeam: 'Azul', awayTeam: 'Vermelho', homeScore: 1, awayScore: 1, status: 'Finalizado' },
  ],
};

const teamColors: { [key: string]: string } = {
  'Verde': 'bg-green-500',
  'Amarelo': 'bg-yellow-400',
  'Azul': 'bg-blue-500',
  'Vermelho': 'bg-red-500',
};

type Round = keyof typeof gamesData;

export default function GamesView({ onBack }: GamesViewProps) {
  const [activeTab, setActiveTab] = useState<Round>('1');

  return (
    <div className="dark">
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Jogos da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Round)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-card">
            <TabsTrigger value="1" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Rodada 1</TabsTrigger>
            <TabsTrigger value="2" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Rodada 2</TabsTrigger>
            <TabsTrigger value="3" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Rodada 3</TabsTrigger>
            <TabsTrigger value="4" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">Rodada 4</TabsTrigger>
          </TabsList>
          {Object.entries(gamesData).map(([round, games]) => (
            <TabsContent key={round} value={round}>
              <div className="space-y-3 mt-4">
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
        </Tabs>
      </main>
    </div>
  );
}
