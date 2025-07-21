
"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Shield, Search } from 'lucide-react';
import type { User as UserType } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Input } from '../ui/input';

interface LoginViewProps {
  onLoginSuccess: (userId: string) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  users: Record<string, UserType>;
}

export default function LoginView({ onLoginSuccess, onNavigateToRegister, onBack, users }: LoginViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    const allUsers = Object.values(users);
    if (!searchTerm) {
      return allUsers;
    }
    return allUsers.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen">
       <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-10">
         <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 pr-10">Selecionar Usuário</h1>
      </header>
      
      <main className="flex-1 p-4">
        <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                placeholder="Buscar usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-muted/30 border-border"
            />
        </div>
        <ScrollArea className="h-[calc(100vh-220px)]">
            <div className="space-y-2">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map(user => (
                        <Card key={user.id} className="cursor-pointer hover:bg-muted" onClick={() => onLoginSuccess(user.id)}>
                            <CardContent className="p-3 flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <Avatar>
                                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar"/>
                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-semibold text-foreground flex items-center gap-2">
                                            {user.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                    </div>
                                </div>
                                {user.role === 'admin' && (
                                    <div className="flex items-center gap-1 text-primary text-xs font-bold">
                                        <Shield className="h-4 w-4" />
                                        <span>Admin</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="text-center py-10 text-muted-foreground">
                        <p>Nenhum usuário encontrado.</p>
                    </div>
                )}
            </div>
        </ScrollArea>
      </main>
    </div>
  );
}
