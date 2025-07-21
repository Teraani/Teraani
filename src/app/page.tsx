
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
import AdminView from '@/components/views/admin-view';
import BottomNav from '@/components/bottom-nav';
import LoginView from '@/components/views/login-view';
import RegisterView from '@/components/views/register-view';

export type View = 'welcome' | 'login' | 'register' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin';
export type Position = Player['pos'] | null;

export interface AddPlayerSlot {
  position: Player['pos'] | 'RES'; // 'RES' for reserve
  index: number;
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('welcome');
  const [appData, setAppData] = useState(data);

  // Simulate a logged-in user. By default, it's the admin.
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const currentUser = loggedInUserId ? appData.users[loggedInUserId] : null;

  const [userLineup, setUserLineup] = useState<(string | null)[]>([]);
  const [userReserves, setUserReserves] = useState<(string | null)[]>([]);
  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | null>(null);
  
  const handleLoginSuccess = (userId: string) => {
    const user = appData.users[userId];
    setLoggedInUserId(userId);
    setUserLineup(user.lineup || Array(11).fill(null));
    setUserReserves(user.reserves || Array(5).fill(null));
    setUserAvatar(user.avatar || null);
    navigateTo('dashboard');
  };

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
  
  const handleSetEditor = (userId: string | null) => {
    setAppData(prevData => ({
        ...prevData,
        editorOfTheRound: userId,
    }));
  };

  const handleSetScoutEditor = (userId: string | null) => {
    setAppData(prevData => ({
        ...prevData,
        scoutEditor: userId,
    }));
  };

  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userWithCurrentLineup = useMemo(() => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      lineup: (userLineup || []).filter(id => id !== null) as string[],
      reserves: (userReserves || []).filter(id => id !== null) as string[],
    }
  }, [currentUser, userLineup, userReserves]);

  const renderView = () => {
    if (!userWithCurrentLineup && currentView !== 'welcome' && currentView !== 'login' && currentView !== 'register') {
      return <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigateTo('register')} onBack={() => navigateTo('welcome')} users={appData.users} />;
    }

    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('login')} />;
      case 'login':
        return <LoginView onLoginSuccess={handleLoginSuccess} onNavigateToRegister={() => navigateTo('register')} onBack={() => navigateTo('welcome')} users={appData.users} />;
      case 'register':
        return <RegisterView onRegisterSuccess={() => navigateTo('dashboard')} onNavigateToLogin={() => navigateTo('login')} />;
      case 'dashboard':
        return <DashboardView user={userWithCurrentLineup!} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
      case 'lineup':
        return <LineupView userLineup={userLineup} setUserLineup={setUserLineup} userReserves={userReserves} setUserReserves={setUserReserves} players={appData.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} userAvatar={userAvatar} currentUser={currentUser!} editorOfTheRound={appData.editorOfTheRound} />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userWithCurrentLineup!} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
      case 'market':
        return <MarketView players={appData.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={slotToAddPlayer?.position ?? null} />;
      case 'partial-score':
        return <PartialScoreView user={userWithCurrentLineup!} players={appData.players} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} friends={appData.friends} user={userWithCurrentLineup!} players={appData.players} userAvatar={userAvatar} />;
      case 'statistics':
        return <StatisticsView players={appData.players} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'admin':
        return <AdminView onBack={goBack} users={Object.values(appData.users)} editorOfTheRound={appData.editorOfTheRound} onSetEditor={handleSetEditor} scoutEditor={appData.scoutEditor} onSetScoutEditor={handleSetScoutEditor} />;
      default:
        return <DashboardView user={userWithCurrentLineup!} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} userAvatar={userAvatar} onAvatarChange={setUserAvatar} />;
    }
  };

  return (
    <div>
      <main className="pb-20">
        {renderView()}
      </main>
      {currentView !== 'welcome' && currentView !== 'login' && currentView !== 'register' && <BottomNav currentView={currentView} onNavigate={navigateTo} />}
    </div>
  );
}
