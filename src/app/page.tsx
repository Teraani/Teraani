"use client";

import { useState, useMemo } from 'react';
import type { Player, User } from '@/lib/data';
import { data } from '@/lib/data';
import WelcomeView from '@/components/views/welcome-view';
import DashboardView from '@/components/views/dashboard-view';
import LineupView from '@/components/views/lineup-view';
import PlayerDetailsView from '@/components/views/player-details-view';
import PartialScoreView from '@/components/views/partial-score-view';
import GamesView from '@/components/views/games-view';
import MarketView from '@/components/views/market-view';
import BottomNav from '@/components/bottom-nav';

export type View = 'welcome' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market';

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');


  const appData: { user: User; players: Record<string, Player> } = useMemo(() => data, []);

  const navigateTo = (view: View) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const selectPlayer = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const goBack = () => {
    navigateTo(previousView);
  }

  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <DashboardView user={appData.user} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayer} />;
      case 'lineup':
        return <LineupView user={appData.user} players={appData.players} onPlayerSelect={selectPlayer} onNavigate={navigateTo} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} /> : <DashboardView user={appData.user} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayer} />;
      case 'market':
        return <MarketView players={appData.players} onPlayerSelect={selectPlayer} onBack={goBack} />;
      case 'partial-score':
        return <PartialScoreView user={appData.user} players={appData.players} onBack={goBack} onPlayerSelect={selectPlayer} />;
      case 'games':
        return <GamesView onBack={goBack} />;
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
