

"use client";

import { Button } from '@/components/ui/button';

const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <defs>
            <rect id="signal-icon-bg" width="100" height="100" rx="20" fill="rgba(255, 255, 255, 0.2)" />
        </defs>
        <use href="#signal-icon-bg" />
        <rect x="30" y="55" width="8" height="15" rx="3" fill="white" />
        <rect x="46" y="45" width="8" height="25" rx="3" fill="white" />
        <rect x="62" y="30" width="8" height="40" rx="3" fill="white" />
    </svg>
);


interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-primary p-8 text-primary-foreground text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold mb-4">Amistoso FC</h2>
        <div className="w-32 h-32 flex items-center justify-center mb-6">
            <SignalIcon className="w-full h-full" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">Bem-vindo!</h1>
        <p className="max-w-md">Futebol de verdade, entre amigos. Porque aqui, todo jogo é clássico!</p>
      </div>
      
      <div className="w-full">
        <Button
          onClick={onEnter}
          className="bg-white text-primary hover:bg-gray-200 font-bold w-full py-4 h-auto text-lg rounded-xl shadow-lg transition duration-300"
        >
          Entrar
        </Button>
      </div>
    </div>
  );
}
