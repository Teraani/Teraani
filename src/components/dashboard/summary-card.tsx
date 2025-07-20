import type { User } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SummaryCardProps {
  user: User;
}

export default function SummaryCard({ user }: SummaryCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        <Avatar className="w-16 h-16 border-4 border-accent">
          <AvatarFallback className="bg-blue-600 text-white font-bold text-2xl">
            {user.teamName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-xl font-bold text-gray-800 dark:text-gray-100">{user.teamName}</CardTitle>
          <p className="text-sm text-gray-500 dark:text-gray-400">Nível Prata II</p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 text-center mt-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">PARCIAL</p>
            <p className="text-2xl font-bold text-green-600">{user.partialScore.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">TOTAL</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{user.totalScore.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">PATRIMÔNIO</p>
            <p className="text-2xl font-bold text-blue-600">C$ {user.valuation.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
