import type { View } from '@/app/page';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onNavigate: (view: View) => void;
}

interface ActionButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
}

function ActionButton({ icon, label, onClick }: ActionButtonProps) {
  return (
    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center justify-center gap-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 transition" onClick={onClick}>
       <span className="text-3xl" role="img" aria-label={label}>{icon}</span>
      <p className="font-semibold text-gray-700 dark:text-gray-200 mt-1 text-center">{label}</p>
    </Button>
  );
}

export default function QuickActions({ onNavigate }: QuickActionsProps) {
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">Acesso Rápido</h3>
      <div className="grid grid-cols-2 gap-4">
        <ActionButton icon="👕" label="Minha Escalação" onClick={() => onNavigate('lineup')} />
        <ActionButton icon="📈" label="Mercado" onClick={() => onNavigate('market')} />
        <ActionButton icon="🏆" label="Ligas" onClick={() => onNavigate('leagues')} />
        <ActionButton icon="👥" label="Amigos" onClick={() => { /* Placeholder */ }} />
      </div>
    </div>
  );
}
