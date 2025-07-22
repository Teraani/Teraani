
"use client";

import { Button } from '@/components/ui/button';

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        {...props}
    >
        <circle cx="50" cy="50" r="48" fill="white" stroke="black" strokeWidth="1" />
        <polygon points="50,30 65,42 58,60 42,60 35,42" fill="black" />
        <polygon points="50,30 35,42 30,25 50,15 70,25 65,42" fill="white" stroke="black" strokeWidth="1" />
        <polygon points="65,42 70,25 85,35 85,65 70,75 58,60" fill="white" stroke="black" strokeWidth="1" />
        <polygon points="58,60 70,75 50,85 30,75 42,60" fill="white" stroke="black" strokeWidth="1" />
        <polygon points="42,60 30,75 15,65 15,35 30,25 35,42" fill="white" stroke="black" strokeWidth="1" />
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
        <div className="w-24 h-24 flex items-center justify-center mb-6">
            <SoccerBallIcon className="w-24 h-24" />
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
