import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface LineupViewProps {
  user: User;
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
}

export default function LineupView({ user, players, onPlayerSelect }: LineupViewProps) {
  const lineupPlayers = user.lineup.map(id => ({ ...players[id], id }));
  const totalScore = lineupPlayers.reduce((sum, player) => sum + player.points, 0);

  const positions: { [key in Player['pos']]: ({ id: string } & Player)[] } = {
    GOL: [],
    ZAG: [],
    LAT: [],
    MEI: [],
    ATA: [],
  };

  lineupPlayers.forEach(player => {
    positions[player.pos].push(player);
  });
  const defenders = [...positions.ZAG, ...positions.LAT];

  return (
    <div className="bg-gray-900 min-h-screen">
      <header className="bg-gray-900 text-white p-4 flex flex-col items-center gap-4">
        <div className="flex justify-center items-center w-full">
            <Button variant="ghost" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2">Parcial</Button>
            <Button variant="ghost" className="text-white">Jogos</Button>
            <Button variant="ghost" className="text-white">
                <Share2 className="w-5 h-5" />
            </Button>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-6">
          Pontuação da rodada: {totalScore.toFixed(2)}
        </Button>
      </header>
      <div className="p-4">
        <Pitch>
          <div className="flex justify-around z-10 w-full">
            {positions.ATA.map(p => <PlayerCard key={p.id} player={p} onPlayerSelect={onPlayerSelect} />)}
          </div>
          <div className="flex justify-around z-10 w-full">
            {positions.MEI.map(p => <PlayerCard key={p.id} player={p} onPlayerSelect={onPlayerSelect} />)}
          </div>
          <div className="flex justify-around z-10 w-full">
            {defenders.map(p => <PlayerCard key={p.id} player={p} onPlayerSelect={onPlayerSelect} />)}
          </div>
          <div className="flex justify-around z-10 w-full">
            {positions.GOL.map(p => <PlayerCard key={p.id} player={p} onPlayerSelect={onPlayerSelect} />)}
          </div>
        </Pitch>
        <div className="mt-4 flex flex-col gap-2">
            <AiSuggestions user={user} players={players} />
            <div className="bg-orange-500 text-white p-3 rounded-lg flex items-center justify-center space-x-2 shadow-lg text-center">
                <Clock className="w-5 h-5" />
                <span className="font-bold">MERCADO FECHADO</span>
            </div>
        </div>
      </div>
    </div>
  );
}
