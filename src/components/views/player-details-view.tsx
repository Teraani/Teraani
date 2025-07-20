import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Star } from 'lucide-react';
import PlayerStatsChart from '@/components/player-details/player-stats-chart';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface PlayerDetailsViewProps {
  player: { id: string } & Player;
  onBack: () => void;
}

export default function PlayerDetailsView({ player, onBack }: PlayerDetailsViewProps) {
  const valColor = player.last_val >= 0 ? 'text-green-600' : 'text-red-600';
  const valSign = player.last_val >= 0 ? '▲' : '▼';

  return (
    <div>
      <header className="bg-gray-800 dark:bg-zinc-800 text-white p-4 shadow-md flex justify-between items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold">{player.name}</h2>
        <Button variant="ghost" size="icon">
          <Star className="h-6 w-6" />
        </Button>
      </header>
      <div className="p-4 space-y-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <Image
              src={player.img}
              alt={player.name}
              width={80}
              height={80}
              data-ai-hint="player portrait"
              className="rounded-full border-4 border-gray-200 dark:border-gray-700"
            />
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{player.pos} · {player.team} · {player.games} JOGOS</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{player.points.toFixed(2)} pts</p>
              <p className={cn("font-semibold", valColor)}>
                VALORIZAÇÃO: {valSign} C$ {Math.abs(player.last_val).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estatísticas da Rodada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <PlayerStatsChart />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximo Jogo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-4 text-lg font-bold text-gray-800 dark:text-gray-100">
              <Image src="https://placehold.co/40x40" alt="Time 1" data-ai-hint="team logo" className="w-10 h-10 rounded-full" width={40} height={40}/>
              <span>X</span>
              <Image src="https://placehold.co/40x40" alt="Time 2" data-ai-hint="team logo" className="w-10 h-10 rounded-full" width={40} height={40}/>
            </div>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">HOJE · MARACANÃ · 19:30</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
