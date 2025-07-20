import type { Player } from '@/lib/data';

interface PlayerCardProps {
  player: { id: string } & Player;
  onPlayerSelect: (playerId: string) => void;
}

export default function PlayerCard({ player, onPlayerSelect }: PlayerCardProps) {
  return (
    <button className="flex flex-col items-center text-center w-20 group" onClick={() => onPlayerSelect(player.id)}>
      <div className="relative w-16 h-16 group-hover:scale-110 transition-transform duration-200">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M12 2L3 5V12C3 18.16 7.12 22.42 12 24C16.88 22.42 21 18.16 21 12V5L12 2ZM11 15H9V13H11V15ZM11 11H9V9H11V11ZM15 15H13V13H15V15ZM15 11H13V9H15V11Z" fill="#a3e635"/>
          <path d="M11 15H9V13H11V15ZM11 11H9V9H11V11ZM15 15H13V13H15V15ZM15 11H13V9H15V11Z" fill="white"/>
        </svg>
      </div>
      <p className="text-white font-semibold text-sm bg-black/50 px-2 py-0.5 rounded mt-1 whitespace-nowrap">
        {player.name}
      </p>
    </button>
  );
}
