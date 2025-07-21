
"use client";

import { useState, useMemo } from 'react';
import type { Friend, Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogTrigger 
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
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FriendsScoreViewProps {
  onBack: () => void;
  friends: Friend[];
  user: User;
  players: Record<string, Player>;
  userAvatar: string | null;
}

const TeamCrest = ({ crest, avatar, name, teamName }: { crest: string; avatar: string; name: string; teamName: string; }) => (
  <div className="relative">
    <Image src={crest} alt="" width={48} height={48} className="rounded-md" data-ai-hint="team crest" />
    <Avatar className="absolute bottom-[-8px] right-[-8px] h-8 w-8 border-2 border-background">
      <AvatarImage src={avatar} alt={name} data-ai-hint="player avatar" />
      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
    </Avatar>
  </div>
);

const AddFriendDialog = ({ players, onSelect }: { players: Record<string, Player>, onSelect: (friend: Friend) => void }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredPlayers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    if (!lowerCaseSearch) return [];
    return Object.entries(players)
      .filter(([_, player]) => player.name.toLowerCase().includes(lowerCaseSearch))
      .map(([id, player]) => ({...player, id}));
  }, [searchTerm, players]);

  const handleSelect = (player: Player & { id: string }) => {
    const newFriend: Friend = {
      id: `player-${player.id}`,
      name: player.name,
      teamName: `${player.name} FC`,
      score: player.points,
      playersPlayed: player.games,
      totalPlayers: 11, // Assume 11 for now
      isPro: false,
      crest: 'https://placehold.co/40x40/cccccc/000000',
      avatar: player.img,
    };
    onSelect(newFriend);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-accent">
          <UserPlus className="h-6 w-6 text-foreground" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Comparar Pontuação</DialogTitle>
          <DialogDescription>
            Busque por um jogador para adicioná-lo à lista de comparação.
          </DialogDescription>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input 
            placeholder="Buscar jogador..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="h-64 mt-4">
          <div className="space-y-2">
            {filteredPlayers.map(player => (
              <div 
                key={player.id} 
                className="flex items-center gap-4 p-2 rounded-md hover:bg-muted cursor-pointer"
                onClick={() => handleSelect(player)}
              >
                <Avatar>
                  <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" />
                  <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{player.name}</p>
                  <p className="text-sm text-muted-foreground">{player.team}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};


export default function FriendsScoreView({ onBack, friends, user, players, userAvatar }: FriendsScoreViewProps) {
  const userScore = useMemo(() => {
    return user.lineup.reduce((sum, playerId) => {
      const player = players[playerId];
      return sum + (player?.points ?? 0);
    }, 0);
  }, [user, players]);

  const userAsFriend: Friend = {
    id: 'user',
    name: 'Felipe', // Assuming the user's name is Felipe as per previous context
    teamName: user.teamName,
    score: userScore,
    playersPlayed: user.lineup.filter(p => p !== null).length,
    totalPlayers: 11,
    isPro: true,
    crest: 'https://placehold.co/40x40/4ade80/000000', // Different crest for user
    avatar: userAvatar || 'https://placehold.co/32x32',
  };

  const [competitors, setCompetitors] = useState<Friend[]>([userAsFriend, ...friends]);
  const [friendToRemove, setFriendToRemove] = useState<Friend | null>(null);
  
  const handleAddCompetitor = (newFriend: Friend) => {
    if (!competitors.find(c => c.id === newFriend.id)) {
      setCompetitors(prev => [...prev, newFriend]);
    }
  }

  const handleRemoveCompetitor = () => {
    if (!friendToRemove) return;
    setCompetitors(prev => prev.filter(c => c.id !== friendToRemove.id));
    setFriendToRemove(null);
  }

  const handleCardClick = (competitor: Friend) => {
    if (competitor.id !== 'user') {
      setFriendToRemove(competitor);
    }
  }

  return (
    <div>
      <AlertDialog open={!!friendToRemove} onOpenChange={(open) => !open && setFriendToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Amigo?</AlertDialogTitle>
            <AlertDialogDescription>
              Você tem certeza que deseja remover "{friendToRemove?.teamName}" da sua lista de comparação?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setFriendToRemove(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveCompetitor} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <Trash2 className="mr-2 h-4 w-4" />
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="bg-card p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-foreground">Amigos</h2>
        <AddFriendDialog players={players} onSelect={handleAddCompetitor} />
      </header>

      <main className="p-4">
        <div className="space-y-3">
          {competitors.map((competitor) => (
            <Card 
              key={competitor.id} 
              className={cn(
                "bg-card shadow-none border-b border-border/50 rounded-lg",
                competitor.id === 'user' ? "border-2 border-primary" : "cursor-pointer hover:bg-muted/50"
              )}
              onClick={() => handleCardClick(competitor)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TeamCrest
                    crest={competitor.crest}
                    avatar={competitor.avatar}
                    name={competitor.name}
                    teamName={competitor.teamName}
                  />
                  <div className="ml-4">
                    <p className="font-bold text-foreground">{competitor.teamName}</p>
                    <div className="flex items-center gap-2">
                       {competitor.isPro && <Badge className="bg-yellow-400 text-yellow-900 px-1.5 py-0 text-[10px] h-4">PRO</Badge>}
                       <span className="text-sm text-muted-foreground">{competitor.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                    <p className="font-bold text-lg text-green-500">{competitor.score?.toFixed(2) ?? '---'}</p>
                    <p className="text-xs text-muted-foreground">JOG. PONT. {competitor.playersPlayed}/{competitor.totalPlayers}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
