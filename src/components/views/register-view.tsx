
"use client";

import { Button } from '@/components/ui/button';
import { Chrome, Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

const SignalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
        <path d="M7 16V8M12 16V4M17 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);


interface RegisterViewProps {
  onRegisterSuccess: () => void;
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function RegisterView({ onRegisterSuccess }: RegisterViewProps) {
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleGoogleSignIn = () => {
    // Here you would add the Firebase Google Sign-In logic
    // For now, we'll just simulate a successful registration/login
    console.log("Signing in with Google...");
    onRegisterSuccess();
  }

  function onSubmit(values: z.infer<typeof registerSchema>) {
    // Here you would add the Firebase Email/Password registration logic
    console.log("Registering with email/password:", values);
    onRegisterSuccess();
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary p-6 text-primary-foreground text-center">
       <main className="flex-1 flex flex-col items-center justify-center">
         <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
            <SignalIcon className="w-12 h-12 text-white" />
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

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary-foreground/30" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-primary px-2 text-primary-foreground/80">
                Ou
                </span>
            </div>
         </div>

          <Button 
            onClick={handleGoogleSignIn}
            variant="outline"
            className="w-full bg-transparent border-white/80 text-white hover:bg-white/10 hover:text-white h-12 text-lg font-bold rounded-xl shadow-lg"
          >
              <Chrome className="mr-3 h-6 w-6"/>
              Entrar com Google
          </Button>
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
