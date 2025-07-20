import type { Player } from '@/lib/data';
import Image from 'next/image';

interface PlayerCardProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
}

export default function PlayerCard({ player, onPlayerSelect }: PlayerCardProps) {
  return (
    <button className="flex flex-col items-center text-center w-20 group" onClick={() => onPlayerSelect(player.id)}>
      <div className="relative w-14 h-14">
        <Image
          src={player.img}
          alt={player.name}
          width={56}
          height={56}
          data-ai-hint="player portrait"
          className="rounded-full border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-200"
        />
      </div>
      <p className="text-white font-semibold text-sm bg-black/50 px-2 py-0.5 rounded mt-1 whitespace-nowrap">
        {player.name}
      </p>
      <p className="text-yellow-300 font-bold text-xs">C$ {player.value.toFixed(2)}</p>
    </button>
  );
}
