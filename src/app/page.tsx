

"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Player, User, Ranking, GoalieRanking, Game, League, PlayerPerformance } from '@/lib/data';
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
import LoginView from '@/components/views/login-view';
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
import LeaguesView from '@/components/views/leagues-view';
import type { ShirtColor, Formation } from '@/components/views/lineup-view';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged, User as FirebaseUser, signOut, updateProfile } from 'firebase/auth';

export type View = 'welcome' | 'register' | 'login' | 'modality-selection' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments' | 'best-eleven' | 'loading';
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

const getFormationsForModality = (modality: Modality | null): Formation[] => {
  switch (modality) {
    case 'society':
      return ['3-2-1', '2-3-1'];
    case 'futsal':
      return ['2-2', '3-1'];
    case 'campo':
    default:
      return ['4-4-2', '4-3-3', '3-5-2'];
  }
};

// Player IDs reordered to match the 4-3-3 formation layout (3 ATK, 3 MEI, 4 DEF, 1 GOL)
const team2002_ids = [
    // Attackers
    'p-ronaldo', 'p-rivaldo', 'p-ronaldinho',
    // Midfielders
    'p-juninho-paulista', 'p-gilberto-silva', 'p-edmilson', 
    // Defenders
    'p-cafu', 'p-lucio', 'p-roque-junior', 'p-roberto-carlos',
    // Goalkeeper
    'p-marcos'
];


// Player IDs reordered to match the 4-4-2 formation layout (2 ATK, 4 MEI, 4 DEF, 1 GOL)
const team1994_ids = [
    // Attackers
    'p-romario', 'p-bebeto',
    // Midfielders
    'p-mauro-silva', 'p-dunga', 'p-mazinho', 'p-zinho',
    // Defenders
    'p-jorginho', 'p-aldair', 'p-marcio-santos', 'p-branco',
    // Goalkeeper
    'p-taffarel'
];


export default function Home() {
  const [currentView, setCurrentView] = useState<View>('loading');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('loading');
  
  const [appData, setAppDataState] = useState(initialData);
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  
  const setAppData = (data: any) => {
    if (typeof data === 'undefined') {
        console.error("Attempted to set undefined app data. This action was prevented.");
        return; 
    }
    setAppDataState(data);
    if (typeof window !== 'undefined') {
        localStorage.setItem('amistosos_fc_data', JSON.stringify(data));
    }
  }

  // New state for multi-league
  const [currentLeagueId, setCurrentLeagueId] = useState<string>('defaultLeague');
  const [invitedToLeagueId, setInvitedToLeagueId] = useState<string | null>(null);

  useEffect(() => {
    setIsInitializing(true);
    try {
        const savedData = localStorage.getItem('amistosos_fc_data');
        if (savedData && savedData !== 'undefined') {
          setAppDataState(JSON.parse(savedData));
        } else {
          setAppDataState(initialData);
        }
    } catch (error) {
        console.error("Failed to parse localStorage data, resetting to initial data.", error);
        setAppDataState(initialData);
    }


    const params = new URLSearchParams(window.location.search);
    const inviteId = params.get('invite');
    if (inviteId) {
        setInvitedToLeagueId(inviteId);
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            setLoggedInUserId(user.uid);
            const userIsAlreadyInALeague = Object.values(appData.leagues).some(l => l.users[user.uid]);

            if (invitedToLeagueId && appData.leagues[invitedToLeagueId]) {
                 handleJoinLeague(invitedToLeagueId, user);
            } else if (!userIsAlreadyInALeague) {
                // This is a new user without an invite, create a default league for them.
                handleCreateLeague(`Liga de ${user.displayName || 'Novo Jogador'}`, user);
            } else {
                // Existing user, find their league or default
                const lastLeagueId = localStorage.getItem('last_league_id') || Object.values(appData.leagues).find(l => l.users[user.uid])?.id || 'defaultLeague';
                setCurrentLeagueId(lastLeagueId);
                const currentLeagueData = appData.leagues[lastLeagueId];

                if (currentLeagueData && !currentLeagueData.modality) {
                     navigateTo('modality-selection');
                } else {
                     navigateTo('dashboard');
                }
            }
        } else {
            setLoggedInUserId(null);
            navigateTo('welcome');
        }
       setIsInitializing(false);
    });

    return () => unsubscribe();
  }, []);


  const currentLeague: League | undefined = appData.leagues[currentLeagueId];

  // These states are now league-dependent
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  // Modality is now part of the league data
  const selectedModality = currentLeague?.modality ?? null;
  
  // Maps userId -> best eleven lineup
  const [bestElevenVotes, setBestElevenVotes] = useState<Record<string, (BestElevenVote | null)[]>>({});
  const [bestElevenSaved, setBestElevenSaved] = useState<Record<string, boolean>>({});
  const [isVotingReleased, setIsVotingReleased] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [isVoteRevelationEnabled, setIsVoteRevelationEnabled] = useState(false);
  const [isPaymentsEnabled, setIsPaymentsEnabled] = useState(currentLeague?.paymentsEnabled ?? true);


  // State to hold player IDs from the last finished match for voting
  const [lastRoundPlayerIds, setLastRoundPlayerIds] = useState<string[]>([]);


  // Simulate a logged-in user. By default, it's the admin.
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null); 
  const currentUser = loggedInUserId && currentLeague ? currentLeague.users[loggedInUserId] : null;

  const { lineup: lineupSize, reserves: reservesSize } = useMemo(() => getTeamSizes(selectedModality), [selectedModality]);

  // State for the two teams the editor can manage
  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[]>(team2002_ids);
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[]>(Array(5).fill(null));
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[]>(team1994_ids);
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[]>(Array(5).fill(null));
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);
  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('amarelo');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('verde');
  const [formation, setFormation] = useState<Formation>('4-4-2');

  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);

  useEffect(() => {
    if (currentLeague) {
      setIsPaymentsEnabled(currentLeague.paymentsEnabled);
    }
  }, [currentLeague]);

  // Helper to update league data
  const updateCurrentLeague = (updater: (league: League) => League) => {
    if (!currentLeague) return;
    const newLeague = updater(currentLeague);
    setAppData({
      ...appData,
      leagues: {
        ...appData.leagues,
        [currentLeagueId]: newLeague,
      }
    });
  };
  
  const handleLeagueChange = (newLeagueId: string) => {
    const newLeague = appData.leagues[newLeagueId];
    if (!newLeague) return;

    setCurrentLeagueId(newLeagueId);
    
    const firstUserIdOfNewLeague = newLeague.users[auth.currentUser?.uid || ''] ? auth.currentUser!.uid : Object.keys(newLeague.users)[0];

    setLoggedInUserId(firstUserIdOfNewLeague);
    setLiveEvents([]);
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
    navigateTo('dashboard');
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

  const handleUpdateUser = async (userId: string, newName: string) => {
    if (auth.currentUser && auth.currentUser.uid === userId) {
      try {
        await updateProfile(auth.currentUser, { displayName: newName });
      } catch (error) {
        console.error("Failed to update Firebase profile:", error);
        toast({ title: "Erro", description: "Não foi possível atualizar o perfil no Firebase.", variant: "destructive" });
        return; // Don't update local state if Firebase fails
      }
    }
    
    updateCurrentLeague(league => ({
      ...league,
      users: {
        ...league.users,
        [userId]: {
          ...league.users[userId],
          name: newName,
        }
      }
    }));
    toast({ title: "Perfil Atualizado!", description: "Seu nome foi alterado com sucesso." });
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
  
  const handleJoinLeague = (leagueId: string, user: FirebaseUser) => {
    const leagueToJoin = appData.leagues[leagueId];
    if (!leagueToJoin) {
      toast({ title: "Liga não encontrada", variant: "destructive" });
      return;
    }

    const newUserForLeague: User = {
      id: user.uid,
      name: user.displayName || 'Novo Jogador',
      email: user.email!,
      teamName: `${(user.displayName || 'Novo').split(' ')[0]} FC`,
      partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player',
      paymentDueDate: new Date().toISOString().split('T')[0],
    };

    setAppData(prevData => {
        const newLeagues = { ...prevData.leagues };
        newLeagues[leagueId].users[user.uid] = newUserForLeague;
        return { ...prevData, leagues: newLeagues };
    });

    setCurrentLeagueId(leagueId);
    setLoggedInUserId(user.uid);
    setInvitedToLeagueId(null);
    navigateTo('dashboard');
    toast({ title: `Bem-vindo à ${leagueToJoin.name}!`, description: "Você entrou na liga com sucesso." });
  };


  const handleCreateLeague = (leagueName: string, user: FirebaseUser) => {
    const newLeagueId = `league_${Date.now()}`;
    const userId = user.uid;

    const userObject: User = {
        id: userId,
        name: user.displayName || 'Novo Jogador',
        email: user.email!,
        teamName: `${(user.displayName || 'Novo').split(' ')[0]} FC`,
        partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'admin',
        paymentDueDate: new Date().toISOString().split('T')[0],
    };
    
    const testUsers: Record<string, User> = {};
    for (let i=1; i<=3; i++) {
        const testUserId = `new_test_user_${i}_${newLeagueId}`;
        testUsers[testUserId] = {
            id: testUserId, name: `Jogador de Teste ${i}`, email: `teste${i}@liga.com`, teamName: `Time Teste ${i}`,
            partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [], role: 'player',
            paymentDueDate: new Date().toISOString().split('T')[0],
        };
    }

    const newLeague: League = {
      id: newLeagueId,
      name: leagueName,
      adminId: userId,
      modality: null,
      paymentsEnabled: true,
      users: {
        [userId]: userObject,
        ...testUsers
      },
      players: defaultLeagueData.players,
      games: {},
      editorOfTheRound: null, scoutEditor: null, paymentEditor: null,
      scalersRanking: {}, goalieRanking: {},
    };

    setAppData(currentData => {
        const newAppData = { ...currentData };
        newAppData.leagues[newLeagueId] = newLeague;
        return newAppData;
    });
    
    setCurrentLeagueId(newLeagueId);
    setLoggedInUserId(userId);
    setTeam1Lineup(team2002_ids);
    setTeam2Lineup(team1994_ids);

    navigateTo('modality-selection');
    toast({ title: "Liga Criada!", description: `Bem-vindo à ${leagueName}!` });
  };


  const handleModalitySelect = (modality: Modality) => {
    updateCurrentLeague(league => ({ ...league, modality }));
    navigateTo('dashboard');
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // onAuthStateChanged will handle navigation to 'welcome'
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Erro ao sair", description: "Não foi possível encerrar a sessão.", variant: "destructive" });
    }
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

  const allScaledPlayerIds = useMemo(() => {
    const scaledIds = new Set<string>();
    [...team1Lineup, ...team1Reserves, ...team2Lineup, ...team2Reserves].forEach(id => {
      if (id) scaledIds.add(id);
    });
    return Array.from(scaledIds);
  }, [team1Lineup, team1Reserves, team2Lineup, team2Reserves]);

  const handleFinishMatch = (team1Score: number, team2Score: number, playersOfLastRound: string[]) => {
    setLastRoundPlayerIds(playersOfLastRound);

    updateCurrentLeague(league => {
        const updatedPlayers = { ...league.players };
        const updatedGames = { ...league.games };
        const roundNumber = Object.keys(updatedGames).length + 1;
        const gameId = `game_${roundNumber}_${Date.now()}`;
        
        const newGame: Game = {
            id: gameId,
            date: format(new Date(), "dd 'de' MMMM - HH:mm'hs'", { locale: ptBR }),
            homeTeam: 'Time 1',
            awayTeam: 'Time 2',
            homeScore: team1Score,
            awayScore: team2Score,
            status: 'Finalizado',
            scorers: liveEvents.filter(event => event.event === 'Gol').map(event => ({ player: event.player, team: event.team })),
        };
        updatedGames[gameId] = newGame;

        const team1PlayerIds = new Set([...team1Lineup, ...team1Reserves].filter(Boolean));
        const team2PlayerIds = new Set([...team2Lineup, ...team2Reserves].filter(Boolean));
        const matchResult = team1Score > team2Score ? 'win' : team2Score > team1Score ? 'loss' : 'draw';

        playersOfLastRound.forEach(playerId => {
            const player = updatedPlayers[playerId];
            if (!player) return;

            // Initialize stats if they don't exist
            if (!player.stats) {
                player.stats = { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 };
            }
             if (!player.performanceHistory) {
                player.performanceHistory = [];
            }

            let roundPoints = 0;
            const roundGoals = liveEvents.filter(e => e.playerId === playerId && e.event === 'Gol').length;
            const roundAssists = liveEvents.filter(e => e.playerId === playerId && e.event === 'Assistência').length;

            roundPoints += roundGoals * 5; // 5 points for a goal
            roundPoints += roundAssists * 3; // 3 points for an assist

            player.stats.games = (player.stats.games || 0) + 1;
            
            const playerTeamIdentifier = team1PlayerIds.has(playerId) ? 'team1' : 'team2';
            const playerResult = (playerTeamIdentifier === 'team1' ? matchResult : (matchResult === 'win' ? 'loss' : (matchResult === 'loss' ? 'win' : 'draw')));

            if (playerResult === 'win') {
                player.stats.wins++;
                roundPoints += 3; // 3 points for a win
            } else if (playerResult === 'draw') {
                player.stats.draws++;
                roundPoints += 1; // 1 point for a draw
            } else {
                player.stats.losses++;
            }
            
            player.stats.goals += roundGoals;
            player.stats.assists += roundAssists;
            player.points += roundPoints;

            const totalPointsFromResults = (player.stats.wins * 3) + player.stats.draws;
            const totalPossiblePoints = player.stats.games * 3;
            player.stats.performance = totalPossiblePoints > 0 ? (totalPointsFromResults / totalPossiblePoints) * 100 : 0;


            player.performanceHistory.push({
                round: roundNumber,
                points: roundPoints,
                team: playerTeamIdentifier === 'team1' ? newGame.homeTeam : newGame.awayTeam,
                goals: roundGoals,
                assists: roundAssists,
                gameId: gameId,
                shirtColor: playerTeamIdentifier === 'team1' ? team1ShirtColor : team2ShirtColor,
            });
        });

        return { ...league, players: updatedPlayers, games: updatedGames };
    });

    // Reset all round-specific states
    setLiveEvents([]); 
    setLineupsSaved(false);
    const { lineup: lineupSizeValue, reserves: reservesSizeValue } = getTeamSizes(selectedModality);
    setTeam1Lineup(Array(lineupSizeValue).fill(null));
    setTeam1Reserves(Array(reservesSizeValue).fill(null));
    setTeam2Lineup(Array(lineupSizeValue).fill(null));
    setTeam2Reserves(Array(reservesSizeValue).fill(null));
    
    // Reset voting state
    setBestElevenVotes({});
    setBestElevenSaved({});
    setIsVotingReleased(false);
    setIsVotingClosed(false);

    toast({
        title: "Partida Finalizada!",
        description: `O placar de ${team1Score} a ${team2Score} foi salvo. As estatísticas foram atualizadas.`,
    });
    navigateTo('games');
};

  const handleAddPlayerToMarket = (newPlayer: Omit<Player, 'last_val' | 'games' | 'performanceHistory'>) => {
    updateCurrentLeague(league => {
      const newPlayerId = `p${Object.keys(league.players).length + 1}`;
      const fullNewPlayer: Player = {
        ...newPlayer,
        last_val: 0,
        games: 0,
        stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 },
        performanceHistory: [],
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

  const handleTogglePayments = (enabled: boolean) => {
    updateCurrentLeague(league => ({ ...league, paymentsEnabled: enabled }));
    setIsPaymentsEnabled(enabled);
     toast({
      title: `Módulo de Pagamentos ${enabled ? 'Ativado' : 'Desativado'}`,
    });
  };

  const handleUpdateLeagueName = (newName: string) => {
    updateCurrentLeague(league => ({ ...league, name: newName }));
    toast({
      title: "Nome da Liga Atualizado!",
    });
  };

  if (isInitializing) {
    return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
  }
  
  if (!currentLeague && !['welcome', 'register', 'login', 'loading'].includes(currentView)) {
    return <div className="flex items-center justify-center h-screen bg-background">Carregando liga...</div>;
  }

  const selectedPlayer = selectedPlayerId && currentLeague ? { ...currentLeague.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userForViews = currentUser;

  const showBottomNav = !['welcome', 'register', 'login', 'modality-selection', 'loading'].includes(currentView);

  const renderView = () => {
    switch (currentView) {
      case 'loading':
         return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
      case 'welcome':
        return <WelcomeView onNavigate={navigateTo} />;
      case 'register':
        return <RegisterView onNavigateToLogin={() => navigateTo('login')} />;
      case 'login':
        return <LoginView onNavigateToRegister={() => navigateTo('register')} />;
      case 'leagues':
        return <LeaguesView 
                  onBack={goBack} 
                  leagues={appData.leagues} 
                  currentLeagueId={currentLeagueId}
                  onLeagueChange={handleLeagueChange}
                  currentUser={currentUser!}
                />;
      case 'modality-selection':
        if (!loggedInUserId || !currentLeague) {
           setCurrentView('welcome');
           return <WelcomeView onNavigate={navigateTo} />;
        }
        const isLeagueAdmin = currentLeague.adminId === loggedInUserId;
        return <ModalitySelectionView 
                  onModalitySelect={handleModalitySelect} 
                  selectedModality={selectedModality}
                  isLeagueAdmin={isLeagueAdmin}
                />;
      case 'dashboard':
        return <DashboardView user={userForViews!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
      case 'lineup':
        return <LineupView 
                 players={currentLeague!.players} 
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
                 team1ShirtColor={team1ShirtColor}
                 setTeam1ShirtColor={setTeam1ShirtColor}
                 team2ShirtColor={team2ShirtColor}
                 setTeam2ShirtColor={setTeam2ShirtColor}
                 formation={formation}
                 setFormation={setFormation}
               />;
      case 'player-details':
        return selectedPlayer && currentLeague ? <PlayerDetailsView player={selectedPlayer} games={currentLeague.games} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userForViews!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
      case 'market':
        return <MarketView 
                 players={currentLeague!.players} 
                 onPlayerSelect={addPlayerToLineup} 
                 onBack={goBack} 
                 position={slotToAddPlayer?.position ?? null}
                 scaledPlayerIds={allScaledPlayerIds}
                 canEdit={canEditLineup}
                 onAddPlayerToMarket={handleAddPlayerToMarket}
                 onRemovePlayerFromMarket={handleRemovePlayerFromMarket}
                 onUpdatePlayerInMarket={() => {}}
               />;
      case 'partial-score':
        return <PartialScoreView players={currentLeague!.players} users={currentLeague!.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
      case 'games':
        return <GamesView onBack={goBack} gamesData={currentLeague!.games} />;
      case 'friends-score':
        return <FriendsScoreView onBack={goBack} user={userForViews!} players={currentLeague!.players} allUsers={currentLeague!.users} />;
      case 'statistics':
        return <StatisticsView players={currentLeague!.players} users={currentLeague!.users} onBack={() => navigateTo('dashboard')} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} scalersRanking={currentLeague!.scalersRanking} goalieRanking={currentLeague!.goalieRanking}/>;
      case 'admin':
        return <AdminView 
                  onBack={goBack} 
                  users={Object.values(currentLeague!.users)} 
                  currentUser={currentUser!}
                  editorOfTheRound={currentLeague!.editorOfTheRound} 
                  onSetEditor={handleSetEditor} 
                  scoutEditor={currentLeague!.scoutEditor} 
                  onSetScoutEditor={handleSetScoutEditor}
                  paymentEditor={currentLeague!.paymentEditor}
                  onSetPaymentEditor={handleSetPaymentEditor}
                  isVoteRevelationEnabled={isVoteRevelationEnabled}
                  onToggleVoteRevelation={handleToggleVoteRevelation}
                  leagueId={currentLeague!.id}
                  isPaymentsEnabled={isPaymentsEnabled}
                  onTogglePayments={handleTogglePayments}
                  leagueName={currentLeague!.name}
                  onUpdateLeagueName={handleUpdateLeagueName}
                />;
       case 'live':
        return <LiveView 
                  onBack={goBack} 
                  user={userForViews!} 
                  players={currentLeague!.players} 
                  canEditScouts={canEditScouts}
                  liveEvents={liveEvents}
                  onAddLiveEvent={handleAddLiveEvent}
                  onFinishMatch={handleFinishMatch}
                  team1Lineup={team1Lineup}
                  team2Lineup={team2Lineup}
                  allScaledPlayerIds={allScaledPlayerIds}
                />;
      case 'payments':
        return <PaymentsView
                  onBack={goBack}
                  currentUser={currentUser!}
                  users={currentLeague!.users}
                  canEdit={canEditPayments && !isPersonalPaymentsView}
                  onSave={handleUpdateUserPayments}
                />;
      case 'best-eleven':
        return <BestElevenView
                  onBack={goBack}
                  players={currentLeague!.players}
                  currentUser={currentUser!}
                  allUsers={Object.values(currentLeague!.users)}
                  allScaledPlayerIds={lastRoundPlayerIds}
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
                  formation={formation}
                />;
      default:
        return <DashboardView user={userForViews!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
    }
  };

  return (
    <div>
      <main className={cn(showBottomNav && "pb-20")}>
        {renderView()}
      </main>
      {showBottomNav && userForViews && <BottomNav currentView={currentView} onNavigate={navigateTo} canViewPayments={canEditPayments && isPaymentsEnabled} />}
    </div>
  );
}

    