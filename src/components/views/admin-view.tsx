
"use client";

import { useState, useMemo } from 'react';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, ShieldCheck, Search, FilePenLine } from 'lucide-react';
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

  const handleSetScoutEditorClick = (user: User) => {
    if (scoutEditor === user.id) {
      onSetScoutEditor(null);
      toast({
        title: 'Permissão de Scout Removida!',
        description: `${user.name} não pode mais editar os scouts.`,
        variant: 'destructive'
      });
    } else {
      onSetScoutEditor(user.id);
      toast({
        title: 'Permissão de Scout Concedida!',
        description: `${user.name} agora pode editar os scouts dos jogadores.`,
      });
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm]);

  const renderUserList = (permissionType: 'lineup' | 'scout') => (
    <div className="space-y-3 pr-4">
      {filteredUsers.map((user) => {
        const isLineupEditor = editorOfTheRound === user.id;
        const isScoutEditor = scoutEditor === user.id;
        const isCurrentUserEditor = permissionType === 'lineup' ? isLineupEditor : isScoutEditor;
        const buttonText = permissionType === 'lineup' ? 'Editor da Rodada' : 'Editor de Scout';
        const grantPermissionText = permissionType === 'lineup' ? 'Conceder Permissão' : 'Permitir Scout';

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
                  {user.role === 'admin' && <ShieldCheck className="h-4 w-4 text-primary" />}
                </p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            {user.role === 'player' && (
              <Button
                size="sm"
                variant={isCurrentUserEditor ? 'destructive' : 'default'}
                onClick={() => permissionType === 'lineup' ? handleSetEditorClick(user) : handleSetScoutEditorClick(user)}
                className={cn("transition-all",
                    isCurrentUserEditor ? "bg-green-600 hover:bg-red-600" : ""
                )}
              >
                {isCurrentUserEditor ? (
                  <>
                    {permissionType === 'lineup' ? <Crown className="mr-2 h-4 w-4" /> : <FilePenLine className="mr-2 h-4 w-4" />}
                    {buttonText}
                  </>
                ) : (
                  grantPermissionText
                )}
              </Button>
            )}
          </div>
        );
      })}
       {filteredUsers.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>Nenhum jogador encontrado.</p>
        </div>
      )}
    </div>
  );

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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar jogador pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-muted/30 border-border"
          />
        </div>

        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Permissão para Edição de Times</CardTitle>
             <p className="text-sm text-muted-foreground pt-1">
              Escolha um jogador para escalar os times nesta rodada.
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(50vh-180px)]">
              {renderUserList('lineup')}
            </ScrollArea>
          </CardContent>
        </Card>
        
        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Permissão para Edição de Scouts</CardTitle>
             <p className="text-sm text-muted-foreground pt-1">
              Escolha um jogador para editar os dados e scouts dos atletas.
            </p>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[calc(50vh-180px)]">
              {renderUserList('scout')}
            </ScrollArea>
          </CardContent>
        </Card>

      </main>
    </div>
  );
}
