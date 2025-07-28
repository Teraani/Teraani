

"use client";

import React, { useState, useEffect, useMemo } from 'react';
import type { Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Footprints, Goal, Send, Calendar, CheckCircle, Info, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
  onFinishMatch: (team1Score: number, team2Score: number, allScaledPlayerIds: string[]) => void;
  team1Lineup: (string | null)[];
  team2Lineup: (string | null)[];
  allScaledPlayerIds: string[];
}

const teamColors: { [key: string]: string } = {
  'Time 1': 'bg-green-500',
  'Time 2': 'bg-yellow-400',
};

const ScoutControlPanel = ({ players, team1Lineup, team2Lineup, onAddLiveEvent }: { 
  players: Record<string, Player>, 
  team1Lineup: (string | null)[], 
  team2Lineup: (string | null)[], 
  onAddLiveEvent: (event: Omit<LiveEvent, 'time'>) => void 
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();
  const [details, setDetails] = useState('');

  const allPlayersInMatch = useMemo(() => {
    const combinedIds = new Set([...team1Lineup, ...team2Lineup].filter(Boolean));
    return Object.entries(players)
      .filter(([id, _]) => combinedIds.has(id))
      .map(([id, player]) => ({ ...player, id }));
  }, [players, team1Lineup, team2Lineup]);


  const handleSubmit = () => {
    if (!selectedPlayerId || !selectedEvent) {
      // Maybe show a toast here
      return;
    }
    const player = allPlayersInMatch.find(p => p.id === selectedPlayerId);
    if (!player) return;

    let teamIdentifier = 'Time 1'; // Default
    if (team1Lineup.includes(player.id)) {
        teamIdentifier = 'Time 1';
    } else if (team2Lineup.includes(player.id)) {
        teamIdentifier = 'Time 2';
    }

    onAddLiveEvent({
      playerId: player.id,
      player: player.name,
      team: teamIdentifier,
      event: selectedEvent,
      details: details || selectedEvent,
    });

    // Reset only details
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
            {allPlayersInMatch.map(player => (
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


export default function LiveView({ onBack, user, players, canEditScouts, liveEvents, onAddLiveEvent, onFinishMatch, team1Lineup, team2Lineup, allScaledPlayerIds }: LiveViewProps) {
    const [team1Score, setTeam1Score] = useState(0);
    const [team2Score, setTeam2Score] = useState(0);
    const [isFinishConfirmOpen, setIsFinishConfirmOpen] = useState(false);
    const [showInfoCard, setShowInfoCard] = useState(false);

    const matchDate = useMemo(() => format(new Date(), "EEEE, dd 'de' MMMM", { locale: ptBR }), []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const hasSeenInfo = localStorage.getItem('liveViewInfoDismissed');
            if (!hasSeenInfo && canEditScouts) {
                setShowInfoCard(true);
            }
        }
    }, [canEditScouts]);

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
      onFinishMatch(team1Score, team2Score, allScaledPlayerIds);
      setIsFinishConfirmOpen(false);
    }

    const handleDismissInfo = () => {
        setShowInfoCard(false);
        if (typeof window !== 'undefined') {
            localStorage.setItem('liveViewInfoDismissed', 'true');
        }
    }

  return (
    <div>
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

      <main className={cn("p-4 space-y-4", canEditScouts && "pb-24")}>
          {showInfoCard && (
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    <Info className="w-6 h-6 text-blue-500" />
                    <CardTitle className="text-blue-800 dark:text-blue-300">Painel de Controle Ao Vivo</CardTitle>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={handleDismissInfo}>
                    <X className="w-5 h-5"/>
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Aqui é onde o Scout da Rodada registra os eventos (gols, assistências, etc.) em tempo real. Os eventos aparecerão no feed para todos acompanharem.
                </p>
              </CardContent>
              <CardFooter>
                 <Button className="w-full bg-blue-500/20 text-blue-700 hover:bg-blue-500/30" onClick={handleDismissInfo}>Entendi, não mostrar novamente</Button>
              </CardFooter>
            </Card>
          )}

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

          {canEditScouts && <ScoutControlPanel players={players} team1Lineup={team1Lineup} team2Lineup={team2Lineup} onAddLiveEvent={onAddLiveEvent} />}

          <Card>
              <CardHeader>
                  <CardTitle>Feed da Partida</CardTitle>
              </CardHeader>
              <CardContent>
                  <ScrollArea className="h-64">
                    <div className="space-y-4 pr-4">
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
                  </ScrollArea>
              </CardContent>
          </Card>
      </main>
      
      {canEditScouts && (
        <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border z-30">
          <Button className="w-full h-12" onClick={() => setIsFinishConfirmOpen(true)} disabled={liveEvents.length === 0}>
            <CheckCircle className="mr-2 h-5 w-5" />
            Finalizar Partida
          </Button>
        </div>
      )}

    </div>
  );
}
