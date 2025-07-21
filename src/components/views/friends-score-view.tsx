
"use client";

import { useState, useMemo } from 'react';
import type { Friend, Player, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus, Search } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
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
    <Avatar className="absolute bottom-[-8px] right-[-8px] h-8 w-8 border-2 border-white dark:border-zinc-800">
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
        <Button variant="ghost" size="icon" className="hover:bg-gray-200 dark:hover:bg-zinc-800">
          <UserPlus className="h-6 w-6" />
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
  
  const handleAddCompetitor = (newFriend: Friend) => {
    // Avoid adding duplicates
    if (!competitors.find(c => c.id === newFriend.id)) {
      setCompetitors(prev => [...prev, newFriend]);
    }
  }


  return (
    <div className="bg-gray-100 dark:bg-zinc-950 min-h-screen">
      <header className="bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Amigos</h2>
        <AddFriendDialog players={players} onSelect={handleAddCompetitor} />
      </header>

      <main className="p-4">
        <div className="space-y-3">
          {competitors.map((competitor) => (
            <Card key={competitor.id} className={cn(
                "bg-white dark:bg-zinc-900 shadow-none border-b border-gray-200 dark:border-zinc-800 rounded-none last:border-b-0",
                competitor.id === 'user' && "border-2 border-primary dark:border-primary"
              )}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TeamCrest
                    crest={competitor.crest}
                    avatar={competitor.avatar}
                    name={competitor.name}
                    teamName={competitor.teamName}
                  />
                  <div className="ml-4">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{competitor.teamName}</p>
                    <div className="flex items-center gap-2">
                       {competitor.isPro && <Badge className="bg-yellow-400 text-yellow-900 px-1.5 py-0 text-[10px] h-4">PRO</Badge>}
                       <span className="text-sm text-gray-500 dark:text-gray-400">{competitor.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                    <p className="font-bold text-lg text-green-500">{competitor.score?.toFixed(2) ?? '---'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JOG. PONT. {competitor.playersPlayed}/{competitor.totalPlayers}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
