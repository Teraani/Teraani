
"use client";

import type { League, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Search, Share2, UserPlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';

interface AllUsersViewProps {
  onBack: () => void;
  leagues: Record<string, League>;
}

export default function AllUsersView({ 
  onBack, 
  leagues, 
}: AllUsersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allUsers = useMemo(() => {
    const usersMap = new Map<string, User>();
    Object.values(leagues).forEach(league => {
      Object.values(league.users).forEach(user => {
        if (!usersMap.has(user.id)) {
          usersMap.set(user.id, user);
        }
      });
    });

    return Array.from(usersMap.values())
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leagues, searchTerm]);

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Todos os Usuários</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={`Buscar em ${allUsers.length} usuários...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-170px)]">
          <div className="space-y-3 pr-2">
            {allUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
             {allUsers.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Nenhum usuário encontrado.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
