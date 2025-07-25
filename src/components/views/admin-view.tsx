

"use client";

import { useState, useMemo } from 'react';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Settings, Search, FilePenLine, Check, DollarSign, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';

interface AdminViewProps {
  onBack: () => void;
  users: User[];
  currentUser: User;
  editorOfTheRound: string | null;
  onSetEditor: (userId: string | null) => void;
  scoutEditor: string | null;
  onSetScoutEditor: (userId: string | null) => void;
  paymentEditor: string | null;
  onSetPaymentEditor: (userId: string | null) => void;
  isVoteRevelationEnabled: boolean;
  onToggleVoteRevelation: (enabled: boolean) => void;
}

export default function AdminView({ 
    onBack, 
    users, 
    currentUser,
    editorOfTheRound, 
    onSetEditor, 
    scoutEditor, 
    onSetScoutEditor, 
    paymentEditor, 
    onSetPaymentEditor,
    isVoteRevelationEnabled,
    onToggleVoteRevelation
}: AdminViewProps) {
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

  const handleSetPaymentEditorClick = (user: User) => {
    if (paymentEditor === user.id) {
      onSetPaymentEditor(null);
      toast({
        title: 'Permissão de Pagamentos Removida!',
        description: `${user.name} não pode mais editar pagamentos.`,
        variant: 'destructive'
      });
    } else {
      onSetPaymentEditor(user.id);
      toast({
        title: 'Permissão de Pagamentos Concedida!',
        description: `${user.name} agora pode editar as datas de vencimento.`,
      });
    }
  };


  const filteredUsers = useMemo(() => {
    return users
        .filter(user => user.id !== currentUser.id)
        .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [users, searchTerm, currentUser.id]);

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
        <Card>
            <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">Revelar Votos</Label>
                        <p className="text-sm text-muted-foreground">
                            Permite que todos vejam os votos da Seleção da Rodada.
                        </p>
                    </div>
                    <Switch
                        checked={isVoteRevelationEnabled}
                        onCheckedChange={onToggleVoteRevelation}
                    />
                </div>
            </CardContent>
        </Card>


        <Card className="bg-card border border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-foreground">Gerenciar Permissões</CardTitle>
            <CardDescription>
              Conceda ou revogue permissões de edição para os jogadores.
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
            <ScrollArea className="h-[calc(100vh-450px)]">
                <div className="space-y-3 pr-4">
                    {filteredUsers.map((user) => {
                        const isLineupEditor = editorOfTheRound === user.id;
                        const isScoutEditor = scoutEditor === user.id;
                        const isPaymentEditor = paymentEditor === user.id;

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
                           
                           <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Settings className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSetEditorClick(user)}>
                                  <Crown className="mr-2 h-4 w-4" />
                                  <span>Editar Times</span>
                                  {isLineupEditor && <Check className="ml-auto h-4 w-4 text-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSetScoutEditorClick(user)}>
                                  <FilePenLine className="mr-2 h-4 w-4" />
                                  <span>Editar Scouts</span>
                                  {isScoutEditor && <Check className="ml-auto h-4 w-4 text-primary" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleSetPaymentEditorClick(user)}>
                                  <DollarSign className="mr-2 h-4 w-4" />
                                  <span>Editar Pagamentos</span>
                                  {isPaymentEditor && <Check className="ml-auto h-4 w-4 text-primary" />}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                           
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
