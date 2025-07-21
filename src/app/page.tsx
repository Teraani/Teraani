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
export type Position = Player['pos'] | null;


export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const [userLineup, setUserLineup] = useState<string[]>(data.user.lineup);
  const [positionToAdd, setPositionToAdd] = useState<Position>(null);


  const appData: { user: User; players: Record<string, Player> } = useMemo(() => data, []);

  const navigateTo = (view: View) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const selectPlayerForDetails = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const addPlayerToLineup = (playerId: string) => {
    if (!positionToAdd) return;
    setUserLineup(prevLineup => [...prevLineup, playerId]);
    setPositionToAdd(null);
    navigateTo('lineup');
  };

  const goBack = () => {
    navigateTo(previousView);
  }

  const handleOpenMarket = (position: Position) => {
    setPositionToAdd(position);
    navigateTo('market');
  }

  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userWithCurrentLineup = useMemo(() => ({
    ...appData.user,
    lineup: userLineup,
  }), [appData.user, userLineup]);

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} />;
      case 'lineup':
        return <LineupView user={userWithCurrentLineup} setUserLineup={setUserLineup} players={appData.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} /> : <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} />;
      case 'market':
        return <MarketView players={appData.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={positionToAdd} />;
      case 'partial-score':
        return <PartialScoreView user={userWithCurrentLineup} players={appData.players} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} />;
      default:
        return <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} />;
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
