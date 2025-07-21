
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
import FriendsScoreView from '@/components/views/friends-score-view';
import StatisticsView from '@/components/views/statistics-view';
import BottomNav from '@/components/bottom-nav';

export type View = 'welcome' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics';
export type Position = Player['pos'] | null;

export interface AddPlayerSlot {
  position: Player['pos'] | 'RES'; // 'RES' for reserve
  index: number;
}


export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const [appData, setAppData] = useState(data);
  const [userLineup, setUserLineup] = useState<(string | null)[]>(appData.user.lineup || Array(11).fill(null));
  const [userReserves, setUserReserves] = useState<(string | null)[]>(appData.user.reserves || Array(5).fill(null));
  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>('https://placehold.co/32x32');


  const navigateTo = (view: View) => {
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const selectPlayerForDetails = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const handlePlayerImageChange = (playerId: string, image: string) => {
    setAppData(prevData => ({
      ...prevData,
      players: {
        ...prevData.players,
        [playerId]: {
          ...prevData.players[playerId],
          img: image,
        }
      }
    }));
  };

  const addPlayerToLineup = (playerId: string) => {
    if (slotToAddPlayer === null) return;

    if (slotToAddPlayer.position === 'RES') {
      setUserReserves(prevReserves => {
        const newReserves = [...(prevReserves || [])];
        if (slotToAddPlayer.index >= 0 && slotToAddPlayer.index < newReserves.length) {
          newReserves[slotToAddPlayer.index] = playerId;
        }
        return newReserves;
      });
    } else {
      setUserLineup(prevLineup => {
        const newLineup = [...(prevLineup || [])];
        if (slotToAddPlayer.index >= 0 && slotToAddPlayer.index < newLineup.length) {
          newLineup[slotToAddPlayer.index] = playerId;
        }
        return newLineup;
      });
    }

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
    reserves: (userReserves || []).filter(id => id !== null) as string[],
  }), [appData.user, userLineup, userReserves]);

  const renderView = () => {
    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('dashboard')} />;
      case 'dashboard':
        return <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
      case 'lineup':
        return <LineupView userLineup={userLineup} setUserLineup={setUserLineup} userReserves={userReserves} setUserReserves={setUserReserves} players={appData.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
      case 'market':
        return <MarketView players={appData.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={slotToAddPlayer?.position ?? null} />;
      case 'partial-score':
        return <PartialScoreView user={userWithCurrentLineup} players={appData.players} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} friends={appData.friends} user={userWithCurrentLineup} players={appData.players} userAvatar={userAvatar} />;
      case 'statistics':
        return <StatisticsView players={appData.players} onBack={goBack} />;
      default:
        return <DashboardView user={userWithCurrentLineup} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
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
