
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Search, Star, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { useToast } from '@/hooks/use-toast';
import Pitch from '../lineup/pitch';
import PlayerCard from '../lineup/player-card';
import AddPlayerButton from '../lineup/add-player-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export interface Vote {
  playerId: string;
  rating: number;
}

interface BestElevenViewProps {
  onBack: () => void;
  players: Record<string, Player>;
  votes: Record<string, Vote>;
  onVote: (vote: Vote) => void;
  currentUserVote?: Vote;
}

const getVotingStatus = () => {
  const now = new Date();
  const day = now.getDay(); // 0 (Sun) - 6 (Sat)
  const hour = now.getHours();

  // Deadline is Thursday (4) at 00:00
  if (day > 4 || (day === 4 && hour >= 0)) {
    return { isOpen: false, message: "Votação da rodada encerrada." };
  }
  return { isOpen: true, message: "A votação encerra Quinta-feira às 00:00h." };
};

const VotePanel = ({ players, onVote, currentUserVote }: { players: Record<string, Player>, onVote: (vote: Vote) => void, currentUserVote?: Vote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player & { id: string } | null>(null);
  const [rating, setRating] = useState(5);
  const { toast } = useToast();

  const filteredPlayers = useMemo(() => {
    return Object.entries(players)
      .map(([id, p]) => ({ ...p, id }))
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 50); // Limit results for performance
  }, [searchTerm, players]);

  const handleVoteSubmit = () => {
    if (!selectedPlayer) {
      toast({ title: "Selecione um jogador", description: "Você precisa escolher um jogador para votar.", variant: "destructive" });
      return;
    }
    onVote({ playerId: selectedPlayer.id, rating });
    setSelectedPlayer(null);
    setSearchTerm('');
  };

  if (currentUserVote) {
    const votedPlayer = players[currentUserVote.playerId];
    return (
      <Card className="bg-card">
        <CardHeader>
          <CardTitle>Seu Voto Foi Registrado!</CardTitle>
          <CardDescription>Você já participou da votação desta rodada.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
             <Avatar className="w-12 h-12">
                <AvatarImage src={votedPlayer.img} alt={votedPlayer.name} data-ai-hint="player portrait" />
                <AvatarFallback>{votedPlayer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-bold">{votedPlayer.name}</p>
              <p className="text-sm text-muted-foreground">{votedPlayer.pos}</p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">{currentUserVote.rating}</span>
              <span className="text-sm text-muted-foreground">/ 10</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card">
      <CardHeader>
        <CardTitle>Vote no Craque da Rodada</CardTitle>
        <CardDescription>Escolha um jogador e dê uma nota de 0 a 10.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {selectedPlayer ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
               <Avatar className="w-12 h-12">
                    <AvatarImage src={selectedPlayer.img} alt={selectedPlayer.name} data-ai-hint="player portrait" />
                    <AvatarFallback>{selectedPlayer.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <p className="font-bold">{selectedPlayer.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedPlayer.pos}</p>
                </div>
                 <Button variant="ghost" size="sm" onClick={() => setSelectedPlayer(null)}>Trocar</Button>
            </div>
             <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                    <label className="font-semibold">Nota</label>
                    <span className="text-xl font-bold text-primary">{rating}</span>
                </div>
                <Slider
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                    max={10}
                    step={1}
                />
            </div>
            <Button className="w-full" onClick={handleVoteSubmit}>
                <ThumbsUp className="mr-2 h-4 w-4" />
                Confirmar Voto
            </Button>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Buscar jogador para votar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <ScrollArea className="h-64">
              <div className="space-y-2 pr-4">
                {filteredPlayers.length > 0 ? filteredPlayers.map(player => (
                  <div key={player.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer" onClick={() => setSelectedPlayer(player)}>
                    <Avatar>
                        <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait"/>
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{player.name}</p>
                        <p className="text-sm text-muted-foreground">{player.pos}</p>
                    </div>
                  </div>
                )) : <p className="text-center text-muted-foreground py-4">Nenhum jogador encontrado.</p>}
              </div>
            </ScrollArea>
          </>
        )}
      </CardContent>
    </Card>
  );
};


export default function BestElevenView({ onBack, players, votes, onVote, currentUserVote }: BestElevenViewProps) {
    
    const [votingStatus, setVotingStatus] = useState(getVotingStatus());

    useEffect(() => {
        const timer = setInterval(() => {
            setVotingStatus(getVotingStatus());
        }, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    const bestEleven = useMemo(() => {
        const playerScores: Record<string, { total: number, count: number }> = {};
        for (const vote of Object.values(votes)) {
            if (!playerScores[vote.playerId]) {
                playerScores[vote.playerId] = { total: 0, count: 0 };
            }
            playerScores[vote.playerId].total += vote.rating;
            playerScores[vote.playerId].count += 1;
        }

        const playerAverages = Object.entries(playerScores).map(([playerId, score]) => ({
            playerId,
            avgRating: score.total / score.count,
            player: players[playerId]
        }));
        
        const sortedPlayers = playerAverages.sort((a, b) => b.avgRating - a.avgRating);
        
        const best: Record<Player['pos'], string[]> = { GOL: [], ZAG: [], LAT: [], MEI: [], VOL: [], ATA: [], 'Mei / Lat': [] };
        sortedPlayers.forEach(({playerId, player}) => {
            if (best[player.pos]) {
                best[player.pos].push(playerId);
            }
        });

        // 4-3-3 formation
        const lineup: (string | null)[] = Array(11).fill(null);
        let lineupIndex = 0;
        
        const fillPosition = (pos: Player['pos'][], count: number) => {
            const candidates = pos.flatMap(p => best[p]);
            const uniqueCandidates = [...new Set(candidates)];
            const top = uniqueCandidates.slice(0, count);
            top.forEach(id => {
              if (lineupIndex < 11) {
                  lineup[lineupIndex++] = id;
              }
            });
        };
        
        fillPosition(['GOL'], 1);
        fillPosition(['ZAG', 'LAT'], 4);
        fillPosition(['MEI', 'VOL'], 3);
        fillPosition(['ATA'], 3);

        return lineup.reverse(); // Rendering from bottom to top

    }, [votes, players]);


  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string } & Player) | null)[]) => {
    return (
        <div className="flex justify-around z-10 w-full">
            {Array.from({ length: count }).map((_, i) => {
                const player = assignedPlayers.shift();
                if (player) {
                    return <PlayerCard key={player.id} player={player} onPlayerSelect={() => {}} />;
                } else {
                    return <AddPlayerButton key={`add-${i}`} onClick={() => {}} />;
                }
            })}
        </div>
    );
  };
    
  const lineupPlayers = bestEleven.map(id => id ? { ...players[id], id } : null);

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Seleção da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4">
        <Pitch>
          {renderPlayerRow(1, lineupPlayers)}
          {renderPlayerRow(4, lineupPlayers)}
          {renderPlayerRow(3, lineupPlayers)}
          {renderPlayerRow(3, lineupPlayers)}
        </Pitch>
        
        <div className="mt-4 flex flex-col gap-2">
            <div className="p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground bg-primary/80">
                <Clock className="w-5 h-5" />
                <span>{votingStatus.message}</span>
            </div>
        </div>

        {votingStatus.isOpen && (
            <VotePanel players={players} onVote={onVote} currentUserVote={currentUserVote} />
        )}

      </main>
    </div>
  );
}
