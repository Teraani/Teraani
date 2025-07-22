

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

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
  onPlayerSelect: (playerId: string) => void;
  canEditScouts: boolean;
  onSave: (updatedPlayers: Record<string, Player>, updatedScalers?: Record<string, Ranking>, updatedGoalies?: Record<string, GoalieRanking>) => void;
}

const RankingListItem = ({ player, rank, statValue, statLabel, onPlayerSelect }: {
    player: {id: string} & (Player | Ranking | GoalieRanking),
    rank: number,
    statValue: string | number,
    statLabel: string,
    onPlayerSelect: (id: string) => void,
}) => (
     <div className="flex items-center gap-4 w-full" onClick={() => 'pos' in player && onPlayerSelect(player.id)}>
        <span className={cn(
            "font-bold text-lg w-6 text-center",
            rank === 1 && "text-amber-400",
            rank === 2 && "text-slate-400",
            rank === 3 && "text-amber-600"
        )}>
            {rank}
        </span>
        <Avatar>
            <AvatarImage src={'img' in player ? player.img : undefined} alt={player.name} data-ai-hint="player portrait" />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 text-left">
            <p className="font-bold text-base text-foreground">{player.name}</p>
            {'pos' in player && <p className="text-sm text-muted-foreground">{player.pos}</p>}
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
};

const ScalerStatsEditor = ({ scaler, canEditScouts, onScalerChange }: { scaler: Ranking, canEditScouts: boolean, onScalerChange: (updatedScaler: Ranking) => void}) => (
    <div className="p-4 bg-muted/30 rounded-b-lg">
        <div className="grid grid-cols-2 gap-4">
            <EditableStat label="Jogos" value={scaler.games} onChange={(v) => onScalerChange({...scaler, games: v})} disabled={canEditScouts} />
            <EditableStat label="Diferença de Resultados" value={scaler.resultsDifference} onChange={(v) => onScalerChange({...scaler, resultsDifference: v})} disabled={canEditScouts} />
        </div>
    </div>
);

const GoalieStatsEditor = ({ goalie, canEditScouts, onGoalieChange }: { goalie: GoalieRanking, canEditScouts: boolean, onGoalieChange: (updatedGoalie: GoalieRanking) => void}) => (
    <div className="p-4 bg-muted/30 rounded-b-lg">
        <div className="grid grid-cols-2 gap-4">
            <EditableStat label="Jogos" value={goalie.games} onChange={(v) => onGoalieChange({...goalie, games: v})} disabled={canEditScouts} />
            <EditableStat label="Gols Sofridos" value={goalie.goalsConceded} onChange={(v) => onGoalieChange({...goalie, goalsConceded: v})} disabled={canEditScouts} />
        </div>
    </div>
);


const GenericRankingList = ({ items, onPlayerSelect, stat, label, canEditScouts, onItemsChange, type }: {
    items: any[],
    onPlayerSelect: (playerId: string) => void,
    stat: string,
    label: string,
    canEditScouts: boolean,
    onItemsChange: (itemId: string, updatedItem: any) => void,
    type: 'player' | 'scaler' | 'goalie'
}) => {
    
    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            if (type === 'player') {
                 if (stat === 'points') return (b.points ?? 0) - (a.points ?? 0);
                 if (stat === 'avgGoals') {
                    const avgA = a.games > 0 ? (a.stats?.goals ?? 0) / a.games : 0;
                    const avgB = b.games > 0 ? (b.stats?.goals ?? 0) / b.games : 0;
                    return avgB - avgA;
                 }
                 const statKey = stat as keyof PlayerStats;
                 return (b.stats?.[statKey] ?? 0) - (a.stats?.[statKey] ?? 0);
            }
            if (type === 'scaler') {
                 return b.avgDifference - a.avgDifference;
            }
             if (type === 'goalie') {
                 return a.avgGoalsConceded - b.avgGoalsConceded;
            }
            return 0;
        });
    }, [items, stat, type]);

    const getStatValue = (item: any) => {
       if (type === 'player') {
            if (stat === 'points') return item.points.toFixed(1);
            if (stat === 'avgGoals') return item.games > 0 ? ((item.stats?.goals ?? 0) / item.games).toFixed(2) : '0.00';
            const statKey = stat as keyof PlayerStats;
            return item.stats?.[statKey] ?? 0;
       }
       if (type === 'scaler') return item.avgDifference.toFixed(2);
       if (type === 'goalie') return item.avgGoalsConceded.toFixed(2);
       return '';
    };

    return (
        <Accordion type="single" collapsible className="w-full space-y-2">
            {sortedItems.map((item, index) => (
                <AccordionItem value={item.id} key={item.id} className="border-b-0">
                    <Card className="bg-card shadow-sm p-3 rounded-lg overflow-hidden">
                         <AccordionTrigger className="p-0 hover:no-underline">
                             <RankingListItem 
                                player={item}
                                rank={index + 1}
                                statValue={getStatValue(item)}
                                statLabel={label}
                                onPlayerSelect={onPlayerSelect}
                            />
                         </AccordionTrigger>
                         <AccordionContent>
                            {type === 'player' && <PlayerStatsEditor player={item} canEditScouts={canEditScouts} onPlayerChange={(updatedData) => onItemsChange(item.id, updatedData)} />}
                            {type === 'scaler' && <ScalerStatsEditor scaler={item} canEditScouts={canEditScouts} onScalerChange={(updatedData) => onItemsChange(item.id, updatedData)} />}
                            {type === 'goalie' && <GoalieStatsEditor goalie={item} canEditScouts={canEditScouts} onGoalieChange={(updatedData) => onItemsChange(item.id, updatedData)} />}
                         </AccordionContent>
                    </Card>
                </AccordionItem>
            ))}
        </Accordion>
    );
};


export default function StatisticsView({ players, onBack, onPlayerSelect, canEditScouts, onSave: onSaveProp }: StatisticsViewProps) {
    const [editablePlayers, setEditablePlayers] = useState<Record<string, Player>>({});
    const [editableScalers, setEditableScalers] = useState<Record<string, Ranking>>({});
    const [editableGoalies, setEditableGoalies] = useState<Record<string, GoalieRanking>>({});

    const [hasChanges, setHasChanges] = useState(false);
    
    useEffect(() => {
        setEditablePlayers(JSON.parse(JSON.stringify(players)));
        setEditableScalers(JSON.parse(JSON.stringify(data.scalersRanking)));
        setEditableGoalies(JSON.parse(JSON.stringify(data.goalieRanking)));
        setHasChanges(false);
    }, [players]);

    const handlePlayerChange = (playerId: string, updatedData: Player) => {
        setHasChanges(true);
        setEditablePlayers(prev => ({ ...prev, [playerId]: updatedData }));
    };

    const handleScalerChange = (scalerId: string, updatedData: Ranking) => {
        const avgDifference = updatedData.games > 0 ? updatedData.resultsDifference / updatedData.games : 0;
        setHasChanges(true);
        setEditableScalers(prev => ({ ...prev, [scalerId]: {...updatedData, avgDifference} }));
    };

    const handleGoalieChange = (goalieId: string, updatedData: GoalieRanking) => {
        const avgGoalsConceded = updatedData.games > 0 ? updatedData.goalsConceded / updatedData.games : 0;
        setHasChanges(true);
        setEditableGoalies(prev => ({ ...prev, [goalieId]: {...updatedData, avgGoalsConceded} }));
    };

    const handleSaveClick = () => {
        onSaveProp(editablePlayers, editableScalers, editableGoalies);
        setHasChanges(false);
    };

    const allPlayersMemo = useMemo(() => Object.values(editablePlayers), [editablePlayers]);
    const scalersMemo = useMemo(() => Object.values(editableScalers), [editableScalers]);
    const goaliesMemo = useMemo(() => Object.values(editableGoalies), [editableGoalies]);

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
                        <TabsList className="grid grid-cols-1 md:grid-cols-6 h-auto" style={{ gridTemplateColumns: 'repeat(6, minmax(120px, 1fr))' }}>
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
                            <GenericRankingList items={allPlayersMemo} onPlayerSelect={onPlayerSelect} stat="points" label="Pontos" canEditScouts={canEditScouts} onItemsChange={handlePlayerChange} type="player" />
                        </TabsContent>
                        <TabsContent value="scorers">
                            <GenericRankingList items={allPlayersMemo} onPlayerSelect={onPlayerSelect} stat="goals" label="Gols" canEditScouts={canEditScouts} onItemsChange={handlePlayerChange} type="player" />
                        </TabsContent>
                        <TabsContent value="assists">
                           <GenericRankingList items={allPlayersMemo} onPlayerSelect={onPlayerSelect} stat="assists" label="Assist." canEditScouts={canEditScouts} onItemsChange={handlePlayerChange} type="player" />
                        </TabsContent>
                        <TabsContent value="avgGoals">
                           <GenericRankingList items={allPlayersMemo} onPlayerSelect={onPlayerSelect} stat="avgGoals" label="Média" canEditScouts={canEditScouts} onItemsChange={handlePlayerChange} type="player" />
                        </TabsContent>
                         <TabsContent value="scalers">
                           <GenericRankingList items={scalersMemo} onPlayerSelect={onPlayerSelect} stat="avgDifference" label="Diferença Média" canEditScouts={canEditScouts} onItemsChange={handleScalerChange} type="scaler" />
                        </TabsContent>
                        <TabsContent value="defense">
                           <GenericRankingList items={goaliesMemo} onPlayerSelect={onPlayerSelect} stat="avgGoalsConceded" label="Média Gols Sofridos" canEditScouts={canEditScouts} onItemsChange={handleGoalieChange} type="goalie" />
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

