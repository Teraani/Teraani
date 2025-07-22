
"use client";

import type { View } from '@/app/page';
import type { Player, User } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Users, BarChart3, Trophy, LogOut, ShieldCheck, FilePenLine, Radio, CalendarClock, AlertCircle } from 'lucide-react';
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

interface DashboardViewProps {
  user: User;
  players: Record<string, Player>;
  onNavigate: (view: View) => void;
  onPlayerSelect: (playerId: string) => void;
  userAvatar: string | null;
  onAvatarChange: (image: string) => void;
}

function PaymentStatus({ user, onNavigate }: { user: User, onNavigate: (view: View) => void }) {
  const { toast } = useToast();
  const [notificationShown, setNotificationShown] = useState(false);

  useEffect(() => {
    if (notificationShown) return;

    const dueDate = parseISO(user.paymentDueDate);
    const today = new Date();
    const daysUntilDue = differenceInDays(dueDate, today);

    if (daysUntilDue <= 1 && daysUntilDue >= 0) {
      toast({
        title: "Aviso de Vencimento",
        description: `Sua mensalidade vence amanhã! (${format(dueDate, 'dd/MM/yyyy')})`,
        variant: "destructive",
      });
      setNotificationShown(true);
    } else if (daysUntilDue < 0) {
        toast({
            title: "Mensalidade Vencida",
            description: `Sua mensalidade venceu em ${format(dueDate, 'dd/MM/yyyy')}.`,
            variant: "destructive",
        });
        setNotificationShown(true);
    }
  }, [user.paymentDueDate, toast, notificationShown]);

  const dueDate = parseISO(user.paymentDueDate);
  const today = new Date();
  const isOverdue = differenceInDays(dueDate, today) < 0;

  return (
    <Card className="bg-card p-4 mt-4 border-l-4 border-primary">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                {isOverdue ? <AlertCircle className="w-6 h-6 text-destructive" /> : <CalendarClock className="w-6 h-6 text-primary"/>}
                <div>
                    <h4 className="font-bold">Situação da Mensalidade</h4>
                    <p className="text-sm text-muted-foreground">
                        {isOverdue ? "Vencida desde" : "Vence em"}: {format(dueDate, 'dd MMMM, yyyy', { locale: ptBR })}
                    </p>
                </div>
            </div>
            <Button size="sm" onClick={() => onNavigate('payments')}>Ver detalhes</Button>
        </div>
    </Card>
  );
}


function PlayerSummary({ user, players, onNavigate, userAvatar, onAvatarChange }: { user: User, players: Record<string, Player>, onNavigate: (view: View) => void, userAvatar: string | null, onAvatarChange: (image: string) => void }) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                onAvatarChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const { totalGames, totalPoints, performancePercentage } = useMemo(() => {
        const userAsPlayer = Object.values(players).find(p => p.name.toLowerCase().includes(user.name.split(' ')[0].toLowerCase()));
        
        if (!userAsPlayer) {
          return { totalGames: 0, totalPoints: 0, performancePercentage: '0%' };
        }

        const totalGames = userAsPlayer.games || 0;
        const totalPoints = userAsPlayer.points || 0;
        const performance = userAsPlayer.stats?.performance || 0;
        
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
                        <Avatar className="h-20 w-20 cursor-pointer" onClick={handleAvatarClick}>
                            <AvatarImage src={userAvatar ?? undefined} alt="Foto do Jogador" />
                            <AvatarFallback className="text-3xl">
                                <Upload className="h-8 w-8"/>
                            </AvatarFallback>
                        </Avatar>
                        {userAvatar && (
                          <div
                            className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer"
                            onClick={handleAvatarClick}
                          >
                            <Upload className="h-4 w-4 text-primary-foreground" />
                          </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <h3 className="text-2xl font-bold">{user.name}</h3>
                </div>
                <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Partidas Jogadas</p>
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
                <PaymentStatus user={user} onNavigate={onNavigate} />
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
            <div className="grid grid-cols-4 gap-2">
                {items.map(item => (
                    <button key={item.label} onClick={() => onNavigate(item.view)} className="flex flex-col items-center justify-center gap-2 p-2 rounded-lg bg-card hover:bg-muted transition-colors aspect-square">
                        <div className="text-primary">
                            <item.icon className="w-8 h-8" />
                        </div>
                        <p className="text-xs font-semibold text-center text-foreground">{item.label}</p>
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
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com strava (em breve)</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com garmim (em breve)</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com a Samsung (em breve)</a></li>
                </ul>
            </CardContent>
        </Card>
    )
}


export default function DashboardView({ user, players, onNavigate, onPlayerSelect, userAvatar, onAvatarChange }: DashboardViewProps) {
  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center justify-between">
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar ?? undefined} alt="Avatar do Usuário" />
                <AvatarFallback>
                  <Users />
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
            {user.role === 'admin' && (
              <DropdownMenuItem onClick={() => onNavigate('admin')}>
                <ShieldCheck className="mr-2 h-4 w-4" />
                <span>Admin</span>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onNavigate('welcome')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl font-bold text-foreground">Amistosos FC</h1>

        <div className="w-10 h-10" />
      </header>
      <div className="p-4 space-y-8">
        <PlayerSummary user={user} players={players} onNavigate={onNavigate} userAvatar={userAvatar} onAvatarChange={onAvatarChange} />
        <QuickAccess onNavigate={onNavigate} />
        <ConnectSection />
      </div>
    </div>
  );
}
