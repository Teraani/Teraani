
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Search, Save, Trash2, UserX, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import Pitch from '../lineup/pitch';
import PlayerCard from '../lineup/player-card';
import AddPlayerButton from '../lineup/add-player-button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
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


export interface Vote {
  playerId: string;
  rating: number;
}

interface BestElevenViewProps {
  onBack: () => void;
  players: Record<string, Player>;
  currentUser: User;
  onVote: (lineup: (string | null)[]) => void;
  userLineup: (string | null)[] | undefined;
}

interface PlayerActionState {
  playerId: string;
  index: number;
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

const PlayerSelectionModal = ({ players, onSelectPlayer, onBack, currentUserPlayerId }: { players: Record<string, Player>, onSelectPlayer: (playerId: string) => void, onBack: () => void, currentUserPlayerId: string | null }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPlayers = useMemo(() => {
    return Object.entries(players)
      .map(([id, p]) => ({ ...p, id }))
      .filter(p => p.id !== currentUserPlayerId && p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a,b) => b.value - a.value)
      .slice(0, 50); 
  }, [searchTerm, players, currentUserPlayerId]);

  return (
    <DialogContent className="h-[90vh] flex flex-col">
       <DialogHeader>
        <DialogTitle>Selecionar Jogador</DialogTitle>
        <DialogDescription>
          Escolha um jogador para adicionar à sua seleção da rodada.
        </DialogDescription>
      </DialogHeader>
       <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Buscar jogador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
       <ScrollArea className="flex-1">
        <div className="space-y-2 pr-4">
          {filteredPlayers.length > 0 ? filteredPlayers.map(player => (
            <div key={player.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer" onClick={() => onSelectPlayer(player.id)}>
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
    </DialogContent>
  )
}


export default function BestElevenView({ onBack, players, currentUser, onVote, userLineup }: BestElevenViewProps) {
    const { toast } = useToast();
    const [votingStatus, setVotingStatus] = useState(getVotingStatus());
    const [lineup, setLineup] = useState<(string | null)[]>(userLineup || Array(11).fill(null));
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [slotToFill, setSlotToFill] = useState<number | null>(null);
    const [playerActionState, setPlayerActionState] = useState<PlayerActionState | null>(null);


    useEffect(() => {
        const timer = setInterval(() => {
            setVotingStatus(getVotingStatus());
        }, 60000); // Check every minute
        return () => clearInterval(timer);
    }, []);

    const currentUserPlayerId = useMemo(() => {
      if (!currentUser) return null;
      const userFirstName = currentUser.name.split(' ')[0].toLowerCase();
      const playerEntry = Object.entries(players).find(([id, p]) => p.name.toLowerCase().includes(userFirstName));
      return playerEntry ? playerEntry[0] : null;
    }, [currentUser, players]);


    const handleAddPlayerClick = (index: number) => {
      if (!votingStatus.isOpen) {
        toast({ title: "Votação Encerrada", description: "Não é mais possível alterar a seleção.", variant: 'destructive' });
        return;
      }
      setSlotToFill(index);
      setSelectionModalOpen(true);
    }
    
    const handlePlayerCardClick = (state: PlayerActionState) => {
        if (!votingStatus.isOpen) return;
        setPlayerActionState(state);
    };

    const handleSelectPlayerForSlot = (playerId: string) => {
      if (slotToFill !== null) {
        const newLineup = [...lineup];
        newLineup[slotToFill] = playerId;
        setLineup(newLineup);
        setSelectionModalOpen(false);
        setSlotToFill(null);
      }
    }
    
    const handleRemovePlayer = () => {
        if (!playerActionState) return;
        const { index } = playerActionState;
        const newLineup = [...lineup];
        newLineup[index] = null;
        setLineup(newLineup);
        setPlayerActionState(null);
    };


  const renderPlayerRow = (count: number, startIndex: number, lineupPlayers: (({ id: string } & Player) | null)[]) => {
    return (
        <div className="flex justify-around z-10 w-full">
            {Array.from({ length: count }).map((_, i) => {
                const player = lineupPlayers[startIndex + i];
                const currentIndex = startIndex + i;
                if (player) {
                    return <PlayerCard key={player.id} player={player} onPlayerSelect={() => handlePlayerCardClick({ playerId: player.id, index: currentIndex })} />;
                } else {
                    return <AddPlayerButton key={`add-${i}`} onClick={() => handleAddPlayerClick(currentIndex)} />;
                }
            })}
        </div>
    );
  };
    
  const lineupPlayers = lineup.map(id => id ? { ...players[id], id } : null);

  const isComplete = !lineup.some(p => p === null);

  return (
    <div>
       <AlertDialog open={!!playerActionState} onOpenChange={(open) => !open && setPlayerActionState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{playerActionState && players[playerActionState.playerId]?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              O que você gostaria de fazer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <Button variant="destructive" onClick={handleRemovePlayer}>
              <UserX className="mr-2 h-4 w-4" />
              Remover da Seleção
            </Button>
            <AlertDialogCancel onClick={() => setPlayerActionState(null)}>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isSelectionModalOpen} onOpenChange={setSelectionModalOpen}>
        <PlayerSelectionModal 
            players={players}
            onSelectPlayer={handleSelectPlayerForSlot}
            onBack={() => setSelectionModalOpen(false)}
            currentUserPlayerId={currentUserPlayerId}
        />
      </Dialog>


      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Seleção da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4 pb-24">
        <Pitch>
          {renderPlayerRow(1, 10, lineupPlayers)}
          {renderPlayerRow(3, 7, lineupPlayers)}
          {renderPlayerRow(3, 4, lineupPlayers)}
          {renderPlayerRow(4, 0, lineupPlayers)}
        </Pitch>
        
        <div className="mt-4 flex flex-col gap-2">
            <div className="p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground bg-primary/80">
                <Clock className="w-5 h-5" />
                <span>{votingStatus.message}</span>
            </div>
        </div>
      </main>

       {votingStatus.isOpen && (
        <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-30">
            <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg" disabled={!isComplete} onClick={() => onVote(lineup)}>
                <Save className="mr-2 h-5 w-5"/>
                Salvar Seleção
            </Button>
        </div>
      )}

    </div>
  );
}
