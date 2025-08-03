

"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Logo } from '../logo';
import { auth } from '@/lib/firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { View } from '../app-container';

interface LoginViewProps {
  onNavigateToRegister: () => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginView({ onNavigateToRegister }: LoginViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "jason.teraani@gmail.com",
      password: "password",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
        await signInWithEmailAndPassword(auth, values.email, values.password);
        // The onAuthStateChanged listener in AppContainer will handle navigation
        toast({
            title: "Login realizado",
            description: "Bem-vindo de volta!",
        });
    } catch (error: any) {
        console.error("Login error:", error);
        toast({
            title: "Erro no Login",
            description: "Verifique seu e-mail e senha. " + error.message,
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground text-center">
       <main className="flex-1 flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Logo className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-1">Entrar no Amistosos FC</h1>
        <p className="max-w-md mb-6">
            Bem-vindo de volta! Insira seus dados para continuar.
        </p>

        <div className="w-full max-w-sm space-y-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="email" placeholder="E-mail" {...field} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input type="password" placeholder="Senha" {...field} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-white text-primary hover:bg-gray-200 h-12 text-lg font-bold rounded-xl shadow-lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
          </Form>
        </div>
            
        <div className="mt-8 text-center text-sm text-primary-foreground/80">
            <p>
                Não tem uma conta?{' '}
                <Button variant="link" onClick={onNavigateToRegister} className="font-semibold underline text-white p-0">
                  Cadastre-se aqui.
                </Button>
            </p>
        </div>
       </main>
    </div>
  );
}
