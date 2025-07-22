
"use client";

import { Button } from '@/components/ui/button';

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="10" fill="white" stroke="black" />
    {/* Center pentagon */}
    <polygon points="12,9 14.3,12.5 11,15.5 9.7,12.5 12,9" fill="#333" stroke="black" />
    {/* Top hexagon */}
    <polygon points="12,9 9.7,12.5 7.7,12.5 7.7,8 9.7,5.5 12,5.5" fill="white" stroke="black" />
    <polygon points="12,9 14.3,12.5 16.3,12.5 16.3,8 14.3,5.5 12,5.5" fill="white" stroke="black" />
    {/* Bottom hexagons */}
    <polygon points="11,15.5 9.7,12.5 7.7,12.5 7.7,17 9.7,18.5 11,18.5" fill="white" stroke="black" />
    <polygon points="13,15.5 14.3,12.5 16.3,12.5 16.3,17 14.3,18.5 13,18.5" fill="white" stroke="black" />
    <polygon points="11,15.5 13,15.5 14.3,18.5 12,20 9.7,18.5" fill="white" stroke="black" />
    {/* Side partial pentagons */}
    <path d="M7.7,8 L7.7,17 L6,18 L3.5,15 L3.5,10 L6,7 Z" fill="#555" stroke="black" />
    <path d="M16.3,8 L16.3,17 L18,18 L20.5,15 L20.5,10 L18,7 Z" fill="#555" stroke="black" />
    <path d="M9.7,5.5 L14.3,5.5 L16,4 L12,2 L8,4 Z" fill="#555" stroke="black" />
  </svg>
);


interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary p-8 text-primary-foreground text-center">
      <header className="w-full h-10">
        <h2 className="text-2xl font-bold">Amistoso FC</h2>
      </header>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <SoccerBallIcon className="w-16 h-16 text-black" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Bem-vindo!</h1>
        <p className="text-lg mb-8 max-w-md">
            Futebol de verdade, entre amigos. Porque aqui, todo jogo é clássico!
        </p>
      </div>
      
      <div className="w-full">
        <Button
          onClick={onEnter}
          className="bg-white text-primary hover:bg-gray-200 font-bold w-full py-4 h-auto text-lg rounded-xl shadow-lg transition duration-300"
        >
          ENTRAR
        </Button>
      </div>
    </div>
  );
}
