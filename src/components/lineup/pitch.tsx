import type { ReactNode } from 'react';
import type { Modality } from '@/app/page';
import { cn } from '@/lib/utils';

interface PitchProps {
  children: ReactNode;
  modality?: Modality | null;
}

export default function Pitch({ children, modality }: PitchProps) {
  const getPitchStyles = () => {
    switch (modality) {
      case 'futsal':
        return {
          className: 'bg-blue-600',
          gradient: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(to bottom, #3b82f6, #2563eb)`
        };
      case 'society':
         return {
          className: 'bg-[#068f44]',
          gradient: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(to bottom, #069b4a, #068f44)`
        };
      case 'campo':
      default:
        return {
          className: 'bg-[#057F3A]',
          gradient: `linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.15)), linear-gradient(to bottom, #059649, #057F3A)`
        };
    }
  };

  const { className, gradient } = getPitchStyles();

  return (
    <div className={cn("pitch-container w-full h-[600px] rounded-lg mx-auto relative overflow-hidden border-2 border-white/30", className)} style={{ backgroundImage: gradient }}>
      {/* Field Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 border-2 border-white/30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-16 border-2 border-b-2 border-t-0 border-white/30 rounded-b-xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-16 border-2 border-t-2 border-b-0 border-white/30 rounded-t-xl" />
      
      {/* Grid for player positioning */}
      <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 z-10">
        {children}
      </div>
    </div>
  );
}
