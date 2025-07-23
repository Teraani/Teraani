
"use client";

import { Home, Shirt, Trophy, BarChart2, DollarSign, Award } from 'lucide-react';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
  canViewPayments: boolean;
}

const navItems: { view: View, icon: React.ElementType, label: string, requiresPermission?: 'payments' }[] = [
  { view: 'dashboard', icon: Home, label: 'Início' },
  { view: 'lineup', icon: Shirt, label: 'Escalação' },
  { view: 'best-eleven', icon: Award, label: 'Seleção' },
  { view: 'statistics', icon: BarChart2, label: 'Estatísticas' },
  { view: 'payments', icon: DollarSign, label: 'Pagamentos', requiresPermission: 'payments' },
];

export default function BottomNav({ currentView, onNavigate, canViewPayments }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 shadow-lg flex justify-around p-2 z-50">
      {navItems.map((item) => {
        if (item.requiresPermission === 'payments' && !canViewPayments) {
          return null;
        }

        return (
          <button
            key={item.view}
            onClick={() => onNavigate(item.view)}
            className={cn(
              'flex flex-col items-center text-gray-500 dark:text-gray-400 w-full transition-colors duration-200 relative',
              { 'text-primary dark:text-primary': currentView === item.view },
              'hover:text-primary'
            )}
            aria-current={currentView === item.view ? 'page' : undefined}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs font-medium text-center">{item.label}</span>
          </button>
        )
      })}
    </nav>
  );
}
