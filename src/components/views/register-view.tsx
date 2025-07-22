
"use client";

import { Button } from '@/components/ui/button';
import { Chrome } from 'lucide-react';

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


interface RegisterViewProps {
  onRegisterSuccess: () => void;
}

export default function RegisterView({ onRegisterSuccess }: RegisterViewProps) {

  const handleGoogleSignIn = () => {
    // Here you would add the Firebase Google Sign-In logic
    // For now, we'll just simulate a successful registration/login
    console.log("Signing in with Google...");
    onRegisterSuccess();
  }

  return (
    <div className="flex flex-col min-h-screen bg-primary p-8 text-primary-foreground text-center">
       <main className="flex-1 flex flex-col items-center justify-center">
         <div className="w-24 h-24 mb-4">
            <SignalIcon className="w-full h-full" />
        </div>
        <h1 className="text-3xl font-bold mb-2">Amistosos FC</h1>
        <p className="max-w-md mb-8">
            Faça login para escalar seu time, acompanhar as parciais e disputar com seus amigos.
        </p>

        <Button 
          onClick={handleGoogleSignIn}
          className="w-full max-w-sm bg-white text-primary hover:bg-gray-200 h-14 text-lg font-bold rounded-xl shadow-lg"
        >
            <Chrome className="mr-3 h-6 w-6"/>
            Entrar com Google
        </Button>
            
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
