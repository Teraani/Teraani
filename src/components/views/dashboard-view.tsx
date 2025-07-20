import type { View } from '@/app/page';
import type { Player, User } from '@/lib/data';
import SummaryCard from '@/components/dashboard/summary-card';
import QuickActions from '@/components/dashboard/quick-actions';
import ScorersCard from '@/components/dashboard/scorers-card';

interface DashboardViewProps {
  user: User;
  players: Record<string, Player>;
  onNavigate: (view: View) => void;
  onPlayerSelect: (playerId: string) => void;
}

export default function DashboardView({ user, players, onNavigate }: DashboardViewProps) {
  return (
    <div>
      <header className="bg-gray-800 dark:bg-zinc-800 text-white p-4 shadow-md">
        <h2 className="text-xl font-bold text-center">Brasileiro Masculino</h2>
      </header>
      <div className="p-4 space-y-6">
        <SummaryCard user={user} />
        <QuickActions onNavigate={onNavigate} />
        <ScorersCard user={user} players={players} />
      </div>
    </div>
  );
}
