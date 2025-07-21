
"use client";

import { useState, useMemo } from 'react';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, ShieldCheck, Search, FilePenLine, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

interface AdminViewProps {
  onBack: () => void;
  users: User[];
  editorOfTheRound: string | null;
  onSetEditor: (userId: string | null) => void;
  scoutEditor: string | null;
  onSetScoutEditor: (userId: string | null) => void;
}

export default function AdminView({ onBack, users, editorOfTheRound, onSetEditor, scoutEditor, onSetScoutEditor }: AdminViewProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSetEditorClick = (user: User) => {
    if (editorOfTheRound === user.id) {
      onSetEditor(null);
      toast({
        title: 'Permissão de Edição de Time Removida!',
        description: `${user.name} não pode mais editar os times.`,
        variant: 'destructive'
      });
    } else {
      onSetEditor(user.id);
      toast({
        title: 'Permissão de Edição de Time Concedida!',
        description: `${user.name} agora pode editar os times nesta rodada.`,
      });
    }
  };

  const handleSetScoutEditorClick = (user: User) => {
    if (scoutEditor === user.id) {
      onSetScoutEditor(null);
      toast({
        title: 'Permissão de Edição de Scout Removida!',
        description: `${user.name} não pode mais editar os scouts.`,
        variant: 'destructive'
      });
    } else {
      onSetScoutEditor(user.id);
      toast({
        title: 'Permissão de Edição de Scout Concedida!',
        description: `${user.name} agora pode editar os scouts dos jogadores.`,
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users
        .filter(user => user.role === 'player')
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Painel do Administrador</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-6">
        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Gerenciar Permissões</CardTitle>
            <CardDescription>
              Conceda ou revogue permissões de edição para os jogadores em cada rodada.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    placeholder="Buscar jogador pelo nome..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/30 border-border"
                />
            </div>
            <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-3 pr-4">
                    {filteredUsers.map((user) => {
                        const isLineupEditor = editorOfTheRound === user.id;
                        const isScoutEditor = scoutEditor === user.id;

                        return (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar"/>
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-foreground flex items-center gap-2">
                                        {user.name}
                                    </p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                           
                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    variant={isLineupEditor ? 'secondary' : 'outline'}
                                    onClick={() => handleSetEditorClick(user)}
                                    className={cn("transition-all", isLineupEditor && "bg-blue-600 text-white hover:bg-blue-700")}
                                >
                                    {isLineupEditor ? <Crown className="mr-2 h-4 w-4" /> : <Crown className="mr-2 h-4 w-4" />}
                                    Editar Times
                                </Button>
                                <Button
                                    size="sm"
                                    variant={isScoutEditor ? 'secondary' : 'outline'}
                                    onClick={() => handleSetScoutEditorClick(user)}
                                    className={cn("transition-all", isScoutEditor && "bg-green-600 text-white hover:bg-green-700")}
                                >
                                    {isScoutEditor ? <FilePenLine className="mr-2 h-4 w-4" /> : <FilePenLine className="mr-2 h-4 w-4" />}
                                    Editar Scouts
                                </Button>
                            </div>
                           
                        </div>
                        );
                    })}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-muted-foreground">
                        <p>Nenhum jogador encontrado.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
