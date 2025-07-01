import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, TrendingUp, Users, DollarSign } from 'lucide-react';

interface DashboardStatsProps {
  totalMoves: number;
  totalTrades: number;
  totalSalaryImpact: number;
  activeTeams: number;
}

export function DashboardStats({ totalMoves, totalTrades, totalSalaryImpact, activeTeams }: DashboardStatsProps) {
  const formatSalary = (amount: number) => {
    if (amount >= 1000000000) {
      return `$${(amount / 1000000000).toFixed(1)}B`;
    }
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  const stats = [
    {
      title: 'Total Moves',
      value: totalMoves.toString(),
      icon: Activity,
      description: 'Player movements this season',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Trades',
      value: totalTrades.toString(),
      icon: TrendingUp,
      description: 'Completed trades',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Salary Impact',
      value: formatSalary(totalSalaryImpact),
      icon: DollarSign,
      description: 'Total salary movement',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Active Teams',
      value: activeTeams.toString(),
      icon: Users,
      description: 'Teams with recent moves',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="transition-all hover:shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}