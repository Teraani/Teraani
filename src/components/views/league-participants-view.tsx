
"use client";

import type { League, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';

interface LeagueParticipantsViewProps {
  onBack: () => void;
  league: League;
}

export default function LeagueParticipantsView({ onBack, league }: LeagueParticipantsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const participants = useMemo(() => {
    return Object.values(league.users)
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (b.role === 'admin' && a.role !== 'admin') return 1;
        return a.name.localeCompare(b.name);
      });
  }, [league.users, searchTerm]);

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Membros da Liga</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>
        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="space-y-3 pr-2">
            {participants.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && <Crown className="h-4 w-4 text-amber-500" />}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.teamName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
