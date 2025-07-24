
"use client";

import { Button } from '@/components/ui/button';

const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path 
            d="M50 10 C 50 10, 90 25, 90 50 C 90 75, 50 90, 50 90 C 50 90, 10 75, 10 50 C 10 25, 50 10, 50 10 Z" 
            fill="rgba(255, 255, 255, 0.2)"
            stroke="white"
            strokeWidth="3"
        />
        <path
            d="M35 40 L 65 40 L 65 60 L 50 70 L 35 60 Z"
            fill="white"
        />
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
            <ShieldIcon className="w-full h-full" />
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
