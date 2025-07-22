

"use client";

import { useState, useMemo } from 'react';
import type { Player, User, Ranking, GoalieRanking } from '@/lib/data';
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
import RegisterView from '@/components/views/register-view';
import { useToast } from '@/hooks/use-toast';
import LiveView from '@/components/views/live-view';
import type { LiveEvent } from '@/components/views/live-view';
import PaymentsView from '@/components/views/payments-view';
import { cn } from '@/lib/utils';


export type View = 'welcome' | 'register' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments';
export type Position = Player['pos'] | null;

export interface AddPlayerSlot {
  position: Player['pos'] | 'RES'; // 'RES' for reserve
  index: number;
  team: 'team1' | 'team2';
}

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('welcome');
  const [appData, setAppData] = useState(data);
  const { toast } = useToast();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  // Simulate a logged-in user. By default, it's the admin.
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>('user27'); // Default to Admin for initial load
  const currentUser = loggedInUserId ? appData.users[loggedInUserId] : null;

  // State for the two teams the editor can manage
  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[]>(Array(11).fill(null));
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[]>(Array(5).fill(null));
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[]>(Array(11).fill(null));
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[]>(Array(5).fill(null));
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);

  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);
  
  const handleAvatarChange = (userId: string, image: string) => {
    setAppData(prevData => ({
      ...prevData,
      users: {
        ...prevData.users,
        [userId]: {
          ...prevData.users[userId],
          avatar: image,
        }
      }
    }));
  };

  const canEditLineup = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.id === appData.editorOfTheRound;
  }, [currentUser, appData.editorOfTheRound]);
  
  const canEditScouts = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.id === appData.scoutEditor;
  }, [currentUser, appData.scoutEditor]);

  const canEditPayments = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'admin' || currentUser.id === appData.paymentEditor;
  }, [currentUser, appData.paymentEditor]);
  
  const handleLoginSuccess = (userId: string) => {
    const user = appData.users[userId];
    if (!user) {
      console.error("Login failed: User not found");
      // Optionally show a toast error
      toast({
        title: "Erro de Login",
        description: "Usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }
    setLoggedInUserId(userId);
    navigateTo('dashboard');
    toast({
      title: `Bem-vindo, ${user.name}!`,
      description: "Login realizado com sucesso.",
    });
  };

  const handleRegistrationSuccess = () => {
    // For now, just log in the default user (Admin) after "Google Sign-In"
    handleLoginSuccess('user27');
  }

  const navigateTo = (view: View, options?: { isPersonalPayments?: boolean }) => {
    if (view === 'payments') {
      setIsPersonalPaymentsView(options?.isPersonalPayments || false);
    }
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
    
    const { position, index, team } = slotToAddPlayer;
    
    const setLineup = team === 'team1' ? setTeam1Lineup : setTeam2Lineup;
    const setReserves = team === 'team1' ? setTeam1Reserves : setTeam2Reserves;

    if (position === 'RES') {
      setReserves(prevReserves => {
        const newReserves = [...(prevReserves || [])];
        if (index >= 0 && index < newReserves.length) {
          newReserves[index] = playerId;
        }
        return newReserves;
      });
    } else {
      setLineup(prevLineup => {
        const newLineup = [...(prevLineup || [])];
        if (index >= 0 && index < newLineup.length) {
          newLineup[index] = playerId;
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
  
  const handleSetPaymentEditor = (userId: string | null) => {
    setAppData(prevData => ({
        ...prevData,
        paymentEditor: userId,
    }));
  };

  const handleUpdateStats = (updatedPlayers: Record<string, Player>, updatedScalers?: Record<string, Ranking>, updatedGoalies?: Record<string, GoalieRanking>) => {
    setAppData(prevData => ({
      ...prevData,
      players: updatedPlayers,
      ...(updatedScalers && { scalersRanking: updatedScalers }),
      ...(updatedGoalies && { goalieRanking: updatedGoalies }),
    }));
    toast({
      title: "Estatísticas Salvas!",
      description: "Os dados foram atualizados com sucesso.",
    });
  };

  const handleUpdateUserPayments = (updatedUsers: Record<string, User>) => {
    setAppData(prevData => ({
      ...prevData,
      users: updatedUsers
    }));
    toast({
      title: "Pagamentos Salvos!",
      description: "As datas de vencimento foram atualizadas.",
    });
  };

  const handleSaveLineups = () => {
    console.log("Saving lineups...");
    console.log("Team 1:", team1Lineup, team1Reserves);
    console.log("Team 2:", team2Lineup, team2Reserves);
    setLineupsSaved(true);
    toast({
        title: "Times Salvos!",
        description: "As escalações da rodada foram salvas com sucesso.",
    });
  };

  const handleAddLiveEvent = (event: Omit<LiveEvent, 'time'>) => {
    const newEvent: LiveEvent = {
      ...event,
      time: `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
    };
    setLiveEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const handleAddPlayerToMarket = (newPlayer: Omit<Player, 'last_val' | 'games'>) => {
    setAppData(prevData => {
      const newPlayerId = `p${Object.keys(prevData.players).length + 1}`;
      const fullNewPlayer: Player = {
        ...newPlayer,
        last_val: 0,
        games: 0,
      }
      return {
        ...prevData,
        players: {
          ...prevData.players,
          [newPlayerId]: fullNewPlayer,
        }
      };
    });
    toast({
      title: "Jogador Adicionado!",
      description: `${newPlayer.name} agora está disponível no mercado.`,
    });
  };

  const handleRemovePlayerFromMarket = (playerId: string) => {
    setAppData(prevData => {
      const newPlayers = { ...prevData.players };
      const playerName = newPlayers[playerId]?.name;
      delete newPlayers[playerId];
      return {
        ...prevData,
        players: newPlayers,
      };
    });
     toast({
      title: "Jogador Removido!",
      variant: "destructive",
    });
  };

  const handleUpdatePlayerInMarket = (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => {
    setAppData(prevData => {
      if (!prevData.players[playerId]) {
        return prevData;
      }
      const updatedPlayer = {
        ...prevData.players[playerId],
        ...updatedData
      };
      return {
        ...prevData,
        players: {
          ...prevData.players,
          [playerId]: updatedPlayer
        }
      };
    });
    toast({
      title: "Jogador Atualizado!",
      description: `Os dados de ${updatedData.name} foram salvos.`,
    });
  };


  const selectedPlayer = selectedPlayerId ? { ...appData.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userForViews = useMemo(() => {
    if (!currentUser) return null;
    return {
      ...currentUser,
      // The concept of a personal lineup is removed for display, using team lineups instead
      lineup: [],
      reserves: [],
    }
  }, [currentUser]);

  const allScaledPlayerIds = useMemo(() => {
    const scaledIds = new Set<string>();
    [...team1Lineup, ...team1Reserves, ...team2Lineup, ...team2Reserves].forEach(id => {
      if (id) scaledIds.add(id);
    });
    return Array.from(scaledIds);
  }, [team1Lineup, team1Reserves, team2Lineup, team2Reserves]);

  const showBottomNav = currentView !== 'welcome' && currentView !== 'register';

  const renderView = () => {
    if (!userForViews && showBottomNav) {
      return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
    }

    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('register')} />;
      case 'register':
        return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
      case 'dashboard':
        return <DashboardView user={userForViews!} allUsers={appData.users} onUserSelect={handleLoginSuccess} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} />;
      case 'lineup':
        return <LineupView 
                 players={appData.players} 
                 onPlayerSelect={selectPlayerForDetails} 
                 onNavigate={navigateTo} 
                 onAddPlayer={handleOpenMarket} 
                 currentUser={currentUser!}
                 canEdit={canEditLineup}
                 team1Lineup={team1Lineup}
                 setTeam1Lineup={setTeam1Lineup}
                 team1Reserves={team1Reserves}
                 setTeam1Reserves={setTeam1Reserves}
                 team2Lineup={team2Lineup}
                 setTeam2Lineup={setTeam2Lineup}
                 team2Reserves={team2Reserves}
                 setTeam2Reserves={setTeam2Reserves}
                 onSaveLineups={handleSaveLineups}
                 lineupsSaved={lineupsSaved}
               />;
      case 'player-details':
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userForViews!} allUsers={appData.users} onUserSelect={handleLoginSuccess} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} />;
      case 'market':
        return <MarketView 
                 players={appData.players} 
                 onPlayerSelect={addPlayerToLineup} 
                 onBack={goBack} 
                 position={slotToAddPlayer?.position ?? null}
                 scaledPlayerIds={allScaledPlayerIds}
                 canEdit={canEditScouts}
                 onAddPlayerToMarket={handleAddPlayerToMarket}
                 onRemovePlayerFromMarket={handleRemovePlayerFromMarket}
                 onUpdatePlayerInMarket={handleUpdatePlayerInMarket}
               />;
      case 'partial-score':
        return <PartialScoreView players={appData.players} users={appData.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} user={userForViews!} players={appData.players} allUsers={appData.users} />;
      case 'statistics':
        return <StatisticsView players={appData.players} users={appData.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} />;
      case 'admin':
        return <AdminView 
                  onBack={goBack} 
                  users={Object.values(appData.users)} 
                  editorOfTheRound={appData.editorOfTheRound} 
                  onSetEditor={handleSetEditor} 
                  scoutEditor={appData.scoutEditor} 
                  onSetScoutEditor={handleSetScoutEditor}
                  paymentEditor={appData.paymentEditor}
                  onSetPaymentEditor={handleSetPaymentEditor}
                />;
       case 'live':
        return <LiveView 
                  onBack={goBack} 
                  user={userForViews!} 
                  players={appData.players} 
                  canEditScouts={canEditScouts}
                  liveEvents={liveEvents}
                  onAddLiveEvent={handleAddLiveEvent}
                  allPlayers={Object.values(appData.players).map(p => ({...p, id: Object.keys(appData.players).find(key => appData.players[key] === p)!}))}
                />;
      case 'payments':
        return <PaymentsView
                  onBack={goBack}
                  currentUser={currentUser!}
                  users={appData.users}
                  canEdit={canEditPayments && !isPersonalPaymentsView}
                  onSave={handleUpdateUserPayments}
                />;
      default:
        return <DashboardView user={userForViews!} allUsers={appData.users} onUserSelect={handleLoginSuccess} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} />;
    }
  };

  return (
    <div>
      <main className={cn(showBottomNav && currentView !== 'welcome' && currentView !== 'register' && "pb-20")}>
        {renderView()}
      </main>
      {showBottomNav && <BottomNav currentView={currentView} onNavigate={navigateTo} canViewPayments={canEditPayments} />}
    </div>
  );
}
