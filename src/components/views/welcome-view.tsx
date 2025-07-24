
"use client";

import { Button } from '@/components/ui/button';

const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path d="M7 16V8M12 16V4M17 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
        <div className="w-32 h-32 flex items-center justify-center bg-white/20 rounded-3xl mb-6">
            <SignalIcon className="w-20 h-20 text-white" />
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
