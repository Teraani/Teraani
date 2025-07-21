import { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock, Trash2, LogOut, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import type { View, AddPlayerSlot } from '@/app/page';
import { cn } from '@/lib/utils';
import AddPlayerButton from '@/components/lineup/add-player-button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


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
}

type Formation = '4-3-3' | '4-4-2' | '3-5-2';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

export default function LineupView({ userLineup, players, onPlayerSelect, onNavigate, setUserLineup, onAddPlayer, userReserves, setUserReserves, userAvatar }: LineupViewProps) {
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [shirtColor, setShirtColor] = useState<ShirtColor>('verde');
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  // This will reconstruct the user object for components that need it, like AiSuggestions
  const user: User = useMemo(() => ({
      ...data.user,
      lineup: userLineup.filter(id => id !== null) as string[],
      reserves: userReserves.filter(id => id !== null) as string[]
  }), [userLineup, userReserves]);


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

  const handleAddPlayer = (position: Player['pos'] | 'RES', index: number) => {
    onAddPlayer({ position, index });
  };
  
  const lineupPlayers = userLineup.map(id => id ? { ...players[id], id } : null);
  const reservePlayers = userReserves.map(id => id ? { ...players[id], id } : null);
  const totalScore = lineupPlayers.reduce((sum, player) => sum + (player?.points ?? 0), 0);

  
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
      goalkeeper: assignedGoalkeeper,
    };
  }, [lineupPlayers, atkCount, midCount, defCount]);


  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string } & Player) | null)[], position: Player['pos'], startIndex: number) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
        const player = assignedPlayers[i];
        const slotIndex = startIndex + i;
        if (player) {
            elements.push(<PlayerCard key={`${player.id}-${slotIndex}`} player={player} onPlayerSelect={onPlayerSelect} shirtColor={shirtColor} />);
        } else {
            elements.push(<AddPlayerButton key={`add-${position}-${slotIndex}`} onClick={() => handleAddPlayer(position, slotIndex)} />);
        }
    }
    return <div className="flex justify-around z-10 w-full">{elements}</div>;
  };

  const renderReserves = () => {
    const elements = [];
    for (let i = 0; i < 5; i++) {
        const player = reservePlayers[i];
        if (player) {
            elements.push(<PlayerCard key={player.id} player={player} onPlayerSelect={onPlayerSelect} isReserve />);
        } else {
            elements.push(<AddPlayerButton key={`add-RES-${i}`} onClick={() => handleAddPlayer('RES', i)} />);
        }
    }
    return <div className="flex flex-wrap justify-center gap-4">{elements}</div>;
  }

  return (
    <div className="dark">
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
                    <p className="text-sm font-medium leading-none">Felipe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      felipe@exemplo.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onNavigate('welcome')}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1 flex justify-center items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="text-foreground">Time</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setShirtColor('verde')}>Verde</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShirtColor('amarelo')}>Amarelo</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShirtColor('preto')}>Preto</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShirtColor('vermelho')}>Vermelho</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShirtColor('branco')}>Branco</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" className="text-primary-foreground" onClick={() => onNavigate('partial-score')}>Parcial</Button>
                <Button variant="ghost" className="text-primary-foreground" onClick={() => onNavigate('games')}>Jogos</Button>
            </div>
            
            <Button variant="ghost" className="text-primary-foreground">
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        <Button className="bg-primary hover:bg-primary/90 rounded-lg px-6">
          Pontuação da rodada: {totalScore.toFixed(2)}
        </Button>
      </header>
      <div className="p-4 pb-32">
        <Pitch>
          {renderPlayerRow(atkCount, attackers, 'ATA', 0)}
          {renderPlayerRow(midCount, midfielders, 'MEI', atkCount)}
          {renderPlayerRow(defCount, defenders, 'ZAG', atkCount + midCount)}
          {renderPlayerRow(1, goalkeeper, 'GOL', atkCount + midCount + defCount)}
        </Pitch>
        <div className="mt-4 flex flex-col gap-2">
            <AiSuggestions user={user} players={players} />
            <div className={cn(
                "p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center font-bold text-primary-foreground",
                isMarketOpen ? "bg-green-600" : "bg-orange-500"
            )}>
                <Clock className="w-5 h-5" />
                <span>{isMarketOpen ? "MERCADO ABERTO" : "MERCADO FECHADO"}</span>
            </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-lg font-bold mb-4 text-center text-foreground">Reservas</h3>
            {renderReserves()}
        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 bg-card p-2 border-t border-border shadow-lg z-50">
          <div className="flex justify-between items-center px-2 pb-2">
              <div className="flex flex-col items-center gap-1">
                  <span className="text-xs text-foreground">Esquema Tático</span>
                  <Select value={formation} onValueChange={(value: Formation) => setFormation(value)}>
                      <SelectTrigger className="w-auto bg-muted border-none h-8 text-foreground">
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
                  <span className="text-xs text-foreground">Desfazer Time</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted hover:bg-accent rounded-full" onClick={handleClearLineup}>
                      <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
              </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" className="bg-muted text-foreground hover:bg-accent">
                  Limpar Reservas
              </Button>
              <Button variant="secondary" className="bg-muted text-foreground hover:bg-accent" onClick={handleClearLineup}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Limpar Time
              </Button>
              <Button className="bg-green-600 text-white hover:bg-green-700">
                  Salvar Time
              </Button>
          </div>
      </div>
    </div>
  );
}

// Helper to access data, assuming it's imported in this file now
import { data } from '@/lib/data';
