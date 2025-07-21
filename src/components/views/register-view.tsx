"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mail, User } from 'lucide-react';

interface RegisterViewProps {
  onRegisterSuccess: () => void;
  onNavigateToLogin: () => void;
}

export default function RegisterView({ onRegisterSuccess, onNavigateToLogin }: RegisterViewProps) {
  return (
    <div className="flex flex-col min-h-screen">
       <header className="bg-card p-4 shadow-sm flex items-center">
         <Button variant="ghost" size="icon" onClick={onNavigateToLogin} className="hover:bg-accent">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold text-center flex-1 pr-10">Cadastro</h1>
      </header>
      
      <main className="flex-1 p-8 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto">
            <div className="space-y-4">
                 <div>
                    <Label htmlFor="name">Nome</Label>
                     <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="name" type="text" placeholder="Seu nome" className="pl-10" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="email">E-mail</Label>
                    <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input id="email" type="email" placeholder="seuemail@exemplo.com" className="pl-10" />
                    </div>
                </div>
                <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" placeholder="Crie uma senha forte" className="mt-1" />
                </div>
                 <div>
                    <Label htmlFor="confirm-password">Confirmar Senha</Label>
                    <Input id="confirm-password" type="password" placeholder="Confirme sua senha" className="mt-1" />
                </div>
                <Button onClick={onRegisterSuccess} className="w-full bg-primary h-12 text-lg">
                    Cadastrar
                </Button>
            </div>
            
            <div className="mt-8 text-center">
                <p className="text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-primary hover:underline">
                        Faça login
                    </button>
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
