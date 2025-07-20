import type { ReactNode } from 'react';

interface PitchProps {
  children: ReactNode;
}

export default function Pitch({ children }: PitchProps) {
  return (
    <div className="pitch w-full h-[600px] rounded-lg mx-auto flex flex-col justify-around items-center relative overflow-hidden bg-[#057F3A] border-2 border-white/30">
      {/* Field Lines */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/30 rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/30 rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-16 border-2 border-b-2 border-t-0 border-white/30 rounded-b-xl" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[40%] h-16 border-2 border-t-2 border-b-0 border-white/30 rounded-t-xl" />

      <style jsx>{`
        .pitch {
          background-image: linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(0,0,0,0.15)),
                            linear-gradient(to bottom, #059649, #057F3A);
        }
      `}</style>
      
      {children}
    </div>
  );
}
