
import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import PlayerStatsChart from '@/components/player-details/player-stats-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { useRef } from 'react';

interface PlayerDetailsViewProps {
  player: { id: string } & Player;
  onBack: () => void;
  onImageChange: (playerId: string, image: string) => void;
}

export default function PlayerDetailsView({ player, onBack, onImageChange }: PlayerDetailsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stats = [
    { label: 'Geral', value: 10 },
    { label: 'Verde', value: 10 },
    { label: 'Amarelo', value: 10 },
  ];

  const matches = [
    { round: 1, teams: 'Verde 1 x 2 Amarelo', points: 10 },
    { round: 2, teams: 'Azul 3 x 0 Vermelho', points: 8 },
    { round: 3, teams: 'Verde 0 x 0 Amarelo', points: 2 },
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(player.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };


  return (
    <div className="bg-gray-100 dark:bg-zinc-900 min-h-screen">
       <header className="bg-white dark:bg-zinc-800 p-4 shadow-md flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-gray-800 dark:text-gray-100">Jogador</h2>
        <div className="w-9 h-9"></div>
      </header>
      
      <div className="bg-green-500 p-4 flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20 border-4 border-white cursor-pointer" onClick={handleAvatarClick}>
            <AvatarImage src={player.img} alt={player.name} className="object-cover" />
            <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1 cursor-pointer" onClick={handleAvatarClick}>
            <Upload className="h-4 w-4 text-primary-foreground" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white">{player.name}</h3>
          <p className="text-white">{player.pos}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <Card className="bg-gray-200 dark:bg-zinc-800 border-none">
           <CardContent className="p-0">
             <Tabs defaultValue="resumo" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                    <TabsTrigger value="resumo" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Resumo</TabsTrigger>
                    <TabsTrigger value="detalhes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Detalhes</TabsTrigger>
                </TabsList>
                <TabsContent value="resumo">
                     <div className="mt-4 p-4">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">Último Jogo</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Quinta - VI Guarani - 19:00hs</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Verde 1 x 2 Amarelo</p>

                        <h4 className="font-bold text-gray-800 dark:text-gray-100 mt-4">Índice por Rodada</h4>
                        <Button className="mt-2 h-auto py-1 px-4 bg-blue-600 hover:bg-blue-700 text-white">Pontuação</Button>
                        <div className="h-[200px] mt-2">
                            <PlayerStatsChart />
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="detalhes" className="p-4">
                    <Card className="bg-gray-200 dark:bg-zinc-700">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold">Médias de pontos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-around text-center">
                          {stats.map((stat) => (
                            <div key={stat.label}>
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className="font-bold text-lg">{stat.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-6">
                      <h3 className="text-lg font-bold mb-3">Pontuação por partida</h3>
                      <div className="flex gap-2 mb-4">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Tudo</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Verde</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">Amarelo</Button>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm font-semibold text-muted-foreground mb-2 px-2">
                          <span>Rod. Confronto</span>
                          <span>Pontos da rodada</span>
                        </div>
                        <div className="space-y-2">
                          {matches.map((match) => (
                             <div key={match.round} className="flex justify-between items-center bg-white dark:bg-zinc-800 p-3 rounded-lg">
                                <div>
                                    <span className="font-bold">{match.round}</span>
                                    <span className="text-muted-foreground ml-2">{match.teams}</span>
                                </div>
                                <span className="font-bold text-lg">{match.points}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                 </TabsContent>
             </Tabs>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
