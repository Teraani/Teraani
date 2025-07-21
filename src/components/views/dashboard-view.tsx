
"use client";

import type { View } from '@/app/page';
import type { Player, User } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Users, BarChart3, Trophy } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';

interface DashboardViewProps {
  user: User;
  players: Record<string, Player>;
  onNavigate: (view: View) => void;
  onPlayerSelect: (playerId: string) => void;
}

function PlayerSummary({ user, players, onNavigate }: { user: User, players: Record<string, Player>, onNavigate: (view: View) => void }) {
    const [playerImage, setPlayerImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPlayerImage(reader.result as string);
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
        <Card className="bg-gray-200 dark:bg-zinc-800 p-4">
            <CardContent className="p-0">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Avatar className="h-20 w-20 bg-yellow-300" onClick={handleAvatarClick}>
                            <AvatarImage src={playerImage ?? undefined} alt="Foto do Jogador" />
                            <AvatarFallback className="text-3xl text-gray-700 cursor-pointer">
                                <Upload className="h-8 w-8"/>
                            </AvatarFallback>
                        </Avatar>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Felipe</h3>
                </div>
                <div className="grid grid-cols-3 text-center mt-4">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Partidas Jogadas</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{totalGames}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pontos</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{totalPoints.toFixed(2)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Aproveitamento</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{performancePercentage}</p>
                    </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onNavigate('lineup')}>
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
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">Acesso Rápido</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                {items.map(item => (
                    <button key={item.label} onClick={() => onNavigate(item.view)} className="flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                        <div className="w-20 h-20 bg-gray-300 dark:bg-zinc-700 rounded-full flex items-center justify-center text-primary dark:text-primary">
                            <item.icon className="w-10 h-10" />
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.label}</p>
                    </button>
                ))}
            </div>
        </div>
    );
}

function ConnectSection() {
    return (
        <Card className="bg-yellow-200 dark:bg-yellow-800/50 border-none">
            <CardContent className="p-4 text-center">
                <ul className="space-y-2">
                    <li><a href="#" className="font-semibold text-gray-800 dark:text-yellow-100 hover:underline">Conecte-se com strava</a></li>
                    <li><a href="#" className="font-semibold text-gray-800 dark:text-yellow-100 hover:underline">Conecte-se com garmim</a></li>
                    <li><a href="#" className="font-semibold text-gray-800 dark:text-yellow-100 hover:underline">Conecte-se com a Samsung</a></li>
                </ul>
            </CardContent>
        </Card>
    )
}


export default function DashboardView({ user, players, onNavigate, onPlayerSelect }: DashboardViewProps) {
  return (
    <div>
      <header className="bg-white dark:bg-zinc-900 p-4 shadow-sm">
        <div className="flex justify-center gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-8">Início</Button>
            <Button variant="ghost" className="text-blue-600 font-semibold rounded-lg px-8">Amigos</Button>
        </div>
      </header>
      <div className="p-4 space-y-8">
        <PlayerSummary user={user} players={players} onNavigate={onNavigate} />
        <QuickAccess onNavigate={onNavigate} />
        <ConnectSection />
      </div>
    </div>
  );
}
