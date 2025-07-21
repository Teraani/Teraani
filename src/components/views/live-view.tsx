
"use client";

import { useState, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Footprints, Star, Shirt, Goal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface LiveViewProps {
  onBack: () => void;
  user: User;
  players: Record<string, Player>;
}

const teamColors: { [key: string]: string } = {
  'Time 1': 'bg-green-500',
  'Time 2': 'bg-yellow-400',
};

// Simulated events
const mockEvents = [
  { time: "89'", player: 'Rafael Ohy', team: 'Time 1', event: 'Gol', icon: Goal, details: 'Um golaço de fora da área!' },
  { time: "75'", player: 'André Corsini', team: 'Time 2', event: 'Assistência', icon: Footprints, details: 'Cruzamento na medida.' },
  { time: "62'", player: 'Vinícius Simão', team: 'Time 1', event: 'Defesa', icon: Shield, details: 'Defendeu um pênalti.' },
  { time: "48'", player: 'Deyvid Gontarczik (Deca)', team: 'Time 2', event: 'Gol', icon: Goal, details: 'Cabeçada certeira.' },
];


export default function LiveView({ onBack, user, players }: LiveViewProps) {
    const [team1Score, setTeam1Score] = useState(1);
    const [team2Score, setTeam2Score] = useState(1);
    const [time, setTime] = useState(45);
    const [events, setEvents] = useState(mockEvents.slice(2));

    const userTeamScore = user.lineup.reduce((sum, id) => {
        if (!id) return sum;
        return sum + (players[id]?.points ?? 0);
    }, 0);

    // Simulate game progress
    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => (prev < 90 ? prev + 1 : 90));

            // Simulate new events
            if (time === 61) {
                setTeam1Score(2);
                setEvents(prev => [mockEvents[2], ...prev]);
            }
             if (time === 74) {
                setTeam2Score(2);
                setEvents(prev => [mockEvents[1], ...prev]);
            }
             if (time === 88) {
                setTeam1Score(3);
                setEvents(prev => [mockEvents[0], ...prev]);
            }
        }, 2000); // Update every 2 seconds for demo

        return () => clearInterval(interval);
    }, [time]);

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-red-500 animate-pulse">AO VIVO</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="flex-1 p-4 space-y-4 overflow-y-auto">
        <Card className="bg-card border-primary/50 border-2">
            <CardHeader className="text-center p-4">
                <CardTitle>Sua Pontuação</CardTitle>
                <p className="text-4xl font-bold text-primary">{userTeamScore.toFixed(2)}</p>
            </CardHeader>
        </Card>
        
        <Card className="bg-card">
          <CardContent className="p-4">
              <div className="flex justify-between items-center text-center">
                  <div className="flex flex-col items-center gap-2 w-1/3">
                      <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", teamColors['Time 1'])}>
                          <Shirt className="w-7 h-7 text-white"/>
                      </div>
                      <span className="font-semibold text-sm text-foreground">Time 1</span>
                  </div>

                  <div className="flex flex-col items-center">
                      <span className="text-sm text-muted-foreground">{time}'</span>
                      <div className="flex items-center gap-3 my-1">
                          <span className="text-3xl font-bold text-foreground">{team1Score}</span>
                          <span className="text-muted-foreground">x</span>
                          <span className="text-3xl font-bold text-foreground">{team2Score}</span>
                      </div>
                      <span className="text-xs font-semibold text-red-500 animate-pulse">Em andamento</span>
                  </div>

                  <div className="flex flex-col items-center gap-2 w-1/3">
                       <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", teamColors['Time 2'])}>
                          <Shirt className="w-7 h-7 text-white"/>
                      </div>
                      <span className="font-semibold text-sm text-foreground">Time 2</span>
                  </div>
              </div>
          </CardContent>
        </Card>

        <Card className="flex-1 flex flex-col">
            <CardHeader>
                <CardTitle>Feed da Partida</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                 <ScrollArea className="h-[calc(100vh-450px)]">
                    <div className="space-y-4 p-4 pt-0">
                    {events.map((event, index) => (
                        <div key={index} className="flex items-start gap-3">
                            <span className="font-mono text-sm text-muted-foreground">{event.time}</span>
                            <div className="flex-shrink-0 bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                                <event.icon className="w-4 h-4 text-foreground" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-foreground">{event.player} ({event.team})</p>
                                <p className="text-sm text-muted-foreground">{event.details}</p>
                            </div>
                        </div>
                    ))}
                     </div>
                </ScrollArea>
            </CardContent>
        </Card>

      </main>
    </div>
  );
}
