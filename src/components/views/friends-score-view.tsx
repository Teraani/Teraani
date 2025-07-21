
"use client";

import type { Friend } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, UserPlus } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface FriendsScoreViewProps {
  onBack: () => void;
  friends: Friend[];
}

const TeamCrest = ({ friend }: { friend: Friend }) => (
  <div className="relative">
    <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 flex gap-1">
      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
    </div>
    <Image src={friend.crest} alt={`${friend.teamName} crest`} width={48} height={48} className="rounded-md" data-ai-hint="team crest" />
    <Avatar className="absolute bottom-[-8px] right-[-8px] h-8 w-8 border-2 border-white dark:border-zinc-800">
      <AvatarImage src={friend.avatar} alt={friend.name} data-ai-hint="player avatar" />
      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
    </Avatar>
  </div>
);


export default function FriendsScoreView({ onBack, friends }: FriendsScoreViewProps) {
  return (
    <div className="bg-gray-100 dark:bg-zinc-950 min-h-screen">
      <header className="bg-white dark:bg-zinc-900 p-4 shadow-sm flex items-center justify-between sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-800">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Amigos</h2>
        <Button variant="ghost" size="icon" className="hover:bg-gray-200 dark:hover:bg-zinc-800">
          <UserPlus className="h-6 w-6" />
        </Button>
      </header>

      <main className="p-4">
        <div className="space-y-3">
          {friends.map((friend) => (
            <Card key={friend.id} className="bg-white dark:bg-zinc-900 shadow-none border-b border-gray-200 dark:border-zinc-800 rounded-none last:border-b-0">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <TeamCrest friend={friend} />
                  <div className="ml-4">
                    <p className="font-bold text-gray-800 dark:text-gray-100">{friend.teamName}</p>
                    <div className="flex items-center gap-2">
                       {friend.isPro && <Badge className="bg-yellow-400 text-yellow-900 px-1.5 py-0 text-[10px] h-4">PRO</Badge>}
                       <span className="text-sm text-gray-500 dark:text-gray-400">{friend.name}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                    <p className="font-bold text-lg text-green-500">{friend.score?.toFixed(2) ?? '---'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">JOG. PONT. {friend.playersPlayed}/{friend.totalPlayers}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
