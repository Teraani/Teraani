
"use client";

import { Button } from '@/components/ui/button';

const SoccerBallIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" fill="white" stroke="black" />
      <polygon points="12 5.1 15.9 8.1 14.4 12.9 9.6 12.9 8.1 8.1" fill="black" />
      <polygon points="12 5.1 8.1 8.1 9.6 12.9" fill="none" stroke="black" />
      <polygon points="12 5.1 15.9 8.1 14.4 12.9" fill="none" stroke="black" />
      <polygon points="8.1 8.1 4.2 11.1 5.7 15.9 9.6 12.9" fill="none" stroke="black" />
      <polygon points="15.9 8.1 19.8 11.1 18.3 15.9 14.4 12.9" fill="none" stroke="black" />
      <polygon points="9.6 12.9 5.7 15.9 8.1 18.9 12 16.9" fill="none" stroke="black" />
      <polygon points="14.4 12.9 18.3 15.9 15.9 18.9 12 16.9" fill="none" stroke="black" />
      <polygon points="12 16.9 8.1 18.9 9.6 22" fill="black" />
      <polygon points="12 16.9 15.9 18.9 14.4 22" fill="black" />
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
