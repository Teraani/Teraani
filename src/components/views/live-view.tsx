
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Footprints, Goal, Send, Calendar, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export interface LiveEvent {
  time: string;
  player: string;
  playerId: string;
  team: string;
  event: string;
  details: string;
}

interface LiveViewProps {
  onBack: () => void;
  user: User;
  players: Record<string, Player>;
  canEditScouts: boolean;
  liveEvents: LiveEvent[];
  onAddLiveEvent: (event: Omit<LiveEvent, 'time'>) => void;
  onFinishMatch: (team1Score: number, team2Score: number) => void;
  allPlayers: ({id: string} & Player)[];
}

const teamColors: { [key: string]: string } = {
  'Time 1': 'bg-green-500',
  'Time 2': 'bg-yellow-400',
};

const ScoutControlPanel = ({ allPlayers, onAddLiveEvent }: { allPlayers: ({id: string} & Player)[], onAddLiveEvent: (event: Omit<LiveEvent, 'time'>) => void }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();
  const [details, setDetails] = useState('');

  const handleSubmit = () => {
    if (!selectedPlayerId || !selectedEvent) {
      // Maybe show a toast here
      return;
    }
    const player = allPlayers.find(p => p.id === selectedPlayerId);
    if (!player) return;

    onAddLiveEvent({
      playerId: player.id,
      player: player.name,
      team: 'Time 1', // This is simplified, a real app would know the player's current team
      event: selectedEvent,
      details: details || selectedEvent,
    });

    // Reset form
    setSelectedPlayerId(undefined);
    setSelectedEvent(undefined);
    setDetails('');
  };

  const eventTypes = [
    { value: 'Gol', label: 'Gol', icon: Goal },
    { value: 'Assistência', label: 'Assistência', icon: Footprints },
    { value: 'Defesa Difícil', label: 'Defesa Difícil', icon: Shield },
  ];

  return (
    <Card className="bg-muted/50 border-border">
      <CardHeader>
        <CardTitle className="text-lg">Painel do Scout</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedPlayerId} onValueChange={setSelectedPlayerId}>
          <SelectTrigger><SelectValue placeholder="Selecione o jogador" /></SelectTrigger>
          <SelectContent>
            {allPlayers.map(player => (
              <SelectItem key={player.id} value={player.id}>{player.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger><SelectValue placeholder="Selecione o evento" /></SelectTrigger>
          <SelectContent>
            {eventTypes.map(event => (
              <SelectItem key={event.value} value={event.value}>{event.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input 
          placeholder="Detalhes (opcional)" 
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />

        <Button onClick={handleSubmit} className="w-full" disabled={!selectedPlayerId || !selectedEvent}>
          <Send className="mr-2 h-4 w-4" />
          Registrar Evento
        </Button>
      </CardContent>
    </Card>
  );
};


export default function LiveView({ onBack, user, players, canEditScouts, liveEvents, onAddLiveEvent, onFinishMatch, allPlayers }: LiveViewProps) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);

    const matchDate = useMemo(() => format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR }), []);

    // Update score based on events
    useEffect(() => {
        const t1Score = liveEvents.filter(e => e.team === 'Time 1' && e.event === 'Gol').length;
        const t2Score = liveEvents.filter(e => e.team === 'Time 2' && e.event === 'Gol').length;
        setTeam1Score(t1Score);
        setTeam2Score(t2Score);
    }, [liveEvents]);

    const EventIcon = ({ event }: { event: string }) => {
        if (event === 'Gol') return <Goal className="w-4 h-4 text-foreground" />;
        if (event === 'Assistência') return <Footprints className="w-4 h-4 text-foreground" />;
        if (event === 'Defesa Difícil') return <Shield className="w-4 h-4 text-foreground" />;
        return <div className="w-4 h-4" />;
    };
    
    const handleFinishClick = () => {
      onFinishMatch(team1Score, team2Score);
      setIsFinishConfirmOpen(false);
    }

  return (
    <div className={cn("flex flex-col h-screen", canEditScouts ? "pb-24" : "")}>
       <AlertDialog open={isFinishConfirmOpen} onOpenChange={setIsFinishConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Partida?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja finalizar a partida com o placar de {team1Score} a {team2Score}? Esta ação não pode ser desfeita e irá registrar o resultado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleFinishClick}>Finalizar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-red-500 animate-pulse">AO VIVO</h2>
        <div className="w-9 h-9" />
      </header>

      <ScrollArea className="flex-1">
        <main className="p-4 space-y-4">
            <Card className="bg-card">
              <CardContent className="p-4">
                  <div className="flex justify-between items-center text-center">
                      <div className="flex flex-col items-center gap-2 w-1/3">
                          <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", teamColors['Time 1'])}>
                              <p className="font-bold text-white text-lg">T1</p>
                          </div>
                          <span className="font-semibold text-sm text-foreground">Time 1</span>
                      </div>

                      <div className="flex flex-col items-center">
                          <div className="flex items-center gap-3 my-1">
                              <span className="text-3xl font-bold text-foreground">{team1Score}</span>
                              <span className="text-muted-foreground">x</span>
                              <span className="text-3xl font-bold text-foreground">{team2Score}</span>
                          </div>
                          <span className="text-xs font-semibold text-red-500 animate-pulse">Em andamento</span>
                      </div>

                      <div className="flex flex-col items-center gap-2 w-1/3">
                           <div className={cn("w-12 h-12 rounded-full flex items-center justify-center", teamColors['Time 2'])}>
                               <p className="font-bold text-white text-lg">T2</p>
                           </div>
                          <span className="font-semibold text-sm text-foreground">Time 2</span>
                      </div>
                  </div>
              </CardContent>
            </Card>
            
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground capitalize">
                <Calendar className="w-4 h-4"/>
                <span>{matchDate}</span>
            </div>

            {canEditScouts && <ScoutControlPanel allPlayers={allPlayers} onAddLiveEvent={onAddLiveEvent} />}

            <Card className="flex-1 flex flex-col">
                <CardHeader>
                    <CardTitle>Feed da Partida</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <div className="space-y-4 p-4 pt-0">
                        {liveEvents.length > 0 ? liveEvents.map((event, index) => (
                            <div key={index} className="flex items-start gap-3">
                                <span className="font-mono text-sm text-muted-foreground">{event.time}</span>
                                <div className="flex-shrink-0 bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                                   <EventIcon event={event.event} />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-foreground">{event.player} ({event.team})</p>
                                    <p className="text-sm text-muted-foreground">{event.details}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-10 text-muted-foreground">
                                <p>Nenhum evento na partida ainda.</p>
                                <p className="text-xs">Aguardando o início do jogo.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </main>
      </ScrollArea>
      
      {canEditScouts && (
        <div className="fixed bottom-0 left-0 right-0 bg-card p-4 border-t border-border z-30">
          <Button className="w-full h-12" onClick={() => setIsFinishConfirmOpen(true)} disabled={liveEvents.length === 0}>
            <CheckCircle className="mr-2 h-5 w-5" />
            Finalizar Partida
          </Button>
        </div>
      )}

    </div>
  );
}
