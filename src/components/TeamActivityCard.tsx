import React from 'react';
import { TeamActivity } from '@/types/nba';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign } from 'lucide-react';

interface TeamActivityCardProps {
  activity: TeamActivity;
}

export function TeamActivityCard({ activity }: TeamActivityCardProps) {
  const formatSalary = (amount: number) => {
    const isNegative = amount < 0;
    const absAmount = Math.abs(amount);
    let formatted;
    
    if (absAmount >= 1000000) {
      formatted = `$${(absAmount / 1000000).toFixed(1)}M`;
    } else {
      formatted = `$${(absAmount / 1000).toFixed(0)}K`;
    }
    
    return isNegative ? `-${formatted}` : `+${formatted}`;
  };

  const netChange = activity.players_acquired - activity.players_lost;

  return (
    <Card className="w-full transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: activity.team.primary_color }}
            >
              {activity.team.abbreviation}
            </div>
            <div>
              <CardTitle className="text-lg">{activity.team.city} {activity.team.name}</CardTitle>
              <p className="text-sm text-gray-600">{activity.team.conference} • {activity.team.division}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{activity.moves_count}</div>
            <p className="text-xs text-gray-500">Total Moves</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Activity Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
              <TrendingUp className="w-4 h-4" />
              <span className="font-semibold">{activity.players_acquired}</span>
            </div>
            <p className="text-xs text-gray-600">Acquired</p>
          </div>
          
          <div className="text-center p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
              <TrendingDown className="w-4 h-4" />
              <span className="font-semibold">{activity.players_lost}</span>
            </div>
            <p className="text-xs text-gray-600">Lost</p>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
              <Users className="w-4 h-4" />
              <span className="font-semibold">{netChange > 0 ? '+' : ''}{netChange}</span>
            </div>
            <p className="text-xs text-gray-600">Net</p>
          </div>
        </div>

        {/* Salary Impact */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium">Salary Impact</span>
          </div>
          <span className={`font-bold ${activity.net_salary_change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatSalary(activity.net_salary_change)}
          </span>
        </div>

        {/* Recent Moves */}
        {activity.recent_moves.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-2">Recent Moves</h4>
            <div className="space-y-2">
              {activity.recent_moves.slice(0, 2).map((move, index) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 bg-white border rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                      {move.player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span>{move.player.name}</span>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    move.move_type === 'trade' ? 'bg-blue-100 text-blue-800' :
                    move.move_type === 'signing' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {move.move_type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}