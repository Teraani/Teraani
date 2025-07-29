
"use client";

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

interface LoginViewProps {
  onLoginSuccess: (userId: string) => void;
  onNavigateToRegister: () => void;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function LoginView({ onLoginSuccess, onNavigateToRegister }: LoginViewProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      toast({
        title: "Login bem-sucedido!",
        description: "Você foi autenticado com sucesso.",
      });
      onLoginSuccess(userCredential.user.uid);
    } catch (error: any) {
      console.error("Erro no login:", error);
       toast({
        title: "Erro no Login",
        description: "E-mail ou senha inválidos. Verifique seus dados e tente novamente.",
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
                Entrar
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
