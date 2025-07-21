
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

export interface AddPlayerSlot {
  position: Player['pos'];
  index: number;
}


export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const [userLineup, setUserLineup] = useState<(string | null)[]>(data.user.lineup || []);
  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);


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
    if (slotToAddPlayer === null) return;
  
    setUserLineup(prevLineup => {
      const newLineup = [...(prevLineup || [])];
      // Place player in the specific slot that was clicked
      if (slotToAddPlayer.index >= 0 && slotToAddPlayer.index < newLineup.length) {
        newLineup[slotToAddPlayer.index] = playerId;
      }
      return newLineup;
    });
  
    setSlotToAddPlayer(null);
    navigateTo('lineup');
  };

  const goBack = () => {
    navigateTo(previousView);
  }

  const handleOpenMarket = (slot: AddPlayerSlot) => {
    setSlotToAddPlayer(slot);
    navigateTo('market');
  }

  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userWithCurrentLineup = useMemo(() => ({
    ...appData.user,
    lineup: (userLineup || []).filter(id => id !== null) as string[],
  }), [appData.user, userLineup]);

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} />;
      case 'lineup':
        return <LineupView userLineup={userLineup} setUserLineup={setUserLineup} players={appData.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} /> : <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} />;
      case 'market':
        return <MarketView players={appData.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={slotToAddPlayer?.position ?? null} />;
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
