"use client";

import { Home, Shirt, Trophy, BarChart2, Radio } from 'lucide-react';
import type { View } from '@/app/page';
import { cn } from '@/lib/utils';

interface BottomNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const navItems = [
  { view: 'dashboard' as View, icon: Home, label: 'Início' },
  { view: 'lineup' as View, icon: Shirt, label: 'Escalação' },
  { view: 'live' as View, icon: Radio, label: 'Ao Vivo' },
  { view: 'statistics' as View, icon: BarChart2, label: 'Estatísticas' },
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
            'flex flex-col items-center text-gray-500 dark:text-gray-400 hover:text-primary w-full transition-colors duration-200 relative',
            { 'text-primary dark:text-primary': currentView === item.view }
          )}
          aria-current={currentView === item.view ? 'page' : undefined}
        >
          {item.view === 'live' && (
            <span className="absolute top-0 right-3 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          )}
          <item.icon className="h-6 w-6" />
          <span className="text-xs font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
