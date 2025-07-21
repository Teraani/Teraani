import { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock, Trash2, LogOut, Users, Settings, Wand2, Share2, Loader2, UserX, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { View, AddPlayerSlot } from '@/app/page';
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
  userLineup: (string | null)[];
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
  onNavigate: (view: View) => void;
  setUserLineup: (lineup: (string | null)[]) => void;
  onAddPlayer: (slot: AddPlayerSlot) => void;
  userReserves: (string | null)[];
  setUserReserves: (reserves: (string | null)[]) => void;
  userAvatar: string | null;
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
}

type Formation = '4-3-3' | '4-4-2' | '3-5-2';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

interface PlayerActionState {
  playerId: string;
  isReserve: boolean;
  index: number;
  team: 'team1' | 'team2' | 'user';
}

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


const TeamEditor = ({
  teamName,
  lineup,
  reserves,
  players,
  formation,
  shirtColor,
  onPlayerCardClick,
  onAddPlayer,
  canEdit,
  teamIdentifier
}: {
  teamName: string;
  lineup: (string | null)[];
  reserves: (string | null)[];
  players: Record<string, Player>;
  formation: Formation;
  shirtColor: ShirtColor;
  onPlayerCardClick: (state: PlayerActionState) => void;
  onAddPlayer: (position: Player['pos'] | 'RES', index: number) => void;
  canEdit: boolean;
  teamIdentifier: 'team1' | 'team2' | 'user';
}) => {
    
  const lineupPlayers = lineup.map(id => id ? { ...players[id], id } : null);
  const reservePlayers = reserves.map(id => id ? { ...players[id], id } : null);
  
  const { attackers, midfielders, defenders, goalkeeper, atkCount, midCount, defCount } = useMemo(() => {
    const [parsedDef, parsedMid, parsedAtk] = formation.split('-').map(Number);
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
  }, [lineupPlayers, formation]);


  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string } & Player) | null)[], position: Player['pos'], startIndex: number) => {
    return (
        <div className="flex justify-around z-10 w-full">
            {Array.from({ length: count }).map((_, i) => {
                const player = assignedPlayers[i];
                const slotIndex = startIndex + i;
                if (player) {
                    return <PlayerCard key={`${player.id}-${slotIndex}`} player={player} onPlayerSelect={() => onPlayerCardClick({ playerId: player.id, isReserve: false, index: slotIndex, team: teamIdentifier })} shirtColor={shirtColor} />;
                } else if (canEdit) {
                    return <AddPlayerButton key={`add-${position}-${slotIndex}`} onClick={() => onAddPlayer(position, slotIndex)} />;
                } else {
                    return <div className="w-20 h-28" />;
                }
            })}
        </div>
    );
  };

  const renderReserves = () => (
    <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: 5 }).map((_, i) => {
            const player = reservePlayers[i];
            if (player) {
                return <PlayerCard key={`${player.id}-${i}`} player={player} onPlayerSelect={() => onPlayerCardClick({ playerId: player.id, isReserve: true, index: i, team: teamIdentifier })} isReserve />;
            } else if (canEdit) {
                return <AddPlayerButton key={`add-RES-${i}`} onClick={() => onAddPlayer('RES', i)} />;
            } else {
                return <div className="w-20 h-28" />;
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
    userLineup, players, onPlayerSelect, onNavigate, setUserLineup, onAddPlayer,
    userReserves, setUserReserves, userAvatar, currentUser, canEdit,
    team1Lineup, setTeam1Lineup, team1Reserves, setTeam1Reserves,
    team2Lineup, setTeam2Lineup, team2Reserves, setTeam2Reserves,
    onSaveLineups,
  } = props;
    
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('verde');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('amarelo');
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('team1');
  const [isBalancing, setIsBalancing] = useState(false);
  const { toast } = useToast();
  const [playerActionState, setPlayerActionState] = useState<PlayerActionState | null>(null);
  
  const user: User = useMemo(() => ({
      ...currentUser,
      lineup: userLineup.filter(id => id !== null) as string[],
      reserves: userReserves.filter(id => id !== null) as string[]
  }), [currentUser, userLineup, userReserves]);


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
    if (canEdit) {
      setPlayerActionState(state);
    } else {
      onPlayerSelect(state.playerId);
    }
  };

  const handleRemovePlayer = () => {
    if (!playerActionState) return;

    const { team, isReserve, index } = playerActionState;

    const lineupSetters = {
      user: { lineup: setUserLineup, reserves: setUserReserves },
      team1: { lineup: setTeam1Lineup, reserves: setTeam1Reserves },
      team2: { lineup: setTeam2Lineup, reserves: setTeam2Reserves },
    };
    
    const lineups = {
        user: { lineup: userLineup, reserves: userReserves },
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
    if (team === 'team1') {
        setTeam1Lineup(Array(11).fill(null));
        setTeam1Reserves(Array(5).fill(null));
    } else {
        setTeam2Lineup(Array(11).fill(null));
        setTeam2Reserves(Array(5).fill(null));
    }
  };
  
  const handleClearReserves = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setTeam1Reserves(Array(5).fill(null));
    } else {
      setTeam2Reserves(Array(5).fill(null));
    }
  };

  const handleApplyAiLineup = (lineup: string[], reserves: string[]) => {
    const newLineup = Array(11).fill(null);
    const newReserves = Array(5).fill(null);
    lineup.slice(0, 11).forEach((id, i) => { newLineup[i] = id; });
    reserves.slice(0, 5).forEach((id, i) => { newReserves[i] = id; });
    setUserLineup(newLineup);
    setUserReserves(newReserves);
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
        team1Result.reserves.forEach(id => delete remainingPlayers[id]);

        const team2Result = await generateBalancedTeam({
            availablePlayers: remainingPlayers,
            teamBudget: 150,
        });

        const newTeam1Lineup = Array(11).fill(null);
        team1Result.lineup.slice(0, 11).forEach((id, i) => newTeam1Lineup[i] = id);
        const newTeam1Reserves = Array(5).fill(null);
        team1Result.reserves.slice(0, 5).forEach((id, i) => newTeam1Reserves[i] = id);
        
        const newTeam2Lineup = Array(11).fill(null);
        team2Result.lineup.slice(0, 11).forEach((id, i) => newTeam2Lineup[i] = id);
        const newTeam2Reserves = Array(5).fill(null);
        team2Result.reserves.slice(0, 5).forEach((id, i) => newTeam2Reserves[i] = id);

        setTeam1Lineup(newTeam1Lineup);
        setTeam1Reserves(newTeam1Reserves);
        setTeam2Lineup(newTeam2Lineup);
        setTeam2Reserves(newTeam2Reserves);
        
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
    if (!canEdit) return;
    onAddPlayer({ position, index, team });
  };
  
  const totalScore = userLineup.reduce((sum, id) => sum + (id ? players[id]?.points ?? 0 : 0), 0);
  
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
            
            <Button variant="ghost" className="text-primary-foreground">
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        {!canEdit && (
            <Button className="bg-primary hover:bg-primary/90 rounded-lg px-6">
                Pontuação da rodada: {totalScore.toFixed(2)}
            </Button>
        )}
      </header>
      <div className="p-4 pb-32">
        
        {canEdit ? (
            <Card>
                <CardHeader>
                    <CardTitle>Editor da Rodada</CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="team1">Time 1</TabsTrigger>
                            <TabsTrigger value="team2">Time 2</TabsTrigger>
                        </TabsList>
                        <TabsContent value="team1" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                               <ShirtColorDropdown color={team1ShirtColor} onColorChange={setTeam1ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={() => handleClearLineup('team1')} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 1
                                </Button>
                            </div>
                            <TeamEditor
                                teamIdentifier="team1"
                                teamName="Time 1"
                                lineup={team1Lineup}
                                reserves={team1Reserves}
                                players={players}
                                formation={formation}
                                shirtColor={team1ShirtColor}
                                onPlayerCardClick={handlePlayerCardClick}
                                onAddPlayer={handleAddPlayerForTeam('team1')}
                                canEdit={canEdit}
                            />
                        </TabsContent>
                        <TabsContent value="team2" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <ShirtColorDropdown color={team2ShirtColor} onColorChange={setTeam2ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={() => handleClearLineup('team2')} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 2
                                </Button>
                            </div>
                            <TeamEditor
                                teamIdentifier="team2"
                                teamName="Time 2"
                                lineup={team2Lineup}
                                reserves={team2Reserves}
                                players={players}
                                formation={formation}
                                shirtColor={team2ShirtColor}
                                onPlayerCardClick={handlePlayerCardClick}
                                onAddPlayer={handleAddPlayerForTeam('team2')}
                                canEdit={canEdit}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        ) : (
            <TeamEditor
                teamIdentifier="user"
                teamName={currentUser.teamName}
                lineup={userLineup}
                reserves={userReserves}
                players={players}
                formation={formation}
                shirtColor={team1ShirtColor}
                onAddPlayer={(pos, idx) => onAddPlayer({ position: pos, index: idx, team: 'team1' })}
                canEdit={canEdit}
                onPlayerCardClick={handlePlayerCardClick}
            />
        )}
        
        <div className="mt-4 flex flex-col gap-2">
            {!canEdit && <AiSuggestions user={user} players={players} onApplyLineup={handleApplyAiLineup} />}
             {canEdit && (
                <Button onClick={handleBalanceTeams} className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isBalancing}>
                    {isBalancing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                    {isBalancing ? 'Balanceando...' : 'Balancear Times'}
                </Button>
            )}
            <div className={cn(
                "p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground",
                isMarketOpen ? "bg-green-600" : "bg-orange-500"
            )}>
                <Clock className="w-5 h-5" />
                <span>{isMarketOpen ? "MERCADO ABERTO" : "MERCADO FECHADO"}</span>
            </div>
        </div>
      </div>
       <div className="fixed bottom-20 left-0 right-0 bg-card p-2 border-t border-border shadow-lg z-50">
          <div className="flex justify-around items-center px-2 pb-2">
              <div className="flex flex-col items-center gap-1">
                  <span className="text-xs">Esquema Tático</span>
                  <Select value={formation} onValueChange={(value: Formation) => setFormation(value)} disabled={!canEdit}>
                      <SelectTrigger className="w-auto bg-muted border-none h-8">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="4-3-3">4-3-3</SelectItem>
                          <SelectItem value="4-4-2">4-4-2</SelectItem>
                          <SelectItem value="3-5-2">3-5-2</SelectItem>
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
                    disabled={!canEdit}
                  >
                      <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
              </div>
          </div>
          <Button className="w-full bg-green-600 text-white hover:bg-green-700" onClick={onSaveLineups} disabled={!canEdit}>
              Salvar Times
          </Button>
      </div>
    </div>
  );
}
