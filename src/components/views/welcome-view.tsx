
"use client";

import { Button } from '@/components/ui/button';

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      {...props}
    >
      <defs>
        <clipPath id="circle-clip">
          <circle cx="100" cy="100" r="100" />
        </clipPath>
      </defs>
      <g clipPath="url(#circle-clip)">
        <circle cx="100" cy="100" r="100" fill="white" />
        {/* Central Pentagon */}
        <polygon points="100,70 128.5,89 117,121 83,121 71.5,89" fill="black" stroke="black" strokeWidth="1"/>
        {/* Top Hexagon */}
        <polygon points="100,70 71.5,89 71.5,55 100,40 128.5,55 128.5,89" fill="white" stroke="black" strokeWidth="1"/>
        {/* Top-right Hexagon */}
        <polygon points="128.5,89 128.5,55 157,70 170,100 157,121 117,121" fill="white" stroke="black" strokeWidth="1"/>
        {/* Bottom-right Hexagon */}
        <polygon points="117,121 157,121 157,155 128.5,170 100,155 83,170" fill="white" stroke="black" strokeWidth="1"/>
        <polygon points="117,121 157,121 157,155 128.5,170 100,155" fill="white" stroke="black" strokeWidth="1"/>
         {/* Bottom-left Hexagon */}
        <polygon points="83,121 43,121 43,155 71.5,170 100,155" fill="white" stroke="black" strokeWidth="1"/>
        {/* Top-left Hexagon */}
        <polygon points="71.5,89 71.5,55 43,70 30,100 43,121 83,121" fill="white" stroke="black" strokeWidth="1"/>
        {/* Shaded parts to give 3D illusion */}
        <polygon points="157,70 170,100 185,90 185,70" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
        <polygon points="43,70 30,100 15,90 15,70" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
        <polygon points="157,155 128.5,170 140,185 170,180" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
        <polygon points="43,155 71.5,170 60,185 30,180" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
         <polygon points="100,40 71.5,55 60,40" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
         <polygon points="100,40 128.5,55 140,40" fill="#f0f0f0" stroke="black" strokeWidth="1"/>
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
