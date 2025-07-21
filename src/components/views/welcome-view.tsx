"use client";

import { Button } from '@/components/ui/button';
import { BarChart } from 'lucide-react';

interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-primary p-8 text-primary-foreground text-center">
      <div className="w-full text-left">
         {/* Placeholder for top bar content if needed */}
      </div>

      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
            <BarChart className="w-12 h-12 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4">Bem-vindo!</h1>
        <p className="text-lg mb-8 max-w-md">Escale seu time, participe de ligas e mostre que você sabe mitar!</p>
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
