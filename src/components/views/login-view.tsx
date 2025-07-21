
"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Shield } from 'lucide-react';
import type { User as UserType } from '@/lib/data';
import { ScrollArea } from '../ui/scroll-area';
import { Card, CardContent } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { cn } from '@/lib/utils';

interface LoginViewProps {
  onLoginSuccess: (userId: string) => void;
  onNavigateToRegister: () => void;
  onBack: () => void;
  users: Record<string, UserType>;
}

export default function LoginView({ onLoginSuccess, onNavigateToRegister, onBack, users }: LoginViewProps) {

  const userList = Object.values(users);

  return (
    <div className="flex flex-col min-h-screen">
       <header className="bg-card p-4 shadow-sm flex items-center sticky top-0 z-10">
         <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 pr-10">Selecionar Usuário</h1>
      </header>
      
      <main className="flex-1 p-4">
        <p className="text-center text-muted-foreground mb-4">
            Clique em um usuário para fazer login.
        </p>
        <ScrollArea className="h-[calc(100vh-150px)]">
            <div className="space-y-2">
                {userList.map(user => (
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
                ))}
            </div>
        </ScrollArea>
      </main>
    </div>
  );
}
