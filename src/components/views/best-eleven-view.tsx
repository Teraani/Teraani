

"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Clock, Search, Save, Trash2, UserX, Eye, Star, Send, VoteIcon, Lock, CheckCircle } from 'lucide-react';
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
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { BestElevenVote, Modality } from '@/app/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';

type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '3-2-1' | '2-3-1' | '2-2' | '3-2';

export interface Vote {
  playerId: string;
  rating: number;
}

interface BestElevenViewProps {
  onBack: () => void;
  players: Record<string, Player>;
  currentUser: User;
  allUsers: User[];
  allScaledPlayerIds: string[];
  onVote: (lineup: (BestElevenVote | null)[]) => void;
  userLineup: (BestElevenVote | null)[] | undefined;
  allVotes: Record<string, (BestElevenVote | null)[]>;
  isSaved: boolean;
  canManageVoting: boolean;
  isVotingReleased: boolean;
  isVotingClosed: boolean;
  onReleaseVoting: () => void;
  onCloseVoting: () => void;
  modality: Modality | null;
  isVoteRevelationEnabled: boolean;
}

interface PlayerActionState {
  playerId: string;
  index: number;
}

const getVotingStatus = (isReleased: boolean, isClosed: boolean) => {
    if (isClosed) {
        return { isOpen: false, message: "Votação da rodada encerrada." };
    }
    if (isReleased) {
        return { isOpen: true, message: "A votação está aberta!" };
    }
    return { isOpen: false, message: "Aguardando liberação da votação." };
};

const getFormationsForModality = (modality: Modality | null): Formation[] => {
  switch (modality) {
    case 'society':
      return ['3-2-1', '2-3-1'];
    case 'futsal':
      return ['2-2', '3-2'];
    case 'campo':
    default:
      return ['4-3-3', '4-4-2', '3-5-2'];
  }
};

const getLineupSize = (modality: Modality | null) => {
    switch (modality) {
        case 'society': return 7;
        case 'futsal': return 5;
        case 'campo':
        default: return 11;
    }
}


const PlayerSelectionModal = ({ players, onSelectPlayer, lineup, allScaledPlayerIds }: { players: Record<string, Player>, onSelectPlayer: (playerId: string) => void, lineup: (BestElevenVote | null)[], allScaledPlayerIds: string[] }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const lineupPlayerIds = new Set(lineup.filter(Boolean).map(vote => vote!.playerId));
  const scaledPlayerIdsSet = new Set(allScaledPlayerIds);

  const filteredPlayers = useMemo(() => {
    return Object.entries(players)
      .map(([id, p]) => ({ ...p, id }))
      .filter(p => 
        scaledPlayerIdsSet.has(p.id) &&
        !lineupPlayerIds.has(p.id) &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a,b) => b.value - a.value);
  }, [searchTerm, players, lineupPlayerIds, scaledPlayerIdsSet]);

  return (
    <DialogContent className="h-[90vh] flex flex-col">
       <DialogHeader>
        <DialogTitle>Selecionar Jogador</DialogTitle>
        <DialogDescription>
          Escolha um jogador que participou da partida para adicionar à sua seleção.
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
          )) : <p className="text-center text-muted-foreground py-4">Nenhum jogador encontrado ou todos já foram adicionados.</p>}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}

const RatingModal = ({ player, onRate, onCancel }: { player: Player, onRate: (rating: number) => void, onCancel: () => void }) => {
    const [rating, setRating] = useState(5);

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Avalie o Jogador</DialogTitle>
                <DialogDescription>
                    Dê uma nota de 0 a 10 para a atuação de {player.name}.
                </DialogDescription>
            </DialogHeader>
            <div className="py-4">
                <Label htmlFor="rating" className="text-center block text-4xl font-bold mb-4">{rating.toFixed(1)}</Label>
                <Slider
                    id="rating"
                    min={0}
                    max={10}
                    step={0.5}
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                />
            </div>
             <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={onCancel}>Cancelar</Button>
                <Button onClick={() => onRate(rating)}>Confirmar Nota</Button>
            </div>
        </DialogContent>
    )
}


export default function BestElevenView({ onBack, players, currentUser, allUsers, allScaledPlayerIds, onVote, userLineup, allVotes, isSaved, canManageVoting, isVotingReleased, isVotingClosed, onReleaseVoting, onCloseVoting, modality, isVoteRevelationEnabled }: BestElevenViewProps) {
    const { toast } = useToast();
    const lineupSize = getLineupSize(modality);
    
    const [lineup, setLineup] = useState<(BestElevenVote | null)[]>(userLineup || Array(lineupSize).fill(null));
    const [isSelectionModalOpen, setSelectionModalOpen] = useState(false);
    const [slotToFill, setSlotToFill] = useState<number | null>(null);
    const [playerActionState, setPlayerActionState] = useState<PlayerActionState | null>(null);
    const [playerToRate, setPlayerToRate] = useState<string | null>(null);

    const availableFormations = useMemo(() => getFormationsForModality(modality), [modality]);
    const [formation, setFormation] = useState<Formation>(availableFormations[0]);
    
    useEffect(() => {
        setFormation(getFormationsForModality(modality)[0]);
        setLineup(Array(getLineupSize(modality)).fill(null))
    }, [modality]);

    const finalEleven = useMemo(() => {
        if (!isVotingClosed) return null;

        const playerScores: Record<string, { totalRating: number; voteCount: number }> = {};

        Object.values(allVotes).forEach(userVote => {
            userVote.forEach(vote => {
                if (vote) {
                    if (!playerScores[vote.playerId]) {
                        playerScores[vote.playerId] = { totalRating: 0, voteCount: 0 };
                    }
                    playerScores[vote.playerId].totalRating += vote.rating;
                    playerScores[vote.playerId].voteCount += 1;
                }
            });
        });

        const getTopPlayersForPosition = (
          positions: Player['pos'][],
          count: number
        ): (BestElevenVote | null)[] => {
            const eligiblePlayers = Object.entries(playerScores)
                .filter(([playerId]) => positions.includes(players[playerId]?.pos))
                .sort(([, a], [, b]) => b.totalRating - a.totalRating)
                .slice(0, count);

            const results: (BestElevenVote | null)[] = eligiblePlayers.map(([playerId, score]) => ({
                playerId,
                rating: score.totalRating / score.voteCount,
            }));
            
            // Fill with null if not enough players were voted for
            while(results.length < count) {
                results.push(null);
            }

            return results;
        };
        
        const formationParts = formation.split('-').map(Number);
        let defCount = 0, midCount = 0, atkCount = 0;
        const gkCount = 1;

        if ((modality === 'campo' || modality === 'society') && formationParts.length === 3) {
            [defCount, midCount, atkCount] = formationParts;
        } else if (modality === 'futsal' && formationParts.length === 2) {
            [defCount, atkCount] = formationParts;
        } else {
             if (lineupSize === 11) [defCount, midCount, atkCount] = [4, 3, 3];
             if (lineupSize === 7) [defCount, midCount, atkCount] = [3, 2, 1];
             if (lineupSize === 5) [defCount, atkCount] = [2, 2];
        }

        const topAttackers = getTopPlayersForPosition(['ATA'], atkCount);
        const topMidfielders = getTopPlayersForPosition(['MEI', 'VOL'], midCount);
        const topDefenders = getTopPlayersForPosition(['ZAG', 'LAT'], defCount);
        const topGoalkeeper = getTopPlayersForPosition(['GOL'], gkCount);
        
        return [...topAttackers, ...topMidfielders, ...topDefenders, ...topGoalkeeper];

    }, [isVotingClosed, allVotes, players, formation, modality, lineupSize]);


    const votingStatus = getVotingStatus(isVotingReleased, isVotingClosed);
    const isVotingActive = votingStatus.isOpen;

    const handleAddPlayerClick = (index: number) => {
      if (!isVotingActive || isSaved) {
        let description = "Não é mais possível alterar a seleção.";
        if (!isVotingReleased) description = "Aguarde o administrador da liga liberar a votação.";
        else if (isVotingClosed) description = "A votação já foi encerrada.";
        
        toast({ title: "Votação Indisponível", description, variant: 'destructive' });
        return;
      }
      setSlotToFill(index);
      setSelectionModalOpen(true);
    }
    
    const handlePlayerCardClick = (state: PlayerActionState) => {
        if (!isVotingActive || isSaved) return;
        setPlayerActionState(state);
    };

    const handleSelectPlayerForSlot = (playerId: string) => {
        const player = players[playerId];
        if (!player) return;

        // Allow admin/voter to vote for themselves
        const isAlreadyInLineup = lineup.some(vote => vote?.playerId === playerId);
        if (isAlreadyInLineup) {
            toast({
                title: "Jogador já escalado",
                description: "Este jogador já foi adicionado à sua seleção.",
                variant: "destructive",
            });
            return;
        }

        if (slotToFill !== null) {
            setPlayerToRate(playerId);
            setSelectionModalOpen(false);
        }
    }
    
    const handleConfirmRating = (rating: number) => {
        if (slotToFill !== null && playerToRate !== null) {
            const newLineup = [...lineup];
            newLineup[slotToFill] = { playerId: playerToRate, rating };
            setLineup(newLineup);
        }
        setPlayerToRate(null);
        setSlotToFill(null);
    };
    
    const handleRemovePlayer = () => {
        if (!playerActionState) return;
        const { index } = playerActionState;
        const newLineup = [...lineup];
        newLineup[index] = null;
        setLineup(newLineup);
        setPlayerActionState(null);
    };

    const lineupToDisplay = isVotingClosed ? finalEleven : lineup;

    const { attackers, midfielders, defenders, goalkeeper, atkCount, midCount, defCount } = useMemo(() => {
        if (!lineupToDisplay) {
            return { attackers: [], midfielders: [], defenders: [], goalkeeper: [], atkCount: 0, midCount: 0, defCount: 0 };
        }
        
        const formationParts = formation.split('-').map(Number);
        let parsedDef = 0, parsedMid = 0, parsedAtk = 0;

        if ((modality === 'campo' || modality === 'society') && formationParts.length === 3) {
            [parsedDef, parsedMid, parsedAtk] = formationParts;
        } else if (modality === 'futsal' && formationParts.length === 2) {
            [parsedDef, parsedAtk] = formationParts;
            parsedMid = 0;
        } else {
            // Fallback for default or incorrect formation mapping
            if (lineupSize === 11) [parsedDef, parsedMid, parsedAtk] = [4, 3, 3];
            if (lineupSize === 7) [parsedDef, parsedMid, parsedAtk] = [3, 2, 1];
            if (lineupSize === 5) [parsedDef, parsedAtk] = [2, 2];
        }

        let playerIndex = 0;
        const assignedAttackers = lineupToDisplay.slice(playerIndex, playerIndex + parsedAtk);
        playerIndex += parsedAtk;
        const assignedMidfielders = lineupToDisplay.slice(playerIndex, playerIndex + parsedMid);
        playerIndex += parsedMid;
        const assignedDefenders = lineupToDisplay.slice(playerIndex, playerIndex + parsedDef);
        playerIndex += parsedDef;
        const assignedGoalkeeper = lineupToDisplay.slice(playerIndex, playerIndex + 1);

        return {
            attackers: assignedAttackers,
            midfielders: assignedMidfielders,
            defenders: assignedDefenders,
            goalkeeper: assignedGoalkeeper,
            atkCount: parsedAtk,
            midCount: parsedMid,
            defCount: parsedDef,
        };
    }, [lineupToDisplay, formation, modality, lineupSize]);

    const renderPlayerRow = (count: number, lineupSlice: (BestElevenVote | null)[], startIndex: number) => {
      if (count === 0) return null;
      return (
          <div className="flex justify-around z-10 w-full">
              {Array.from({ length: count }).map((_, i) => {
                  const lineupEntry = lineupSlice[i];
                  const currentIndex = startIndex + i;
                  if (lineupEntry) {
                      const player = players[lineupEntry.playerId];
                      return <PlayerCard key={lineupEntry.playerId} player={{...player, id: lineupEntry.playerId}} rating={lineupEntry.rating} onPlayerSelect={() => !isVotingClosed && handlePlayerCardClick({ playerId: lineupEntry.playerId, index: currentIndex })} />;
                  } else if (!isVotingClosed) {
                      return <AddPlayerButton key={`add-${i}`} onClick={() => handleAddPlayerClick(currentIndex)} />;
                  } else {
                     return <div key={`empty-slot-${i}`} className="w-20 h-28"/>
                  }
              })}
          </div>
      );
    };

    const isComplete = !lineup.some(p => p === null);
    
    const usersWhoVoted = useMemo(() => {
        return allUsers.filter(user => allVotes[user.id]);
    }, [allVotes, allUsers]);
    
    const canViewVotes = isVotingClosed && isVoteRevelationEnabled;

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
            lineup={lineup}
            allScaledPlayerIds={allScaledPlayerIds}
        />
      </Dialog>
      
      <Dialog open={!!playerToRate} onOpenChange={(open) => !open && setPlayerToRate(null)}>
        {playerToRate && (
            <RatingModal 
                player={players[playerToRate]}
                onRate={handleConfirmRating}
                onCancel={() => setPlayerToRate(null)}
            />
        )}
      </Dialog>


      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Seleção da Rodada</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4 pb-24">
        <Tabs defaultValue="my-selection">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="my-selection">{isVotingClosed ? "Resultado Final" : "Minha Seleção"}</TabsTrigger>
            <TabsTrigger value="votes">Apuração</TabsTrigger>
          </TabsList>
          <TabsContent value="my-selection">
            <Pitch modality={modality}>
                {renderPlayerRow(atkCount, attackers, 0)}
                {renderPlayerRow(midCount, midfielders, atkCount)}
                {renderPlayerRow(defCount, defenders, atkCount + midCount)}
                {renderPlayerRow(1, goalkeeper, atkCount + midCount + defCount)}
            </Pitch>
          </TabsContent>
          <TabsContent value="votes">
            <Card>
                <CardHeader>
                    <CardTitle>Apuração dos Votos</CardTitle>
                    <CardDescription>
                       {isVoteRevelationEnabled 
                            ? (isVotingClosed ? 'Confira os votos de todos os participantes.' : 'Acompanhe em tempo real quem já votou.')
                            : 'A apuração dos votos está oculta pelo administrador.'
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        {!isVoteRevelationEnabled ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center">
                                <Lock className="w-12 h-12 mb-4" />
                                <p className="font-bold">Votos Ocultos</p>
                                <p className="text-sm">O administrador desativou a revelação dos votos no momento.</p>
                            </div>
                        ) : (
                            <div className="space-y-3 pr-2">
                                {allUsers.map(user => {
                                    const hasVoted = !!allVotes[user.id];
                                    if (canViewVotes) {
                                        const userVote = allVotes[user.id];
                                        if (!userVote) return null;
                                        return (
                                            <Dialog key={user.id}>
                                                <DialogTrigger asChild>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 cursor-pointer">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar>
                                                                <AvatarImage src={user.avatar} alt={user.name}/>
                                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                            <p className="font-semibold">{user.name}</p>
                                                        </div>
                                                        <Button variant="ghost" size="sm">
                                                            <Eye className="mr-2 h-4 w-4" /> Ver Voto
                                                        </Button>
                                                    </div>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>Voto de {user.name}</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                                        {userVote.map((playerVote, index) => {
                                                            if (!playerVote) return null;
                                                            const player = players[playerVote.playerId];
                                                            return (
                                                                <div key={index} className="flex items-center justify-between p-2 bg-background rounded">
                                                                    <p>{player.name}</p>
                                                                    <div className="flex items-center gap-1 font-bold text-amber-500">
                                                                        <Star className="w-4 h-4" fill="currentColor" />
                                                                        {playerVote.rating.toFixed(1)}
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
                                        )
                                    } else {
                                        // Show pending status if revelation is on but voting is not closed
                                        return (
                                            <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={user.avatar} alt={user.name}/>
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <p className="font-semibold">{user.name}</p>
                                                </div>
                                                <div className={cn("px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap", hasVoted ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500")}>
                                                    {hasVoted ? 'Votou' : 'Pendente'}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4 flex flex-col gap-2">
            <div className={cn(
                "p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground",
                isVotingActive ? "bg-primary/80" : "bg-destructive/80"
            )}>
                <Clock className="w-5 h-5" />
                <span>{votingStatus.message}</span>
            </div>
             {canManageVoting && !isVotingReleased && (
              <Button onClick={onReleaseVoting} className="bg-blue-600 hover:bg-blue-700">
                <Send className="mr-2 h-4 w-4" />
                Liberar Votação
              </Button>
            )}
             {canManageVoting && isVotingReleased && !isVotingClosed && (
              <Button onClick={onCloseVoting} variant="destructive" className="bg-red-600 hover:bg-red-700">
                <CheckCircle className="mr-2 h-4 w-4" />
                Encerrar Votação (Admin)
              </Button>
            )}
        </div>
      </main>

       {isVotingActive && !isSaved && (
        <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-30 flex items-center gap-4">
            <div className="flex-1">
                 <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg" disabled={!isComplete} onClick={() => onVote(lineup)}>
                    <Save className="mr-2 h-5 w-5"/>
                    Salvar Seleção
                </Button>
            </div>
            <div className="flex-none">
                 <Select value={formation} onValueChange={(value: Formation) => setFormation(value)}>
                    <SelectTrigger className="w-auto bg-muted border-none h-12">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {availableFormations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
      )}

    </div>
  );
}
