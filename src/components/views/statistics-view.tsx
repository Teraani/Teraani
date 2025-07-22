
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player, PlayerStats } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Shield, Star, Award, Footprints } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '../ui/scroll-area';

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  canEditScouts: boolean;
  onSave: (updatedPlayers: Record<string, Player>) => void;
}

type StatCategory = 'points' | 'goals' | 'assists' | 'defense';

const RankingListItem = ({ player, rank, statValue, statLabel }: {
    player: {id: string} & Player,
    rank: number,
    statValue: string | number,
    statLabel: string,
}) => (
    <Card className="bg-card shadow-sm p-3">
        <div className="flex items-center gap-4 w-full">
            <span className={cn(
                "font-bold text-lg w-6 text-center",
                rank === 1 && "text-amber-400",
                rank === 2 && "text-slate-400",
                rank === 3 && "text-amber-600"
            )}>
                {rank}
            </span>
            <Avatar>
                <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" />
                <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
                <p className="font-bold text-base text-foreground">{player.name}</p>
                <p className="text-sm text-muted-foreground">{player.team} • {player.pos}</p>
            </div>
            <div className="text-right">
                <p className="font-extrabold text-xl text-primary">{statValue}</p>
                <p className="text-xs text-muted-foreground">{statLabel}</p>
            </div>
        </div>
    </Card>
);

const RankingList = ({ players, onPlayerSelect, stat, valueKey, label }: {
    players: ({id: string} & Player)[],
    onPlayerSelect: (playerId: string) => void,
    stat: 'points' | 'goals' | 'assists' | 'saves',
    valueKey?: keyof PlayerStats,
    label: string,
}) => {
    
    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            if (stat === 'points') return (b.points ?? 0) - (a.points ?? 0);
            if (stat === 'saves') return (a.stats?.goalsAgainst ?? 999) - (b.stats?.goalsAgainst ?? 999);
            return (b.stats?.[stat] ?? 0) - (a.stats?.[stat] ?? 0);
        });
    }, [players, stat]);

    const getStatValue = (player: Player) => {
        if (stat === 'points') return player.points.toFixed(1);
        if (stat === 'saves') return player.stats?.goalsAgainst ?? 'N/A';
        return player.stats?.[stat] ?? 'N/A';
    }

    return (
        <div className="space-y-2">
            {sortedPlayers.map((p, index) => (
                <div key={p.id} onClick={() => onPlayerSelect(p.id)} className="cursor-pointer">
                    <RankingListItem 
                        player={p}
                        rank={index + 1}
                        statValue={getStatValue(p)}
                        statLabel={label}
                    />
                </div>
            ))}
        </div>
    );
};

export default function StatisticsView({ players, onBack, onPlayerSelect, canEditScouts, onSave }: StatisticsViewProps) {
    
    const allPlayers = useMemo(() => {
        if (!players) return [];
        return Object.entries(players).map(([id, player]) => ({...player, id}));
    }, [players]);

    const goalkeepers = useMemo(() => {
        return allPlayers.filter(p => p.pos === 'GOL');
    }, [allPlayers]);

    return (
        <div className={cn(canEditScouts && "pb-40")}>
            <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
                <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-xl font-bold text-center flex-1">Estatísticas</h2>
                <div className="w-9 h-9" />
            </header>

            <main className="p-4">
                 <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 bg-muted mb-4">
                        <TabsTrigger value="general"><Star className="w-4 h-4 mr-2"/> Geral</TabsTrigger>
                        <TabsTrigger value="scorers"><Award className="w-4 h-4 mr-2"/>Gols</TabsTrigger>
                        <TabsTrigger value="assists"><Footprints className="w-4 h-4 mr-2"/> Assists</TabsTrigger>
                        <TabsTrigger value="defense"><Shield className="w-4 h-4 mr-2"/>Defesa</TabsTrigger>
                    </TabsList>
                    
                    <ScrollArea className="h-[calc(100vh-200px)]">
                        <TabsContent value="general">
                            <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="points" label="Pontos"/>
                        </TabsContent>
                        <TabsContent value="scorers">
                            <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="goals" label="Gols" />
                        </TabsContent>
                        <TabsContent value="assists">
                           <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="assists" label="Assist." />
                        </TabsContent>
                        <TabsContent value="defense">
                           <RankingList players={goalkeepers} onPlayerSelect={onPlayerSelect} stat="saves" label="Gols Sofridos"/>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </main>
        </div>
    );
}
