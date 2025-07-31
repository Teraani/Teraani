

"use client";

import type { View } from '@/app/page';
import type { Player, User, League } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Users, BarChart3, Trophy, LogOut, ShieldCheck, FilePenLine, Radio, CalendarClock, AlertCircle, Crown, Check, Search, ChevronRight, Mail, Landmark, Edit, Globe } from 'lucide-react';
import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { differenceInDays, parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Input } from '../ui/input';
import { ThemeToggle } from '../theme-toggle';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';

interface DashboardViewProps {
  user: User;
  allUsers: Record<string, User>;
  players: Record<string, Player>;
  onNavigate: (view: View, options?: { isPersonalPayments?: boolean }) => void;
  onPlayerSelect: (playerId: string) => void;
  onAvatarChange: (userId: string, image: string) => void;
  onUpdateUser: (userId: string, newName: string) => void;
  leagues: Record<string, League>;
  currentLeagueId: string;
  onLeagueChange: (leagueId: string) => void;
  isPaymentsEnabled: boolean;
  onLogout: () => void;
  leagueName: string;
  onUpdateLeagueName: (newName: string) => void;
}

function PaymentStatus({ user, onNavigate }: { user: User, onNavigate: (view: View, options?: { isPersonalPayments?: boolean }) => void }) {
  const { toast } = useToast();
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    if (notificationShown) return;

    const dueDate = parseISO(user.paymentDueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const daysUntilDue = differenceInDays(dueDate, today);

    let toastShownThisSession = sessionStorage.getItem(`notified_${user.id}_${user.paymentDueDate}`);

    if (toastShownThisSession) return;

    if (daysUntilDue <= 1 && daysUntilDue >= 0) {
      toast({
        title: "Aviso de Vencimento",
        description: `Sua mensalidade vence amanhã! (${format(dueDate, 'dd/MM/yyyy', { locale: ptBR })})`,
        variant: "destructive",
      });
       sessionStorage.setItem(`notified_${user.id}_${user.paymentDueDate}`, 'true');
    } else if (daysUntilDue < 0) {
        toast({
            title: "Mensalidade Vencida",
            description: `Sua mensalidade venceu em ${format(dueDate, 'dd/MM/yyyy', { locale: ptBR })}.`,
            variant: "destructive",
        });
        sessionStorage.setItem(`notified_${user.id}_${user.paymentDueDate}`, 'true');
    }
  }, [user.id, user.paymentDueDate, toast, notificationShown]);

  const dueDate = parseISO(user.paymentDueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysDiff = differenceInDays(dueDate, today);
  const isOverdue = daysDiff < 0;

  return (
    <Card className="bg-card mt-4">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {isOverdue ? <AlertCircle className="w-6 h-6 text-destructive" /> : <CalendarClock className="w-6 h-6 text-primary" />}
          <div>
            <h4 className="font-bold">Situação da Mensalidade</h4>
            <p className="text-sm text-muted-foreground">
              {isOverdue ? "Vencida desde" : "Vence em"}: {format(dueDate, 'dd MMMM, yyyy', { locale: ptBR })}
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => onNavigate('payments', { isPersonalPayments: true })}>Ver detalhes</Button>
      </div>
    </Card>
  );
}


function EditProfileDialog({ user, leagueName, isLeagueAdmin, onUpdateUser, onUpdateLeagueName, children }: { user: User; leagueName: string; isLeagueAdmin: boolean; onUpdateUser: (userId: string, newName: string) => void; onUpdateLeagueName: (newName: string) => void; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [newLeagueName, setNewLeagueName] = useState(leagueName);

  const handleSave = () => {
    if (name.trim() && name.trim() !== user.name) {
      onUpdateUser(user.id, name.trim());
    }
     if (isLeagueAdmin && newLeagueName.trim() && newLeagueName.trim() !== leagueName) {
      onUpdateLeagueName(newLeagueName.trim());
    }
    setIsOpen(false);
  };
  
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(user.name);
      setNewLeagueName(leagueName);
    }
    setIsOpen(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Perfil e Liga</DialogTitle>
          <DialogDescription>
            Faça alterações no seu perfil. Se for admin, pode alterar o nome da liga aqui também.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Seu Nome
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
           {isLeagueAdmin && (
             <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="leagueName" className="text-right">
                  Nome da Liga
                </Label>
                <Input
                  id="leagueName"
                  value={newLeagueName}
                  onChange={(e) => setNewLeagueName(e.target.value)}
                  className="col-span-3"
                />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleSave}>Salvar alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


function PlayerSummary({ user, players, onNavigate }: { user: User, players: Record<string, Player>, onNavigate: (view: View, options?: { isPersonalPayments?: boolean }) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { totalGames, totalPoints, performancePercentage } = useMemo(() => {
        const userAsPlayer = Object.values(players).find(p => p.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()));
        
        if (!userAsPlayer || !userAsPlayer.stats) {
          return { totalGames: 0, totalPoints: 0, performancePercentage: '0%' };
        }

        const totalGames = userAsPlayer.games || 0;
        const totalPoints = userAsPlayer.points || 0;
        
        const performance = userAsPlayer.stats.performance || 0;
        
        return {
            totalGames,
            totalPoints,
            performancePercentage: performance.toFixed(0) + '%'
        };
    }, [user, players]);

    return (
        <Card className="bg-card p-4">
            <CardContent className="p-0">
                <div className="flex items-center gap-4">
                     <div className="relative">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatar ?? undefined} alt="Foto do Jogador" />
                            <AvatarFallback className="text-3xl">
                                {user.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold">{user.name}</h3>
                    </div>
                </div>
                <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Partidas</p>
                        <p className="font-bold text-lg">{totalGames}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Pontos</p>
                        <p className="font-bold text-lg">{totalPoints.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Aproveitamento</p>
                        <p className="font-bold text-lg">{performancePercentage}</p>
                    </div>
                </div>
                <Button className="w-full mt-4" onClick={() => onNavigate('lineup')}>
                    Ver Times da Rodada
                </Button>
            </CardContent>
        </Card>
    );
}

function QuickAccess({ onNavigate }: { onNavigate: (view: View) => void }) {
    const items = [
        { label: "Parciais gerais", view: 'partial-score' as View, icon: BarChart3 },
        { label: "Parcial dos amigos", view: 'friends-score' as View, icon: Users },
        { label: "Resultado dos jogos", view: 'games' as View, icon: Trophy },
        { label: "Partida ao vivo", view: 'live' as View, icon: Radio },
    ];
    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Acesso Rápido</h3>
             <div className="grid grid-cols-4 gap-2 text-center">
                {items.map(item => (
                    <button key={item.label} onClick={() => onNavigate(item.view)} className="flex flex-col items-center gap-2 p-3 bg-card rounded-lg hover:bg-muted transition-colors">
                        <div className="text-primary">
                            <item.icon className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-xs text-foreground">{item.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

function ConnectSection() {
    return (
        <Card className="bg-secondary border-none">
            <CardContent className="p-4 text-center">
                <ul className="space-y-2">
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com Amazfit (em breve)</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com Garmin (em breve)</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com a Samsung (em breve)</a></li>
                </ul>
            </CardContent>
        </Card>
    )
}


export default function DashboardView({ user, allUsers, players, onNavigate, onPlayerSelect, onAvatarChange, onUpdateUser, leagues, currentLeagueId, onLeagueChange, isPaymentsEnabled, onLogout, leagueName, onUpdateLeagueName }: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const sortedUsers = useMemo(() => {
    return Object.values(allUsers)
      .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, searchTerm]);
  
  const currentLeague = leagues[currentLeagueId];
  const isLeagueAdmin = currentLeague.adminId === user.id;
  const isSuperAdmin = user.email === 'jason.teraani@gmail.com';


  return (
    <div>
      <header className="bg-primary text-primary-foreground p-4 shadow-sm flex items-center justify-between">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-white/20 p-0">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar ?? undefined} alt="Avatar do Usuário" />
                <AvatarFallback>
                  <Users className="text-black" />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
             <EditProfileDialog 
                user={user} 
                onUpdateUser={onUpdateUser}
                leagueName={leagueName}
                isLeagueAdmin={isLeagueAdmin}
                onUpdateLeagueName={onUpdateLeagueName}
             >
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Edit className="mr-2 h-4 w-4" />
                    <span>Editar Perfil / Liga</span>
                </DropdownMenuItem>
            </EditProfileDialog>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <ThemeToggle />
            </DropdownMenuItem>
             <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate('leagues')}>
                <Landmark className="mr-2 h-4 w-4" />
                <span>Trocar/Gerenciar Ligas</span>
            </DropdownMenuItem>
            {isLeagueAdmin && (
              <DropdownMenuItem onClick={() => onNavigate('admin')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin da Liga</span>
              </DropdownMenuItem>
            )}
             {isPaymentsEnabled && (
              <DropdownMenuItem onClick={() => onNavigate('payments', { isPersonalPayments: true })}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Pagamentos</span>
              </DropdownMenuItem>
            )}
            {isSuperAdmin && (
              <>
               <DropdownMenuItem onClick={() => onNavigate('all-users')}>
                <Globe className="mr-2 h-4 w-4" />
                <span>Todos os Usuários do App</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onNavigate('all-leagues')}>
                <Trophy className="mr-2 h-4 w-4" />
                <span>Todas as Ligas do App</span>
              </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={() => window.location.href = 'mailto:suporte.amistosofc@gmail.com'}>
                <Mail className="mr-2 h-4 w-4" />
                <span>Suporte</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl font-bold">Início</h1>

        <div className="w-10 h-10" />
      </header>
      <div className="p-4 space-y-8">
        <Card className="cursor-pointer bg-card hover:bg-muted/50" onClick={() => onNavigate('league-participants')}>
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-muted-foreground">Liga Atual</p>
                    <h3 className="text-lg font-bold">{currentLeague.name}</h3>
                </div>
                <div className="flex items-center text-muted-foreground">
                    <Users className="mr-2 h-5 w-5" />
                    <span className="font-bold">{Object.keys(currentLeague.users).length}</span>
                    <ChevronRight className="h-5 w-5 ml-2" />
                </div>
            </CardContent>
        </Card>
        <PlayerSummary user={user} players={players} onNavigate={onNavigate} />
        <QuickAccess onNavigate={onNavigate} />
        <ConnectSection />
      </div>
    </div>
  );
}
