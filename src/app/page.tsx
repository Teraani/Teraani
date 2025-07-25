

"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Player, User, Ranking, GoalieRanking, Game, League } from '@/lib/data';
import { initialData, defaultLeagueData } from '@/lib/data';
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
import LeagueSelectionView from '@/components/views/league-selection-view';
import BestElevenView from '@/components/views/best-eleven-view';
import type { Vote } from '@/components/views/best-eleven-view';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type View = 'welcome' | 'register' | 'league-selection' | 'modality-selection' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments' | 'best-eleven';
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
      return { lineup: 5, reserves: 4 };
    case 'campo':
    default:
      return { lineup: 11, reserves: 5 };
  }
};

export default function Home() {
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('welcome');
  const [appData, setAppData] = useState(initialData);
  const { toast } = useToast();
  
  // New state for multi-league
  const [currentLeagueId, setCurrentLeagueId] = useState<string>('defaultLeague');
  const [invitedToLeagueId, setInvitedToLeagueId] = useState<string | null>(null);
  const currentLeague: League | undefined = appData.leagues[currentLeagueId];

  // These states are now league-dependent
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  // Modality is now part of the league data
  const selectedModality = currentLeague?.modality ?? null;
  const [allGamesData, setAllGamesData] = useState<Record<string, Game[]>>({});

  
  // Maps userId -> best eleven lineup
  const [bestElevenVotes, setBestElevenVotes] = useState<Record<string, (BestElevenVote | null)[]>>({});
  const [bestElevenSaved, setBestElevenSaved] = useState<Record<string, boolean>>({});
  const [isVotingReleased, setIsVotingReleased] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [isVoteRevelationEnabled, setIsVoteRevelationEnabled] = useState(false);


  // Simulate a logged-in user. By default, it's the admin.
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>('user27'); // Default to Admin for initial load
  const currentUser = loggedInUserId && currentLeague ? currentLeague.users[loggedInUserId] : null;

  const { lineup: lineupSize, reserves: reservesSize } = useMemo(() => getTeamSizes(selectedModality), [selectedModality]);

  // State for the two teams the editor can manage
  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[]>(Array(lineupSize).fill(null));
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[]>(Array(reservesSize).fill(null));
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[]>(Array(lineupSize).fill(null));
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[]>(Array(reservesSize).fill(null));
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);

  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);
  
  // Check for invitation link on initial load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get('invite');
    if (inviteCode && appData.leagues[inviteCode]) {
      setInvitedToLeagueId(inviteCode);
      // If there's an invite code, always go to the registration screen.
      // The logic inside onRegisterSuccess will handle adding the user to the league.
      navigateTo('register');
    }
  }, []);

  useEffect(() => {
    const { lineup, reserves } = getTeamSizes(selectedModality);
    setTeam1Lineup(Array(lineup).fill(null));
    setTeam1Reserves(Array(reserves).fill(null));
    setTeam2Lineup(Array(lineup).fill(null));
    setTeam2Reserves(Array(reserves).fill(null));
  }, [selectedModality]);
  
  // Helper to update league data
  const updateCurrentLeague = (updater: (league: League) => League) => {
    if (!currentLeague) return;
    const newLeague = updater(currentLeague);
    setAppData(prevData => ({
      ...prevData,
      leagues: {
        ...prevData.leagues,
        [currentLeagueId]: newLeague,
      }
    }));
  };
  
  const handleLeagueChange = (newLeagueId: string) => {
    const newLeague = appData.leagues[newLeagueId];
    if (!newLeague) return;

    setCurrentLeagueId(newLeagueId);
    
    // Reset user and dependent states
    const firstUserId = Object.keys(newLeague.users)[0] || null;
    setLoggedInUserId(firstUserId);
    setLiveEvents([]);
    setAllGamesData({});
    setBestElevenVotes({});
    setBestElevenSaved({});
    setLineupsSaved(false);
    
    // Check if the new league has a modality, if not, navigate to selection
    if (!newLeague.modality) {
      navigateTo('modality-selection');
    } else {
        toast({
            title: `Liga Alterada: ${newLeague.name}`,
        });
    }
  };


  const handleAvatarChange = (userId: string, image: string) => {
    updateCurrentLeague(league => ({
      ...league,
      users: {
        ...league.users,
        [userId]: {
          ...league.users[userId],
          avatar: image,
        }
      }
    }));
  };

  const canEditLineup = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.editorOfTheRound;
  }, [currentUser, currentLeague]);

  const canManageVoting = useMemo(() => {
    if (!currentUser) return false;
    return currentUser.role === 'admin';
  }, [currentUser]);
  
  const canEditScouts = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.scoutEditor;
  }, [currentUser, currentLeague]);

  const canEditPayments = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.paymentEditor;
  }, [currentUser, currentLeague]);
  
  const handleLoginSuccess = (userId: string) => {
    const user = currentLeague?.users[userId];
    if (!user) {
      console.error("Login failed: User not found");
      toast({
        title: "Erro de Login",
        description: "Usuário não encontrado.",
        variant: "destructive",
      });
      return;
    }
    setLoggedInUserId(userId);

    if (invitedToLeagueId) {
        const leagueToJoin = appData.leagues[invitedToLeagueId];
        if (leagueToJoin && !leagueToJoin.users[userId]) {
            // Add user to the invited league
            setAppData(prev => ({
                ...prev,
                leagues: {
                    ...prev.leagues,
                    [invitedToLeagueId]: {
                        ...prev.leagues[invitedToLeagueId],
                        users: {
                            ...prev.leagues[invitedToLeagueId].users,
                            [userId]: user
                        }
                    }
                }
            }));
            setCurrentLeagueId(invitedToLeagueId);
            toast({ title: `Bem-vindo à ${leagueToJoin.name}!` });
        }
        setInvitedToLeagueId(null); // Clear invitation
    }
    
    navigateTo('dashboard');
    toast({
      title: `Bem-vindo, ${user.name}!`,
      description: "Login realizado com sucesso.",
    });
  };

  const handleRegistrationSuccess = () => {
    const tempUserId = `newUser_${Date.now()}`;
    const tempUser: User = {
      id: tempUserId,
      name: "Novo Jogador",
      email: "novo@jogador.com",
      teamName: "Time",
      partialScore: 0,
      totalScore: 0,
      valuation: 100,
      lineup: [],
      reserves: [],
      role: 'player', // Default to player, will be admin if they create a league
      paymentDueDate: new Date().toISOString().split('T')[0],
    };

    setLoggedInUserId(tempUserId);

    if (invitedToLeagueId) {
        setAppData(prev => ({
            ...prev,
            leagues: {
                ...prev.leagues,
                [invitedToLeagueId]: {
                    ...prev.leagues[invitedToLeagueId],
                    users: {
                        ...prev.leagues[invitedToLeagueId].users,
                        [tempUserId]: tempUser
                    }
                }
            }
        }));
        setCurrentLeagueId(invitedToLeagueId);
        toast({ title: "Bem-vindo!", description: `Você foi adicionado à liga ${appData.leagues[invitedToLeagueId].name}.` });
        navigateTo('dashboard');
        setInvitedToLeagueId(null);
    } else {
        // This is a temporary solution for non-invited registration
        setAppData(prev => ({
            ...prev,
            leagues: {
                ...prev.leagues,
                defaultLeague: {
                    ...prev.leagues.defaultLeague,
                    users: {
                        ...prev.leagues.defaultLeague.users,
                        [tempUserId]: tempUser
                    }
                }
            }
        }));
        navigateTo('league-selection');
    }
  }

  const handleCreateLeague = (leagueName: string) => {
    if (!currentUser) {
      toast({ title: "Erro", description: "Nenhum usuário logado para criar a liga.", variant: "destructive" });
      return;
    }

    const newLeagueId = `league_${Date.now()}`;
    
    const testUsers: Record<string, User> = {};
    for (let i=1; i<=3; i++) {
        const userId = `new_test_user_${i}`;
        testUsers[userId] = {
            id: userId,
            name: `Jogador de Teste ${i}`,
            email: `teste${i}@liga.com`,
            teamName: `Time Teste ${i}`,
            partialScore: 0,
            totalScore: 0,
            valuation: 100,
            lineup: [],
            reserves: [],
            role: 'player',
            paymentDueDate: new Date().toISOString().split('T')[0],
        };
    }

    const newLeague: League = {
      id: newLeagueId,
      name: leagueName,
      adminId: currentUser.id,
      modality: null,
      users: {
        [currentUser.id]: {
          ...currentUser,
          role: 'admin' // Ensure the creator is the admin of this league
        },
        ...testUsers
      },
      players: defaultLeagueData.players, // Start with default players
      editorOfTheRound: null,
      scoutEditor: null,
      paymentEditor: null,
      scalersRanking: {},
      goalieRanking: {},
    };

    setAppData(prev => ({
      ...prev,
      leagues: {
        ...prev.leagues,
        [newLeagueId]: newLeague,
      }
    }));
    
    setCurrentLeagueId(newLeagueId);
    navigateTo('modality-selection');
    toast({ title: "Liga Criada!", description: `Bem-vindo à ${leagueName}!` });
  };


  const handleModalitySelect = (modality: Modality) => {
    updateCurrentLeague(league => ({ ...league, modality }));
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
    updateCurrentLeague(league => ({
      ...league,
      players: {
        ...league.players,
        [playerId]: {
          ...league.players[playerId],
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
    updateCurrentLeague(league => ({ ...league, editorOfTheRound: userId }));
  };

  const handleSetScoutEditor = (userId: string | null) => {
    updateCurrentLeague(league => ({ ...league, scoutEditor: userId }));
  };
  
  const handleSetPaymentEditor = (userId: string | null) => {
    updateCurrentLeague(league => ({ ...league, paymentEditor: userId }));
  };

  const handleUpdateStats = (updatedPlayers: Record<string, Player>, updatedScalers?: Record<string, Ranking>, updatedGoalies?: Record<string, GoalieRanking>) => {
    updateCurrentLeague(league => ({
        ...league,
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
    updateCurrentLeague(league => ({...league, users: updatedUsers }));
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
    updateCurrentLeague(league => {
      const newPlayerId = `p${Object.keys(league.players).length + 1}`;
      const fullNewPlayer: Player = {
        ...newPlayer,
        last_val: 0,
        games: 0,
      }
      return {
        ...league,
        players: {
          ...league.players,
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
    updateCurrentLeague(league => {
      const newPlayers = { ...league.players };
      const playerName = newPlayers[playerId]?.name;
      delete newPlayers[playerId];
      return {
        ...league,
        players: newPlayers,
      };
    });
     toast({
      title: "Jogador Removido!",
      variant: "destructive",
    });
  };

  const handleUpdatePlayerInMarket = (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => {
    updateCurrentLeague(league => {
      if (!league.players[playerId]) {
        return league;
      }
      const updatedPlayer = {
        ...league.players[playerId],
        ...updatedData
      };
      return {
        ...league,
        players: {
          ...league.players,
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
    setIsVotingClosed(true);
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

  if (!currentLeague) {
    return <div>Carregando liga...</div>; // Or some other loading state
  }

  const selectedPlayer = selectedPlayerId ? { ...currentLeague.players[selectedPlayerId], id: selectedPlayerId } : null;

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
  


  const showBottomNav = currentView !== 'welcome' && currentView !== 'register' && currentView !== 'modality-selection' && currentView !== 'league-selection';

  const renderView = () => {
    if (!userForViews && showBottomNav) {
      return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
    }

    switch (currentView) {
      case 'welcome':
        return <WelcomeView onEnter={() => navigateTo('register')} />;
      case 'register':
        return <RegisterView onRegisterSuccess={handleRegistrationSuccess} />;
      case 'league-selection':
        return <LeagueSelectionView onCreateLeague={handleCreateLeague} />;
      case 'modality-selection':
        return <ModalitySelectionView 
                  onModalitySelect={handleModalitySelect} 
                  selectedModality={selectedModality}
                  isLeagueAdmin={currentUser?.role === 'admin'}
                />;
      case 'dashboard':
        return <DashboardView user={userForViews!} allUsers={currentLeague.users} onUserSelect={handleLoginSuccess} players={currentLeague.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} />;
      case 'lineup':
        return <LineupView 
                 players={currentLeague.players} 
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
        return selectedPlayer ? <PlayerDetailsView player={selectedPlayer} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userForViews!} allUsers={currentLeague.users} onUserSelect={handleLoginSuccess} players={currentLeague.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} />;
      case 'market':
        return <MarketView 
                 players={currentLeague.players} 
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
        return <PartialScoreView players={currentLeague.players} users={currentLeague.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} gamesData={allGamesData} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} user={userForViews!} players={currentLeague.players} allUsers={currentLeague.users} />;
      case 'statistics':
        return <StatisticsView players={currentLeague.players} users={currentLeague.users} onBack={() => navigateTo('dashboard')} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} scalersRanking={currentLeague.scalersRanking} goalieRanking={currentLeague.goalieRanking}/>;
      case 'admin':
        return <AdminView 
                  onBack={goBack} 
                  users={Object.values(currentLeague.users)} 
                  currentUser={currentUser!}
                  editorOfTheRound={currentLeague.editorOfTheRound} 
                  onSetEditor={handleSetEditor} 
                  scoutEditor={currentLeague.scoutEditor} 
                  onSetScoutEditor={handleSetScoutEditor}
                  paymentEditor={currentLeague.paymentEditor}
                  onSetPaymentEditor={handleSetPaymentEditor}
                  isVoteRevelationEnabled={isVoteRevelationEnabled}
                  onToggleVoteRevelation={handleToggleVoteRevelation}
                  leagueId={currentLeague.id}
                />;
       case 'live':
        return <LiveView 
                  onBack={goBack} 
                  user={userForViews!} 
                  players={currentLeague.players} 
                  canEditScouts={canEditScouts}
                  liveEvents={liveEvents}
                  onAddLiveEvent={handleAddLiveEvent}
                  onFinishMatch={handleFinishMatch}
                  team1Lineup={team1Lineup}
                  team2Lineup={team2Lineup}
                />;
      case 'payments':
        return <PaymentsView
                  onBack={goBack}
                  currentUser={currentUser!}
                  users={currentLeague.users}
                  canEdit={canEditPayments && !isPersonalPaymentsView}
                  onSave={handleUpdateUserPayments}
                />;
      case 'best-eleven':
        return <BestElevenView
                  onBack={goBack}
                  players={currentLeague.players}
                  currentUser={currentUser!}
                  allUsers={Object.values(currentLeague.users)}
                  allScaledPlayerIds={allScaledPlayerIds}
                  onVote={handleBestElevenVote}
                  userLineup={currentUser ? bestElevenVotes[currentUser.id] : undefined}
                  allVotes={bestElevenVotes}
                  isSaved={currentUser ? bestElevenSaved[currentUser.id] : false}
                  canManageVoting={canManageVoting}
                  isVotingReleased={isVotingReleased}
                  isVotingClosed={isVotingClosed}
                  onReleaseVoting={handleReleaseVoting}
                  onCloseVoting={handleCloseVoting}
                  modality={selectedModality}
                  isVoteRevelationEnabled={isVoteRevelationEnabled}
                />;
      default:
        return <DashboardView user={userForViews!} allUsers={currentLeague.users} onUserSelect={handleLoginSuccess} players={currentLeague.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} />;
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
