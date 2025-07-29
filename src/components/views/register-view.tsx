
"use client";

import { Button } from '@/components/ui/button';
import { Mail, Lock, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';
import { Logo } from '../logo';
import { auth } from '@/lib/firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import { User as FirebaseUser } from 'firebase/auth';

interface RegisterViewProps {
  onRegisterSuccess: (user: FirebaseUser, name: string) => void;
  onLoginSuccess: (userId: string) => void;
}

const registerSchema = z.object({
  name: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um e-mail válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export default function RegisterView({ onRegisterSuccess, onLoginSuccess }: RegisterViewProps) {
  const { toast } = useToast();
  
  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onRegisterSubmit(values: z.infer<typeof registerSchema>) {
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

  async function onLoginSubmit(values: z.infer<typeof loginSchema>) {
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
  
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        'auth_domain': 'amistososai-fc.web.app'
    });
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        toast({
            title: "Login com Google bem-sucedido!",
        });
        // This will either log in the existing user or create a new one in our app data
        onLoginSuccess(user.uid); 
    } catch (error: any) {
        console.error("Erro no login com Google:", error);
        toast({
            title: "Erro no Login com Google",
            description: "Não foi possível fazer login com o Google. Tente novamente.",
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
            Escale seu time, acompanhe as parciais e dispute com seus amigos.
        </p>

        <Tabs defaultValue="login" className="w-full max-w-sm">
          <TabsList className="grid w-full grid-cols-2 bg-black/10 text-primary-foreground/80">
            <TabsTrigger value="login" className="data-[state=active]:bg-white/90 data-[state=active]:text-primary data-[state=active]:shadow-md">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-white/90 data-[state=active]:text-primary data-[state=active]:shadow-md">Criar Conta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
             <div className="w-full max-w-sm space-y-4 mt-4">
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
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
                      control={loginForm.control}
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
          </TabsContent>
          
          <TabsContent value="register">
            <div className="w-full max-w-sm space-y-4 mt-4">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
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
                    control={registerForm.control}
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
                    control={registerForm.control}
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
          </TabsContent>
        </Tabs>
            
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
