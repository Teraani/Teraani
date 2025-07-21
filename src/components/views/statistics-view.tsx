
"use client";

import type { Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo } from 'react';

interface StatisticsViewProps {
  players: Record<string, Player>;
  onBack: () => void;
}

export default function StatisticsView({ players, onBack }: StatisticsViewProps) {
  const sortedPlayers = useMemo(() => {
    return Object.values(players)
      .sort((a, b) => (b.points ?? 0) - (a.points ?? 0));
  }, [players]);

  return (
    <div className="bg-gray-50 dark:bg-zinc-900 min-h-screen flex flex-col">
      <header className="bg-white dark:bg-zinc-800 p-4 shadow-md flex items-center sticky top-0 z-20 shrink-0">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-gray-200 dark:hover:bg-zinc-700">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-gray-800 dark:text-gray-100">Estatísticas Gerais</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 flex-grow overflow-hidden">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-100 dark:bg-zinc-800">
              <TableRow>
                <TableHead className="w-[40px]">#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Pos</TableHead>
                <TableHead>J</TableHead>
                <TableHead>V</TableHead>
                <TableHead>D</TableHead>
                <TableHead>E</TableHead>
                <TableHead>GP</TableHead>
                <TableHead>GC</TableHead>
                <TableHead>SG</TableHead>
                <TableHead>Pts</TableHead>
                <TableHead>Aprov.</TableHead>
                <TableHead>Gols</TableHead>
                <TableHead>Assis.</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>CV</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPlayers.map((player, index) => (
                <TableRow key={player.name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className="font-medium">{player.name}</TableCell>
                  <TableCell>{player.pos}</TableCell>
                  <TableCell>{player.games}</TableCell>
                  <TableCell>{player.stats?.wins ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.losses ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.draws ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.goalsFor ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.goalsAgainst ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.goalDifference ?? 'N/A'}</TableCell>
                  <TableCell className="font-bold">{player.points?.toFixed(1) ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.performance ? `${player.stats.performance.toFixed(2)}%` : 'N/A'}</TableCell>
                  <TableCell>{player.stats?.goals ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.assists ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.yellowCards ?? 'N/A'}</TableCell>
                  <TableCell>{player.stats?.redCards ?? 'N/A'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </main>
    </div>
  );
}

