import type { Player, User } from '@/lib/data';
import Pitch from '@/components/lineup/pitch';
import PlayerCard from '@/components/lineup/player-card';
import AiSuggestions from '@/components/lineup/ai-suggestions';
import { Clock } from 'lucide-react';

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
    <div>
      <header className="bg-gray-800 dark:bg-zinc-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <h2 className="text-xl font-bold">Minha Escalação</h2>
        <div className="text-right">
          <p className="text-sm">Pontos</p>
          <p className="font-bold text-lg text-green-400">{totalScore.toFixed(2)}</p>
        </div>
      </header>
      <div className="p-4">
        <p className="text-center text-gray-600 dark:text-gray-300 mb-4">
          Este é o seu time para a rodada. Clique em um jogador para ver mais detalhes ou use a IA para sugestões.
        </p>
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
