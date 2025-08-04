

import { useState, useMemo, useEffect, useRef } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import { Clock, Trash2, LogOut, Users, Settings, Wand2, Share2, Loader2, UserX, Eye, Info, Upload, Edit, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { View, AddPlayerSlot, Modality } from '@/components/app-container';
import { cn } from '@/lib/utils';
import AddPlayerButton from '../lineup/add-player-button';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

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
  onUpdatePlayerInMarket: (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => void;
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
      { pos: 'ZAG', grid: '4 / 2' }, { pos: 'ZAG', grid: '4 / 4' }, { pos: 'LAT', grid: '4 / 1' }, { pos: 'LAT', grid: '4 / 5' },
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
      { pos: 'LAT', grid: '4 / 1' }, { pos: 'ZAG', grid: '4 / 2' }, { pos: 'ZAG', grid: '4 / 4' }, { pos: 'LAT', grid: '4 / 5' },
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
      return ['4-4-2', '4-3-3', '3-5-2'];
  }
};

const PlayerEditorDialog = ({
  player,
  onSave,
  onClose,
  onRemove
}: {
  player: Player & { id: string };
  onSave: (data: Partial<Player>, id: string) => void;
  onClose: () => void;
  onRemove: () => void;
}) => {
  const [name, setName] = useState(player?.name || '');
  const [pos, setPos] = useState<Player['pos'] | ''>(player?.pos || '');
  const [team, setTeam] = useState(player?.team || '');
  const [img, setImg] = useState(player?.img || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pos || !team) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = {
      name,
      pos: pos as Player['pos'],
      team,
      img,
    };
    onSave(data, player.id);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Jogador</DialogTitle>
        <DialogDescription>Atualize os dados do atleta.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
          {img ? (
            <Avatar className="w-24 h-24">
              <AvatarImage src={img} alt="Pré-visualização" data-ai-hint="player avatar" />
              <AvatarFallback className="text-4xl">{name.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
          ) : (
            <Avatar className="w-24 h-24">
              <AvatarFallback className="text-4xl bg-muted"><UserPlus /></AvatarFallback>
            </Avatar>
          )}
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Anexar Imagem
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <div>
          <Label htmlFor="playerName">Nome</Label>
          <Input id="playerName" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="playerTeam">Time</Label>
          <Select onValueChange={setTeam} value={team} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a cor/time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Verde">Verde</SelectItem>
              <SelectItem value="Amarelo">Amarelo</SelectItem>
              <SelectItem value="Preto">Preto</SelectItem>
              <SelectItem value="Vermelho">Vermelho</SelectItem>
              <SelectItem value="Branco">Branco</SelectItem>
              <SelectItem value="Azul">Azul</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="playerPos">Posição</Label>
          <Select onValueChange={(v) => setPos(v as Player['pos'])} value={pos} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a posição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="GOL">Goleiro (GOL)</SelectItem>
              <SelectItem value="LAT">Lateral (LAT)</SelectItem>
              <SelectItem value="ZAG">Zagueiro (ZAG)</SelectItem>
              <SelectItem value="MEI">Meio-campo (MEI)</SelectItem>
              <SelectItem value="VOL">Volante (VOL)</SelectItem>
              <SelectItem value="ATA">Atacante (ATA)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className='flex-col-reverse sm:flex-row sm:justify-between w-full'>
            <Button type="button" variant="ghost" className="text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={onRemove}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remover da Escalação
            </Button>
            <div className='flex justify-end gap-2'>
                <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
                <Button type="submit">Salvar Alterações</Button>
            </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
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

  const renderPlayerGrid = () => {
    const layout = formationLayouts[formation]?.positions;
    if (!layout) return null;

    return layout.map((slot, index) => {
      const playerId = lineup[index];
      const player = playerId ? { ...players[playerId], id: playerId } : null;
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
        {Array.from({ length: reserves.length }).map((_, i) => {
            const playerId = reserves[i];
            const player = playerId ? { ...players[playerId], id: playerId } : null;
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
    formation, setFormation, onUpdatePlayerInMarket
  } = props;
    
  const availableFormations = useMemo(() => getFormationsForModality(modality), [modality]);
  
  useEffect(() => {
    if (!availableFormations.includes(formation)) {
      setFormation(availableFormations[0]);
    }
  }, [availableFormations, formation, setFormation]);

  const [activeTab, setActiveTab] = useState('team1');
  const { toast } = useToast();
  const [playerActionState, setPlayerActionState] = useState<PlayerActionState | null>(null);
  const [showInfoCard, setShowInfoCard] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('lineupInfoDismissed')) {
      setShowInfoCard(true);
    }
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
  
  const handleClearTeam = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
        setTeam1Lineup(Array(team1Lineup.length).fill(null));
        setTeam1Reserves(Array(team1Reserves.length).fill(null));
    } else {
        setTeam2Lineup(Array(team2Lineup.length).fill(null));
        setTeam2Reserves(Array(team2Reserves.length).fill(null));
    }
    toast({ title: `Time ${team === 'team1' ? 1 : 2} limpo!` });
  };
  

  const handleClearReserves = (team: 'team1' | 'team2') => {
    if (team === 'team1') {
      setTeam1Reserves(Array(team1Reserves.length).fill(null));
    } else {
      setTeam2Reserves(Array(team2Reserves.length).fill(null));
    }
  };

  const handleAddPlayerForTeam = (team: 'team1' | 'team2') => (position: Player['pos'] | 'RES', index: number) => {
    onAddPlayer({ position, index, team });
  };
  
  const getTeamSizes = (modality: Modality | null) => {
    switch (modality) {
      case 'society':
        return { lineup: 7, reserves: 4 };
      case 'futsal':
        return { lineup: 5, reserves: 4 };
      case 'campo':
      default:
        return { lineup: 11, reserves: 5 };
    }
  };

  const handleApplyAiSuggestions = (team1: string[], team2: string[]) => {
    const { lineup: luSize, reserves: resSize } = getTeamSizes(modality);
    
    const fillArray = (arr: string[], size: number) => {
        const filled = [...arr];
        while(filled.length < size) filled.push(null as any);
        return filled.slice(0, size);
    }

    setTeam1Lineup(fillArray(team1, luSize));
    setTeam1Reserves(Array(resSize).fill(null));
    setTeam2Lineup(fillArray(team2, luSize));
    setTeam2Reserves(Array(resSize).fill(null));
};
  
  const handleShare = () => {
    const getTeamText = (teamName: string, lineupIds: (string | null)[], reserveIds: (string | null)[]) => {
      let text = `*${teamName}*\n\n`;
      text += "*Titulares:*\n";
      lineupIds.forEach((id, index) => {
        if (id && players[id]) {
          text += `${index + 1}. ${players[id].name} (${players[id].pos})\n`;
        }
      });
      text += "\n*Reservas:*\n";
      reserveIds.forEach((id, index) => {
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

  const handleDismissInfo = () => {
    setShowInfoCard(false);
    localStorage.setItem('lineupInfoDismissed', 'true');
  };

  return (
    <div className="pb-32">
        <Dialog open={!!playerActionState} onOpenChange={(open) => !open && setPlayerActionState(null)}>
            {playerActionState && (
                <PlayerEditorDialog
                    player={{ ...players[playerActionState.playerId], id: playerActionState.playerId }}
                    onSave={onUpdatePlayerInMarket}
                    onClose={() => setPlayerActionState(null)}
                    onRemove={() => {
                        handleRemovePlayer();
                    }}
                />
            )}
        </Dialog>


      <header className="bg-card p-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex-1">
            <Button variant="ghost" className="text-foreground" onClick={handleShare}>
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        <h2 className="text-xl font-bold text-center flex-1">Escalação</h2>
        <div className="flex-1" />
      </header>

      <div className="p-4 space-y-4">
        {canEdit && showInfoCard && (
            <Card className="bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                        <Info className="w-6 h-6 text-blue-500" />
                        <CardTitle className="text-blue-800 dark:text-blue-300">Monte os Times</CardTitle>
                    </div>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-blue-500" onClick={handleDismissInfo}>
                        <X className="w-5 h-5"/>
                    </Button>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-blue-700 dark:text-blue-400">
                        Use os botões '+' para adicionar jogadores ou clique em 'Balancear Times' para uma sugestão da IA.
                    </p>
                </CardContent>
                 <CardFooter>
                    <Button 
                        className="w-full bg-blue-500/20 text-blue-700 hover:bg-blue-500/30" 
                        onClick={() => { handleClearTeam('team1'); handleClearTeam('team2'); }}>
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Limpar Times
                    </Button>
                </CardFooter>
            </Card>
        )}
      
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="team1">Time 1</TabsTrigger>
                <TabsTrigger value="team2">Time 2</TabsTrigger>
            </TabsList>
            
            <TabsContent value="team1" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                   <ShirtColorDropdown color={team1ShirtColor} onColorChange={setTeam1ShirtColor} disabled={!canEdit} />
                    {canEdit && (
                       <Button variant="outline" size="sm" onClick={() => handleClearTeam('team1')} >
                           Limpar Time 1
                       </Button>
                    )}
                </div>
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
                <div className="flex justify-between items-center mb-4">
                    <ShirtColorDropdown color={team2ShirtColor} onColorChange={setTeam2ShirtColor} disabled={!canEdit} />
                     {canEdit && (
                        <Button variant="outline" size="sm" onClick={() => handleClearTeam('team2')}>
                            Limpar Time 2
                        </Button>
                     )}
                </div>
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
        
        {canEdit && (
            <div className="mt-4 flex flex-col gap-2">
                <AiSuggestions user={currentUser} players={players} onApplyLineup={handleApplyAiSuggestions} />
            </div>
        )}
      </div>

      {canEdit && (
         <div className="fixed bottom-20 left-0 right-0 bg-card p-2 border-t border-border shadow-lg z-30">
             <div className="flex justify-around items-center px-2 pb-2">
                <div className="flex flex-col items-center gap-1">
                    <span className="text-xs">Esquema Tático</span>
                     <Select value={formation} onValueChange={(value: Formation) => setFormation(value)}>
                        <SelectTrigger className="w-[120px] bg-muted border-none h-8">
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
