

"use client";

import type { League, User, Player } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Crown, Search, Share2, UserPlus, Trash2, Upload, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMemo, useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter
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

const GuestPlayerForm = ({
  onSave,
  onClose,
}: {
  onSave: (data: any) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState('');
  const [pos, setPos] = useState<Player['pos'] | ''>('');
  const [team, setTeam] = useState('');
  const [img, setImg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImg(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !pos || !team) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    const data = {
      name,
      pos: pos as Player['pos'],
      team,
      img: img || `https://placehold.co/128x128/8E44AD/FFFFFF?text=${name.charAt(0)}`,
    };
    onSave(data);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Adicionar Jogador Convidado</DialogTitle>
        <DialogDescription>
          Preencha os dados do jogador convidado para esta rodada.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
           {img ? (
            <Avatar className="w-24 h-24">
                <AvatarImage src={img} alt="Pré-visualização" data-ai-hint="player avatar"/>
                <AvatarFallback className="text-4xl">{name.charAt(0) || 'C'}</AvatarFallback>
            </Avatar>
           ) : (
            <Avatar className="w-24 h-24">
                <AvatarFallback className="text-4xl bg-muted"><UserPlus/></AvatarFallback>
            </Avatar>
           )}
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Anexar Imagem
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <div>
          <Label htmlFor="guestName">Nome</Label>
          <Input id="guestName" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="guestTeam">Cor da Camisa/Time</Label>
          <Select onValueChange={setTeam} value={team} required>
              <SelectTrigger>
                  <SelectValue placeholder="Selecione uma cor" />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="Verde">Verde</SelectItem>
                  <SelectItem value="Amarelo">Amarelo</SelectItem>
                  <SelectItem value="Preto">Preto</SelectItem>
                  <SelectItem value="Vermelho">Vermelho</SelectItem>
                  <SelectItem value="Branco">Branco</SelectItem>
                  <SelectItem value="Azul">Azul</SelectItem>
              </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="guestPos">Posição</Label>
           <Select onValueChange={(v) => setPos(v as Player['pos'])} value={pos} required>
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
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Adicionar Convidado</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}

const EditUserForm = ({
  user,
  onSave,
  onClose,
}: {
  user: User;
  onSave: (userId: string, data: Partial<User>) => void;
  onClose: () => void;
}) => {
  const [name, setName] = useState(user.name);
  const [teamName, setTeamName] = useState(user.teamName);
  const [avatar, setAvatar] = useState(user.avatar || '');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !teamName) {
      alert('Nome e nome do time são obrigatórios.');
      return;
    }
    const data: Partial<User> = { name, teamName, avatar };
    onSave(user.id, data);
    onClose();
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Membro da Liga</DialogTitle>
        <DialogDescription>
          Atualize os dados do jogador.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col items-center gap-4">
           <Avatar className="w-24 h-24">
              <AvatarImage src={avatar} alt="Avatar" data-ai-hint="player avatar" />
              <AvatarFallback className="text-4xl">{name.charAt(0)}</AvatarFallback>
            </Avatar>
          <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="mr-2 h-4 w-4" />
            Mudar Avatar
          </Button>
          <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
        </div>

        <div>
          <Label htmlFor="userName">Nome do Jogador</Label>
          <Input id="userName" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="teamName">Nome do Time</Label>
          <Input id="teamName" value={teamName} onChange={e => setTeamName(e.target.value)} required />
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button type="submit">Salvar Alterações</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};


interface LeagueParticipantsViewProps {
  onBack: () => void;
  league: League;
  isLeagueAdmin: boolean;
  onInvite: () => void;
  onAddGuest: (guestData: any) => void;
  onRemoveUser: (userId: string) => void;
  onUpdateUser: (userId: string, data: Partial<User>) => void;
}

export default function LeagueParticipantsView({ 
  onBack, 
  league, 
  isLeagueAdmin, 
  onInvite, 
  onAddGuest,
  onRemoveUser,
  onUpdateUser,
}: LeagueParticipantsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<User | null>(null);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const participants = useMemo(() => {
    return Object.values(league.users)
      .filter(user => user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (a.role === 'admin' && b.role !== 'admin') return -1;
        if (b.role === 'admin' && a.role !== 'admin') return 1;
        return a.name.localeCompare(b.name);
      });
  }, [league.users, searchTerm]);

  const handleConfirmRemove = () => {
    if (userToRemove) {
      onRemoveUser(userToRemove.id);
      setUserToRemove(null);
    }
  }

  return (
    <div>
       <AlertDialog open={!!userToRemove} onOpenChange={(open) => !open && setUserToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remover Membro</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover "{userToRemove?.name}" da liga? Todas as suas estatísticas e dados relacionados serão perdidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToRemove(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmRemove} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAddGuestOpen} onOpenChange={setIsAddGuestOpen}>
        <GuestPlayerForm 
          onSave={(data) => onAddGuest(data)}
          onClose={() => setIsAddGuestOpen(false)}
        />
      </Dialog>
      
      <Dialog open={!!userToEdit} onOpenChange={(open) => !open && setUserToEdit(null)}>
        {userToEdit && (
          <EditUserForm
            user={userToEdit}
            onSave={onUpdateUser}
            onClose={() => setUserToEdit(null)}
          />
        )}
      </Dialog>


      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1 text-foreground">Membros da Liga</h2>
        <div className="w-9 h-9" />
      </header>

      <main className="p-4 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar membro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {isLeagueAdmin && (
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onInvite}>
              <Share2 className="mr-2 h-4 w-4" />
              Convidar Amigo
            </Button>
            <Button variant="secondary" onClick={() => setIsAddGuestOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Convidado
            </Button>
          </div>
        )}

        <ScrollArea className="h-[calc(100vh-240px)]">
          <div className="space-y-3 pr-2">
            {participants.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground flex items-center gap-2">
                      {user.name}
                      {user.role === 'admin' && <Crown className="h-4 w-4 text-amber-500" />}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.teamName}</p>
                  </div>
                </div>
                 {isLeagueAdmin && user.role !== 'admin' && (
                  <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" onClick={() => setUserToEdit(user)}>
                       <Edit className="h-4 w-4 text-muted-foreground" />
                     </Button>
                    <Button variant="ghost" size="icon" onClick={() => setUserToRemove(user)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}
