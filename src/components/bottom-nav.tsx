"use client";

import { Home, Shirt, LineChart, Trophy } from 'lucide-react';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { view: 'dashboard' as View, icon: Home, label: 'Início' },
  { view: 'lineup' as View, icon: Shirt, label: 'Escalação' },
  { view: 'market' as View, icon: LineChart, label: 'Mercado' },
  { view: 'leagues' as View, icon: Trophy, label: 'Ligas' },
];

export default function BottomNav({ currentView, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-950 border-t dark:border-zinc-800 shadow-lg flex justify-around p-2 z-50">
      {navItems.map((item) => (
        <button
          key={item.view}
          onClick={() => onNavigate(item.view)}
          className={cn(
            'flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary w-full transition-colors duration-200',
            { 'text-primary dark:text-primary': currentView === item.view }
          )}
          aria-current={currentView === item.view ? 'page' : undefined}
        >
          <item.icon className="h-6 w-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
