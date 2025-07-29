
"use client";

import { Button } from '@/components/ui/button';
import { Logo } from '../logo';
import type { View } from '@/app/page';

interface WelcomeViewProps {
  onNavigate: (view: View) => void;
}

export default function WelcomeView({ onNavigate }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-between h-screen bg-primary p-8 text-primary-foreground text-center">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-32 h-32 flex items-center justify-center bg-white/20 rounded-3xl mb-6">
          <Logo className="w-24 h-24 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold mb-2">Bem-vindo!</h1>
        <p className="max-w-md">Futebol de verdade, entre amigos. Porque aqui, todo jogo é clássico!</p>
      </div>
      
      <div className="w-full max-w-sm space-y-4">
        <Button
          onClick={() => onNavigate('login')}
          className="bg-white text-primary hover:bg-gray-200 font-bold w-full py-4 h-auto text-lg rounded-xl shadow-lg transition duration-300"
        >
          Entrar
        </Button>
        <Button
          onClick={() => onNavigate('register')}
          variant="outline"
          className="bg-transparent border-white text-white hover:bg-white/10 font-bold w-full py-4 h-auto text-lg rounded-xl shadow-lg transition duration-300"
        >
          Criar Conta
        </Button>
      </div>
    </div>
  );
}
