

"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Player, User, Ranking, GoalieRanking, Game, League, PlayerPerformance } from '@/lib/data';
import { initialData } from '@/lib/initial-data-backup';
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


export default function AppContainer() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [previousView, setPreviousView] = useState<View>('dashboard');
  const { toast } = useToast();
  
  const [loggedInUser, setLoggedInUser] = useState<User | null>(initialData.leagues.defaultLeague.users['user27']);
  const [isInitializing, setIsInitializing] = useState(false);

  const [appData, setAppData] = useState(initialData);
  const [currentLeagueId, setCurrentLeagueId] = useState<string | null>('defaultLeague');

  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const selectedModality = currentLeagueId ? appData.leagues[currentLeagueId]?.modality ?? null : null;
  
  const [bestElevenVotes, setBestElevenVotes] = useState<Record<string, (BestElevenVote | null)[]>>({});
  const [bestElevenSaved, setBestElevenSaved] = useState<Record<string, boolean>>({});
  const [isVotingReleased, setIsVotingReleased] = useState(false);
  const [isVotingClosed, setIsVotingClosed] = useState(false);
  const [isVoteRevelationEnabled, setIsVoteRevelationEnabled] = useState(false);
  
  const [lastRoundPlayerIds, setLastRoundPlayerIds] = useState<string[]>([]);
  
  const { lineup: lineupSize, reserves: reservesSize } = useMemo(() => getTeamSizes(selectedModality), [selectedModality]);

  const [team1Lineup, setTeam1Lineup] = useState<(string | null)[]>(Array(11).fill(null));
  const [team1Reserves, setTeam1Reserves] = useState<(string | null)[]>(Array(5).fill(null));
  const [team2Lineup, setTeam2Lineup] = useState<(string | null)[]>(Array(11).fill(null));
  const [team2Reserves, setTeam2Reserves] = useState<(string | null)[]>(Array(5).fill(null));

  const [isPersonalPaymentsView, setIsPersonalPaymentsView] = useState(false);
  const [team1ShirtColor, setTeam1ShirtColor] = useState<ShirtColor>('amarelo');
  const [team2ShirtColor, setTeam2ShirtColor] = useState<ShirtColor>('verde');
  const [formation, setFormation] = useState<Formation>('4-4-2');
  
  const [lineupsSaved, setLineupsSaved] = useState(false);
  const [slotToAddPlayer, setSlotToAddPlayer] = useState<AddPlayerSlot | null>(null);
  
  const navigateTo = (view: View, options?: { isPersonalPayments?: boolean }) => {
    if (view === 'payments') {
      setIsPersonalPaymentsView(options?.isPersonalPayments || false);
    }
    setPreviousView(currentView);
    setCurrentView(view);
    window.scrollTo(0, 0);
  };
  
  const handleUpdateLeagueName = (newName: string) => {
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
    return currentLeague.users[loggedInUser.id] || null;
  }, [currentLeague, loggedInUser]);

  const isPaymentsEnabled = currentLeague?.paymentsEnabled ?? true;
  
  const updateCurrentLeague = (updater: (league: League) => League, leagueIdToUpdate?: string) => {
    const targetLeagueId = leagueIdToUpdate || currentLeagueId;
    if (!targetLeagueId) return;

    setAppData(prevData => {
        const newLeague = updater(prevData.leagues[targetLeagueId]);
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
    updateCurrentLeague(league => {
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

      return {
        ...league,
        users: { ...league.users, [guestUserId]: newGuestUser },
        players: { ...league.players, [guestPlayerId]: newGuestPlayer },
      };
    });
    toast({ title: 'Convidado Adicionado!', description: `${guestData.name} foi adicionado à liga e ao mercado.` });
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
    updateCurrentLeague(league => ({ ...league, modality }));
    navigateTo('dashboard');
  };

  const handleLogout = async (showToast = true) => {
    setLoggedInUser(null!);
    setCurrentLeagueId(null!);
    navigateTo('welcome');
  };

  const selectPlayerForDetails = (playerId: string) => {
    setSelectedPlayerId(playerId);
    navigateTo('player-details');
  };

  const handlePlayerImageChange = (playerId: string, image: string) => {
    updateCurrentLeague(league => ({ ...league, players: { ...league.players, [playerId]: { ...league.players[playerId], img: image } } }));
  };

  const addPlayerToLineup = (playerId: string) => {
    if (slotToAddPlayer === null) return;
    
    const { position, index, team } = slotToAddPlayer;
    const setLineup = team === 'team1' ? setTeam1Lineup : setTeam2Lineup;
    const setReserves = team === 'team1' ? setTeam1Reserves : setTeam2Reserves;

    if (position === 'RES') {
      setReserves(prevReserves => {
        const newReserves = [...(prevReserves || [])];
        if (index >= 0 && index < newReserves.length) newReserves[index] = playerId;
        return newReserves;
      });
    } else {
      setLineup(prevLineup => {
        const newLineup = [...(prevLineup || [])];
        if (index >= 0 && index < newLineup.length) newLineup[index] = playerId;
        return newLineup;
      });
    }

    setSlotToAddPlayer(null);
    navigateTo('lineup');
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
            homeTeam: 'Time 1', awayTeam: 'Time 2',
            homeScore: team1Score, awayScore: team2Score,
            status: 'Finalizado',
            scorers: liveEvents.filter(event => event.event === 'Gol').map(event => ({ player: event.player, team: event.team })),
        };
        updatedGames[gameId] = newGame;

        const team1PlayerIds = new Set([...team1Lineup, ...team1Reserves].filter(Boolean));
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
            player.stats.games = (player.stats.games || 0) + 1;
            
            const playerTeamIdentifier = team1PlayerIds.has(playerId) ? 'team1' : 'team2';
            const playerResult = (playerTeamIdentifier === 'team1' ? matchResult : (matchResult === 'win' ? 'loss' : (matchResult === 'loss' ? 'win' : 'draw')));

            if (playerResult === 'win') { player.stats.wins++; roundPoints += 3; }
            else if (playerResult === 'draw') { player.stats.draws++; roundPoints += 1; }
            else { player.stats.losses++; }
            
            player.stats.goals += roundGoals;
            player.stats.assists += roundAssists;
            player.points += roundPoints;

            const totalPointsFromResults = (player.stats.wins * 3) + player.stats.draws;
            const totalPossiblePoints = player.stats.games * 3;
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
    updateCurrentLeague(league => {
      const newPlayerId = `p${Object.keys(league.players).length + 1}`;
      const fullNewPlayer: Player = {
        ...newPlayer, last_val: 0, games: 0,
        stats: { wins: 0, losses: 0, draws: 0, goals: 0, assists: 0, yellowCards: 0, redCards: 0, goalsAgainst: 0, goalsFor: 0, goalDifference: 0, performance: 0, points: 0 },
        performanceHistory: [],
      }
      return { ...league, players: { ...league.players, [newPlayerId]: fullNewPlayer } };
    });
    toast({ title: "Jogador Adicionado!", description: `${newPlayer.name} agora está disponível no mercado.` });
  };

  const handleRemovePlayerFromMarket = (playerId: string) => {
    updateCurrentLeague(league => {
      const newPlayers = { ...league.players };
      delete newPlayers[playerId];
      return { ...league, players: newPlayers };
    });
     toast({ title: "Jogador Removido!", variant: "destructive" });
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

  if (isInitializing || !currentUser || !currentLeague) {
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

  const selectedPlayer = selectedPlayerId && currentLeague ? { ...currentLeague.players[selectedPlayerId], id: selectedPlayerId } : null;
  const showBottomNav = !['welcome', 'register', 'login', 'modality-selection', 'loading'].includes(currentView);

  const renderView = () => {
    const isLeagueAdmin = currentLeague.adminId === currentUser.id;
    switch (currentView) {
        case 'loading': return <div className="flex items-center justify-center h-screen bg-background text-xl">Carregando...</div>;
        case 'all-users': return <AllUsersView leagues={appData.leagues} onBack={goBack} />;
        case 'all-leagues': return <AllLeaguesView leagues={appData.leagues} onBack={goBack} />;
        case 'leagues': return <LeaguesView onBack={goBack} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} currentUser={currentUser!} />;
        case 'league-participants': return <LeagueParticipantsView onBack={goBack} league={currentLeague} isLeagueAdmin={isLeagueAdmin} onInvite={handleInvite} onAddGuest={handleAddGuestPlayer} onRemoveUser={handleRemoveUserFromLeague} />;
        case 'modality-selection': return <ModalitySelectionView onModalitySelect={handleModalitySelect} selectedModality={selectedModality} isLeagueAdmin={isLeagueAdmin} />;
        case 'dashboard': return <DashboardView user={currentUser!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={() => handleLogout()} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName} />;
        case 'lineup': return <LineupView players={currentLeague!.players} onPlayerSelect={selectPlayerForDetails} onNavigate={navigateTo} onAddPlayer={handleOpenMarket} currentUser={currentUser!} canEdit={canEditLineup} team1Lineup={team1Lineup} setTeam1Lineup={setTeam1Lineup} team1Reserves={team1Reserves} setTeam1Reserves={setTeam1Reserves} team2Lineup={team2Lineup} setTeam2Lineup={setTeam2Lineup} team2Reserves={team2Reserves} setTeam2Reserves={setTeam2Reserves} onSaveLineups={handleSaveLineups} lineupsSaved={lineupsSaved} modality={selectedModality} team1ShirtColor={team1ShirtColor} setTeam1ShirtColor={setTeam1ShirtColor} team2ShirtColor={team2ShirtColor} setTeam2ShirtColor={setTeam2ShirtColor} formation={formation} setFormation={setFormation} />;
        case 'player-details': return selectedPlayer && currentLeague ? <PlayerDetailsView player={selectedPlayer} games={currentLeague.games} onBack={goBack} onImageChange={handlePlayerImageChange} /> : <DashboardView user={currentUser!} allUsers={currentLeague!.users} players={currentLeague!.players} onNavigate={navigateTo} onPlayerSelect={selectPlayerForDetails} onAvatarChange={handleAvatarChange} onUpdateUser={handleUpdateUser} leagues={appData.leagues} currentLeagueId={currentLeagueId!} onLeagueChange={handleLeagueChange} isPaymentsEnabled={isPaymentsEnabled} onLogout={() => handleLogout()} leagueName={currentLeague.name} onUpdateLeagueName={handleUpdateLeagueName}/>;
        case 'market': return <MarketView players={currentLeague!.players} onPlayerSelect={addPlayerToLineup} onBack={goBack} position={slotToAddPlayer?.position ?? null} scaledPlayerIds={allScaledPlayerIds} canEdit={canEditLineup} onAddPlayerToMarket={handleAddPlayerToMarket} onRemovePlayerFromMarket={handleRemovePlayerFromMarket} onUpdatePlayerInMarket={() => {}} />;
        case 'partial-score': return <PartialScoreView players={currentLeague!.players} users={currentLeague!.users} onBack={goBack} onPlayerSelect={selectPlayerForDetails} />;
        case 'games': return <GamesView onBack={goBack} gamesData={currentLeague!.games} />;
        case 'friends-score': return <FriendsScoreView onBack={goBack} user={currentUser!} players={currentLeague!.players} allUsers={currentLeague!.users} />;
        case 'statistics': return <StatisticsView players={currentLeague!.players} users={currentLeague!.users} onBack={() => navigateTo('dashboard')} onPlayerSelect={selectPlayerForDetails} canEditScouts={canEditScouts} onSave={handleUpdateStats} scalersRanking={currentLeague!.scalersRanking} goalieRanking={currentLeague!.goalieRanking}/>;
        case 'admin': return <AdminView onBack={goBack} users={Object.values(currentLeague!.users)} currentUser={currentUser!} editorOfTheRound={currentLeague!.editorOfTheRound} onSetEditor={handleSetEditor} scoutEditor={currentLeague!.scoutEditor} onSetScoutEditor={handleSetScoutEditor} paymentEditor={currentLeague!.paymentEditor} onSetPaymentEditor={handleSetPaymentEditor} isVoteRevelationEnabled={isVoteRevelationEnabled} onToggleVoteRevelation={handleToggleVoteRevelation} leagueId={currentLeague!.id} isPaymentsEnabled={isPaymentsEnabled} onTogglePayments={handleTogglePayments} leagueName={currentLeague!.name} onUpdateLeagueName={handleUpdateLeagueName} />;
        case 'live': return <LiveView onBack={goBack} user={currentUser!} players={currentLeague!.players} canEditScouts={canEditScouts} liveEvents={liveEvents} onAddLiveEvent={handleAddLiveEvent} onFinishMatch={handleFinishMatch} team1Lineup={team1Lineup} team2Lineup={team2Lineup} allScaledPlayerIds={allScaledPlayerIds} />;
        case 'payments': return <PaymentsView onBack={goBack} currentUser={currentUser!} users={currentLeague!.users} canEdit={canEditPayments && !isPersonalPaymentsView} onSave={handleUpdateUserPayments} />;
        case 'best-eleven': return <BestElevenView onBack={goBack} players={currentLeague!.players} currentUser={currentUser!} allUsers={Object.values(currentLeague!.users)} allScaledPlayerIds={lastRoundPlayerIds} onVote={handleBestElevenVote} userLineup={currentUser ? bestElevenVotes[currentUser.id] : undefined} allVotes={bestElevenVotes} isSaved={currentUser ? bestElevenSaved[currentUser.id] : false} canManageVoting={canManageVoting} isVotingReleased={isVotingReleased} isVotingClosed={isVotingClosed} onReleaseVoting={handleReleaseVoting} onCloseVoting={handleCloseVoting} modality={selectedModality} isVoteRevelationEnabled={isVoteRevelationEnabled} formation={formation} />;
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
