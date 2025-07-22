
"use client";

import React, { useState, useMemo, useEffect } from 'react';
import type { User } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, Calendar as CalendarIcon, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { format, parseISO, differenceInDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';

interface PaymentsViewProps {
  onBack: () => void;
  currentUser: User;
  users: Record<string, User>;
  canEdit: boolean;
  onSave: (updatedUsers: Record<string, User>) => void;
}

const getStatus = (dueDate: string) => {
  const date = parseISO(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today to the start of the day
  const daysDiff = differenceInDays(date, today);

  if (daysDiff < 0) return { text: 'Vencido', color: 'text-destructive', bg: 'bg-destructive/10' };
  if (daysDiff <= 7) return { text: 'Vence esta semana', color: 'text-yellow-500', bg: 'bg-yellow-500/10' };
  return { text: 'Em dia', color: 'text-green-500', bg: 'bg-green-500/10' };
};

export default function PaymentsView({ onBack, currentUser, users, canEdit, onSave }: PaymentsViewProps) {
  const [editableUsers, setEditableUsers] = useState<Record<string, User>>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setEditableUsers(JSON.parse(JSON.stringify(users)));
    setHasChanges(false);
  }, [users]);

  const handleDateChange = (userId: string, date: Date | undefined) => {
    if (!date) return;
    setHasChanges(true);
    setEditableUsers(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        paymentDueDate: format(date, 'yyyy-MM-dd'),
      },
    }));
  };

  const handleSaveClick = () => {
    onSave(editableUsers);
    setHasChanges(false);
  };

  const sortedUsers = useMemo(() => {
    if (!editableUsers) return [];
    return Object.values(editableUsers)
      .filter(user => user.role === 'player' && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => differenceInDays(parseISO(a.paymentDueDate), parseISO(b.paymentDueDate)));
  }, [editableUsers, searchTerm]);
  
  if (!currentUser) return null;

  const userItemContent = (user: User) => (
    <div className="p-3 bg-muted/30 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar"/>
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                        Vencimento: {format(parseISO(user.paymentDueDate), "PPP", { locale: ptBR })}
                    </p>
                </div>
            </div>
            <div className={cn("px-2 py-0.5 rounded-full text-xs font-semibold", getStatus(user.paymentDueDate).bg, getStatus(user.paymentDueDate).color)}>
               {getStatus(user.paymentDueDate).text}
            </div>
        </div>
    </div>
  );

  return (
    <div>
      <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-20">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-bold text-center flex-1">Pagamentos</h2>
        <div className="w-9 h-9" />
      </header>
      
      <main className="p-4 space-y-4">
        {!canEdit && (
            <Card>
                <CardHeader>
                    <CardTitle>Sua Mensalidade</CardTitle>
                </CardHeader>
                <CardContent>
                    {userItemContent(currentUser)}
                </CardContent>
            </Card>
        )}

        {canEdit && (
            <Card>
                <CardHeader>
                    <CardTitle>Status dos Pagamentos</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="relative mb-4">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Buscar jogador..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-muted/30 border-border"
                        />
                    </div>
                    <ScrollArea className="h-[calc(100vh-320px)]">
                        <div className="space-y-3 pr-2">
                        {sortedUsers.map(user => (
                            <Popover key={user.id}>
                                <PopoverTrigger asChild>
                                    <div className="cursor-pointer">
                                        {userItemContent(user)}
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={parseISO(user.paymentDueDate)}
                                        onSelect={(date) => handleDateChange(user.id, date)}
                                        initialFocus
                                        locale={ptBR}
                                    />
                                </PopoverContent>
                            </Popover>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        )}
      </main>

      {canEdit && hasChanges && (
        <div className="fixed bottom-20 left-0 right-0 bg-card p-4 border-t border-border shadow-lg z-30">
            <Button className="w-full bg-green-600 text-white hover:bg-green-700 h-12 text-lg" onClick={handleSaveClick}>
                <Save className="mr-2 h-5 w-5"/>
                Salvar Alterações
            </Button>
        </div>
      )}
    </div>
  );
}
