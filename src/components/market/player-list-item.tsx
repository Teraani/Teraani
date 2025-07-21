import type { Player } from '@/lib/data';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '../ui/badge';

interface PlayerListItemProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
  isScaled?: boolean;
}

export default function PlayerListItem({ player, onPlayerSelect, isScaled }: PlayerListItemProps) {
  const valColor = player.last_val >= 0 ? 'text-green-600' : 'text-red-600';
  const valSign = player.last_val >= 0 ? '+' : '';

  return (
    <Card 
        className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors"
        onClick={() => onPlayerSelect(player.id)}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="w-12 h-12">
            <AvatarImage src={player.img} alt={player.name} data-ai-hint="player portrait" className="object-cover"/>
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-800 dark:text-gray-100">{player.name}</p>
            {isScaled && <Badge variant="secondary" className="text-xs">Escalado</Badge>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{player.pos}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{player.value.toFixed(2)}</p>
        <p className={cn("text-sm font-semibold", valColor)}>{valSign}{player.last_val.toFixed(2)}</p>
      </div>
    </Card>
  );
}
