

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
import LeagueEntryView from '@/components/views/league-entry-view';
import BestElevenView from '@/components/views/best-eleven-view';
import type { Vote } from '@/components/views/best-eleven-view';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import LeaguesView from '@/components/views/leagues-view';
import type { ShirtColor, Formation } from '@/components/views/lineup-view';
import { auth } from '@/lib/firebase-config';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';

export type View = 'welcome' | 'register' | 'login' | 'league-entry' | 'modality-selection' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments' | 'best-eleven';
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
  const [currentView, setCurrentView] = useState<View>('welcome');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('welcome');
  
  const [appData, setAppDataState] = useState(initialData);
  const { toast } = useToast();
  
  const setAppData = (data: any) => {
    setAppDataState(data);
    if (typeof window !== 'undefined') {
        localStorage.setItem('amistosos_fc_data', JSON.stringify(data));
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
        const savedData = localStorage.getItem('amistosos_fc_data');
        let loadedData = initialData;
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData);
                // Basic validation to ensure we're loading valid data
                if (parsedData && parsedData.leagues) {
                    loadedData = parsedData;
                }
            } catch (e) {
                console.error("Failed to parse localStorage data, resetting.", e);
                localStorage.removeItem('amistosos_fc_data');
            }
        }
        setAppDataState(loadedData);

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            const authScreens: View[] = ['welcome', 'login', 'register'];
            // We get the current view from the state, which is reliable.
            if (user) {
                // If the user is logged in, but somehow on an auth screen (e.g. back button),
                // we safely navigate them to the dashboard.
                if (authScreens.includes(currentView)) {
                   handleLoginSuccess(user.uid, loadedData); // Use the data loaded at startup
                }
            } else {
                // If there's no user, ensure we are on an authentication screen.
                if (!authScreens.includes(currentView)) {
                    navigateTo('welcome');
                }
            }
        });

        return () => unsubscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, [currentView]); // Rerun when currentView changes to handle navigation correctly


  // New state for multi-league
  const [currentLeagueId, setCurrentLeagueId] = useState<string>('defaultLeague');
  const [invitedToLeagueId, setInvitedToLeagueId] = useState<string | null>(null);
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
  
  // Check for invitation link on initial load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const inviteCode = urlParams.get('invite');
      if (inviteCode && appData.leagues[inviteCode]) {
        setInvitedToLeagueId(inviteCode);
        navigateTo('register');
      }
    }
  }, [appData.leagues]);

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
    
    // Reset user and dependent states
    const firstUserId = Object.keys(newLeague.users)[0] || null;
    setLoggedInUserId(firstUserId);
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
  
  const handleLoginSuccess = (userId: string, data = appData) => {
    let userExistsInAnyLeague = false;
    let userLeagues: string[] = [];
    let userObject: User | null = null;
    
    // Always get the freshest data from localStorage upon login.
    const freshSavedData = localStorage.getItem('amistosos_fc_data');
    let currentAppData = initialData;
    if (freshSavedData) {
        try {
            currentAppData = JSON.parse(freshSavedData);
        } catch (e) {
            console.error("Failed to parse fresh data on login, using initial data.", e);
        }
    } else {
        currentAppData = data; // Fallback to passed data or initialData
    }


    // Find all leagues the user belongs to
    for (const leagueId in currentAppData.leagues) {
        if (currentAppData.leagues[leagueId].users[userId]) {
            userExistsInAnyLeague = true;
            userLeagues.push(leagueId);
            if (!userObject) { // Store the first user object we find
                userObject = currentAppData.leagues[leagueId].users[userId];
            }
        }
    }

    // Handle invitation logic
    if (invitedToLeagueId && userObject && !userLeagues.includes(invitedToLeagueId)) {
        const leagueToJoin = currentAppData.leagues[invitedToLeagueId];
        if (leagueToJoin) {
            const updatedLeague = {
                ...leagueToJoin,
                users: { ...leagueToJoin.users, [userId]: userObject }
            };
            const newAppData = {
                ...currentAppData,
                leagues: { ...currentAppData.leagues, [invitedToLeagueId]: updatedLeague }
            };
            setAppData(newAppData);
            userLeagues.push(invitedToLeagueId);
            currentAppData = newAppData; // Important: update currentAppData for subsequent logic
        }
    }

    setLoggedInUserId(userId);

    if (userLeagues.length > 0) {
        // Prioritize the invited league, then the last created one, then the first one found.
        const lastCreatedLeagueId = Object.keys(currentAppData.leagues)
            .filter(id => id.startsWith('league_') && userLeagues.includes(id))
            .sort((a, b) => parseInt(b.split('_')[1]) - parseInt(a.split('_')[1]))[0];

        const leagueToSwitchToId = invitedToLeagueId && userLeagues.includes(invitedToLeagueId)
            ? invitedToLeagueId
            : lastCreatedLeagueId || userLeagues[0];

        const leagueToSwitchTo = currentAppData.leagues[leagueToSwitchToId];
        setCurrentLeagueId(leagueToSwitchToId);
        
        if (!leagueToSwitchTo.modality) {
            navigateTo('modality-selection');
        } else {
            navigateTo('dashboard');
        }
        if (userObject) {
            toast({
                title: `Bem-vindo de volta, ${userObject.name}!`,
                description: "Login realizado com sucesso.",
            });
        }
        if (invitedToLeagueId) setInvitedToLeagueId(null);
    } else {
        // This is a new user with no leagues
        navigateTo('league-entry');
    }
};


  const handleRegistrationSuccess = (user: FirebaseUser, name: string) => {
    const newUser: User = {
      id: user.uid,
      name: name,
      email: user.email!,
      teamName: `${name.split(' ')[0]} FC`,
      partialScore: 0,
      totalScore: 0,
      valuation: 100,
      lineup: [],
      reserves: [],
      role: 'player',
      paymentDueDate: new Date().toISOString().split('T')[0],
    };

    // New user, just set the logged in user ID and navigate to league entry
    // where they will create their first league.
    setLoggedInUserId(user.uid);
    // Add the new user to a temporary user object so handleCreateLeague can find it.
    // This object won't be part of any league yet.
    const tempUserData = { ...appData, temporaryUser: newUser };
    setAppData(tempUserData);
    
    navigateTo('league-entry');
    toast({ title: "Cadastro Concluído!", description: "Agora crie sua primeira liga." });
  };


  const handleCreateLeague = (leagueName: string) => {
    if (!loggedInUserId) {
        toast({ title: "Erro", description: "Nenhum usuário logado para criar a liga.", variant: "destructive" });
        return;
    }
    
    // Find the logged-in user's data from the temporary holder or from ANY league
    let creator: User | null = (appData as any).temporaryUser ?? null;
    if (!creator) {
      for (const league of Object.values(appData.leagues)) {
          if (league.users[loggedInUserId]) {
              creator = league.users[loggedInUserId];
              break;
          }
      }
    }

    if (!creator) {
      toast({ title: "Erro", description: "Não foi possível encontrar os dados do usuário para criar a liga.", variant: "destructive" });
      return;
    }

    const newLeagueId = `league_${Date.now()}`;
    
    const testUsers: Record<string, User> = {};
    for (let i=1; i<=3; i++) {
        const userId = `new_test_user_${i}_${newLeagueId}`;
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
      adminId: creator.id,
      modality: null,
      paymentsEnabled: true,
      users: {
        [creator.id]: {
          ...creator,
          role: 'admin' // Ensure the creator is the admin of this league
        },
        ...testUsers
      },
      players: defaultLeagueData.players, // Start with default players
      games: {},
      editorOfTheRound: null,
      scoutEditor: null,
      paymentEditor: null,
      scalersRanking: {},
      goalieRanking: {},
    };

    const newAppData = { ...appData };
    // Remove temporary user if it exists
    if ((newAppData as any).temporaryUser) {
        delete (newAppData as any).temporaryUser;
    }
    
    newAppData.leagues[newLeagueId] = newLeague;
    setAppData(newAppData);
    
    setCurrentLeagueId(newLeagueId);
    
    // Set the test teams for the new league
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
      // The onAuthStateChanged listener will handle navigation to 'welcome'
      setLoggedInUserId(null);
      setCurrentLeagueId('defaultLeague'); // Reset to a safe default
      navigateTo('welcome');
      toast({ title: "Você saiu!", description: "Sessão encerrada com sucesso." });
    } catch (error) {
      console.error("Logout error:", error);
      toast({ title: "Erro ao sair", description: "Não foi possível encerrar a sessão.", variant: "destructive" });
    }
  };

  const navigateTo = (view: View, options?: { isPersonalPayments?: boolean }) => {
    if (view === 'payments') {
      setIsPersonalPaymentsView(options?.isPersonalPayments || false);
    }
    if (view === 'register' || view === 'login') {
      setLoggedInUserId(null); // Clear logged-in user when going to auth pages
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

  if (!currentLeague && !['welcome', 'register', 'login', 'league-entry'].includes(currentView)) {
    return <div>Carregando liga...</div>;
  }

  const selectedPlayer = selectedPlayerId && currentLeague ? { ...currentLeague.players[selectedPlayerId], id: selectedPlayerId } : null;

  const userForViews = currentUser;

  const showBottomNav = !['welcome', 'register', 'login', 'modality-selection', 'league-entry'].includes(currentView);

  const renderView = () => {
    if (!userForViews && showBottomNav) {
      // This is a fallback. If we're on a view that needs a user but don't have one,
      // something is wrong. Let's redirect to welcome to be safe.
      // This helps prevent crashes.
      navigateTo('welcome');
      return <WelcomeView onNavigate={navigateTo} />;
    }

    switch (currentView) {
      case 'welcome':
        return <WelcomeView onNavigate={navigateTo} />;
      case 'register':
        return <RegisterView onRegisterSuccess={handleRegistrationSuccess} onNavigateToLogin={() => navigateTo('login')} />;
      case 'login':
        return <LoginView onLoginSuccess={(uid) => handleLoginSuccess(uid, appData)} onNavigateToRegister={() => navigateTo('register')} />;
      case 'league-entry':
        return <LeagueEntryView onCreateLeague={handleCreateLeague} />;
      case 'leagues':
        return <LeaguesView 
                  onBack={goBack} 
                  leagues={appData.leagues} 
                  currentLeagueId={currentLeagueId}
                  onLeagueChange={handleLeagueChange}
                  onNavigate={navigateTo}
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
        return <DashboardView user={userForViews!} allUsers={currentLeague!.users} onUserSelect={(uid) => handleLoginSuccess(uid, appData)} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
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
        return selectedPlayer && currentLeague ? <PlayerDetailsView player={selectedPlayer} games={currentLeague.games} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={userForViews!} allUsers={currentLeague!.users} onUserSelect={(uid) => handleLoginSuccess(uid, appData)} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
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
        return <DashboardView user={userForViews!} allUsers={currentLeague!.users} onUserSelect={(uid) => handleLoginSuccess(uid, appData)} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} leagues={appData.leagues} currentLeagueId={currentLeagueId} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={handleLogout}/>;
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
