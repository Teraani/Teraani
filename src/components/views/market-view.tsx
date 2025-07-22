
"use client";

import { useState, useMemo } from 'react';
import type { Player } from '@/lib/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ArrowLeft, UserPlus, Trash2 } from 'lucide-react';
import PlayerListItem from '@/components/market/player-list-item';
import type { Position } from '@/app/page';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';


interface MarketViewProps {
  players: Record<string, Player>;
  onPlayerSelect: (playerId: string) => void;
  onBack: () => void;
  position: Position;
  scaledPlayerIds: string[];
  canEdit: boolean;
  onAddPlayerToMarket: (player: Omit<Player, 'last_val' | 'games'>) => void;
  onRemovePlayerFromMarket: (playerId: string) => void;
}

const AddPlayerForm = ({ onAddPlayer, canEdit }: { onAddPlayer: (player: Omit<Player, 'last_val' | 'games'>) => void, canEdit: boolean }) => {
  const [name, setName] = useState('');
  const [pos, setPos] = useState<Player['pos'] | ''>('');
  const [value, setValue] = useState('');
  const [team, setTeam] = useState('');
  const [img, setImg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pos || !value || !team) {
      alert('Por favor, preencha todos os campos.');
      return;
    }
    onAddPlayer({
      name,
      pos: pos as Player['pos'],
      value: parseFloat(value),
      points: 0,
      team,
      img: img || 'https://placehold.co/60x60',
    });
    // Reset form and close dialog
    setName('');
    setPos('');
    setValue('');
    setTeam('');
    setImg('');
    setIsOpen(false);
  };

  if (!canEdit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <UserPlus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Novo Jogador</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo atleta ao mercado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="playerName">Nome</Label>
            <Input id="playerName" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="playerTeam">Time</Label>
            <Input id="playerTeam" value={team} onChange={e => setTeam(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="playerPos">Posição</Label>
             <Select onValueChange={(v) => setPos(v as Player['pos'])} value={pos}>
                <SelectTrigger>
                    <SelectValue placeholder="Selecione a posição" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="GOL">Goleiro (GOL)</SelectItem>
                    <SelectItem value="LAT">Lateral (LAT)</SelectItem>
                    <SelectItem value="ZAG">Zagueiro (ZAG)</SelectItem>
                    <SelectItem value="MEI">Meio-campo (MEI)</SelectItem>
                    <SelectItem value="VOL">Volante (VOL)</SelectItem>
                    <SelectItem value="ATA">Atacante (ATA)</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="playerValue">Valor (C$)</Label>
            <Input id="playerValue" type="number" step="0.1" value={value} onChange={e => setValue(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="playerImg">URL da Imagem (Opcional)</Label>
            <Input id="playerImg" value={img} onChange={e => setImg(e.target.value)} placeholder="https://..." />
          </div>
          <DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
            </DialogClose>
            <Button type="submit">Adicionar Jogador</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}


export default function MarketView({ players, onPlayerSelect, onBack, position, scaledPlayerIds, canEdit, onAddPlayerToMarket, onRemovePlayerFromMarket }: MarketViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [playerToRemove, setPlayerToRemove] = useState<string | null>(null);
  const { toast } = useToast();

  const scaledIdsSet = useMemo(() => new Set(scaledPlayerIds), [scaledPlayerIds]);

  const handleSelectPlayer = (playerId: string) => {
    if (scaledIdsSet.has(playerId)) {
      toast({
        title: "Jogador já escalado!",
        description: "Este jogador já está em um dos times. Remova-o para poder escalá-lo em outra posição.",
        variant: "destructive",
      });
      return;
    }
    onPlayerSelect(playerId);
  };

  const handleConfirmRemove = () => {
    if (playerToRemove) {
      onRemovePlayerFromMarket(playerToRemove);
      setPlayerToRemove(null);
    }
  }

  const groupedPlayers = useMemo(() => {
    const lowerCaseSearch = searchTerm.toLowerCase();

    const allPlayers = Object.entries(players)
      .filter(([_, player]) => player.name.toLowerCase().includes(lowerCaseSearch))
      .sort((a, b) => b[1].value - a[1].value);

    if (lowerCaseSearch) {
      return { 'Resultados da Busca': allPlayers.map(([id, p]) => ({ ...p, id })) };
    }
    
    const groups: Record<string, ({id: string} & Player)[]> = {
      'ATA': [],
      'MEI': [],
      'VOL': [],
      'LAT': [],
      'ZAG': [],
      'GOL': [],
    };

    allPlayers.forEach(([id, player]) => {
      const p = { ...player, id };
      if (groups[p.pos]) {
        groups[p.pos].push(p);
      }
    });

    const orderedGroups: Record<string, ({id: string} & Player)[]> = {};
    const order: (keyof typeof groups)[] = ['ATA', 'MEI', 'VOL', 'LAT', 'ZAG', 'GOL'];
    
    order.forEach(pos => {
        if (groups[pos]) {
            orderedGroups[pos] = groups[pos];
        }
    });
    
    return orderedGroups;

  }, [searchTerm, players]);

  return (
    <div>
      <AlertDialog open={!!playerToRemove} onOpenChange={(open) => !open && setPlayerToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Remoção</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover o jogador "{playerToRemove ? players[playerToRemove]?.name : ''}" do mercado? Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPlayerToRemove(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive hover:bg-destructive/90">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <header className="bg-card p-4 shadow-md flex items-center sticky top-0 z-20">
         <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Mercado de Atletas</h2>
        <AddPlayerForm onAddPlayer={onAddPlayerToMarket} canEdit={canEdit} />
      </header>
      <div className="p-4">
        <p className="text-center text-muted-foreground mb-4">
          Aqui você pode buscar, filtrar e analisar todos os jogadores disponíveis para escalar no seu time.
        </p>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            id="market-search"
            placeholder="Buscar por nome do atleta..."
            className="w-full p-3 pl-10 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="space-y-4">
          {Object.entries(groupedPlayers).map(([pos, playerList]) => {
            if (playerList.length === 0) return null;
            return (
              <div key={pos}>
                <h3 className="font-bold text-lg mb-2">{pos}</h3>
                <div className="space-y-2">
                  {playerList.map((player) => (
                    <div key={player.id} className="flex items-center gap-2">
                      <PlayerListItem 
                        player={player} 
                        onPlayerSelect={() => handleSelectPlayer(player.id)}
                        isScaled={scaledIdsSet.has(player.id)}
                      />
                      {canEdit && (
                        <Button variant="destructive" size="icon" onClick={() => setPlayerToRemove(player.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
