
"use client";

import type { View } from '@/app/page';
import type { League, User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, PlusCircle, Trophy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LeaguesViewProps {
  onBack: () => void;
  leagues: Record<string, League>;
  currentLeagueId: string;
  onLeagueChange: (leagueId: string) => void;
  currentUser: User;
}

export default function LeaguesView({
  onBack,
  leagues,
  currentLeagueId,
  onLeagueChange,
  currentUser
}: LeaguesViewProps) {
  const { toast } = useToast();

  const userLeagues = Object.values(leagues).filter(league => league.users[currentUser.id]);

  const handleSelectLeague = (leagueId: string) => {
    if (leagueId !== currentLeagueId) {
      onLeagueChange(leagueId);
    } else {
      onBack(); // Go back if the current league is selected again
    }
  };
  
  const handleInvite = async (leagueId: string) => {
    const inviteLink = `${window.location.origin}?invite=${leagueId}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast({
        title: 'Link de Convite Copiado!',
        description: 'O link foi copiado. Compartilhe com seus amigos!',
      });
    } catch (err) {
      toast({
        title: 'Erro ao Copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Minhas Ligas</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Suas Ligas</CardTitle>
                <CardDescription>Selecione uma liga para ver os detalhes ou crie uma nova.</CardDescription>
            </CardHeader>
            <CardContent>
                <ScrollArea className="h-[calc(100vh-250px)]">
                    <div className="space-y-3">
                        {userLeagues.map((league) => (
                            <div
                                key={league.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted"
                                onClick={() => handleSelectLeague(league.id)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                        <Trophy className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-foreground">{league.name}</p>
                                        <p className="text-sm text-muted-foreground">{Object.keys(league.users).length} membros</p>
                                    </div>
                                </div>
                                {currentLeagueId === league.id && (
                                    <Check className="h-5 w-5 text-primary" />
                                )}
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
