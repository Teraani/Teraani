import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddPlayerButtonProps {
  onClick: () => void;
}

export default function AddPlayerButton({ onClick }: AddPlayerButtonProps) {
  return (
    <Button 
      variant="ghost" 
      className="flex flex-col items-center justify-center text-center w-20 h-28 group text-white/50 hover:text-white" 
      onClick={onClick}
    >
      <div className="w-16 h-16 flex items-center justify-center rounded-full border-2 border-dashed border-white/30">
        <PlusCircle className="w-8 h-8" />
      </div>
      <div className="w-[70px] mt-1 text-center">
        <p className="font-semibold text-[10px] truncate px-1 pt-0.5">
          Adicionar
        </p>
      </div>
    </Button>
  );
}
