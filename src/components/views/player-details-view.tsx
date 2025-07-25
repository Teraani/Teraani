
import type { Player, Game } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload } from 'lucide-react';
import PlayerStatsChart from '@/components/player-details/player-stats-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import Image from 'next/image';
import { useRef, useMemo } from 'react';

interface PlayerDetailsViewProps {
  player: { id: string } & Player;
  games: Record<string, Game>;
  onBack: () => void;
  onImageChange: (playerId: string, image: string) => void;
}

export default function PlayerDetailsView({ player, games, onBack, onImageChange }: PlayerDetailsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const averagePoints = player.games > 0 && player.points ? (player.points / player.games) : 0;
  
  const lastGamePerformance = useMemo(() => {
    if (!player.performanceHistory || player.performanceHistory.length === 0) return null;
    return player.performanceHistory[player.performanceHistory.length - 1];
  }, [player.performanceHistory]);

  const lastGame = useMemo(() => {
    if (!lastGamePerformance) return null;
    return games[lastGamePerformance.gameId];
  }, [lastGamePerformance, games]);

  const matchesByTeam = useMemo(() => {
    const teams: Record<string, { points: number; games: number }> = {};
    if (player.performanceHistory) {
        player.performanceHistory.forEach(perf => {
            if (!teams[perf.team]) {
                teams[perf.team] = { points: 0, games: 0 };
            }
            teams[perf.team].points += perf.points;
            teams[perf.team].games += 1;
        });
    }
    return Object.entries(teams).map(([team, data]) => ({
      team,
      ...data,
      average: data.games > 0 ? data.points / data.games : 0
    })).sort((a,b) => b.average - a.average);
  }, [player.performanceHistory]);

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

  const chartData = useMemo(() => {
    if (!player.performanceHistory || player.performanceHistory.length === 0) {
       return [{ round: '1', points: player.points }];
    }
    
    return player.performanceHistory.map(perf => ({
        round: `${perf.round}`,
        points: perf.points
    }));
  }, [player.performanceHistory, player.points]);


  return (
    <div>
       <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6 text-foreground" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Jogador</h2>
        <div className="w-9 h-9"></div>
      </header>
      
      <div className="bg-gradient-to-b from-primary/20 to-transparent p-4 flex items-center gap-4">
        <div className="relative">
          <Avatar className="w-20 h-20 border-4 border-card cursor-pointer" onClick={handleAvatarClick}>
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
          <h3 className="text-2xl font-bold text-foreground">{player.name}</h3>
          <p className="text-muted-foreground">{player.pos}</p>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <Card className="bg-card border-none">
           <CardContent className="p-0">
             <Tabs defaultValue="resumo" className="w-full">
                <TabsList className="w-full flex bg-transparent p-0">
                    <TabsTrigger value="resumo" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Resumo</TabsTrigger>
                    <TabsTrigger value="detalhes" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent">Detalhes</TabsTrigger>
                    <TabsTrigger value="heatmap" className="flex-1 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none data-[state=active]:shadow-none bg-transparent text-center">Mapa de Calor (em breve)</TabsTrigger>
                </TabsList>
                <TabsContent value="resumo">
                     <div className="mt-4 p-4">
                        <h4 className="font-bold text-foreground">Último Jogo</h4>
                        {lastGame ? (
                          <>
                            <p className="text-sm text-muted-foreground mt-2">{lastGame.date}</p>
                            <p className="text-sm text-muted-foreground">{lastGame.homeTeam} {lastGame.homeScore} x {lastGame.awayScore} {lastGame.awayTeam}</p>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground mt-2">Nenhum jogo recente registrado.</p>
                        )}


                        <h4 className="font-bold text-foreground mt-4">Índice por Rodada</h4>
                        <Button className="mt-2 h-auto py-1 px-4 bg-primary/20 hover:bg-primary/30 text-primary-foreground">Pontuação</Button>
                        <div className="h-[200px] mt-2">
                            <PlayerStatsChart data={chartData} />
                        </div>
                    </div>
                </TabsContent>
                 <TabsContent value="detalhes" className="p-4 space-y-4">
                    <Card className="bg-muted/50 dark:bg-muted/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg font-bold text-foreground">Médias de Pontos</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-around text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Jogos</p>
                                <p className="font-bold text-lg text-foreground">{player.games ?? 0}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Pontos</p>
                                <p className="font-bold text-lg text-foreground">{player.points?.toFixed(2) ?? '0.00'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Média por Partida</p>
                                <p className="font-bold text-lg text-foreground">{averagePoints.toFixed(2)}</p>
                            </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-3">Pontuação por time</h3>
                       {matchesByTeam.length > 0 ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-semibold text-muted-foreground mb-2 px-2">
                              <span>Time</span>
                              <div className="flex gap-8">
                                <span>Média</span>
                                <span>Total</span>
                              </div>
                          </div>
                          {matchesByTeam.map((match) => (
                              <div key={match.team} className="flex justify-between items-center bg-muted/50 dark:bg-muted/20 p-3 rounded-lg">
                              <span className="font-bold text-foreground">{match.team}</span>
                              <div className="flex gap-8 text-right">
                                  <span className="font-bold text-md w-10 text-foreground">{match.average.toFixed(2)}</span>
                                  <span className="font-bold text-md w-10 text-foreground">{match.points.toFixed(2)}</span>
                              </div>
                          </div>
                          ))}
                        </div>
                       ) : (
                         <p className="text-sm text-muted-foreground text-center py-4">Sem dados de jogos por time.</p>
                       )}
                    </div>
                 </TabsContent>
                 <TabsContent value="heatmap" className="p-4 space-y-4">
                    <h4 className="font-bold text-foreground">Mapa de Calor (em breve)</h4>
                    <div className="text-center text-muted-foreground p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
                        <p className="mb-4">Conecte sua conta Strava, Garmin ou Samsung para visualizar o mapa de calor de suas atividades em campo.</p>
                        <div className="flex justify-center gap-4 mb-4">
                            <Button variant="outline">Conectar Strava</Button>
                            <Button variant="outline">Conectar Garmin</Button>
                        </div>
                        <Image src="https://placehold.co/600x400.png" alt="Mapa de Calor" width={600} height={400} data-ai-hint="heatmap soccer" className="rounded-lg mx-auto" />
                    </div>
                </TabsContent>
             </Tabs>
           </CardContent>
        </Card>
      </div>
    </div>
  );
}
