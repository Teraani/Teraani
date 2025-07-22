
"use client";

import { Home, Shirt, Trophy, BarChart2, DollarSign } from 'lucide-react';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { view: 'dashboard' as View, icon: Home, label: 'Início', disabled: false },
  { view: 'lineup' as View, icon: Shirt, label: 'Escalação', disabled: false },
  { view: 'statistics' as View, icon: BarChart2, label: 'Estatísticas', disabled: false },
  { view: 'payments' as View, icon: DollarSign, label: 'Pagamentos', disabled: false },
];

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 shadow-lg flex justify-around p-2 z-50">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => !item.disabled && onNavigate(item.view)}
          disabled={item.disabled}
          className={cn(
            'flex flex-col items-center text-gray-500 dark:text-gray-400 w-full transition-colors duration-200 relative',
            { 'text-primary dark:text-primary': !item.disabled && currentView === item.view },
            item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-primary'
          )}
          aria-current={currentView === item.view ? 'page' : undefined}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs font-medium text-center">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
