
"use client";

import type { League } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Users, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState } from 'react';

interface AllLeaguesViewProps {
  onBack: () => void;
  leagues: Record<string, League>;
}

export default function AllLeaguesView({ onBack, leagues }: AllLeaguesViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLeagues = useMemo(() => {
    return Object.values(leagues)
      .filter(league => league.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [leagues, searchTerm]);

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Todas as Ligas</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={`Buscar em ${filteredLeagues.length} ligas...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <ScrollArea className="h-[calc(100vh-170px)]">
          <div className="space-y-3 pr-2">
            {filteredLeagues.map((league) => {
              const admin = league.users[league.adminId];
              return (
                <div key={league.id} className="p-3 rounded-lg bg-muted/50">
                   <div className="flex items-center justify-between">
                     <div>
                        <p className="font-bold text-foreground">{league.name}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Crown className="w-3 h-3 text-amber-500" /> 
                            {admin?.name || 'Admin não encontrado'}
                        </p>
                     </div>
                     <div className="flex items-center text-muted-foreground font-semibold">
                        <Users className="w-4 h-4 mr-2" />
                        {Object.keys(league.users).length}
                     </div>
                   </div>
                </div>
              );
            })}
             {filteredLeagues.length === 0 && (
                <div className="text-center py-10 text-muted-foreground">
                    <p>Nenhuma liga encontrada.</p>
                </div>
            )}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
