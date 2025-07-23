
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Users, Lock } from 'lucide-react';
import React from 'react';
import type { Modality } from '@/app/page';

interface ModalitySelectionViewProps {
  onModalitySelect: (modality: Modality) => void;
  selectedModality: Modality | null;
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
    players: '6 jogadores',
    type: 'futsal',
    description: 'Técnica e habilidade na quadra.'
  },
];

export default function ModalitySelectionView({ onModalitySelect, selectedModality }: ModalitySelectionViewProps) {

  const handleSelect = (modalityType: Modality) => {
    onModalitySelect(modalityType);
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Escolha a Modalidade</h1>
        <p className="text-muted-foreground mt-2">
          {selectedModality 
            ? "Você selecionou sua modalidade. Para trocar, será necessário o plano PRO."
            : "Selecione o tipo de jogo que você quer gerenciar."
          }
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-6">
        {modalities.map((modality) => {
          const isSelected = selectedModality === modality.type;
          const isDisabled = selectedModality !== null && !isSelected;

          return (
            <Card
              key={modality.type}
              className={cn(
                "w-full max-w-md transition-all",
                isSelected && "border-primary border-2",
                !isDisabled && "cursor-pointer hover:shadow-lg",
                isDisabled && "border-border bg-muted/50"
              )}
              onClick={() => !isDisabled && handleSelect(modality.type)}
            >
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{modality.name}</CardTitle>
                  {isDisabled && (
                    <Lock className="w-5 h-5 text-muted-foreground" />
                  )}
                   {isSelected && (
                    <div className="text-xs font-bold text-primary-foreground bg-primary px-2 py-1 rounded-full">SELECIONADO</div>
                  )}
                </div>
                <CardDescription>{modality.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-muted-foreground">
                  <Users className="w-5 h-5 mr-2" />
                  <span>{modality.players}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full"
                  disabled={isDisabled}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent double event firing
                    if (!isDisabled) handleSelect(modality.type);
                  }}
                >
                  {isSelected ? 'Continuar' : isDisabled ? 'Bloqueado (PRO)' : 'Selecionar'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </main>

       <footer className="text-center text-xs text-muted-foreground mt-8">
            <p>
                A troca de modalidade estará disponível em breve no plano PRO.
            </p>
        </footer>
    </div>
  );
}
