
"use client";

import type { View } from '@/app/page';
import type { Player, User } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Users, BarChart3, Trophy, LogOut } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardViewProps {
  user: User;
  players: Record<string, Player>;
  onNavigate: (view: View) => void;
  onPlayerSelect: (playerId: string) => void;
  userAvatar: string | null;
  onAvatarChange: (image: string) => void;
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
        const lineupPlayers = user.lineup.map(id => players[id]).filter(Boolean);
        const reservePlayers = user.reserves.map(id => players[id]).filter(Boolean);
        const allUserPlayers = [...lineupPlayers, ...reservePlayers];
        
        const totalGames = allUserPlayers.reduce((sum, p) => sum + p.games, 0);
        const totalPoints = allUserPlayers.reduce((sum, p) => sum + p.points, 0);

        // Simple performance logic: rounds with positive score are "wins"
        const positiveScoreRounds = allUserPlayers.reduce((sum, p) => {
            // This is a simulation as we don't have round-by-round data
            // Assuming half of the games had a positive score for simplicity
            return sum + Math.floor(p.games / 2);
        }, 0);
        
        const performance = totalGames > 0 ? (positiveScoreRounds / totalGames) * 100 : 0;
        
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
                    <h3 className="text-2xl font-bold">Felipe</h3>
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
                <Button className="w-full mt-4" onClick={() => onNavigate('lineup')}>
                    Ver Time
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
    ];
    return (
        <div>
            <h3 className="text-xl font-bold mb-4">Acesso Rápido</h3>
            <div className="grid grid-cols-3 gap-4">
                {items.map(item => (
                    <button key={item.label} onClick={() => onNavigate(item.view)} className="flex flex-col items-center justify-center gap-3 p-3 rounded-lg bg-card hover:bg-muted transition-colors aspect-square">
                        <div className="text-primary">
                            <item.icon className="w-10 h-10" />
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
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com strava</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com garmim</a></li>
                    <li><a href="#" className="font-semibold text-secondary-foreground hover:underline">Conecte-se com a Samsung</a></li>
                </ul>
            </CardContent>
        </Card>
    )
}


export default function DashboardView({ user, players, onNavigate, onPlayerSelect, userAvatar, onAvatarChange }: DashboardViewProps) {
  return (
    <div className="dark">
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
                <p className="text-sm font-medium leading-none">Felipe</p>
                <p className="text-xs leading-none text-muted-foreground">
                  felipe@exemplo.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onNavigate('welcome')}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex justify-center gap-4">
            <Button className="rounded-lg px-8">Início</Button>
            <Button variant="ghost" className="text-primary-foreground font-semibold rounded-lg px-8">Amigos</Button>
        </div>
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
