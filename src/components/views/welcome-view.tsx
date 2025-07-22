
"use client";

import { Button } from '@/components/ui/button';

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        {...props}
    >
        <circle cx="50" cy="50" r="50" fill="white" />
        <g stroke="black" strokeWidth="1.5">
            {/* Central Pentagon */}
            <polygon fill="black" points="50,35 65,46 59,64 41,64 35,46" />
            {/* Top Hexagon */}
            <polygon fill="white" points="50,35 35,46 35,25 50,15 65,25 65,46" />
            {/* Top Right Hexagon */}
            <polygon fill="white" points="65,46 65,25 81,35 88,54 81,72 59,64" />
            {/* Bottom Right Hexagon */}
            <polygon fill="white" points="59,64 81,72 81,90 65,100 50,90 41,100" />
            <polygon fill="white" points="59,64 81,72 81,90 65,98 50,90" />
             {/* Bottom Left Hexagon */}
            <polygon fill="white" points="41,64 19,72 19,90 35,98 50,90" />
            {/* Top Left Hexagon */}
            <polygon fill="white" points="35,46 35,25 19,35 12,54 19,72 41,64" />
        </g>
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
