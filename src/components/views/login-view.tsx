
"use client";

import type { User } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Crown } from 'lucide-react';

interface LoginViewProps {
  users: User[];
  onLogin: (userId: string) => void;
}

const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
        viewBox="0 0 100 100" 
        xmlns="http://www.w3.org/2000/svg" 
        {...props}
    >
        <defs>
            <rect id="signal-icon-bg" width="100" height="100" rx="20" fill="rgba(255, 255, 255, 0.2)" />
        </defs>
        <use href="#signal-icon-bg" />
        <rect x="30" y="55" width="8" height="15" rx="3" fill="white" />
        <rect x="46" y="45" width="8" height="25" rx="3" fill="white" />
        <rect x="62" y="30" width="8" height="40" rx="3" fill="white" />
    </svg>
);

export default function LoginView({ users, onLogin }: LoginViewProps) {
  return (
    <div className="flex flex-col h-screen bg-primary p-4 text-primary-foreground text-center">
      <div className="pt-8 flex flex-col items-center">
        <div className="w-20 h-20 mb-4">
            <SignalIcon className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Amistosos FC</h1>
        <p className="max-w-md mb-4">
          Selecione seu perfil para continuar.
        </p>
      </div>

      <ScrollArea className="flex-1 my-4">
        <div className="space-y-3 px-4">
          {users.map((user) => (
            <Card
              key={user.id}
              className="bg-white/10 text-white p-4 flex items-center gap-4 cursor-pointer hover:bg-white/20 transition-colors duration-200"
              onClick={() => onLogin(user.id)}
            >
              <Avatar className="h-12 w-12 border-2 border-white/50">
                <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="player avatar"/>
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <p className="font-bold flex items-center gap-2">
                  {user.name}
                  {user.role === 'admin' && (
                    <Crown className="h-4 w-4 text-amber-400" />
                  )}
                </p>
                <p className="text-sm opacity-80">{user.email}</p>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
      <footer className="py-4 text-center text-xs text-primary-foreground/80">
        <p>
            Esta é uma tela de desenvolvimento para seleção de perfil.
        </p>
      </footer>
    </div>
  );
}
