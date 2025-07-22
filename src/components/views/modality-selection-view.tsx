
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Users, Lock } from 'lucide-react';
import React from 'react';

interface ModalitySelectionViewProps {
  onModalitySelect: (modality: 'campo' | 'society' | 'futsal') => void;
}

const modalities = [
  {
    name: 'Futebol de Campo',
    players: '11 jogadores',
    type: 'campo',
    isFree: true,
    description: 'A experiência clássica do futebol, com 11 jogadores de cada lado.'
  },
  {
    name: 'Society',
    players: '8 jogadores',
    type: 'society',
    isFree: false,
    description: 'Jogo rápido e dinâmico em campo reduzido.'
  },
  {
    name: 'Futsal',
    players: '6 jogadores',
    type: 'futsal',
    isFree: false,
    description: 'Técnica e habilidade na quadra.'
  },
];

export default function ModalitySelectionView({ onModalitySelect }: ModalitySelectionViewProps) {
  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Escolha a Modalidade</h1>
        <p className="text-muted-foreground mt-2">Selecione o tipo de jogo que você quer gerenciar.</p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center space-y-6">
        {modalities.map((modality) => (
          <Card
            key={modality.type}
            className={cn(
              "w-full max-w-md transition-all",
              modality.isFree ? "border-primary border-2 cursor-pointer hover:shadow-lg" : "border-border bg-muted/50"
            )}
            onClick={() => modality.isFree && onModalitySelect(modality.type as any)}
          >
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{modality.name}</CardTitle>
                {modality.isFree ? (
                  <div className="text-xs font-bold text-primary-foreground bg-primary px-2 py-1 rounded-full">GRÁTIS</div>
                ) : (
                  <Lock className="w-5 h-5 text-muted-foreground" />
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
                disabled={!modality.isFree}
                onClick={() => modality.isFree && onModalitySelect(modality.type as any)}
              >
                {modality.isFree ? 'Selecionar' : 'Disponível no Plano PRO'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </main>

       <footer className="text-center text-xs text-muted-foreground mt-8">
            <p>
                As modalidades pagas estarão disponíveis em breve.
            </p>
        </footer>
    </div>
  );
}
