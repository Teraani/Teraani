import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AddPlayerButtonProps {
  onClick: () => void;
  variant?: 'pitch' | 'default';
}

export default function AddPlayerButton({ onClick, variant = 'default' }: AddPlayerButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "flex flex-col items-center justify-center text-center w-16 h-24 group p-0",
        variant === 'pitch' ? 'text-white/50 hover:text-white' : 'text-muted-foreground hover:text-foreground'
      )}
      onClick={onClick}
    >
      <div className={cn(
        "w-8 h-8 flex items-center justify-center rounded-full border-2 border-dashed",
         variant === 'pitch' ? 'border-white/30 group-hover:border-white' : 'border-border'
      )}>
        <PlusCircle className="w-5 h-5" />
      </div>
    </Button>
  );
}
