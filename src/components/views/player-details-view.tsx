import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import PlayerStatsChart from '@/components/player-details/player-stats-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PlayerDetailsViewProps {
  player: { id: string } & Player;
  onBack: () => void;
}

export default function PlayerDetailsView({ player, onBack }: PlayerDetailsViewProps) {

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 min-h-screen">
      <header className="bg-primary text-primary-foreground p-4 shadow-md flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-primary/80">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Jogador</h2>
        <div className="w-9 h-9"></div>
      </header>
      <div className="p-4 space-y-4">
        <Card className="bg-gray-200 dark:bg-zinc-800 border-none">
          <CardContent className="p-4 text-center text-gray-800 dark:text-gray-100">
            <h3 className="text-2xl font-bold">{player.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{player.pos} - {player.team} - {player.games} Jogos</p>
            <div className="mt-4">
              <p className="text-sm">Pontos</p>
              <p className="text-2xl font-bold">{player.points.toFixed(2)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/20 dark:bg-accent/10 border-accent/50">
          <CardContent className="p-4 text-center">
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Último Jogo</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Quinta - VI Guarani - 19:00hs</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Verde 1 x 2 Amarelo</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-200 dark:bg-zinc-800 border-none">
           <CardContent className="p-4">
             <h3 className="text-lg font-bold text-center text-gray-800 dark:text-gray-100">Estatística Pro</h3>
             <Tabs defaultValue="resumo" className="w-full mt-2">
                <TabsList className="grid w-full grid-cols-2 bg-transparent p-0">
                    <TabsTrigger value="resumo" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Resumo</TabsTrigger>
                    <TabsTrigger value="detalhes" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Detalhes</TabsTrigger>
                </TabsList>
                <TabsContent value="resumo">
                     <div className="mt-4">
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">Índice por Rodada</h4>
                         <Button className="mt-2 h-auto py-1 px-4 bg-blue-600 hover:bg-blue-700 text-white">Pontuação</Button>
                        <div className="h-[200px] mt-2">
                            <PlayerStatsChart />
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="detalhes">
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 py-8">Detalhes das estatísticas em breve.</p>
                 </TabsContent>
             </Tabs>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}