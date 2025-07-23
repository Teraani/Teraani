
"use client";

import { Home, Shirt, Trophy, BarChart2, DollarSign, Award } from 'lucide-react';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  canViewPayments: boolean;
}

const navItems: { view: View, icon: React.ElementType, label: string, isPro?: boolean }[] = [
  { view: 'dashboard', icon: Home, label: 'Início' },
  { view: 'lineup', icon: Shirt, label: 'Escalação' },
  { view: 'best-eleven', icon: Award, label: 'Seleção', isPro: true },
  { view: 'statistics', icon: BarChart2, label: 'Estatísticas' },
];

export default function BottomNav({ currentView, onNavigate, canViewPayments }: BottomNavProps) {
  const allNavItems = [...navItems];
  if (canViewPayments) {
      allNavItems.push({ view: 'payments', icon: DollarSign, label: 'Pagamentos', isPro: true });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 shadow-lg flex justify-around p-2 z-50">
      {allNavItems.map((item) => {
        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={cn(
              'flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 w-full transition-colors duration-200 relative gap-1',
              { 'text-primary dark:text-primary': currentView === item.view },
              'hover:text-primary'
            )}
            aria-current={currentView === item.view ? 'page' : undefined}
          >
            <item.icon className="h-6 w-6" />
            <div className="flex flex-col items-center h-8 justify-start pt-1">
                 <span className="text-xs font-medium text-center whitespace-nowrap">{item.label}</span>
                 {item.isPro && <Badge className="bg-amber-400 text-black text-[8px] px-1 h-3 font-bold mt-0.5">PRO</Badge>}
            </div>
          </button>
        )
      })}
    </nav>
  );
}
