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
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
          className={cn(
            'w-full h-full',
            jerseyColor === 'green' ? 'fill-lime-500' : 'fill-yellow-400'
          )}>
            <path d="M12 2C9.243 2 7 4.243 7 7v7.586l-1.707-1.707-1.414 1.414L12 22.414l8.121-8.121-1.414-1.414L17 14.586V7c0-2.757-2.243-5-5-5zM9 7c0-1.654 1.346-3 3-3s3 1.346 3 3v7h-6V7z" />
        </svg>
      </div>
      <p className="text-white font-semibold text-sm bg-black/50 px-2 py-0.5 rounded mt-1 whitespace-nowrap">
        {player.name}
      </p>
    </button>
  );
}
