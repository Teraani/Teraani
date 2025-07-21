
"use client";

import { useState, useMemo } from 'react';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, ShieldCheck, Search, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
}

export default function AdminView({ onBack, users, editorOfTheRound, onSetEditor }: AdminViewProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSetEditorClick = (user: User) => {
    if (editorOfTheRound === user.id) {
      // If the user is already the editor, remove the permission
      onSetEditor(null);
      toast({
        title: 'Permissão Removida!',
        description: `${user.name} não é mais o editor da rodada.`,
        variant: 'destructive'
      });
    } else {
      onSetEditor(user.id);
      toast({
        title: 'Permissão Concedida!',
        description: `${user.name} agora pode editar os times nesta rodada.`,
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  return (
    <div className="dark">
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6 text-white" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Painel do Administrador</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4">
        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Gerenciar Permissões da Rodada</CardTitle>
             <p className="text-sm text-muted-foreground pt-1">
              Escolha um jogador para dar permissão de edição dos times nesta rodada ou remova a permissão clicando novamente.
            </p>
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

            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pr-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar"/>
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground flex items-center gap-2">
                          {user.name}
                          {user.role === 'admin' && <ShieldCheck className="h-4 w-4 text-primary" />}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    {user.role === 'player' && (
                      <Button
                        size="sm"
                        variant={editorOfTheRound === user.id ? 'destructive' : 'default'}
                        onClick={() => handleSetEditorClick(user)}
                        className={cn("transition-all",
                            editorOfTheRound === user.id ? "bg-green-600 hover:bg-red-600" : ""
                        )}
                      >
                        {editorOfTheRound === user.id ? (
                          <>
                            <Crown className="mr-2 h-4 w-4" />
                            Editor da Rodada
                          </>
                        ) : (
                          'Conceder Permissão'
                        )}
                      </Button>
                    )}
                  </div>
                ))}
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
