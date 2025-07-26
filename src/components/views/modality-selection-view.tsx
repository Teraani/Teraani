
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Users, Lock } from 'lucide-react';
import React from 'react';
import type { Modality } from '@/app/page';
import { Logo } from '../logo';

interface ModalitySelectionViewProps {
  onModalitySelect: (modality: Modality) => void;
  selectedModality: Modality | null;
  isLeagueAdmin: boolean;
}

const modalities: { name: string; players: string; type: Modality; description: string; }[] = [
  {
    name: 'Futebol de Campo',
    players: '11 jogadores',
    type: 'campo',
    description: 'A experiência clássica do futebol, com 11 jogadores de cada lado.'
  },
  {
    name: 'Society',
    players: '7 jogadores',
    type: 'society',
    description: 'Jogo rápido e dinâmico em campo reduzido.'
  },
  {
    name: 'Futsal',
    players: '5 jogadores',
    type: 'futsal',
    description: 'Técnica e habilidade na quadra.'
  },
];

export default function ModalitySelectionView({ onModalitySelect, selectedModality, isLeagueAdmin }: ModalitySelectionViewProps) {

  const handleSelect = (modalityType: Modality) => {
    onModalitySelect(modalityType);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground">
      <header className="text-center mb-8">
        <div className="w-20 h-20 bg-black/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <Logo className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Escolha a Modalidade da Liga</h1>
        <p className="text-primary-foreground/80 mt-2">
          {isLeagueAdmin
            ? "Como admin da liga, selecione o tipo de jogo para todos os participantes."
            : "Aguardando o administrador da liga escolher a modalidade."
          }
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-6">
        {modalities.map((modality) => {
          const isSelected = selectedModality === modality.type;
          const isDisabled = !isLeagueAdmin || (selectedModality !== null && !isSelected);

          return (
            <Card
              key={modality.type}
              className={cn(
                "w-full max-w-md transition-all bg-black/20 border-white/20 text-primary-foreground",
                isSelected && "border-white/80 border-2 shadow-2xl",
                !isDisabled && "cursor-pointer hover:bg-black/30",
                isDisabled && "bg-black/10 text-primary-foreground/50"
              )}
              onClick={() => !isDisabled && handleSelect(modality.type)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{modality.name}</CardTitle>
                  {isDisabled && !isSelected && (
                    <Lock className="w-5 h-5 text-primary-foreground/50" />
                  )}
                   {isSelected && (
                    <div className="text-xs font-bold text-primary bg-primary-foreground px-2 py-1 rounded-full">SELECIONADO</div>
                  )}
                </div>
                <CardDescription className="text-primary-foreground/80">{modality.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={cn("flex items-center", isDisabled ? "text-primary-foreground/50" : "text-primary-foreground/80")}>
                  <Users className="w-5 h-5 mr-2" />
                  <span>{modality.players}</span>
                </div>
              </CardContent>
              {isLeagueAdmin && (
                 <CardFooter>
                    <Button
                      className="w-full bg-white text-primary hover:bg-gray-200"
                      disabled={isDisabled}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent double event firing
                        if (!isDisabled) handleSelect(modality.type);
                      }}
                    >
                      {isSelected ? 'Confirmado' : 'Confirmar Modalidade'}
                    </Button>
                  </CardFooter>
              )}
            </Card>
          );
        })}
      </main>

       <footer className="text-center text-xs text-primary-foreground/80 mt-8">
            <p>
                A modalidade é definida para toda a liga. Apenas o administrador pode alterá-la.
            </p>
        </footer>
    </div>
  );
}
