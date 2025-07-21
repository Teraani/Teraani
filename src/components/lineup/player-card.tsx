import type { Player } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';
import type { ShirtColor } from '@/components/views/lineup-view';

interface PlayerCardProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
  isReserve?: boolean;
  shirtColor?: ShirtColor;
}

const teamShirtColors: Record<ShirtColor, string> = {
  verde: '#006437', // Green
  amarelo: '#FDB913', // Yellow
  preto: '#231F20', // Black
  vermelho: '#D32F2F', // Red
  branco: '#FFFFFF', // White
};

export default function PlayerCard({ player, onPlayerSelect, isReserve = false, shirtColor = 'verde' }: PlayerCardProps) {
  const valColor = player.last_val >= 0 ? 'text-green-500' : 'text-red-500';
  const ValIcon = player.last_val >= 0 ? ArrowUp : ArrowDown;
  const primaryColor = isReserve ? '#4B5563' : teamShirtColors[shirtColor];
  const secondaryColor = shirtColor === 'branco' ? '#231F20' : '#FFFFFF';

  return (
    <button className="flex flex-col items-center text-center w-20 group" onClick={() => onPlayerSelect(player.id)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg viewBox="0 0 48 48" className="relative w-12 h-12 z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path d="M12 7L4 12V22L12 19V7Z" fill={secondaryColor} stroke="#1F2937" strokeWidth="1"/>
                <path d="M36 7L44 12V22L36 19V7Z" fill={secondaryColor} stroke="#1F2937" strokeWidth="1"/>
                <path d="M12 19L24 24L36 19V36L24 41L12 36V19Z" fill={primaryColor} stroke="#1F2937" strokeWidth="1"/>
                <path d="M12 7H36V19L24 24L12 19V7Z" fill={primaryColor} stroke="#1F2937" strokeWidth="1" />
                <text x="24" y="16" fontFamily="sans-serif" fontSize="6" fill={secondaryColor} textAnchor="middle" fontWeight="bold">{player.team}</text>
            </g>
        </svg>
      </div>

      <div className={cn(
        "w-[70px] -mt-2.5 rounded-sm shadow-md",
        isReserve ? "bg-gray-700" : "bg-blue-800"
      )}>
        <p className="text-white font-semibold text-[10px] truncate px-1 pt-0.5">
          {player.name}
        </p>
        <div className="flex items-center justify-center text-[10px] text-white/80 pb-0.5">
          <span>{player.points.toFixed(2)}</span>
          <ValIcon className={cn("w-2.5 h-2.5 ml-1", valColor)} />
        </div>
      </div>
    </button>
  );
}
