import type { Player } from '@/lib/data';
import { cn } from '@/lib/utils';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface PlayerCardProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
  isReserve?: boolean;
}

const teamColors: Record<string, { primary: string, secondary: string }> = {
  'FLA': { primary: '#D32F2F', secondary: '#000000' }, // Red, Black
  'CRU': { primary: '#0033A0', secondary: '#FFFFFF' }, // Blue, White
  'PAL': { primary: '#006437', secondary: '#FFFFFF' }, // Green, White
  'COR': { primary: '#FFFFFF', secondary: '#000000' }, // White, Black
  'INT': { primary: '#C60017', secondary: '#FFFFFF' }, // Red, White
  'GRE': { primary: '#00A1E0', secondary: '#000000' }, // Blue, Black
  'SAO': { primary: '#FFFFFF', secondary: '#D32F2F' }, // White, Red
  'VAS': { primary: '#000000', secondary: '#FFFFFF' }, // Black, White
  'DEFAULT': { primary: '#4B5563', secondary: '#E5E7EB' }, // Gray
};

export default function PlayerCard({ player, onPlayerSelect, isReserve = false }: PlayerCardProps) {
  const colors = teamColors[player.team] || teamColors['DEFAULT'];
  const hasStripes = player.team === 'FLA' || player.team === 'GRE';

  const valColor = player.last_val >= 0 ? 'text-green-500' : 'text-red-500';
  const ValIcon = player.last_val >= 0 ? ArrowUp : ArrowDown;

  return (
    <button className="flex flex-col items-center text-center w-20 group" onClick={() => onPlayerSelect(player.id)}>
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute w-[50px] h-[50px] bg-black/30 rounded-md top-0"></div>
        <svg viewBox="0 0 48 48" className="relative w-12 h-12 z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 7L4 12V22L12 19V7Z" fill={colors.secondary} stroke="#1F2937" strokeWidth="1"/>
            <path d="M36 7L44 12V22L36 19V7Z" fill={colors.secondary} stroke="#1F2937" strokeWidth="1"/>
            <path d="M12 19L24 24L36 19V36L24 41L12 36V19Z" fill={colors.primary} stroke="#1F2937" strokeWidth="1"/>
            {hasStripes && (
                <>
                    <rect x="14" y="20" width="20" height="3" fill={colors.secondary}/>
                    <rect x="14" y="25" width="20" height="3" fill={colors.secondary}/>
                    <rect x="14" y="30" width="20" height="3" fill={colors.secondary}/>
                </>
            )}
            <path d="M12 7H36V19L24 24L12 19V7Z" fill={colors.primary} stroke="#1F2937" strokeWidth="1" />
            <text x="24" y="16" fontFamily="sans-serif" fontSize="6" fill={colors.secondary} textAnchor="middle" fontWeight="bold">{player.team}</text>
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
