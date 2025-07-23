

import { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import { Clock, Trash2, LogOut, Users, Settings, Wand2, Share2, Loader2, UserX, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { View, AddPlayerSlot, Modality } from '@/app/page';
import { cn } from '@/lib/utils';
import AddPlayerButton from '@/components/lineup/add-player-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { generateBalancedTeam } from '@/ai/flows/suggest-player-replacements';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"


interface LineupViewProps {
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
  onNavigate: (view: View) => void;
  onAddPlayer: (slot: AddPlayerSlot) => void;
  currentUser: User;
  canEdit: boolean;
  team1Lineup: (string | null)[];
  setTeam1Lineup: (lineup: (string | null)[]) => void;
  team1Reserves: (string | null)[];
  setTeam1Reserves: (reserves: (string | null)[]) => void;
  team2Lineup: (string | null)[];
  setTeam2Lineup: (lineup: (string | null)[]) => void;
  team2Reserves: (string | null)[];
  setTeam2Reserves: (reserves: (string | null)[]) => void;
  onSaveLineups: () => void;
  lineupsSaved: boolean;
  modality: Modality | null;
}

type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '3-2-2' | '2-3-1' | '1-2-2';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

interface PlayerActionState {
  playerId: string;
  isReserve: boolean;
  index: number;
  team: 'team1' | 'team2';
}

const getFormationsForModality = (modality: Modality | null): Formation[] => {
  switch (modality) {
    case 'society':
      return ['3-2-2'];
    case 'futsal':
      return ['1-2-2'];
    case 'campo':
    default:
      return ['4-3-3', '4-4-2', '3-5-2'];
  }
};


const ShirtColorDropdown = ({ color, onColorChange, disabled }: { color: ShirtColor, onColorChange: (color: ShirtColor) => void, disabled: boolean }) => {
    const colors: { value: ShirtColor, label: string }[] = [
        { value: 'verde', label: 'Verde' },
        { value: 'amarelo', label: 'Amarelo' },
        { value: 'preto', label: 'Preto' },
        { value: 'vermelho', label: 'Vermelho' },
        { value: 'branco', label: 'Branco' },
    ];
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" disabled={disabled}>
                    Cor: <span className="capitalize ml-2">{color}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {colors.map(c => (
                    <DropdownMenuItem key={c.value} onClick={() => onColorChange(c.value)}>
                        {c.label}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};


const TeamDisplay = ({
  lineup,
  reserves,
  players,
  formation,
  shirtColor,
  onPlayerCardClick,
  onAddPlayer,
  canEdit,
  teamIdentifier,
  modality
}: {
  lineup: (string | null)[];
  reserves: (string | null)[];
  players: Record<string, Player>;
  formation: Formation;
  shirtColor: ShirtColor;
  onPlayerCardClick: (state: PlayerActionState) => void;
  onAddPlayer: (position: Player['pos'] | 'RES', index: number) => void;
  canEdit: boolean;
  teamIdentifier: 'team1' | 'team2';
  modality: Modality | null;
}) => {
    
  const lineupPlayers = lineup.map(id => id ? { ...players[id], id } : null);
  const reservePlayers = reserves.map(id => id ? { ...players[id], id } : null);
  
  const { attackers, midfielders, defenders, goalkeeper, atkCount, midCount, defCount } = useMemo(() => {
    const formationParts = formation.split('-').map(Number);
    let parsedDef = 0, parsedMid = 0, parsedAtk = 0;

    if (modality === 'campo' && formationParts.length === 3) {
        [parsedDef, parsedMid, parsedAtk] = formationParts;
    } else if (modality === 'society' && formationParts.length === 3) { // 3-2-2
        [parsedDef, parsedMid, parsedAtk] = [formationParts[0], formationParts[1], formationParts[2]];
    } else if (modality === 'futsal' && formationParts.length === 3) { // 1-2-2
        [parsedDef, parsedMid, parsedAtk] = [formationParts[0], formationParts[1], formationParts[2]];
    } else {
        // Fallback for default or incorrect formation mapping
        if(lineupPlayers.length === 11) [parsedDef, parsedMid, parsedAtk] = [4,3,3];
        if(lineupPlayers.length === 8) [parsedDef, parsedMid, parsedAtk] = [3,2,2];
        if(lineupPlayers.length === 6) [parsedDef, parsedMid, parsedAtk] = [1,2,2];
    }
    
    let playerIndex = 0;
    
    const assignedAttackers = lineupPlayers.slice(playerIndex, playerIndex + parsedAtk);
    playerIndex += parsedAtk;
    const assignedMidfielders = lineupPlayers.slice(playerIndex, playerIndex + parsedMid);
    playerIndex += parsedMid;
    const assignedDefenders = lineupPlayers.slice(playerIndex, playerIndex + parsedDef);
    playerIndex += parsedDef;
    const assignedGoalkeeper = lineupPlayers.slice(playerIndex, playerIndex + 1);
    
    return { 
        attackers: assignedAttackers, 
        midfielders: assignedMidfielders, 
        defenders: assignedDefenders, 
        goalkeeper: assignedGoalkeeper,
        atkCount: parsedAtk,
        midCount: parsedMid,
        defCount: parsedDef,
    };
  }, [lineupPlayers, formation, modality]);


  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string } & Player) | null)[], position: Player['pos'], startIndex: number) => {
    if (count === 0) return null;
    return (
        <div className="flex justify-around z-10 w-full">
            {Array.from({ length: count }).map((_, i) => {
                const player = assignedPlayers[i];
                const slotIndex = startIndex + i;
                if (player) {
                    return <PlayerCard key={`${teamIdentifier}-${player.id}-${slotIndex}`} player={player} onPlayerSelect={() => onPlayerCardClick({ playerId: player.id, isReserve: false, index: slotIndex, team: teamIdentifier })} shirtColor={shirtColor} />;
                } else if (canEdit) {
                    return <AddPlayerButton key={`add-${teamIdentifier}-${position}-${slotIndex}`} onClick={() => onAddPlayer(position, slotIndex)} />;
                } else {
                    return <div key={`empty-${teamIdentifier}-${position}-${slotIndex}`} className="w-20 h-28" />;
                }
            })}
        </div>
    );
  };

  const renderReserves = () => (
    <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: reservePlayers.length }).map((_, i) => {
            const player = reservePlayers[i];
            if (player) {
                return <PlayerCard key={`${teamIdentifier}-res-${player.id}-${i}`} player={player} onPlayerSelect={() => onPlayerCardClick({ playerId: player.id, isReserve: true, index: i, team: teamIdentifier })} isReserve />;
            } else if (canEdit) {
                return <AddPlayerButton key={`add-${teamIdentifier}-RES-${i}`} onClick={() => onAddPlayer('RES', i)} />;
            } else {
                return <div key={`empty-${teamIdentifier}-RES-${i}`} className="w-20 h-28" />;
            }
        })}
    </div>
  );

  return (
    <div className="space-y-4">
        <Pitch>
            {renderPlayerRow(atkCount, attackers, 'ATA', 0)}
            {renderPlayerRow(midCount, midfielders, 'MEI', atkCount)}
            {renderPlayerRow(defCount, defenders, 'ZAG', atkCount + midCount)}
            {renderPlayerRow(1, goalkeeper, 'GOL', atkCount + midCount + defCount)}
        </Pitch>
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-center text-foreground">Reservas</h3>
            {renderReserves()}
        </div>
    </div>
  );
};


export default function LineupView(props: LineupViewProps) {
  const { 
    players, onPlayerSelect, onNavigate, onAddPlayer,
    currentUser, canEdit,
    team1Lineup, setTeam1Lineup, team1Reserves, setTeam1Reserves,
    team2Lineup, setTeam2Lineup, team2Reserves, setTeam2Reserves,
    onSaveLineups, lineupsSaved, modality
  } = props;
    
  const availableFormations = useMemo(() => getFormationsForModality(modality), [modality]);
  const [formation, setFormation] = useState<Formation>(availableFormations[0]);
  
  useEffect(() => {
    setFormation(getFormationsForModality(modality)[0]);
  }, [modality]);


  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('verde');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('amarelo');
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('team1');
  const [isBalancing, setIsBalancing] = useState(false);
  const { toast } = useToast();
  const [playerActionState, setPlayerActionState] = useState<PlayerActionState | null>(null);

  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getDay();
      const hour = now.getHours();
      setIsMarketOpen(!(day === 4 && hour >= 18));
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); 
    return () => clearInterval(interval);
  }, []);

  const handlePlayerCardClick = (state: PlayerActionState) => {
    if (!canEdit) {
      onPlayerSelect(state.playerId);
      return;
    }
    setPlayerActionState(state);
  };

  const handleRemovePlayer = () => {
    if (!playerActionState) return;

    const { team, isReserve, index } = playerActionState;

    const lineupSetters = {
      team1: { lineup: setTeam1Lineup, reserves: setTeam1Reserves },
      team2: { lineup: setTeam2Lineup, reserves: setTeam2Reserves },
    };
    
    const lineups = {
        team1: { lineup: team1Lineup, reserves: team1Reserves },
        team2: { lineup: team2Lineup, reserves: team2Reserves },
    }

    const { lineup, reserves } = lineups[team];
    const { lineup: setLineup, reserves: setReserves } = lineupSetters[team];

    if (isReserve) {
        const newReserves = [...reserves];
        newReserves[index] = null;
        setReserves(newReserves);
    } else {
        const newLineup = [...lineup];
        newLineup[index] = null;
        setLineup(newLineup);
    }
    
    setPlayerActionState(null);
  };
  
  const handleClearLineup = (team: 'team1' | 'team2') => {
    const { lineup, reserves } = getFormationsForModality(modality);
    if (team === 'team1') {
        setTeam1Lineup(Array(team1Lineup.length).fill(null));
        setTeam1Reserves(Array(team1Reserves.length).fill(null));
    } else {
        setTeam2Lineup(Array(team2Lineup.length).fill(null));
        setTeam2Reserves(Array(team2Reserves.length).fill(null));
    }
  };
  
  const handleClearReserves = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setTeam1Reserves(Array(team1Reserves.length).fill(null));
    } else {
      setTeam2Reserves(Array(team2Reserves.length).fill(null));
    }
  };

  const handleBalanceTeams = async () => {
    setIsBalancing(true);
    try {
        const team1Result = await generateBalancedTeam({
            availablePlayers: players,
            teamBudget: 150,
        });

        const remainingPlayers = { ...players };
        team1Result.lineup.forEach(id => delete remainingPlayers[id]);

        const team2Result = await generateBalancedTeam({
            availablePlayers: remainingPlayers,
            teamBudget: 150,
        });

        const newTeam1Lineup = Array(team1Lineup.length).fill(null);
        team1Result.lineup.slice(0, team1Lineup.length).forEach((id, i) => newTeam1Lineup[i] = id);
        
        const newTeam2Lineup = Array(team2Lineup.length).fill(null);
        team2Result.lineup.slice(0, team2Lineup.length).forEach((id, i) => newTeam2Lineup[i] = id);

        setTeam1Lineup(newTeam1Lineup);
        setTeam1Reserves(Array(team1Reserves.length).fill(null));
        setTeam2Lineup(newTeam2Lineup);
        setTeam2Reserves(Array(team2Reserves.length).fill(null));
        
        toast({
            title: "Times Balanceados!",
            description: "A IA gerou duas equipes equilibradas para o confronto.",
        });

    } catch (error) {
        console.error("Error balancing teams:", error);
        toast({
            title: "Erro ao Balancear",
            description: "Não foi possível gerar os times. Tente novamente.",
            variant: "destructive",
        });
    } finally {
        setIsBalancing(false);
    }
  };

  const handleAddPlayerForTeam = (team: 'team1' | 'team2') => (position: Player['pos'] | 'RES', index: number) => {
    onAddPlayer({ position, index, team });
  };
  
  const team1Score = team1Lineup.reduce((sum, id) => sum + (id ? players[id]?.points ?? 0 : 0), 0);
  const team2Score = team2Lineup.reduce((sum, id) => sum + (id ? players[id]?.points ?? 0 : 0), 0);
  
  const handleShare = () => {
    const getTeamText = (teamName: string, lineup: (string | null)[], reserves: (string | null)[]) => {
      let text = `*${teamName}*\n\n`;
      text += "*Titulares:*\n";
      lineup.forEach((id, index) => {
        if (id && players[id]) {
          text += `${index + 1}. ${players[id].name} (${players[id].pos})\n`;
        }
      });
      text += "\n*Reservas:*\n";
      reserves.forEach((id, index) => {
        if (id && players[id]) {
          text += `${index + 1}. ${players[id].name} (${players[id].pos})\n`;
        }
      });
      return text;
    };

    const team1Text = getTeamText('TIME 1', team1Lineup, team1Reserves);
    const team2Text = getTeamText('TIME 2', team2Lineup, team2Reserves);
    
    const fullMessage = `🔥 *ESCALAÇÃO DA RODADA - AMISTOSOS FC* 🔥\n\n${team1Text}\n-----------------\n\n${team2Text}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(fullMessage)}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const editorView = (
     <>
        <Card>
            <CardHeader>
                <CardTitle>{canEdit ? "Editor da Rodada" : "Times da Rodada"}</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="team1">Time 1</TabsTrigger>
                        <TabsTrigger value="team2">Time 2</TabsTrigger>
                    </TabsList>
                    <TabsContent value="team1" className="mt-4">
                        {canEdit && (
                            <div className="flex justify-between items-center mb-4">
                               <ShirtColorDropdown color={team1ShirtColor} onColorChange={setTeam1ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={() => handleClearLineup('team1')} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 1
                                </Button>
                            </div>
                        )}
                        <TeamDisplay
                            teamIdentifier="team1"
                            lineup={team1Lineup}
                            reserves={team1Reserves}
                            players={players}
                            formation={formation}
                            shirtColor={team1ShirtColor}
                            onPlayerCardClick={handlePlayerCardClick}
                            onAddPlayer={handleAddPlayerForTeam('team1')}
                            canEdit={canEdit}
                            modality={modality}
                        />
                    </TabsContent>
                    <TabsContent value="team2" className="mt-4">
                        {canEdit && (
                            <div className="flex justify-between items-center mb-4">
                                <ShirtColorDropdown color={team2ShirtColor} onColorChange={setTeam2ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={() => handleClearLineup('team2')} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 2
                                </Button>
                            </div>
                        )}
                        <TeamDisplay
                            teamIdentifier="team2"
                            lineup={team2Lineup}
                            reserves={team2Reserves}
                            players={players}
                            formation={formation}
                            shirtColor={team2ShirtColor}
                            onPlayerCardClick={handlePlayerCardClick}
                            onAddPlayer={handleAddPlayerForTeam('team2')}
                            canEdit={canEdit}
                            modality={modality}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
        {canEdit && (
            <div className="mt-4 flex flex-col gap-2">
                <Button onClick={handleBalanceTeams} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isBalancing}>
                    {isBalancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isBalancing ? 'Balanceando...' : 'Balancear Times'}
                </Button>
            </div>
        )}
     </>
  );

  return (
    <div>
      <AlertDialog open={!!playerActionState} onOpenChange={(open) => !open && setPlayerActionState(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{playerActionState && players[playerActionState.playerId]?.name}</AlertDialogTitle>
            <AlertDialogDescription>
              O que você gostaria de fazer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2">
            <Button variant="outline" onClick={() => { onPlayerSelect(playerActionState!.playerId); setPlayerActionState(null); }}>
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalhes do Jogador
            </Button>
            <Button variant="destructive" onClick={handleRemovePlayer}>
              <UserX className="mr-2 h-4 w-4" />
              Remover da Escalação
            </Button>
            <AlertDialogCancel onClick={() => setPlayerActionState(null)}>Cancelar</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="bg-card p-4 flex flex-col items-center gap-4">
        <div className="flex justify-between items-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={currentUser.avatar ?? undefined} alt="Avatar do Usuário" />
                    <AvatarFallback>
                      <Users />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {currentUser.role === 'admin' && (
                  <DropdownMenuItem onClick={() => onNavigate('admin')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Admin</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => onNavigate('welcome')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <h2 className="text-xl font-bold">Escalação</h2>
            
            <Button variant="ghost" className="text-primary-foreground" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        <div className="grid grid-cols-3 items-center w-full max-w-sm">
           <div className="text-center">
              <p className="font-bold text-lg">{team1Score.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">Time 1</p>
           </div>
           <div className="text-center font-bold text-muted-foreground">VS</div>
            <div className="text-center">
                <p className="font-bold text-lg">{team2Score.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Time 2</p>
            </div>
        </div>
      </header>
      <div className="p-4 pb-32">
        {editorView}
        
        <div className="mt-4 flex flex-col gap-2">
            <div className={cn(
                "p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground",
                isMarketOpen ? "bg-green-600" : "bg-orange-500"
            )}>
                <Clock className="w-5 h-5" />
                <span>{isMarketOpen ? "MERCADO ABERTO" : "MERCADO FECHADO"}</span>
            </div>
        </div>
      </div>
      {canEdit && (
         <div className="fixed bottom-20 left-0 right-0 bg-card p-2 border-t border-border shadow-lg z-50">
            <div className="flex justify-around items-center px-2 pb-2">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">Esquema Tático</span>
                     <Select value={formation} onValueChange={(value: Formation) => setFormation(value)}>
                        <SelectTrigger className="w-auto bg-muted border-none h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {availableFormations.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">Limpar Reservas</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 bg-muted hover:bg-accent rounded-full" 
                      onClick={() => handleClearReserves(activeTab as 'team1' | 'team2')} 
                    >
                        <Trash2 className="h-5 w-5 text-red-400" />
                    </Button>
                </div>
            </div>
            {!lineupsSaved && (
              <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={onSaveLineups}>
                  Salvar Times da Rodada
              </Button>
            )}
        </div>
      )}
    </div>
  );
}
