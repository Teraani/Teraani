
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { Player, PlayerStats, Ranking, GoalieRanking } from '@/lib/data';
import { data } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Shield, Star, Award, Footprints, Target, Percent, Trophy } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Card, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from '../ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table"

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  canEditScouts: boolean;
  onSave: (updatedPlayers: Record<string, Player>) => void;
}

const RankingListItem = ({ player, rank, statValue, statLabel, onPlayerSelect }: {
    player: {id: string} & Player,
    rank: number,
    statValue: string | number,
    statLabel: string,
    onPlayerSelect: (id: string) => void,
}) => (
     <div className="flex items-center gap-4 w-full" onClick={() => onPlayerSelect(player.id)}>
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
);


const EditableStat = ({ label, value, onChange, disabled }: { label: string, value: number, onChange: (value: number) => void, disabled: boolean }) => (
    <div className="flex-1">
        <Label htmlFor={`${label}-${value}`} className="text-xs text-muted-foreground">{label}</Label>
        <Input
            id={`${label}-${value}`}
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="h-8 text-center bg-background"
            disabled={!disabled}
            step="0.1"
        />
    </div>
);

const PlayerStatsEditor = ({ player, canEditScouts, onPlayerChange }: { player: Player, canEditScouts: boolean, onPlayerChange: (updatedPlayer: Player) => void}) => {
    
    const handleStatChange = (statName: keyof Player, value: number) => {
        onPlayerChange({ ...player, [statName]: value });
    };

    const handleSubStatChange = (statName: keyof PlayerStats, value: number) => {
        const newStats = { ...(player.stats || {}), [statName]: value };
        onPlayerChange({ ...player, stats: newStats as PlayerStats });
    };

    return (
        <div className="p-4 bg-muted/30 rounded-b-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <EditableStat label="Pontos" value={player.points} onChange={(v) => handleStatChange('points', v)} disabled={canEditScouts} />
                <EditableStat label="Jogos" value={player.games} onChange={(v) => handleStatChange('games', v)} disabled={canEditScouts} />
                <EditableStat label="Gols" value={player.stats?.goals ?? 0} onChange={(v) => handleSubStatChange('goals', v)} disabled={canEditScouts} />
                <EditableStat label="Assistências" value={player.stats?.assists ?? 0} onChange={(v) => handleSubStatChange('assists', v)} disabled={canEditScouts} />
                <EditableStat label="Cartões Am." value={player.stats?.yellowCards ?? 0} onChange={(v) => handleSubStatChange('yellowCards', v)} disabled={canEditScouts} />
                <EditableStat label="Cartões Ver." value={player.stats?.redCards ?? 0} onChange={(v) => handleSubStatChange('redCards', v)} disabled={canEditScouts} />
                {player.pos === 'GOL' && (
                  <EditableStat label="Gols Sofridos" value={player.stats?.goalsAgainst ?? 0} onChange={(v) => handleSubStatChange('goalsAgainst', v)} disabled={canEditScouts} />
                )}
            </div>
        </div>
    );
}

const RankingList = ({ players, onPlayerSelect, stat, label, canEditScouts, onPlayersChange }: {
    players: ({id: string} & Player)[],
    onPlayerSelect: (playerId: string) => void,
    stat: 'points' | 'goals' | 'assists' | 'saves' | 'avgGoals',
    label: string,
    canEditScouts: boolean,
    onPlayersChange: (playerId: string, updatedPlayer: Player) => void
}) => {
    
    const sortedPlayers = useMemo(() => {
        return [...players].sort((a, b) => {
            if (stat === 'points') return (b.points ?? 0) - (a.points ?? 0);
            if (stat === 'saves') return (a.stats?.goalsAgainst ?? 999) - (b.stats?.goalsAgainst ?? 999);
            if (stat === 'avgGoals') {
                 const avgA = a.games > 0 ? (a.stats?.goals ?? 0) / a.games : 0;
                 const avgB = b.games > 0 ? (b.stats?.goals ?? 0) / b.games : 0;
                 return avgB - avgA;
            }
            const statKey = stat as keyof PlayerStats;
            return (b.stats?.[statKey] ?? 0) - (a.stats?.[statKey] ?? 0);
        });
    }, [players, stat]);

    const getStatValue = (player: Player) => {
        if (stat === 'points') return player.points.toFixed(1);
        if (stat === 'saves') return player.stats?.goalsAgainst ?? 0;
        if (stat === 'avgGoals') {
            return player.games > 0 ? ((player.stats?.goals ?? 0) / player.games).toFixed(2) : '0.00';
        }
        const statKey = stat as keyof PlayerStats;
        return player.stats?.[statKey] ?? 0;
    }

    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {sortedPlayers.map((p, index) => (
                <AccordionItem value={p.id} key={p.id} className="border-b-0">
                    <Card className="bg-card shadow-sm p-3 rounded-lg overflow-hidden">
                         <AccordionTrigger className="p-0 hover:no-underline">
                             <RankingListItem 
                                player={p}
                                rank={index + 1}
                                statValue={getStatValue(p)}
                                statLabel={label}
                                onPlayerSelect={onPlayerSelect}
                            />
                         </AccordionTrigger>
                         <AccordionContent>
                             <PlayerStatsEditor 
                                player={p} 
                                canEditScouts={canEditScouts} 
                                onPlayerChange={(updatedData) => onPlayersChange(p.id, updatedData)} 
                             />
                         </AccordionContent>
                    </Card>
                </AccordionItem>
            ))}
        </Accordion>
    );
};

const StaticRankingTable = ({ title, data, headers }: { title: string, data: (Ranking | GoalieRanking)[], headers: string[] }) => (
    <Card>
        <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-4">{title}</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        {headers.map(header => <TableHead key={header}>{header}</TableHead>)}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{index + 1}º</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.games}</TableCell>
                            {'goalsConceded' in item ? (
                                <>
                                    <TableCell>{item.goalsConceded}</TableCell>
                                    <TableCell>{item.avgGoalsConceded.toFixed(2)}</TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell>{item.resultsDifference}</TableCell>
                                    <TableCell>{item.avgDifference.toFixed(2)}</TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
);


export default function StatisticsView({ players, onBack, onPlayerSelect, canEditScouts, onSave }: StatisticsViewProps) {
    const [editablePlayers, setEditablePlayers] = useState<Record<string, Player>>({});
    const [hasChanges, setHasChanges] = useState(false);
    
    useEffect(() => {
        setEditablePlayers(JSON.parse(JSON.stringify(players)));
        setHasChanges(false);
    }, [players]);

    const handlePlayerChange = (playerId: string, updatedData: Player) => {
        setHasChanges(true);
        setEditablePlayers(prev => ({
            ...prev,
            [playerId]: updatedData,
        }));
    };

    const handleSaveClick = () => {
        onSave(editablePlayers);
        setHasChanges(false);
    };

    const allPlayers = useMemo(() => {
        if (!editablePlayers) return [];
        return Object.entries(editablePlayers).map(([id, player]) => ({...player, id}));
    }, [editablePlayers]);

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
                    <ScrollArea className="w-full whitespace-nowrap pb-4">
                        <TabsList className="grid grid-cols-1 md:grid-cols-6 h-auto" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))' }}>
                            <TabsTrigger value="general"><Star className="w-4 h-4 mr-1"/>Geral</TabsTrigger>
                            <TabsTrigger value="scorers"><Target className="w-4 h-4 mr-1"/>Artilharia</TabsTrigger>
                            <TabsTrigger value="assists"><Footprints className="w-4 h-4 mr-1"/>Assists</TabsTrigger>
                            <TabsTrigger value="avgGoals"><Percent className="w-4 h-4 mr-1"/>Média Gols</TabsTrigger>
                            <TabsTrigger value="scalers"><Trophy className="w-4 h-4 mr-1"/>Escalantes</TabsTrigger>
                            <TabsTrigger value="defense"><Shield className="w-4 h-4 mr-1"/>Goleiros</TabsTrigger>
                        </TabsList>
                    </ScrollArea>
                    
                    <ScrollArea className="h-[calc(100vh-220px)] pr-2">
                        <TabsContent value="general">
                            <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="points" label="Pontos" canEditScouts={canEditScouts} onPlayersChange={handlePlayerChange} />
                        </TabsContent>
                        <TabsContent value="scorers">
                            <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="goals" label="Gols" canEditScouts={canEditScouts} onPlayersChange={handlePlayerChange} />
                        </TabsContent>
                        <TabsContent value="assists">
                           <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="assists" label="Assist." canEditScouts={canEditScouts} onPlayersChange={handlePlayerChange} />
                        </TabsContent>
                        <TabsContent value="avgGoals">
                           <RankingList players={allPlayers} onPlayerSelect={onPlayerSelect} stat="avgGoals" label="Média" canEditScouts={canEditScouts} onPlayersChange={handlePlayerChange} />
                        </TabsContent>
                         <TabsContent value="scalers">
                           <StaticRankingTable 
                             title="Ranking Melhores Escalantes 2025" 
                             data={data.scalersRanking} 
                             headers={['Posição', 'Nome', 'Jogos', 'Diferença Resultados', 'Diferença Média por Jogo']}
                            />
                        </TabsContent>
                        <TabsContent value="defense">
                           <StaticRankingTable 
                             title="Goleiro Menos Vazado 2025"
                             data={data.goalieRanking}
                             headers={['Posição', 'Nome', 'Jogos', 'Gols Sofridos', 'Média de Gol Sofrido por Jogo']}
                           />
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </main>
            {canEditScouts && hasChanges && (
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
