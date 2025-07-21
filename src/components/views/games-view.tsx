"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GamesViewProps {
  onBack: () => void;
}

const gamesData = {
  '1': [
    { date: '26 de junho - 19:00hs', teams: 'Verde 1 x 3 Amarelo' },
    { date: '26 de junho - 21:00hs', teams: 'Azul 2 x 2 Vermelho' },
  ],
  '2': [
    { date: '03 de julho - 19:00hs', teams: 'Verde 0 x 1 Azul' },
    { date: '03 de julho - 21:00hs', teams: 'Amarelo 2 x 0 Vermelho' },
  ],
  '3': [
    { date: '10 de julho - 19:00hs', teams: 'Vermelho 1 x 1 Verde' },
    { date: '10 de julho - 21:00hs', teams: 'Azul 3 x 1 Amarelo' },
  ],
  '4': [
    { date: '17 de julho - 19:00hs', teams: 'Verde 2 x 0 Amarelo' },
    { date: '17 de julho - 21:00hs', teams: 'Azul 1 x 1 Vermelho' },
  ],
};

type Round = keyof typeof gamesData;

export default function GamesView({ onBack }: GamesViewProps) {
  const [activeTab, setActiveTab] = useState<Round>('1');

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen">
      <header className="bg-white dark:bg-zinc-800 p-4 shadow-md flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-gray-800 dark:text-gray-100">Jogos da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as Round)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-gray-200 dark:bg-zinc-800">
            <TabsTrigger value="1">1</TabsTrigger>
            <TabsTrigger value="2">2</TabsTrigger>
            <TabsTrigger value="3">3</TabsTrigger>
            <TabsTrigger value="4">4</TabsTrigger>
          </TabsList>
          {Object.entries(gamesData).map(([round, games]) => (
            <TabsContent key={round} value={round}>
              <div className="space-y-4 mt-4">
                {games.map((game, index) => (
                  <Card key={index} className="bg-gray-200 dark:bg-zinc-800 border-none">
                    <CardContent className="p-4 text-center text-gray-800 dark:text-gray-100">
                      <p className="text-sm">{game.date}</p>
                      <p className="font-bold text-lg">{game.teams}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
