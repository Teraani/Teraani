"use client";

import { useState, useMemo } from 'react';
import type { Player, User } from '@/lib/data';
import { data } from '@/lib/data';
import WelcomeView from '@/components/views/welcome-view';
import DashboardView from '@/components/views/dashboard-view';
import LineupView from '@/components/views/lineup-view';
import PlayerDetailsView from '@/components/views/player-details-view';
import BottomNav from '@/components/bottom-nav';

export type View = 'welcome' | 'dashboard' | 'lineup' | 'player-details' | 'leagues';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);

  const appData: { user: User; players: Record<string, Player> } = useMemo(() => data, []);

  const navigateTo = (view: View) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const selectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const handleBackFromPlayerDetails = () => {
    // A simple logic to go back to the previous sensible view.
    // If we came from lineup, go back to lineup. Otherwise, dashboard is a safe bet.
    // This could be improved with a more robust navigation history.
    if (currentView === 'player-details') {
       navigateTo('lineup');
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <DashboardView user={appData.user} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayer} />;
      case 'lineup':
        return <LineupView user={appData.user} players={appData.players} onPlayerSelect={selectPlayer} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={() => handleBackFromPlayerDetails()} /> : <DashboardView user={appData.user} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayer} />;
      default:
        return <DashboardView user={appData.user} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayer} />;
    }
  };

  return (
    <div className="bg-gray-100 dark:bg-zinc-900 min-h-screen">
      <main className="pb-20">
        {renderView()}
      </main>
      {currentView !== 'welcome' && <BottomNav currentView={currentView} onNavigate={navigateTo} />}
    </div>
  );
}
