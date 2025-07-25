
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Trophy, PlusCircle, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface LeagueEntryViewProps {
  onCreateLeague: (leagueName: string) => void;
}

const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M7 16V12M12 16V8M17 16V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function LeagueEntryView({ onCreateLeague }: LeagueEntryViewProps) {
  const [leagueName, setLeagueName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreateLeague = () => {
    if (leagueName.trim()) {
      onCreateLeague(leagueName.trim());
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background p-6">
      <header className="text-center mb-8">
         <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <SignalIcon className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Bem-vindo ao Amistosos FC!</h1>
        <p className="text-muted-foreground mt-2 max-w-md mx-auto">
          Crie sua própria liga para jogar com seus amigos ou entre em uma liga existente com um código de convite.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center">
        <Tabs defaultValue="create" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Liga
            </TabsTrigger>
            <TabsTrigger value="join">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar na Liga
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardTitle>Crie sua Liga</CardTitle>
                <CardDescription>Dê um nome para sua nova liga e comece a convidar seus amigos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Ex: Liga dos Amigos de Quinta"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                />
                <Button onClick={handleCreateLeague} className="w-full" disabled={!leagueName.trim()}>
                    <Trophy className="w-4 h-4 mr-2" />
                    Criar e Continuar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="join">
            <Card>
              <CardHeader>
                <CardTitle>Entrar em uma Liga</CardTitle>
                <CardDescription>Peça o código de convite para o administrador da liga.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Insira o código de convite"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
                <Button onClick={() => alert("Funcionalidade de entrar com código em breve!")} className="w-full" disabled>
                    Entrar na Liga
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
