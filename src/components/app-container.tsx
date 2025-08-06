


"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Player, User, Ranking, GoalieRanking, Game, League, PlayerPerformance } from '@/lib/data';
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
import LeagueParticipantsView from '@/components/views/league-participants-view';
import AllUsersView from '@/components/views/all-users-view';
import AllLeaguesView from '@/components/views/all-leagues-view';
import { auth, db } from '@/lib/firebase-config';
import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged, signOut, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, getDocs, collection, writeBatch, updateDoc } from "firebase/firestore";

export type View = 'welcome' | 'register' | 'login' | 'modality-selection' | 'dashboard' | 'lineup' | 'player-details' | 'leagues' | 'partial-score' | 'games' | 'market' | 'friends-score' | 'statistics' | 'admin' | 'live' | 'payments' | 'best-eleven' | 'loading' | 'league-participants' | 'all-users' | 'all-leagues';
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

const initialPlayers: Record<string, Player> = {
  'p-mc-haaland': { name: 'Haaland', team: 'Man City', pos: 'ATA', value: 18.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=EH', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-de-bruyne': { name: 'De Bruyne', team: 'Man City', pos: 'MEI', value: 17.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=KB', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-foden': { name: 'Foden', team: 'Man City', pos: 'MEI', value: 16.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=PF', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-rodri': { name: 'Rodri', team: 'Man City', pos: 'VOL', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=R', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-dias': { name: 'Rúben Dias', team: 'Man City', pos: 'ZAG', value: 14.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=RD', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-walker': { name: 'Walker', team: 'Man City', pos: 'LAT', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=KW', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-ederson': { name: 'Ederson', team: 'Man City', pos: 'GOL', value: 12.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=E', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-silva': { name: 'Bernardo Silva', team: 'Man City', pos: 'MEI', value: 15.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=BS', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-gvardiol': { name: 'Gvardiol', team: 'Man City', pos: 'ZAG', value: 13.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JG', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-stones': { name: 'Stones', team: 'Man City', pos: 'ZAG', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JS', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-mc-grealish': { name: 'Grealish', team: 'Man City', pos: 'ATA', value: 14.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/6CABDD/FFFFFF?text=JG', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-bellingham': { name: 'Bellingham', team: 'Real Madrid', pos: 'MEI', value: 18.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=JB', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-vinicius': { name: 'Vinícius Jr.', team: 'Real Madrid', pos: 'ATA', value: 17.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=VJ', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-valverde': { name: 'Valverde', team: 'Real Madrid', pos: 'MEI', value: 16.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=FV', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-modric': { name: 'Modrić', team: 'Real Madrid', pos: 'MEI', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=LM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-rudiger': { name: 'Rüdiger', team: 'Real Madrid', pos: 'ZAG', value: 14.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=AR', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-carvajal': { name: 'Carvajal', team: 'Real Madrid', pos: 'LAT', value: 13.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=DC', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-courtois': { name: 'Courtois', team: 'Real Madrid', pos: 'GOL', value: 12.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=TC', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-rodrygo': { name: 'Rodrygo', team: 'Real Madrid', pos: 'ATA', value: 16.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=R', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-militao': { name: 'Militão', team: 'Real Madrid', pos: 'ZAG', value: 14.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=EM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-tchouameni': { name: 'Tchouaméni', team: 'Real Madrid', pos: 'VOL', value: 15.0, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=AT', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
  'p-rm-mendy': { name: 'Mendy', team: 'Real Madrid', pos: 'LAT', value: 12.5, points: 0, last_val: 0, games: 0, img: 'https://placehold.co/60x60/FEBE10/000000?text=FM', stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 }, performanceHistory: [] },
};

const initialTeam1Lineup = [
  'p-mc-haaland', 'p-mc-grealish', 'p-mc-foden',
  'p-mc-de-bruyne', 'p-mc-silva', 'p-mc-rodri',
  'p-mc-walker', 'p-mc-dias', 'p-mc-stones', 'p-mc-gvardiol',
  'p-mc-ederson'
];

const initialTeam2Lineup = [
  'p-rm-vinicius', 'p-rm-rodrygo', 'p-rm-bellingham',
  'p-rm-valverde', 'p-rm-modric', 'p-rm-tchouameni',
  'p-rm-carvajal', 'p-rm-militao', 'p-rm-rudiger', 'p-rm-mendy',
  'p-rm-courtois'
];

export default function AppContainer() {
  const [currentView, setCurrentView] = useState<View>('loading');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const { toast } = useToast();
  
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [appData, setAppData] = useState<{leagues: Record<string, League>}>({ leagues: {} });
  const [currentLeagueId, setCurrentLeagueId] = useState<string | null>(null);

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const selectedModality = currentLeagueId ? appData.leagues[currentLeagueId]?.modality ?? null : null;
  const [isInitialLoadForModality, setIsInitialLoadForModality] = useState(true);
  
  const [bestElevenVotes, setBestElevenVotes] = useState<Record<string, (BestElevenVote | null)[]>>({});
  const [bestElevenSaved, setBestElevenSaved] = useState<Record<string, boolean>>({});
  const [isVotingReleased, setIsVotingReleased] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [isVoteRevelationEnabled, setIsVoteRevelationEnabled] = useState(false);
  
  const [lastRoundPlayerIds, setLastRoundPlayerIds] = useState<string[]>([]);
  
  const { lineup: lineupSize, reserves: reservesSize } = useMemo(() => getTeamSizes(selectedModality), [selectedModality]);

  // Start with null to indicate that data is not yet loaded.
  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[] | null>(null);
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[] | null>(null);
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[] | null>(null);
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[] | null>(null);

  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);
  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('amarelo');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('verde');
  const [formation, setFormation] = useState<Formation>('4-3-3');
  
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);

  const handleCreateLeague = async (user: User) => {
    const newLeagueId = `league_${Date.now()}`;
    const adminUser = { ...user, role: 'admin' as const };
    
    const newLeague: League = {
      id: newLeagueId,
      name: `Liga de ${user.name}`,
      adminId: user.id,
      users: {
        [user.id]: adminUser,
      },
      players: initialPlayers,
      games: {},
      editorOfTheRound: null,
      scoutEditor: null,
      paymentEditor: null,
      scalersRanking: {},
      goalieRanking: {},
      modality: null, // Set to null to trigger modality selection
      paymentsEnabled: true,
      team1Lineup: initialTeam1Lineup,
      team1Reserves: [],
      team2Lineup: initialTeam2Lineup,
      team2Reserves: [],
    };

    try {
      await setDoc(doc(db, "leagues", newLeagueId), newLeague);
      
      setAppData(prev => ({
        ...prev,
        leagues: { ...prev.leagues, [newLeagueId]: newLeague },
      }));
       
      setLoggedInUser(adminUser);
      setCurrentLeagueId(newLeagueId);
      navigateTo('modality-selection');

      toast({ title: 'Liga Criada com Sucesso!', description: 'Você agora é o admin.' });
      return newLeague;
    } catch (error) {
      console.error("Error creating league:", error);
      toast({ title: 'Erro ao Criar Liga', variant: 'destructive' });
      return null;
    }
  };

  useEffect(() => {
    const handleAuth = async (firebaseUser: FirebaseUser | null) => {
        try {
            if (firebaseUser) {
                const userDocRef = doc(db, "users", firebaseUser.uid);
                let userDocSnap = await getDoc(userDocRef);

                let userProfile: User;

                if (userDocSnap.exists()) {
                    userProfile = userDocSnap.data() as User;
                } else {
                    userProfile = {
                        id: firebaseUser.uid,
                        name: firebaseUser.displayName || 'Novo Jogador',
                        email: firebaseUser.email!,
                        teamName: `${firebaseUser.displayName?.split(' ')[0] || 'Novo'} FC`,
                        partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [],
                        role: 'player',
                        paymentDueDate: format(new Date(), 'yyyy-MM-dd'),
                    };
                    await setDoc(userDocRef, userProfile);
                }
                setLoggedInUser(userProfile);

                const leaguesSnapshot = await getDocs(collection(db, "leagues"));
                const userLeagues: Record<string, League> = {};
                let userHasLeagues = false;

                leaguesSnapshot.forEach(leagueDoc => {
                    const leagueData = leagueDoc.data() as League;
                    if (leagueData.users && leagueData.users[userProfile.id]) {
                        userLeagues[leagueDoc.id] = leagueData;
                        userHasLeagues = true;
                    }
                });

                if (userHasLeagues) {
                    setAppData({ leagues: userLeagues });
                    const firstLeagueId = Object.keys(userLeagues)[0];
                    setCurrentLeagueId(firstLeagueId);
                    const league = userLeagues[firstLeagueId];
                    if (league) {
                        setTeam1Lineup(league.team1Lineup || []);
                        setTeam1Reserves(league.team1Reserves || []);
                        setTeam2Lineup(league.team2Lineup || []);
                        setTeam2Reserves(league.team2Reserves || []);

                        if (league.modality) {
                          setIsInitialLoadForModality(true); // Treat as initial load
                          navigateTo('dashboard');
                        } else {
                          navigateTo('modality-selection');
                        }
                    } else {
                       navigateTo('welcome');
                    }
                } else {
                    navigateTo('leagues');
                }
            } else {
                setLoggedInUser(null);
                setCurrentLeagueId(null);
                setAppData({ leagues: {} });
                navigateTo('welcome');
            }
        } catch (error: any) {
            console.error("Auth state change error:", error);
            if (error.code === 'unavailable') {
                toast({ title: 'Erro de Conexão', description: 'Não foi possível conectar ao banco de dados. Verifique sua conexão e tente novamente.', variant: 'destructive' });
            }
            // Fallback to welcome screen on any error
            setLoggedInUser(null);
            setCurrentLeagueId(null);
            setAppData({ leagues: {} });
            navigateTo('welcome');
        }
    };

    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          // This will be handled by the onAuthStateChanged listener
        } else {
          // If no redirect result, check the current auth state
          const unsubscribe = onAuthStateChanged(auth, handleAuth);
          return () => unsubscribe();
        }
      })
      .catch((error) => {
        console.error("Redirect Result Error:", error);
        toast({
          title: "Erro no Login com Google",
          description: "Não foi possível completar o login. Tente novamente.",
          variant: "destructive",
        });
        handleAuth(null);
      });

    const unsubscribe = onAuthStateChanged(auth, handleAuth);
    return () => unsubscribe();
    
  }, [toast]); // useEffect dependencies


  // This effect dynamically adjusts team sizes when modality changes
  useEffect(() => {
    if (!selectedModality) {
        return;
    };
    
    // Protect initial lineups from being cleared on first modality selection
    if (isInitialLoadForModality) {
        setIsInitialLoadForModality(false);
        const { lineup: newLuSize, reserves: newResSize } = getTeamSizes(selectedModality);
        
        const currentLeague = appData.leagues[currentLeagueId!];
        // Set lineups based on the data fetched from the league
        setTeam1Lineup((currentLeague?.team1Lineup || []).slice(0, newLuSize));
        setTeam1Reserves(Array(newResSize).fill(null));
        setTeam2Lineup((currentLeague?.team2Lineup || []).slice(0, newLuSize));
        setTeam2Reserves(Array(newResSize).fill(null));
        return; 
    }
    
    const { lineup: newLuSize, reserves: newResSize } = getTeamSizes(selectedModality);
    
    const adjustLineup = (currentLineup: (string|null)[] | null) => {
        if (!currentLineup) return Array(newLuSize).fill(null);
        const newLineup = [...currentLineup];
        if (newLineup.length > newLuSize) {
            return newLineup.slice(0, newLuSize);
        }
        while (newLineup.length < newLuSize) {
            newLineup.push(null);
        }
        return newLineup;
    };

    const adjustReserves = (currentReserves: (string|null)[] | null) => {
        if (!currentReserves) return Array(newResSize).fill(null);
         const newReserves = [...currentReserves];
        if (newReserves.length > newResSize) {
            return newReserves.slice(0, newResSize);
        }
        while (newReserves.length < newResSize) {
            newReserves.push(null);
        }
        return newReserves;
    }

    setTeam1Lineup(prev => adjustLineup(prev));
    setTeam1Reserves(prev => adjustReserves(prev));
    setTeam2Lineup(prev => adjustLineup(prev));
    setTeam2Reserves(prev => adjustReserves(prev));

  }, [selectedModality, isInitialLoadForModality, appData.leagues, currentLeagueId]);
  
  // Set initial lineup when the component mounts or when league changes
    useEffect(() => {
        const league = appData.leagues[currentLeagueId!];
        if (league) {
            setTeam1Lineup(league.team1Lineup || []);
            setTeam1Reserves(league.team1Reserves || []);
            setTeam2Lineup(league.team2Lineup || []);
            setTeam2Reserves(league.team2Reserves || []);
            setIsInitialLoadForModality(true); // Reset flag on league change
        } else {
             setTeam1Lineup(null);
             setTeam1Reserves(null);
             setTeam2Lineup(null);
             setTeam2Reserves(null);
        }
    }, [currentLeagueId, appData.leagues]);

  const navigateTo = (view: View, options?: { isPersonalPayments?: boolean }) => {
    if (view === 'payments') {
      setIsPersonalPaymentsView(options?.isPersonalPayments || false);
    }
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };
  
  const handleUpdateLeagueName = (newName: string) => {
    if(!currentLeagueId) return;
    const leagueDocRef = doc(db, "leagues", currentLeagueId);
    updateDoc(leagueDocRef, { name: newName });

    updateCurrentLeague(league => ({ ...league, name: newName }));
    toast({ title: "Nome da Liga Atualizado!" });
  };

  const handleSaveLineups = () => {
    setLineupsSaved(true);
    toast({ title: "Times Salvos!", description: "As escalações da rodada foram salvas com sucesso." });
  };

  const handleReleaseVoting = () => {
    setIsVotingReleased(true);
    toast({ title: "Votação Liberada!", description: "Os jogadores agora podem votar na Seleção da Rodada." });
  };

  const handleCloseVoting = () => {
    setIsVotingClosed(true);
    toast({ title: "Votação Encerrada Manualmente", description: "O administrador encerrou a votação." });
  };
  
  const handleToggleVoteRevelation = (enabled: boolean) => {
    setIsVoteRevelationEnabled(enabled);
    toast({ title: `Revelação de Votos ${enabled ? 'Ativada' : 'Desativada'}` });
  };

  const currentLeague: League | undefined = currentLeagueId ? appData.leagues[currentLeagueId] : undefined;
  
  const currentUser = useMemo(() => {
    if (!loggedInUser || !currentLeague) return null;
    return currentLeague.users[loggedInUser.id] || loggedInUser;
  }, [currentLeague, loggedInUser]);

  const isPaymentsEnabled = currentLeague?.paymentsEnabled ?? true;
  
  const updateCurrentLeague = (updater: (league: League) => League, leagueIdToUpdate?: string) => {
    const targetLeagueId = leagueIdToUpdate || currentLeagueId;
    if (!targetLeagueId) return;

    setAppData(prevData => {
        const leagueToUpdate = prevData.leagues[targetLeagueId];
        if (!leagueToUpdate) return prevData;
        const newLeague = updater(leagueToUpdate);
        return {
            ...prevData,
            leagues: { ...prevData.leagues, [targetLeagueId]: newLeague }
        };
    });
  };
  
  const handleLeagueChange = (newLeagueId: string) => {
    const newLeague = appData.leagues[newLeagueId];
    if (!newLeague) return;
    setCurrentLeagueId(newLeagueId);
    toast({ title: `Liga Alterada: ${newLeague.name}` });
    navigateTo('dashboard');
  };

  const handleInvite = async () => {
    if (!currentLeagueId) return;
    const inviteLink = `${window.location.origin}?invite=${currentLeagueId}`;
    const message = `Ei! Use este link para entrar na minha liga no Amistosos FC: ${inviteLink}`;

    try {
      await navigator.clipboard.writeText(message);
      toast({ title: 'Link de Convite Copiado!', description: 'O link foi copiado. Compartilhe com seus amigos!' });
    } catch (err) {
      toast({ title: 'Erro ao Copiar', description: 'Não foi possível copiar o link.', variant: 'destructive' });
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ title: 'Convite para a Liga Amistosos FC', text: message });
      } catch (err) {
        console.log('API de compartilhamento não utilizada ou cancelada.', err);
      }
    }
  };

  const handleAddGuestPlayer = (guestData: Omit<Player, 'last_val' | 'games' | 'performanceHistory' | 'value' | 'points'>) => {
    if (!currentLeagueId) return;

    const guestName = guestData.name;
    const guestUserId = `guest_user_${Date.now()}`;
    const guestPlayerId = `guest_player_${Date.now()}`;

    const newGuestUser: User = {
      id: guestUserId,
      name: guestName,
      email: `${guestUserId}@example.com`,
      teamName: `${guestName} FC`,
      partialScore: 0, totalScore: 0, valuation: 100, lineup: [], reserves: [],
      role: 'player',
      avatar: guestData.img || `https://placehold.co/128x128/8E44AD/FFFFFF?text=${guestName.charAt(0)}`,
      paymentDueDate: format(new Date(), 'yyyy-MM-dd'),
      playerId: guestPlayerId,
    };

    const newGuestPlayer: Player = {
      ...guestData,
      value: 5.0, points: 0, last_val: 0, games: 0,
      stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 },
      performanceHistory: [],
    };
    
    const leagueDocRef = doc(db, "leagues", currentLeagueId);
    updateDoc(leagueDocRef, {
        [`users.${guestUserId}`]: newGuestUser,
        [`players.${guestPlayerId}`]: newGuestPlayer
    }).then(() => {
        updateCurrentLeague(league => ({
            ...league,
            users: { ...league.users, [guestUserId]: newGuestUser },
            players: { ...league.players, [guestPlayerId]: newGuestPlayer },
        }));
        toast({ title: 'Convidado Adicionado!', description: `${guestData.name} foi adicionado à liga e ao mercado.` });
    }).catch(error => {
        console.error("Error adding guest player:", error);
        toast({ title: "Erro ao adicionar convidado", variant: "destructive" });
    });
  };

  const handleRemoveUserFromLeague = (userIdToRemove: string) => {
    if (!currentLeague) return;

    if (userIdToRemove === currentLeague.adminId) {
      toast({ title: "Ação não permitida", description: "O administrador não pode se remover da própria liga.", variant: "destructive" });
      return;
    }

    updateCurrentLeague(league => {
      const updatedUsers = { ...league.users };
      const userToRemove = updatedUsers[userIdToRemove];
      delete updatedUsers[userIdToRemove];

      const updatedPlayers = { ...league.players };
      if (userToRemove?.playerId && updatedPlayers[userToRemove.playerId]) {
          delete updatedPlayers[userToRemove.playerId];
      }
      
      return { ...league, users: updatedUsers, players: updatedPlayers };
    });

    toast({ title: "Usuário Removido", description: `O usuário foi removido da liga.`, variant: "destructive" });
  };

  const handleAvatarChange = (userId: string, image: string) => {
    updateCurrentLeague(league => ({ ...league, users: { ...league.users, [userId]: { ...league.users[userId], avatar: image } } }));
  };

  const handleUpdateUser = async (userId: string, newName: string) => {
    updateCurrentLeague(league => ({ ...league, users: { ...league.users, [userId]: { ...league.users[userId], name: newName } } }));
    toast({ title: "Perfil Atualizado!", description: "Seu nome foi alterado com sucesso." });
  };

  const canEditLineup = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.editorOfTheRound;
  }, [currentUser, currentLeague]);

  const canManageVoting = useMemo(() => currentUser?.role === 'admin', [currentUser]);
  
  const canEditScouts = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.scoutEditor;
  }, [currentUser, currentLeague]);

  const canEditPayments = useMemo(() => {
    if (!currentUser || !currentLeague) return false;
    return currentUser.role === 'admin' || currentUser.id === currentLeague.paymentEditor;
  }, [currentUser, currentLeague]);
  
  const handleModalitySelect = (modality: Modality) => {
    if(!currentLeagueId) return;
    const leagueDocRef = doc(db, "leagues", currentLeagueId);
    updateDoc(leagueDocRef, { modality: modality });

    updateCurrentLeague(league => ({ ...league, modality }));
    navigateTo('dashboard');
  };

  const handleLogout = async (showToast = true) => {
    try {
        await signOut(auth);
        if(showToast) {
            toast({ title: "Você saiu com sucesso." });
        }
    } catch (error) {
        toast({ title: "Erro ao sair", description: "Não foi possível fazer o logout.", variant: "destructive" });
    }
  };

  const selectPlayerForDetails = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const handlePlayerImageChange = (playerId: string, image: string) => {
    updateCurrentLeague(league => ({ ...league, players: { ...league.players, [playerId]: { ...league.players[playerId], img: image } } }));
  };

  const addPlayerToLineup = async (playerId: string) => {
    if (slotToAddPlayer === null || !currentLeagueId) return;
  
    const { position, index, team } = slotToAddPlayer;
    
    // This is the key that matches the fields in Firestore (e.g., "team1Lineup")
    const arrayKey = position === 'RES' ? `${team}Reserves` as const : `${team}Lineup` as const;
  
    // Determine which local state setter to use
    const setLineupState = team === 'team1' ? setTeam1Lineup : setTeam2Lineup;
    const setReservesState = team === 'team1' ? setTeam1Reserves : setTeam2Reserves;
    
    const stateSetter = position === 'RES' ? setReservesState : setLineupState;
    const relevantSize = position === 'RES' ? reservesSize : lineupSize;

    // Update local state first for immediate UI response
    stateSetter(prev => {
        const newArray = prev ? [...prev] : Array(relevantSize).fill(null);
        if (index >= 0 && index < newArray.length) {
            newArray[index] = playerId;
        }
        return newArray;
    });
  
    setSlotToAddPlayer(null);
    navigateTo('lineup');
  
    // Then, robustly update Firestore
    try {
      const leagueDocRef = doc(db, 'leagues', currentLeagueId);
      const leagueDocSnap = await getDoc(leagueDocRef);
      
      if (leagueDocSnap.exists()) {
        const leagueData = leagueDocSnap.data() as League;
        
        // Get the current array from the fetched data, or initialize it
        const currentArray = (leagueData[arrayKey] || []) as (string | null)[];
        const newArray = [...currentArray];
        
        // Ensure the array is long enough before assigning
        while (newArray.length <= index) {
          newArray.push(null);
        }
        newArray[index] = playerId;
        
        // Save the entire updated array back to Firestore
        await updateDoc(leagueDocRef, { [arrayKey]: newArray });
        
        // Sync local appData state to prevent stale data issues elsewhere
        updateCurrentLeague(league => ({ ...league, [arrayKey]: newArray as any }));
      }
    } catch (error) {
      console.error("Error updating lineup in Firestore:", error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar a escalação no servidor.",
        variant: "destructive",
      });
      // Optionally, revert local state here if Firestore update fails
    }
  };


  const goBack = () => navigateTo(previousView);

  const handleOpenMarket = (slot: AddPlayerSlot) => {
    setSlotToAddPlayer(slot);
    navigateTo('market');
  }
  
  const handleSetEditor = (userId: string | null) => updateCurrentLeague(league => ({ ...league, editorOfTheRound: userId }));
  const handleSetScoutEditor = (userId: string | null) => updateCurrentLeague(league => ({ ...league, scoutEditor: userId }));
  const handleSetPaymentEditor = (userId: string | null) => updateCurrentLeague(league => ({ ...league, paymentEditor: userId }));

  const handleUpdateStats = (updatedPlayers: Record<string, Player>, updatedScalers?: Record<string, Ranking>, updatedGoalies?: Record<string, GoalieRanking>) => {
    updateCurrentLeague(league => ({ ...league, players: updatedPlayers, ...(updatedScalers && { scalersRanking: updatedScalers }), ...(updatedGoalies && { goalieRanking: updatedGoalies }) }));
    toast({ title: "Estatísticas Salvas!", description: "Os dados foram atualizados com sucesso." });
  };

  const handleUpdateUserPayments = (updatedUsers: Record<string, User>) => {
    updateCurrentLeague(league => ({...league, users: updatedUsers }));
    toast({ title: "Pagamentos Salvos!", description: "As datas de vencimento foram atualizadas." });
  };

  const handleAddLiveEvent = (event: Omit<LiveEvent, 'time'>) => {
    const newEvent: LiveEvent = { ...event, time: `${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}` };
    setLiveEvents(prevEvents => [newEvent, ...prevEvents]);
  };

  const allScaledPlayerIds = useMemo(() => {
    const scaledIds = new Set<string>();
    [...(team1Lineup || []), ...(team1Reserves || []), ...(team2Lineup || []), ...(team2Reserves || [])].forEach(id => {
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
            homeTeam: 'Time 1', awayTeam: 'Time 2',
            homeScore: team1Score, awayScore: team2Score,
            status: 'Finalizado',
            scorers: liveEvents.filter(event => event.event === 'Gol').map(event => ({ player: event.player, team: event.team })),
        };
        updatedGames[gameId] = newGame;

        const team1PlayerIds = new Set([...(team1Lineup || []), ...(team1Reserves || [])].filter(Boolean));
        const matchResult = team1Score > team2Score ? 'win' : team2Score > team1Score ? 'loss' : 'draw';

        playersOfLastRound.forEach(playerId => {
            const player = updatedPlayers[playerId];
            if (!player) return;

            if (!player.stats) player.stats = { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 };
            if (!player.performanceHistory) player.performanceHistory = [];

            let roundPoints = 0;
            const roundGoals = liveEvents.filter(e => e.playerId === playerId && e.event === 'Gol').length;
            const roundAssists = liveEvents.filter(e => e.playerId === playerId && e.event === 'Assistência').length;

            roundPoints += roundGoals * 5 + roundAssists * 3;
            player.games = (player.games || 0) + 1;
            
            const playerTeamIdentifier = team1PlayerIds.has(playerId) ? 'team1' : 'team2';
            const playerResult = (playerTeamIdentifier === 'team1' ? matchResult : (matchResult === 'win' ? 'loss' : (matchResult === 'loss' ? 'win' : 'draw')));

            if (playerResult === 'win') { player.stats.wins++; roundPoints += 3; }
            else if (playerResult === 'draw') { player.stats.draws++; roundPoints += 1; }
            else { player.stats.losses++; }
            
            player.stats.goals += roundGoals;
            player.stats.assists += roundAssists;
            player.points += roundPoints;

            const totalPointsFromResults = (player.stats.wins * 3) + player.stats.draws;
            const totalPossiblePoints = player.games * 3;
            player.stats.performance = totalPossiblePoints > 0 ? (totalPointsFromResults / totalPossiblePoints) * 100 : 0;

            player.performanceHistory.push({
                round: roundNumber, points: roundPoints,
                team: playerTeamIdentifier === 'team1' ? newGame.homeTeam : newGame.awayTeam,
                goals: roundGoals, assists: roundAssists, gameId: gameId,
                shirtColor: playerTeamIdentifier === 'team1' ? team1ShirtColor : team2ShirtColor,
            });
        });

        return { ...league, players: updatedPlayers, games: updatedGames };
    });

    setLiveEvents([]); 
    setLineupsSaved(false);
    const { lineup: lineupSizeValue, reserves: reservesSizeValue } = getTeamSizes(selectedModality);
    setTeam1Lineup(Array(lineupSizeValue).fill(null));
    setTeam1Reserves(Array(reservesSizeValue).fill(null));
    setTeam2Lineup(Array(lineupSizeValue).fill(null));
    setTeam2Reserves(Array(reservesSizeValue).fill(null));
    
    setBestElevenVotes({}); setBestElevenSaved({});
    setIsVotingReleased(false); setIsVotingClosed(false);

    toast({ title: "Partida Finalizada!", description: `O placar de ${team1Score} a ${team2Score} foi salvo.` });
    navigateTo('games');
};

  const handleAddPlayerToMarket = (newPlayer: Omit<Player, 'last_val' | 'games' | 'performanceHistory'>) => {
    if (!currentLeagueId) return;
    const newPlayerId = `p_${Date.now()}`;
    const fullNewPlayer: Player = {
        ...newPlayer, last_val: 0, games: 0,
        stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 },
        performanceHistory: [],
    };
    
    const leagueDocRef = doc(db, "leagues", currentLeagueId);
    updateDoc(leagueDocRef, {
        [`players.${newPlayerId}`]: fullNewPlayer
    }).then(() => {
        updateCurrentLeague(league => {
          const updatedPlayers = { ...league.players, [newPlayerId]: fullNewPlayer };
          return { ...league, players: updatedPlayers };
        });
        toast({ title: "Jogador Adicionado!", description: `${newPlayer.name} agora está disponível no mercado.` });
    }).catch(error => {
        console.error("Error adding player to market:", error);
        toast({ title: "Erro ao adicionar jogador", variant: "destructive" });
    });
  };

  const handleRemovePlayerFromMarket = (playerId: string) => {
    updateCurrentLeague(league => {
      const newPlayers = { ...league.players };
      delete newPlayers[playerId];
      return { ...league, players: newPlayers };
    });
     toast({ title: "Jogador Removido!", variant: "destructive" });
  };
  
  const handleUpdatePlayerInMarket = (playerId: string, updatedData: Partial<Omit<Player, 'id'>>) => {
    if (!playerId || !currentLeagueId) return;

    // Save to Firestore
    const leagueDocRef = doc(db, "leagues", currentLeagueId);
    updateDoc(leagueDocRef, {
        [`players.${playerId}`]: { ...appData.leagues[currentLeagueId].players[playerId], ...updatedData }
    }).then(() => {
        // Update local state on success
        updateCurrentLeague(league => {
          const newPlayers = { ...league.players };
          newPlayers[playerId] = { ...newPlayers[playerId], ...updatedData };
          return { ...league, players: newPlayers };
        });
        toast({ title: "Jogador Atualizado!", description: "Os dados do jogador foram atualizados." });
    }).catch(error => {
        console.error("Error updating player in market:", error);
        toast({ title: "Erro ao atualizar jogador", variant: "destructive" });
    });
  };

  const handleBestElevenVote = (lineup: (BestElevenVote | null)[]) => {
    if (!currentUser) return;
    setBestElevenVotes(prev => ({ ...prev, [currentUser.id]: lineup }));
    setBestElevenSaved(prev => ({ ...prev, [currentUser.id]: true }));
    toast({ title: "Seleção Salva!", description: `Sua seleção da rodada foi salva com sucesso.` });
  };

  const handleTogglePayments = (enabled: boolean) => {
    updateCurrentLeague(league => ({ ...league, paymentsEnabled: enabled }));
    toast({ title: `Módulo de Pagamentos ${enabled ? 'Ativado' : 'Desativado'}` });
  };
  
  if (currentView === 'loading') {
    return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
  }
  
  if (!loggedInUser) {
     switch (currentView) {
        case 'welcome': return <WelcomeView onNavigate={navigateTo} />;
        case 'register': return <RegisterView onNavigateToLogin={() => navigateTo('login')} />;
        case 'login': return <LoginView onNavigateToRegister={() => navigateTo('register')} />;
        default: return <WelcomeView onNavigate={navigateTo} />;
      }
  }

  // From this point, loggedInUser is guaranteed to be non-null.
  // We now decide what to show based on whether the full currentUser and currentLeague context is loaded.
  
  if (!currentUser || !currentLeague) {
    // If we have a loggedInUser but not their league/full profile context yet,
    // we need to handle specific views that might be requested.
    switch (currentView) {
      // These views depend on league/user context, so show loading.
      case 'dashboard':
      case 'lineup':
      case 'player-details':
      case 'market':
      case 'partial-score':
      case 'games':
      case 'friends-score':
      case 'statistics':
      case 'admin':
      case 'live':
      case 'payments':
      case 'best-eleven':
      case 'league-participants':
      case 'all-users':
      case 'all-leagues':
        return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando dados da liga...</div>;
      
      // These views can be shown even without full context.
      case 'leagues': 
        return <LeaguesView onBack={goBack} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} currentUser={loggedInUser!} onCreateLeague={() => handleCreateLeague(loggedInUser)} />;
      case 'modality-selection':
        return <ModalitySelectionView onModalitySelect={handleModalitySelect} selectedModality={null} isLeagueAdmin={false} />;

      // Fallback to loading for any other case
      default:
         return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
    }
  }
  
  const isLeagueAdmin = currentLeague.adminId === currentUser.id;
  if (!currentLeague.modality) {
    return <ModalitySelectionView onModalitySelect={handleModalitySelect} selectedModality={selectedModality} isLeagueAdmin={isLeagueAdmin} />;
  }

  const selectedPlayer = selectedPlayerId && currentLeague ? { ...currentLeague.players[selectedPlayerId], id: selectedPlayerId } : null;
  const showBottomNav = !['welcome', 'register', 'login', 'modality-selection', 'loading'].includes(currentView);

  const renderView = () => {
    switch (currentView) {
        case 'loading': return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
        case 'all-users': return <AllUsersView leagues={appData.leagues} onBack={goBack} />;
        case 'all-leagues': return <AllLeaguesView leagues={appData.leagues} onBack={goBack} />;
        case 'leagues': return <LeaguesView onBack={goBack} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} currentUser={currentUser!} onCreateLeague={() => handleCreateLeague(currentUser)} />;
        case 'league-participants': return <LeagueParticipantsView onBack={goBack} league={currentLeague} isLeagueAdmin={isLeagueAdmin} onInvite={handleInvite} onAddGuest={handleAddGuestPlayer} onRemoveUser={handleRemoveUserFromLeague} />;
        case 'modality-selection': return <ModalitySelectionView onModalitySelect={handleModalitySelect} selectedModality={selectedModality} isLeagueAdmin={isLeagueAdmin} />;
        case 'dashboard': return <DashboardView user={currentUser!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={() => handleLogout()} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName} />;
        case 'lineup': return <LineupView players={currentLeague!.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} currentUser={currentUser!} canEdit={canEditLineup} team1Lineup={team1Lineup} setTeam1Lineup={setTeam1Lineup} team1Reserves={team1Reserves} setTeam1Reserves={setTeam1Reserves} team2Lineup={team2Lineup} setTeam2Lineup={setTeam2Lineup} team2Reserves={team2Reserves} setTeam2Reserves={setTeam2Reserves} onSaveLineups={handleSaveLineups} lineupsSaved={lineupsSaved} modality={selectedModality} team1ShirtColor={team1ShirtColor} setTeam1ShirtColor={setTeam1ShirtColor} team2ShirtColor={team2ShirtColor} setTeam2ShirtColor={setTeam2ShirtColor} formation={formation} setFormation={setFormation} onUpdatePlayerInMarket={handleUpdatePlayerInMarket} />;
        case 'player-details': return selectedPlayer && currentLeague ? <PlayerDetailsView player={selectedPlayer} games={currentLeague.games} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={currentUser!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={() => handleLogout()} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName}/>;
        case 'market': return <MarketView players={currentLeague.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={slotToAddPlayer?.position ?? null} scaledPlayerIds={allScaledPlayerIds} canEdit={canEditLineup} onAddPlayerToMarket={handleAddPlayerToMarket} onRemovePlayerFromMarket={handleRemovePlayerFromMarket} onUpdatePlayerInMarket={handleUpdatePlayerInMarket} />;
        case 'partial-score': return <PartialScoreView players={currentLeague!.players} users={currentLeague!.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
        case 'games': return <GamesView onBack={goBack} gamesData={currentLeague!.games} />;
        case 'friends-score': return <FriendsScoreView onBack={goBack} user={currentUser!} players={currentLeague!.players} allUsers={currentLeague!.users} />;
        case 'statistics': return <StatisticsView players={currentLeague!.players} users={currentLeague!.users} onBack={() => navigateTo('dashboard')} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} scalersRanking={currentLeague!.scalersRanking} goalieRanking={currentLeague!.goalieRanking}/>;
        case 'admin': return <AdminView onBack={goBack} users={Object.values(currentLeague!.users)} currentUser={currentUser!} editorOfTheRound={currentLeague!.editorOfTheRound} onSetEditor={handleSetEditor} scoutEditor={currentLeague!.scoutEditor} onSetScoutEditor={handleSetScoutEditor} paymentEditor={currentLeague!.paymentEditor} onSetPaymentEditor={handleSetPaymentEditor} isVoteRevelationEnabled={isVoteRevelationEnabled} onToggleVoteRevelation={handleToggleVoteRevelation} leagueId={currentLeague!.id} isPaymentsEnabled={isPaymentsEnabled} onTogglePayments={handleTogglePayments} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName} />;
        case 'live': return <LiveView onBack={goBack} user={currentUser!} players={currentLeague!.players} canEditScouts={canEditScouts} liveEvents={liveEvents} onAddLiveEvent={handleAddLiveEvent} onFinishMatch={handleFinishMatch} team1Lineup={team1Lineup!} team2Lineup={team2Lineup!} allScaledPlayerIds={allScaledPlayerIds} />;
        case 'payments': return <PaymentsView onBack={goBack} currentUser={currentUser!} users={currentLeague!.users} canEdit={canEditPayments && !isPersonalPaymentsView} onSave={handleUpdateUserPayments} />;
        case 'best-eleven': return <BestElevenView onBack={goBack} players={currentLeague!.players} currentUser={currentUser!} allUsers={Object.values(currentLeague!.users)} allScaledPlayerIds={lastRoundPlayerIds} onVote={handleBestElevenVote} userLineup={currentUser ? bestElevenVotes[currentUser.id] : undefined} allVotes={bestElevenVotes} isSaved={currentUser ? bestElevenSaved[currentUser.id] : false} canManageVoting={canManageVoting} isVotingReleased={isVotingReleased} isVotingClosed={isVotingClosed} onReleaseVoting={onReleaseVoting} onCloseVoting={handleCloseVoting} modality={selectedModality} isVoteRevelationEnabled={isVoteRevelationEnabled} formation={formation} />;
        default: return <DashboardView user={currentUser!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={() => handleLogout()} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName}/>;
    }
  }

  return (
    <div>
      <main className={cn(showBottomNav && "pb-20")}>
        {renderView()}
      </main>
      {showBottomNav && currentUser && <BottomNav currentView={currentView} onNavigate={navigateTo} canViewPayments={isPaymentsEnabled} />}
    </div>
  );
}
