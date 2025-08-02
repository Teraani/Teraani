

"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Logo } from '../logo';
// import { auth } from '@/lib/firebase-config';
// import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult, updateProfile } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import type { User as FirebaseUser } from 'firebase/auth';
import { Loader2 } from 'lucide-react';
import type { View } from '../app-container';

interface RegisterViewProps {
  onNavigateToLogin: () => void;
  onRegister: () => void; // Temporary prop
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid" viewBox="0 0 256 262" {...props}>
        <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.686H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c22.692-21.036 35.89-53.377 35.89-91.802z" />
        <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.186-.351 1.483c21.644 42.822 66.029 72.031 114.904 72.031z" />
        <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.907 13.925 58.602l42.356-32.782z" />
        <path fill="#EB4335" d="M130.55 50.479c19.205 0 36.344 6.698 50.073 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 81.676 0 37.29 29.209 15.646 71.947l41.196 31.913c10.445-31.477 39.746-53.388 73.708-53.388z" />
    </svg>
);

export default function RegisterView({ onNavigateToLogin, onRegister }: RegisterViewProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setIsLoading(true);
    // Simulating a successful registration
    setTimeout(() => {
        onRegister();
        toast({
            title: "Conta Criada!",
            description: "Bem-vindo ao Amistosos FC!",
        });
        setIsLoading(false);
    }, 500);
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    // Simulating a successful registration
     setTimeout(() => {
        onRegister();
        toast({
            title: "Conta Criada com o Google!",
            description: "Bem-vindo ao Amistosos FC!",
        });
        setIsGoogleLoading(false);
    }, 500);
  };


  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground text-center">
       <main className="flex-1 flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Logo className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-1">Crie sua Conta</h1>
        <p className="max-w-md mb-6">
            Escale seu time, acompanhe as parciais e dispute com seus amigos.
        </p>
        
        <div className="w-full max-w-sm space-y-4 mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nome" {...field} className="bg-white text-gray-900 placeholder:text-gray-500" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {isLoading ? 'Criando...' : 'Criar conta'}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-primary-foreground/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-primary px-2 text-primary-foreground/80">
                OU
              </span>
            </div>
          </div>

          <Button onClick={handleGoogleSignIn} variant="outline" className="w-full bg-white text-primary hover:bg-gray-200 h-12 text-base font-bold rounded-xl shadow-lg" disabled={isGoogleLoading}>
             {isGoogleLoading ? (
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
             ) : (
                <GoogleIcon className="w-5 h-5 mr-3" />
             )}
             Continuar com o Google
          </Button>

        </div>
            
        <div className="mt-8 text-center text-sm text-primary-foreground/80">
            <p>
                Já tem uma conta?{' '}
                <Button variant="link" onClick={onNavigateToLogin} className="font-semibold underline text-white p-0">
                  Faça login aqui.
                </Button>
            </p>
        </div>
       </main>
    </div>
  );
}
