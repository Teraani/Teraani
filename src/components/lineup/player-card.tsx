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
      <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-200">
        <svg
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          className={cn(
            'w-full h-full',
            jerseyColor === 'green' ? 'fill-lime-500' : 'fill-yellow-400'
          )}
        >
          <g className="stroke-zinc-800 dark:stroke-zinc-900" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M30 20 L10 30 L15 45 L35 40 Z" />
            <path d="M70 20 L90 30 L85 45 L65 40 Z" />
            <polygon 
              points="35,25 65,25 80,42 65,40 35,40 20,42" 
              className={cn(
                jerseyColor === 'green' ? 'stroke-lime-600' : 'stroke-yellow-500'
              )}
            />
             <polygon points="35,25 65,25 60,35 40,35" className={cn(
                'stroke-none',
                jerseyColor === 'green' ? 'fill-lime-600' : 'fill-yellow-500'
              )} />
            <rect x="20" y="40" width="60" height="40" className="stroke-none" />
            <rect x="20" y="70" width="60" height="8" className={cn('stroke-none', jerseyColor === 'green' ? 'fill-lime-600' : 'fill-yellow-500' )} />
          </g>
        </svg>
      </div>
      <p className="text-white font-semibold text-sm bg-black/50 px-2 py-0.5 rounded mt-1 whitespace-nowrap">
        {player.name}
      </p>
    </button>
  );
}
