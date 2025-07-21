
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player, PlayerStats } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card } from '../ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  canEditScouts: boolean;
  onSave: (updatedPlayers: Record<string, Player>) => void;
}

const StatItem = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex flex-col items-center">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="font-bold text-lg text-foreground">{value ?? '–'}</p>
    </div>
);

const EditableStatInput = ({ value, onChange }: { value: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <Input
    type="number"
    value={value}
    onChange={onChange}
    className="h-8 w-16 text-center bg-background border-border"
  />
);

const PlayerStatsCard = ({ player, rank, onPlayerSelect, canEditScouts, onStatChange }: { 
    player: {id: string} & Player, 
    rank: number, 
    onPlayerSelect: (playerId: string) => void,
    canEditScouts: boolean,
    onStatChange: (playerId: string, field: keyof PlayerStats, value: number) => void
}) => {
    const playerStats = player.stats || {
        wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0,
        performance: 0, points: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0
    };
    
    return (
        <Card className="bg-card shadow-sm">
            <AccordionItem value={`item-${rank}`} className="border-b-0">
                <AccordionTrigger className="p-4 hover:no-underline">
                    <div className="flex items-center gap-4 w-full">
                        <span className={cn(
                            "font-bold text-lg w-6 text-center",
                            rank === 1 && "text-amber-400",
                            rank === 2 && "text-slate-400",
                            rank === 3 && "text-amber-600"
                        )}>
                            {rank}
                        </span>
                        <Avatar onClick={(e) => { e.stopPropagation(); onPlayerSelect(player.id)}}>
                            <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" />
                            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left">
                            <p className="font-bold text-base text-foreground">{player.name}</p>
                            <p className="text-sm text-muted-foreground">{player.pos}</p>
                        </div>
                        <div className="text-right">
                             {canEditScouts ? (
                                <EditableStatInput
                                    value={player.points}
                                    onChange={(e) => onStatChange(player.id, 'points', Number(e.target.value))}
                                />
                             ) : (
                                <p className="font-extrabold text-xl text-primary">{player.points?.toFixed(1) ?? 'N/A'}</p>
                             )}
                            <p className="text-xs text-muted-foreground">Pontos</p>
                        </div>
                    </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                    <div className="bg-muted/50 dark:bg-muted/20 p-4 rounded-lg grid grid-cols-3 sm:grid-cols-4 gap-y-4 text-center">
                        {canEditScouts ? (
                            <>
                                <StatItem label="Jogos" value={player.games} />
                                <StatItem label="Gols" value={playerStats.goals} />
                                <StatItem label="Assist." value={playerStats.assists} />
                                <StatItem label="SG" value={playerStats.goalDifference} />
                                <StatItem label="CA" value={playerStats.yellowCards} />
                                <StatItem label="CV" value={playerStats.redCards} />
                            </>
                        ) : (
                            <>
                                <StatItem label="Jogos" value={player.games} />
                                <StatItem label="Vitórias" value={playerStats.wins} />
                                <StatItem label="Derrotas" value={playerStats.losses} />
                                <StatItem label="Empates" value={playerStats.draws} />
                                <StatItem label="Gols" value={playerStats.goals} />
                                <StatItem label="Assist." value={playerStats.assists} />
                                <StatItem label="SG" value={playerStats.goalDifference} />
                                <StatItem label="Aprov." value={`${playerStats.performance?.toFixed(0) ?? '0'}%`} />
                                <StatItem label="CA" value={playerStats.yellowCards} />
                                <StatItem label="CV" value={playerStats.redCards} />
                            </>
                        )}
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Card>
    );
};

export default function StatisticsView({ players, onBack, onPlayerSelect, canEditScouts, onSave }: StatisticsViewProps) {
    const [editablePlayers, setEditablePlayers] = useState<Record<string, Player>>({});

    useEffect(() => {
        // Initialize local state with data from props when the component loads or players data changes.
        setEditablePlayers(players);
    }, [players]);

    const handleStatChange = (playerId: string, field: keyof PlayerStats | 'points', value: number) => {
        setEditablePlayers(prev => {
            const playerToUpdate = prev[playerId];
            if (!playerToUpdate) return prev;

            const updatedPlayer = { ...playerToUpdate };

            if (field === 'points') {
                updatedPlayer.points = value;
            } else {
                 updatedPlayer.stats = {
                    ...(updatedPlayer.stats || { wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, performance: 0, points: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0 }),
                    [field]: value
                 };
            }
            
            return {
                ...prev,
                [playerId]: updatedPlayer
            };
        });
    };

    const handleSaveClick = () => {
        onSave(editablePlayers);
    };

    const sortedPlayers = useMemo(() => {
        return Object.entries(editablePlayers)
            .map(([id, player]) => ({...player, id}))
            .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
    }, [editablePlayers]);

    return (
        <div className={cn(canEditScouts && "pb-24")}>
            <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
                <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
                <ArrowLeft className="h-6 w-6" />
                </Button>
                <h2 className="text-xl font-bold text-center flex-1">Estatísticas</h2>
                <div className="w-9 h-9" />
            </header>

            <main className="p-4 space-y-3">
                <Accordion type="single" collapsible className="w-full space-y-2">
                    {sortedPlayers.map((player, index) => (
                        <PlayerStatsCard 
                            key={player.id} 
                            player={player} 
                            rank={index + 1} 
                            onPlayerSelect={onPlayerSelect} 
                            canEditScouts={canEditScouts}
                            onStatChange={handleStatChange}
                        />
                    ))}
                </Accordion>
            </main>

            {canEditScouts && (
                <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-30">
                    <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg" onClick={handleSaveClick}>
                        <Save className="mr-2 h-5 w-5"/>
                        Salvar Estatísticas
                    </Button>
                </div>
            )}
        </div>
    );
}
