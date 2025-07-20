"use client";

import { Button } from '@/components/ui/button';

interface WelcomeViewProps {
  onEnter: () => void;
}

export default function WelcomeView({ onEnter }: WelcomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-primary p-4 text-primary-foreground text-center">
      <h1 className="text-4xl font-extrabold mb-4">AmistososAI FC</h1>
      <p className="text-lg mb-8 max-w-md">Escale seu time, participe de ligas e mostre que você sabe mitar!</p>
      <Button
        onClick={onEnter}
        className="bg-white text-primary hover:bg-gray-200 font-bold py-3 px-12 h-auto text-lg rounded-lg shadow-lg transition duration-300"
      >
        ENTRAR
      </Button>
    </div>
  );
}
