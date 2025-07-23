

"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Player, User, Ranking, GoalieRanking, Game } from '@/lib/data';
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
import ModalitySelectionView from '@/components/views/modality-selection-view';
import BestElevenView from '@/components/views/best-eleven-view';
import type { Vote } from '@/components/views/best-eleven-view';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type View = 'welcome' | 'register' | 'modality-selection' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments' | 'best-eleven';
export type Position = Player['pos'] | null;
export type Modality = 'campo' | 'society' | 'futsal';

export interface AddPlayerSlot {
  position: Player['pos'] | 'RES'; // 'RES' for reserve
  index: number;
  team: 'team1' | 'team2';
}

export type BestElevenVote = { playerId: string; rating: number };

const getTeamSizes = (modality: Modality | null) => {
  switch (modality) {
    case 'society':
      return { lineup: 7, reserves: 4 };
    case 'futsal':
      return { lineup: 6, reserves: 4 };
    case 'campo':
    default:
      return { lineup: 11, reserves: 5 };
  }
};

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('welcome');
  const [appData, setAppData] = useState(data);
  const { toast } = useToast();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [selectedModality, setSelectedModality] = useState<Modality | null>(null);
  const [allGamesData, setAllGamesData] = useState<Record<string, Game[]>>({});

  
  // Maps userId -> best eleven lineup
  const [bestElevenVotes, setBestElevenVotes] = useState<Record<string, (BestElevenVote | null)[]>>({});
  const [bestElevenSaved, setBestElevenSaved] = useState<Record<string, boolean>>({});
  const [isVotingReleased, setIsVotingReleased] = useState(false);
  const [isBestElevenVotingClosed, setIsBestElevenVotingClosed] = useState(false);
  const [isVoteRevelationEnabled, setIsVoteRevelationEnabled] = useState(false);


  // Simulate a logged-in user. By default, it's the admin.
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>('user27'); // Default to Admin for initial load
  const currentUser = loggedInUserId ? appData.users[loggedInUserId] : null;

  const { lineup: lineupSize, reserves: reservesSize } = useMemo(() => getTeamSizes(selectedModality), [selectedModality]);

  // State for the two teams the editor can manage
  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[]>(Array(lineupSize).fill(null));
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[]>(Array(reservesSize).fill(null));
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[]>(Array(lineupSize).fill(null));
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[]>(Array(reservesSize).fill(null));
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);

  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);

  useEffect(() => {
    const { lineup, reserves } = getTeamSizes(selectedModality);
    setTeam1Lineup(Array(lineup).fill(null));
    setTeam1Reserves(Array(reserves).fill(null));
    setTeam2Lineup(Array(lineup).fill(null));
    setTeam2Reserves(Array(reserves).fill(null));
  }, [selectedModality]);
  
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
    setLoggedInUserId('user27');
    navigateTo('modality-selection');
  }

  const handleModalitySelect = (modality: Modality) => {
    setSelectedModality(modality);
    navigateTo('dashboard');
  };

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

  const handleFinishMatch = (team1Score: number, team2Score: number) => {
    setAllGamesData(prevGames => {
        const nextRoundNumber = Object.keys(prevGames).length + 1;
        const newRoundKey = `${nextRoundNumber}`;
        
        const scorers = liveEvents
            .filter(event => event.event === 'Gol')
            .map(event => ({ player: event.player, team: event.team }));

        const newGame: Game = {
            date: format(new Date(), "dd 'de' MMMM - HH:mm'hs'", { locale: ptBR }),
            homeTeam: 'Time 1',
            awayTeam: 'Time 2',
            homeScore: team1Score,
            awayScore: team2Score,
            status: 'Finalizado',
            scorers: scorers,
        };
        
        const updatedGames = { ...prevGames };
        if (updatedGames[newRoundKey]) {
            updatedGames[newRoundKey].push(newGame);
        } else {
            updatedGames[newRoundKey] = [newGame];
        }
        return updatedGames;
    });

    setLiveEvents([]); // Clear events for next match
    toast({
        title: "Partida Finalizada!",
        description: `O placar de ${team1Score} a ${team2Score} foi salvo nos resultados.`,
    });
    navigateTo('games');
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
  
  const handleBestElevenVote = (lineup: (BestElevenVote | null)[]) => {
    if (!currentUser) return;
    setBestElevenVotes(prev => ({
        ...prev,
        [currentUser.id]: lineup,
    }));
    setBestElevenSaved(prev => ({
        ...prev,
        [currentUser.id]: true,
    }))
     toast({
      title: "Seleção Salva!",
      description: `Sua seleção da rodada foi salva com sucesso.`,
    });
  };

  const handleReleaseVoting = () => {
    setIsVotingReleased(true);
    toast({
      title: "Votação Liberada!",
      description: "Os jogadores agora podem votar na Seleção da Rodada.",
    });
  };

  const handleCloseVoting = () => {
    setIsBestElevenVotingClosed(true);
    toast({
      title: "Votação Encerrada Manualmente",
      description: "O administrador encerrou a votação.",
    });
  };
  
  const handleToggleVoteRevelation = (enabled: boolean) => {
    setIsVoteRevelationEnabled(enabled);
    toast({
      title: `Revelação de Votos ${enabled ? 'Ativada' : 'Desativada'}`,
      description: `A visualização dos votos foi ${enabled ? 'liberada' : 'ocultada'} pelo admin.`,
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
  
  const allPlayersForScout = useMemo(() => {
    return Object.entries(appData.players)
      .filter(([id, _]) => allScaledPlayerIds.includes(id))
      .map(([id, player]) => ({...player, id}));
  }, [appData.players, allScaledPlayerIds]);

  // Logic to check if voting should be closed
    useEffect(() => {
        if (!isVotingReleased || isBestElevenVotingClosed) return;

        // Check 1: Time-based closure
        const now = new Date();
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        const hour = now.getHours();
        if (day > 4 || (day === 4 && hour >= 0)) {
            setIsBestElevenVotingClosed(true);
            toast({ title: "Votação Encerrada", description: "O prazo para a votação da Seleção da Rodada terminou." });
            return;
        }

        // Check 2: All players voted
        const scaledPlayerUsers = allScaledPlayerIds.map(pId => {
            const player = appData.players[pId];
            if (!player) return null;
            const user = Object.values(appData.users).find(u => u.name.toLowerCase().includes(player.name.split(' ')[0].toLowerCase()));
            return user;
        }).filter(Boolean) as User[];
        
        const haveAllVoted = scaledPlayerUsers.length > 0 && scaledPlayerUsers.every(user => bestElevenSaved[user.id]);

        if (haveAllVoted) {
            setIsBestElevenVotingClosed(true);
            toast({ title: "Votação Encerrada", description: "Todos os jogadores escalados já votaram!" });
        }

    }, [bestElevenSaved, allScaledPlayerIds, appData.players, appData.users, isVotingReleased, isBestElevenVotingClosed, toast]);


  const showBottomNav = currentView !== 'welcome' && currentView !== 'register' && currentView !== 'modality-selection';

  const renderView = () => {
    if (!userForViews && showBottomNav) {
      return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
    }

    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('register')} />;
      case 'register':
        return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
      case 'modality-selection':
        return <ModalitySelectionView onModalitySelect={handleModalitySelect} selectedModality={selectedModality} />;
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
                 modality={selectedModality}
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
                 canEdit={canEditLineup}
                 onAddPlayerToMarket={handleAddPlayerToMarket}
                 onRemovePlayerFromMarket={handleRemovePlayerFromMarket}
                 onUpdatePlayerInMarket={handleUpdatePlayerInMarket}
               />;
      case 'partial-score':
        return <PartialScoreView players={appData.players} users={appData.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} gamesData={allGamesData} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} user={userForViews!} players={appData.players} allUsers={appData.users} />;
      case 'statistics':
        return <StatisticsView players={appData.players} users={appData.users} onBack={() => navigateTo('dashboard')} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} />;
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
                  isVoteRevelationEnabled={isVoteRevelationEnabled}
                  onToggleVoteRevelation={handleToggleVoteRevelation}
                />;
       case 'live':
        return <LiveView 
                  onBack={goBack} 
                  user={userForViews!} 
                  players={appData.players} 
                  canEditScouts={canEditScouts}
                  liveEvents={liveEvents}
                  onAddLiveEvent={handleAddLiveEvent}
                  onFinishMatch={handleFinishMatch}
                  allPlayers={allPlayersForScout}
                  team1Lineup={team1Lineup}
                  team2Lineup={team2Lineup}
                />;
      case 'payments':
        return <PaymentsView
                  onBack={goBack}
                  currentUser={currentUser!}
                  users={appData.users}
                  canEdit={canEditPayments && !isPersonalPaymentsView}
                  onSave={handleUpdateUserPayments}
                />;
      case 'best-eleven':
        return <BestElevenView
                  onBack={goBack}
                  players={appData.players}
                  currentUser={currentUser!}
                  allUsers={Object.values(appData.users)}
                  onVote={handleBestElevenVote}
                  userLineup={currentUser ? bestElevenVotes[currentUser.id] : undefined}
                  allVotes={bestElevenVotes}
                  isSaved={currentUser ? bestElevenSaved[currentUser.id] : false}
                  canEdit={canEditLineup}
                  isVotingReleased={isVotingReleased}
                  isVotingClosed={isBestElevenVotingClosed}
                  onReleaseVoting={handleReleaseVoting}
                  onCloseVoting={handleCloseVoting}
                  modality={selectedModality}
                  isVoteRevelationEnabled={isVoteRevelationEnabled}
                />;
      default:
        return <DashboardView user={userForViews!} allUsers={appData.users} onUserSelect={handleLoginSuccess} players={appData.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} />;
    }
  };

  return (
    <div>
      <main className={cn(showBottomNav && "pb-20")}>
        {renderView()}
      </main>
      {showBottomNav && <BottomNav currentView={currentView} onNavigate={navigateTo} canViewPayments={canEditPayments} />}
    </div>
  );
}
