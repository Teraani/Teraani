import { useState, useMemo, useEffect } from 'react';
import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock, Palette, Shield, Star, Trash2, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import type { View, Position } from '@/app/page';
import { cn } from '@/lib/utils';
import AddPlayerButton from '@/components/lineup/add-player-button';


interface LineupViewProps {
  user: User;
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
  onNavigate: (view: View) => void;
  setUserLineup: (lineup: string[]) => void;
  onAddPlayer: (position: Position) => void;
}

type Formation = '4-3-3' | '4-4-2' | '3-5-2';
export type ShirtColor = 'verde' | 'amarelo' | 'preto' | 'vermelho' | 'branco';

export default function LineupView({ user, players, onPlayerSelect, onNavigate, setUserLineup, onAddPlayer }: LineupViewProps) {
  const [formation, setFormation] = useState<Formation>('4-3-3');
  const [shirtColor, setShirtColor] = useState<ShirtColor>('verde');
  const [isMarketOpen, setIsMarketOpen] = useState(true);

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
    setUserLineup([]);
  };

  const handleAddPlayer = (position: Player['pos']) => {
    onAddPlayer(position);
  };

  const lineupPlayers = user.lineup.map(id => ({ ...players[id], id }));
  const totalScore = lineupPlayers.reduce((sum, player) => sum + player.points, 0);

  const reservePlayers = useMemo(() => {
    const lineupIds = new Set(user.lineup);
    return Object.entries(players)
      .filter(([id]) => !lineupIds.has(id))
      .slice(0, 5)
      .map(([id, player]) => ({ ...player, id }));
  }, [user.lineup, players]);

  const { attackers, midfielders, defenders, goalkeeper } = useMemo(() => {
    const allPlayersByPos: { [key in Player['pos']]: ({ id: string } & Player)[] } = {
      GOL: [], ZAG: [], LAT: [], MEI: [], ATA: [],
    };
    lineupPlayers.forEach(p => {
        if(allPlayersByPos[p.pos]) {
            allPlayersByPos[p.pos].push(p)
        }
    });

    return {
      attackers: allPlayersByPos.ATA,
      midfielders: allPlayersByPos.MEI,
      defenders: [...allPlayersByPos.ZAG, ...allPlayersByPos.LAT],
      goalkeeper: allPlayersByPos.GOL,
    };
  }, [lineupPlayers]);
  
  const [defCount, midCount, atkCount] = formation.split('-').map(Number);

  const renderPlayerRow = (count: number, assignedPlayers: (({ id: string; } & Player)[]), position: Player['pos']) => {
    const elements = [];
    for (let i = 0; i < count; i++) {
        if (assignedPlayers[i]) {
            elements.push(<PlayerCard key={assignedPlayers[i].id} player={assignedPlayers[i]} onPlayerSelect={onPlayerSelect} shirtColor={shirtColor} />);
        } else {
            elements.push(<AddPlayerButton key={`add-${position}-${i}`} onClick={() => handleAddPlayer(position)} />);
        }
    }
    return <div className="flex justify-around z-10 w-full">{elements}</div>;
  };


  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-900 text-white p-4 flex flex-col items-center gap-4">
        <div className="flex justify-center items-center w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">Time</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setShirtColor('verde')}>Verde</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShirtColor('amarelo')}>Amarelo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShirtColor('preto')}>Preto</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShirtColor('vermelho')}>Vermelho</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setShirtColor('branco')}>Branco</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2" onClick={() => onNavigate('partial-score')}>Parcial</Button>
            <Button variant="ghost" className="text-white" onClick={() => onNavigate('games')}>Jogos</Button>
            <Button variant="ghost" className="text-white">
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
          Pontuação da rodada: {totalScore.toFixed(2)}
        </Button>
      </header>
      <div className="p-4 pb-32">
        <Pitch>
          {renderPlayerRow(atkCount, attackers, 'ATA')}
          {renderPlayerRow(midCount, midfielders, 'MEI')}
          {renderPlayerRow(defCount, defenders, 'ZAG')}
          {renderPlayerRow(1, goalkeeper, 'GOL')}
        </Pitch>
        <div className="mt-4 flex flex-col gap-2">
            <AiSuggestions user={user} players={players} />
            <div className={cn(
                "text-white p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center",
                isMarketOpen ? "bg-green-600" : "bg-orange-500"
            )}>
                <Clock className="w-5 h-5" />
                <span className="font-bold">{isMarketOpen ? "MERCADO ABERTO" : "MERCADO FECHADO"}</span>
            </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-white text-lg font-bold mb-4 text-center">Reservas</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {reservePlayers.map(p => (
                    <PlayerCard key={p.id} player={p} onPlayerSelect={onPlayerSelect} isReserve />
                ))}
            </div>
        </div>
      </div>
       <div className="fixed bottom-0 left-0 right-0 bg-gray-800 p-2 border-t border-gray-700 shadow-lg z-50">
          <div className="flex justify-between items-center px-2 pb-2">
              <div className="flex flex-col items-center gap-1 text-white">
                  <span className="text-xs">Esquema Tático</span>
                  <Select value={formation} onValueChange={(value: Formation) => setFormation(value)}>
                      <SelectTrigger className="w-auto bg-gray-700 border-none text-white h-8">
                          <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="4-3-3">4-3-3</SelectItem>
                          <SelectItem value="4-4-2">4-4-2</SelectItem>
                          <SelectItem value="3-5-2">3-5-2</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <div className="flex flex-col items-center gap-1 text-white">
                  <span className="text-xs">Desfazer Time</span>
                  <Button variant="ghost" size="icon" className="h-8 w-8 bg-gray-700 hover:bg-gray-600 rounded-full" onClick={handleClearLineup}>
                      <Trash2 className="h-5 w-5 text-red-400" />
                  </Button>
              </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
              <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600">
                  <Shield className="mr-2 h-4 w-4" />
                  Reservas
              </Button>
              <Button variant="secondary" className="bg-gray-700 text-white hover:bg-gray-600" onClick={handleClearLineup}>
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
