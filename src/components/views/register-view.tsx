

"use client";

import { Button } from '@/components/ui/button';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Logo } from '../logo';
import { auth } from '@/lib/firebase-config';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { User as FirebaseUser } from 'firebase/auth';
import { useEffect } from 'react';

interface RegisterViewProps {
  onRegisterSuccess: (user: FirebaseUser, name: string) => void;
  onNavigateToLogin: () => void;
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

const GoogleIcon = () => (
    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
      <path fill="none" d="M0 0h48v48H0z"></path>
    </svg>
  );

export default function RegisterView({ onRegisterSuccess, onNavigateToLogin }: RegisterViewProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          const user = result.user;
          const name = user.displayName || user.email!.split('@')[0];
          onRegisterSuccess(user, name);
          toast({
            title: "Login com Google bem-sucedido!",
            description: `Bem-vindo, ${name}!`,
          });
        }
      } catch (error: any) {
        console.error("Erro ao obter resultado do redirecionamento:", error);
        toast({
          title: "Erro no Login com Google",
          description: "Não foi possível autenticar com o Google após o redirecionamento. Tente novamente.",
          variant: "destructive",
        });
      }
    };
    checkRedirectResult();
  }, [onRegisterSuccess, toast]);

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Conta criada com sucesso!",
        description: "Agora você pode acessar a plataforma.",
      });
      onRegisterSuccess(userCredential.user, values.name);
    } catch (error: any) {
       console.error("Erro ao criar conta:", error);
       toast({
        title: "Erro ao criar conta",
        description: error.code === 'auth/email-already-in-use' ? 'Este e-mail já está em uso. Tente fazer login.' : (error.message || "Não foi possível criar sua conta."),
        variant: "destructive",
      });
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
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
                OU
                </span>
            </div>
           </div>

            <Button onClick={handleGoogleSignIn} className="w-full bg-white text-gray-700 hover:bg-gray-200 h-12 text-base font-bold rounded-xl shadow-lg">
                <GoogleIcon />
                Continuar com Google
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

    