

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


export type Formation = '4-3-3' | '4-4-2' | '3-5-2' | '3-2-1' | '2-3-1' | '2-2' | '3-1';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

export interface LineupViewProps {
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
  team1ShirtColor: ShirtColor;
  setTeam1ShirtColor: (color: ShirtColor) => void;
  team2ShirtColor: ShirtColor;
  setTeam2ShirtColor: (color: ShirtColor) => void;
  formation: Formation;
  setFormation: (formation: Formation) => void;
}


interface PlayerActionState {
  playerId: string;
  isReserve: boolean;
  index: number;
  team: 'team1' | 'team2';
}

// Defines grid position [row, col, col-span] for each player in a formation
type FormationLayout = {
  [key in Formation]?: {
    positions: { pos: Player['pos']; grid: string }[]; // "row-start/col-start"
  };
};

const formationLayouts: FormationLayout = {
  // Campo (11 players)
  '4-3-3': {
    positions: [
      // Attackers
      { pos: 'ATA', grid: '1 / 1' }, { pos: 'ATA', grid: '1 / 3' }, { pos: 'ATA', grid: '1 / 5' },
      // Midfielders
      { pos: 'MEI', grid: '2 / 3' }, { pos: 'MEI', grid: '3 / 2' }, { pos: 'MEI', grid: '3 / 4' },
      // Defenders
      { pos: 'ZAG', grid: '4 / 1' }, { pos: 'ZAG', grid: '4 / 2' }, { pos: 'ZAG', grid: '4 / 4' }, { pos: 'ZAG', grid: '4 / 5' },
      // Goalkeeper
      { pos: 'GOL', grid: '5 / 3' },
    ]
  },
  '4-4-2': {
    positions: [
      // Attackers
      { pos: 'ATA', grid: '1 / 2' }, { pos: 'ATA', grid: '1 / 4' },
      // Midfielders
      { pos: 'MEI', grid: '3 / 1' }, { pos: 'MEI', grid: '3 / 2' }, { pos: 'MEI', grid: '3 / 4' }, { pos: 'MEI', grid: '3 / 5' },
      // Defenders
      { pos: 'ZAG', grid: '4 / 1' }, { pos: 'ZAG', grid: '4 / 2' }, { pos: 'ZAG', grid: '4 / 4' }, { pos: 'ZAG', grid: '4 / 5' },
      // Goalkeeper
      { pos: 'GOL', grid: '5 / 3' },
    ]
  },
   '3-5-2': {
    positions: [
      // Attackers
      { pos: 'ATA', grid: '1 / 2' }, { pos: 'ATA', grid: '1 / 4' },
      // Midfielders
      { pos: 'MEI', grid: '2 / 3' }, // CAM
      { pos: 'MEI', grid: '2 / 1' }, // LM
      { pos: 'MEI', grid: '2 / 5' }, // RM
      { pos: 'VOL', grid: '3 / 2' }, // L-CDM
      { pos: 'VOL', grid: '3 / 4' }, // R-CDM
      // Defenders
      { pos: 'ZAG', grid: '4 / 2' }, { pos: 'ZAG', grid: '4 / 3' }, { pos: 'ZAG', grid: '4 / 4' },
      // Goalkeeper
      { pos: 'GOL', grid: '5 / 3' },
    ]
  },
  // Society (7 players)
  '3-2-1': {
    positions: [
      { pos: 'ATA', grid: '1 / 3' },
      { pos: 'MEI', grid: '2 / 2' }, { pos: 'MEI', grid: '2 / 4' },
      { pos: 'ZAG', grid: '3 / 1' }, { pos: 'ZAG', grid: '3 / 3' }, { pos: 'ZAG', grid: '3 / 5' },
      { pos: 'GOL', grid: '4 / 3' },
    ]
  },
   '2-3-1': {
    positions: [
      { pos: 'ATA', grid: '1 / 3' },
      { pos: 'MEI', grid: '2 / 1' }, { pos: 'MEI', grid: '2 / 3' }, { pos: 'MEI', grid: '2 / 5' },
      { pos: 'ZAG', grid: '3 / 2' }, { pos: 'ZAG', grid: '3 / 4' },
      { pos: 'GOL', grid: '4 / 3' },
    ]
  },
  // Futsal (5 players)
  '2-2': { // Simplified from 2-1-2
    positions: [
      { pos: 'ATA', grid: '1 / 2' }, { pos: 'ATA', grid: '1 / 4' },
      { pos: 'ZAG', grid: '3 / 2' }, { pos: 'ZAG', grid: '3 / 4' },
      { pos: 'GOL', grid: '4 / 3' },
    ]
  },
  '3-1': { // Simplified from 1-2-1
     positions: [
      { pos: 'ATA', grid: '1 / 3' },
      { pos: 'ZAG', grid: '2 / 1' }, { pos: 'ZAG', grid: '2 / 3' }, { pos: 'ZAG', grid: '2 / 5' },
      { pos: 'GOL', grid: '4 / 3' },
    ]
  }
};

const getFormationsForModality = (modality: Modality | null): Formation[] => {
  switch (modality) {
    case 'society':
      return ['3-2-1', '2-3-1'];
    case 'futsal':
      return ['2-2', '3-1']; // Common Futsal formations
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
  
  const layout = formationLayouts[formation]?.positions;
  
  const renderPlayerGrid = () => {
    if (!layout) return null;

    return layout.map((slot, index) => {
      const player = lineupPlayers[index];
      const gridStyle = { gridArea: slot.grid };

      return (
        <div key={`${teamIdentifier}-grid-${index}`} className="flex items-center justify-center" style={gridStyle}>
          {player ? (
            <PlayerCard 
              player={player} 
              onPlayerSelect={() => onPlayerCardClick({ playerId: player.id, isReserve: false, index: index, team: teamIdentifier })} 
              shirtColor={shirtColor} 
            />
          ) : canEdit ? (
            <AddPlayerButton 
              variant="pitch" 
              onClick={() => onAddPlayer(slot.pos, index)} 
            />
          ) : (
            <div className="w-16 h-24" /> // Placeholder for empty slot in view mode
          )}
        </div>
      );
    });
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
        <Pitch modality={modality}>
          {renderPlayerGrid()}
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
    onSaveLineups, lineupsSaved, modality,
    team1ShirtColor, setTeam1ShirtColor, team2ShirtColor, setTeam2ShirtColor,
    formation, setFormation
  } = props;
    
  const availableFormations = useMemo(() => getFormationsForModality(modality), [modality]);
  
  useEffect(() => {
    if (!availableFormations.includes(formation)) {
      setFormation(availableFormations[0]);
    }
  }, [availableFormations, formation, setFormation]);

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
        const result = await generateBalancedTeam({
            availablePlayers: players,
            teamBudget: 150, // This budget is not really used in the new logic but let's keep it
        });

        const { team1, team2 } = result;

        const placePlayers = (teamData: string[], currentLineup: (string | null)[]) => {
            const newLineup = Array(currentLineup.length).fill(null);
            const goalkeeper = teamData.find(id => players[id]?.pos === 'GOL');
            const fieldPlayers = teamData.filter(id => players[id]?.pos !== 'GOL');

            // Place goalkeeper at the last position
            if (goalkeeper) {
                newLineup[newLineup.length - 1] = goalkeeper;
            }

            // Fill the rest with field players
            for (let i = 0; i < newLineup.length - 1 && i < fieldPlayers.length; i++) {
                newLineup[i] = fieldPlayers[i];
            }
            return newLineup;
        };
        
        setTeam1Lineup(placePlayers(team1, team1Lineup));
        setTeam2Lineup(placePlayers(team2, team2Lineup));
        
        // Clear reserves
        setTeam1Reserves(Array(team1Reserves.length).fill(null));
        setTeam2Reserves(Array(team2Reserves.length).fill(null));

        toast({
            title: "Times Balanceados!",
            description: "A IA gerou duas equipes titulares equilibradas para o confronto.",
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
                <Button onClick={handleBalanceTeams} className="w-full bg-amber-400 text-black hover:bg-amber-500" disabled={isBalancing}>
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
            
            <Button variant="ghost" className="text-foreground" onClick={handleShare}>
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
