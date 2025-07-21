
"use client";

import type { View } from '@/app/page';
import type { Player, User } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Circle, Upload } from 'lucide-react';
import React, { useState, useRef } from 'react';

interface DashboardViewProps {
  user: User;
  players: Record<string, Player>;
  onNavigate: (view: View) => void;
  onPlayerSelect: (playerId: string) => void;
}

function PlayerSummary({ onNavigate }: { onNavigate: (view: View) => void }) {
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
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">10</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Pontos</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">10</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Aproveitamento</p>
                        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">100%</p>
                    </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={() => onNavigate('lineup')}>
                    Ver Time
                </Button>
            </CardContent>
        </Card>
    );
}

function QuickAccess() {
    const items = [
        { label: "Parciais gerais" },
        { label: "Parcial dos amigos" },
        { label: "Resultado dos jogos" },
    ];
    return (
        <div>
            <h3 className="text-xl font-bold text-center mb-4 text-gray-800 dark:text-gray-100">Acesso Rápido</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
                {items.map(item => (
                    <div key={item.label} className="flex flex-col items-center gap-2">
                        <div className="w-20 h-20 bg-gray-300 dark:bg-zinc-700 rounded-full flex items-center justify-center">
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.label}</p>
                    </div>
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
        <PlayerSummary onNavigate={onNavigate} />
        <QuickAccess />
        <ConnectSection />
      </div>
    </div>
  );
}
