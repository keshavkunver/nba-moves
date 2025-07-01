import React from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { PlayerMoveCard } from '@/components/PlayerMoveCard';
import { TeamActivityCard } from '@/components/TeamActivityCard';
import { mockPlayerMoves, mockTeamActivity } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart3, Filter } from 'lucide-react';

export default function Home() {
  // Calculate stats from mock data
  const totalMoves = mockPlayerMoves.length;
  const totalTrades = mockPlayerMoves.filter(move => move.move_type === 'trade').length;
  const totalSalaryImpact = mockPlayerMoves.reduce((sum, move) => sum + (move.salary_cap_impact || 0), 0);
  const activeTeams = mockTeamActivity.length;

  // Sort moves by date (newest first)
  const sortedMoves = [...mockPlayerMoves].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">NBA Moves</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Stats */}
        <div className="mb-8">
          <DashboardStats
            totalMoves={totalMoves}
            totalTrades={totalTrades}
            totalSalaryImpact={totalSalaryImpact}
            activeTeams={activeTeams}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Moves Feed */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Recent Player Moves
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {sortedMoves.map((move) => (
                  <PlayerMoveCard key={move.id} move={move} />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Team Activity Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  Team Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockTeamActivity.map((activity, index) => (
                  <TeamActivityCard key={index} activity={activity} />
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Most Active Conference</div>
                  <div className="text-lg font-bold text-blue-700">Western</div>
                  <div className="text-xs text-blue-600">65% of recent moves</div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="text-sm font-medium text-green-900">Average Deal Size</div>
                  <div className="text-lg font-bold text-green-700">$28.3M</div>
                  <div className="text-xs text-green-600">↑ 12% from last season</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">Trade Deadline</div>
                  <div className="text-lg font-bold text-purple-700">32 days</div>
                  <div className="text-xs text-purple-600">Activity expected to increase</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}