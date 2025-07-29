
"use client";

import { Button } from '@/components/ui/button';
import { Chrome, Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Logo } from '../logo';
import { auth } from '@/lib/firebase-config';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

interface RegisterViewProps {
  onRegisterSuccess: () => void;
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function RegisterView({ onRegisterSuccess }: RegisterViewProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        toast({
            title: "Login bem-sucedido!",
            description: "Você foi autenticado com sucesso.",
        });
        onRegisterSuccess();
    } catch (error: any) {
        console.error("Erro no login com Google:", error);
        toast({
            title: "Erro no Login",
            description: error.message || "Não foi possível completar o login.",
            variant: "destructive",
        });
    }
  }

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Agora você pode acessar a plataforma.",
      });
      onRegisterSuccess();
    } catch (error: any) {
       console.error("Erro ao criar conta:", error);
       toast({
        title: "Erro ao criar conta",
        description: error.message || "Não foi possível criar sua conta.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground text-center">
       <main className="flex-1 flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <Logo className="w-16 h-16 text-white" />
        </div>
        <h1 className="text-3xl font-bold mb-1">Amistosos FC</h1>
        <p className="max-w-md mb-6">
            Crie sua conta para escalar seu time, acompanhar as parciais e disputar com seus amigos.
        </p>

        <div className="w-full max-w-sm space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Nome" {...field} className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 border-primary-foreground/20" />
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
                      <Input type="email" placeholder="E-mail" {...field} className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 border-primary-foreground/20" />
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
                      <Input type="password" placeholder="Senha" {...field} className="bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/70 border-primary-foreground/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-white text-primary hover:bg-gray-200 h-12 text-lg font-bold rounded-xl shadow-lg">
                Criar conta
              </Button>
            </form>
          </Form>
        </div>
            
        <div className="mt-8 text-center text-xs text-primary-foreground/80">
            <p>
                Ao continuar, você concorda com nossos{' '}
                <a href="#" className="font-semibold underline">Termos de Uso</a> e{' '}
                <a href="#" className="font-semibold underline">Política de Privacidade</a>.
            </p>
        </div>
       </main>
    </div>
  );
}
