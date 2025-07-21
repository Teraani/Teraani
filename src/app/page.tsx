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
  const [userLineup, setUserLineup] = useState<(string | null)[]>(data.user.lineup);
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
    if (!slotToAddPlayer) return;

    setUserLineup(prevLineup => {
        const newLineup = [...prevLineup];
        // This logic will need to be more sophisticated if we have more complex formation changes.
        // For now, let's find the Nth null slot and replace it.
        let nullCount = 0;
        let replaced = false;
        for (let i = 0; i < newLineup.length; i++) {
            if (newLineup[i] === null) {
                if (nullCount === slotToAddPlayer.index) {
                     // A simple way to handle this for now. A more robust solution might be needed.
                     // The issue is how `index` in AddPlayerSlot maps to the userLineup array.
                     // Let's just find the first available null slot.
                     // A better approach would be to have a fixed-size array representing the field.
                }
            }
        }
        
        // Let's use a simpler, more direct approach for now.
        // The lineup array has nulls for empty slots.
        const currentPlayers = prevLineup.filter(p => p !== null);
        currentPlayers.push(playerId);
        
        // To maintain order, we should not just push.
        // The problem is that the userLineup array is not structured by position.
        // Let's rebuild the userLineup to have a fixed size with nulls.
        const lineupWithNulls = Array(11).fill(null);
        prevLineup.forEach((pId, i) => {
            if (pId) lineupWithNulls[i] = pId;
        });

        // Find the first empty slot and place the player there.
        // This is still not ideal as it doesn't respect the clicked slot.
        // The state needs to be refactored to represent the field positions.
        
        // Let's try another way. We have the lineup. Let's find the first null and replace it.
        // This is the root of the problem.
        // When user clicks on a slot, we need to know WHICH slot.
        // `userLineup` should probably be an object `{ GOL: [id], ZAG: [id, id], ...}`
        // or a fixed array `(string|null)[11]`
        
        // For now, let's try a direct replacement logic.
        // We will push the player, and let the LineupView handle rendering.
        // The core issue is that userLineup is re-sorted by position in LineupView.
        const newLineupWithPlayer = [...prevLineup.filter(p => p !== null), playerId];
        while(newLineupWithPlayer.length < 11) {
            newLineupWithPlayer.push(null);
        }

        setUserLineup(newLineupWithPlayer);
        
        setSlotToAddPlayer(null);
        navigateTo('lineup');
    });
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
    lineup: userLineup.filter(id => id !== null) as string[],
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
