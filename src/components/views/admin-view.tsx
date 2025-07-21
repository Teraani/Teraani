
"use client";

import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AdminViewProps {
  onBack: () => void;
  users: User[];
  editorOfTheRound: string | null;
  onSetEditor: (userId: string) => void;
}

export default function AdminView({ onBack, users, editorOfTheRound, onSetEditor }: AdminViewProps) {
  const { toast } = useToast();

  const handleSetEditorClick = (user: User) => {
    onSetEditor(user.id);
    toast({
      title: 'Permissão Concedida!',
      description: `${user.name} agora pode editar os times nesta rodada.`,
    });
  };

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
          <CardContent className="p-4">
            <h3 className="text-lg font-semibold text-foreground mb-4">Gerenciar Permissões da Rodada</h3>
            <p className="text-muted-foreground mb-4">
              Escolha um jogador para dar permissão de edição dos times nesta rodada.
            </p>
            <div className="space-y-3">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
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
                      onClick={() => handleSetEditorClick(user)}
                      disabled={editorOfTheRound === user.id}
                      className={cn(editorOfTheRound === user.id && "bg-green-600 hover:bg-green-700")}
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
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
