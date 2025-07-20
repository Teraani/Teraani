import type { Player, User } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ScorersCardProps {
  user: User;
  players: Record<string, Player>;
}

const ScorerItem = ({ player, label, colorClass }: { player: Player, label: string, colorClass: string }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <Avatar className="w-12 h-12">
        <Image src={player.img} alt={player.name} width={48} height={48} data-ai-hint="player portrait" className="object-cover" />
        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-semibold text-gray-800 dark:text-gray-200">{player.name}</p>
      </div>
    </div>
    <span className={cn("font-bold text-lg", colorClass)}>{player.points.toFixed(2)}</span>
  </div>
);


export default function ScorersCard({ user, players }: ScorersCardProps) {
  const lineupPlayers = user.lineup.map(id => ({ ...players[id], id }));
  const topScorer = lineupPlayers.reduce((max, p) => p.points > max.points ? p : max, lineupPlayers[0]);
  const lowScorer = lineupPlayers.reduce((min, p) => p.points < min.points ? p : min, lineupPlayers[0]);

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Seus Pontuadores</h3>
      <Card>
        <CardContent className="p-4 space-y-3">
          {topScorer && <ScorerItem player={topScorer} label="Maior pontuador" colorClass="text-green-600" />}
          {lowScorer && <ScorerItem player={lowScorer} label="Menor pontuador" colorClass="text-red-600" />}
        </CardContent>
      </Card>
    </div>
  );
}
