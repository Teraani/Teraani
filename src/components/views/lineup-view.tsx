import { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock, Trash2, LogOut, Users, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { View, AddPlayerSlot } from '@/app/page';
import { cn } from '@/lib/utils';
import AddPlayerButton from '@/components/lineup/add-player-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';


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
}

type Formation = '4-3-3' | '4-4-2' | '3-5-2';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

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
  onPlayerSelect,
  onAddPlayer,
  canEdit,
}: {
  teamName: string;
  lineup: (string | null)[];
  reserves: (string | null)[];
  players: Record<string, Player>;
  formation: Formation;
  shirtColor: ShirtColor;
  onPlayerSelect: (playerId: string) => void;
  onAddPlayer: (position: Player['pos'] | 'RES', index: number) => void;
  canEdit: boolean;
}) => {
    
  const lineupPlayers = lineup.map(id => id ? { ...players[id], id } : null);
  const reservePlayers = reserves.map(id => id ? { ...players[id], id } : null);
  const [defCount, midCount, atkCount] = useMemo(() => formation.split('-').map(Number), [formation]);

  const { attackers, midfielders, defenders, goalkeeper } = useMemo(() => {
    let playerIndex = 0;
    const assignedAttackers = lineupPlayers.slice(playerIndex, playerIndex + atkCount);
    playerIndex += atkCount;
    const assignedMidfielders = lineupPlayers.slice(playerIndex, playerIndex + midCount);
    playerIndex += midCount;
    const assignedDefenders = lineupPlayers.slice(playerIndex, playerIndex + defCount);
    playerIndex += defCount;
    const assignedGoalkeeper = lineupPlayers.slice(playerIndex, playerIndex + 1);
    
    return { 
        attackers: assignedAttackers, 
        midfielders: assignedMidfielders, 
        defenders: assignedDefenders, 
        goalkeeper: assignedGoalkeeper 
    };
  }, [lineupPlayers, atkCount, midCount, defCount]);

  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string } & Player) | null)[], position: Player['pos'], startIndex: number) => {
    return (
        <div className="flex justify-around z-10 w-full">
            {Array.from({ length: count }).map((_, i) => {
                const player = assignedPlayers[i];
                const slotIndex = startIndex + i;
                if (player) {
                    return <PlayerCard key={`${player.id}-${slotIndex}`} player={player} onPlayerSelect={onPlayerSelect} shirtColor={shirtColor} />;
                } else {
                    return <AddPlayerButton key={`add-${position}-${slotIndex}`} onClick={() => onAddPlayer(position, slotIndex)} />;
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
                return <PlayerCard key={player.id} player={player} onPlayerSelect={onPlayerSelect} isReserve />;
            } else {
                return <AddPlayerButton key={`add-RES-${i}`} onClick={() => onAddPlayer('RES', i)} />;
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
    team2Lineup, setTeam2Lineup, team2Reserves, setTeam2Reserves
  } = props;
    
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('verde');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('amarelo');
  const [isMarketOpen, setIsMarketOpen] = useState(true);
  
  // This will reconstruct the user object for components that need it, like AiSuggestions
  const user: User = useMemo(() => ({
      ...currentUser,
      lineup: userLineup.filter(id => id !== null) as string[],
      reserves: userReserves.filter(id => id !== null) as string[]
  }), [currentUser, userLineup, userReserves]);


  useEffect(() => {
    const checkMarketStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0=Sun, 1=Mon, ..., 4=Thu, ...
      const hour = now.getHours();
      
      // Market is closed on Thursdays from 18:00 onwards
      if (day === 4 && hour >= 18) {
        setIsMarketOpen(false);
      } else {
        setIsMarketOpen(true);
      }
    };

    checkMarketStatus();
    // Optional: Check every minute if you want it to update live without a page refresh
    const interval = setInterval(checkMarketStatus, 60000); 
    return () => clearInterval(interval);
  }, []);
  
  const handleClearLineup = () => {
    setUserLineup(Array(11).fill(null));
    setUserReserves(Array(5).fill(null));
  };
  
  const handleClearTeam1 = () => {
      setTeam1Lineup(Array(11).fill(null));
      setTeam1Reserves(Array(5).fill(null));
  }

  const handleClearTeam2 = () => {
      setTeam2Lineup(Array(11).fill(null));
      setTeam2Reserves(Array(5).fill(null));
  }

  const handleApplyAiLineup = (lineup: string[], reserves: string[]) => {
    // Ensure the arrays have the correct length, filling with null if necessary
    const newLineup = Array(11).fill(null);
    const newReserves = Array(5).fill(null);

    lineup.slice(0, 11).forEach((id, i) => {
        newLineup[i] = id;
    });

    reserves.slice(0, 5).forEach((id, i) => {
        newReserves[i] = id;
    });

    setUserLineup(newLineup);
    setUserReserves(newReserves);
  };

  const handleAddPlayerForTeam = (team: 'team1' | 'team2') => (position: Player['pos'] | 'RES', index: number) => {
    if (!canEdit) return;
    onAddPlayer({ position, index, team });
  };
  
  const totalScore = userLineup.reduce((sum, id) => sum + (id ? players[id]?.points ?? 0 : 0), 0);
  
  return (
    <div>
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
                    <Tabs defaultValue="team1" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="team1">Time 1</TabsTrigger>
                            <TabsTrigger value="team2">Time 2</TabsTrigger>
                        </TabsList>
                        <TabsContent value="team1" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                               <ShirtColorDropdown color={team1ShirtColor} onColorChange={setTeam1ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={handleClearTeam1} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 1
                                </Button>
                            </div>
                            <TeamEditor
                                teamName="Time 1"
                                lineup={team1Lineup}
                                reserves={team1Reserves}
                                players={players}
                                formation={formation}
                                shirtColor={team1ShirtColor}
                                onPlayerSelect={onPlayerSelect}
                                onAddPlayer={handleAddPlayerForTeam('team1')}
                                canEdit={canEdit}
                            />
                        </TabsContent>
                        <TabsContent value="team2" className="mt-4">
                            <div className="flex justify-between items-center mb-4">
                                <ShirtColorDropdown color={team2ShirtColor} onColorChange={setTeam2ShirtColor} disabled={!canEdit} />
                                <Button variant="destructive" size="sm" onClick={handleClearTeam2} disabled={!canEdit}>
                                    <Trash2 className="mr-2 h-4 w-4"/>
                                    Limpar Time 2
                                </Button>
                            </div>
                            <TeamEditor
                                teamName="Time 2"
                                lineup={team2Lineup}
                                reserves={team2Reserves}
                                players={players}
                                formation={formation}
                                shirtColor={team2ShirtColor}
                                onPlayerSelect={onPlayerSelect}
                                onAddPlayer={handleAddPlayerForTeam('team2')}
                                canEdit={canEdit}
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        ) : (
            <TeamEditor
                teamName={currentUser.teamName}
                lineup={userLineup}
                reserves={userReserves}
                players={players}
                formation={formation}
                shirtColor={team1ShirtColor} // Defaulting to team1 color for user's view
                onAddPlayer={(pos, idx) => { /* Non-editors can't add players */ }}
                canEdit={canEdit}
                onPlayerSelect={onPlayerSelect}
            />
        )}
        
        <div className="mt-4 flex flex-col gap-2">
            {!canEdit && <AiSuggestions user={user} players={players} onApplyLineup={handleApplyAiLineup} />}
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
          <div className="flex justify-between items-center px-2 pb-2">
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
                  <span className="text-xs">Desfazer Time</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted hover:bg-accent rounded-full" onClick={handleClearLineup} disabled={!canEdit}>
                      <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
              </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" className="bg-muted text-foreground hover:bg-accent" disabled={!canEdit}>
                  Limpar Reservas
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700" disabled={!canEdit}>
                  Salvar Times
              </Button>
          </div>
      </div>
    </div>
  );
}
