
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Trophy, PlusCircle, LogIn } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Logo } from '../logo';
import { cn } from '@/lib/utils';

interface LeagueEntryViewProps {
  onCreateLeague: (leagueName: string) => void;
}

export default function LeagueEntryView({ onCreateLeague }: LeagueEntryViewProps) {
  const [leagueName, setLeagueName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const handleCreateLeague = () => {
    if (leagueName.trim()) {
      onCreateLeague(leagueName.trim());
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground text-center">
      <header className="text-center mb-8 flex-1 flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-black/20 rounded-2xl flex items-center justify-center mb-4 mx-auto">
            <Logo className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Bem-vindo ao Amistosos FC!</h1>
        <p className="text-primary-foreground/80 mt-2 max-w-md mx-auto">
          Crie sua própria liga para jogar com seus amigos ou entre em uma liga existente com um código de convite.
        </p>
      </header>

      <main className="flex-1 flex flex-col items-center justify-start">
        <Tabs defaultValue="create" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-black/10 text-primary-foreground/80">
            <TabsTrigger value="create" className="data-[state=active]:bg-white/90 data-[state=active]:text-primary data-[state=active]:shadow-md">
                <PlusCircle className="w-4 h-4 mr-2" />
                Criar Liga
            </TabsTrigger>
            <TabsTrigger value="join" className="data-[state=active]:bg-white/90 data-[state=active]:text-primary data-[state=active]:shadow-md">
                <LogIn className="w-4 h-4 mr-2" />
                Entrar na Liga
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create">
            <Card className="bg-transparent border-none shadow-none text-left">
              <CardHeader className="p-2 pt-4">
                <CardTitle>Crie sua Liga</CardTitle>
                <CardDescription className="text-primary-foreground/70">Dê um nome para sua nova liga e comece a convidar seus amigos.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-2">
                <Input
                  placeholder="Ex: Liga dos Amigos de Quinta"
                  value={leagueName}
                  onChange={(e) => setLeagueName(e.target.value)}
                  className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 border-primary-foreground/20"
                />
                <Button onClick={handleCreateLeague} className="w-full bg-white text-primary hover:bg-gray-200 h-12" disabled={!leagueName.trim()}>
                    <Trophy className="w-4 h-4 mr-2" />
                    Criar e Continuar
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="join">
             <Card className="bg-transparent border-none shadow-none text-left">
              <CardHeader className="p-2 pt-4">
                <CardTitle>Entrar em uma Liga</CardTitle>
                <CardDescription className="text-primary-foreground/70">Peça o código de convite para o administrador da liga.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-2">
                <Input
                  placeholder="Insira o código de convite"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                   className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 border-primary-foreground/20"
                />
                <Button onClick={() => alert("Funcionalidade de entrar com código em breve!")} className="w-full bg-white text-primary hover:bg-gray-200 h-12" disabled>
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
