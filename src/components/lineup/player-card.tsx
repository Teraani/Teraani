import type { Player } from '@/lib/data';
import { cn } from '@/lib/utils';

interface PlayerCardProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
  jerseyColor: 'green' | 'yellow';
}

export default function PlayerCard({ player, onPlayerSelect, jerseyColor }: PlayerCardProps) {
  return (
    <button className="flex flex-col items-center text-center w-20 group" onClick={() => onPlayerSelect(player.id)}>
      <div className="relative w-14 h-14 group-hover:scale-110 transition-transform duration-200">
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" 
          className={cn(
            'w-full h-full',
            jerseyColor === 'green' ? 'fill-lime-500' : 'fill-yellow-400'
          )}>
          <path d="M25,10 L75,10 L78,20 L95,25 L85,35 L80,30 L80,90 L20,90 L20,30 L15,35 L5,25 L22,20 Z" />
          <path d="M40,10 Q50,5,60,10 L50,20 Z" fillOpacity="0.3"/>
          <path d="M20,35 L80,35 L80,45 L20,45 Z" fillOpacity="0.2"/>
        </svg>
      </div>
      <p className="text-white font-semibold text-sm bg-black/50 px-2 py-0.5 rounded mt-1 whitespace-nowrap">
        {player.name}
      </p>
    </button>
  );
}
