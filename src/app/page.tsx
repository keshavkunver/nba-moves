import React, { useEffect } from 'react';
import { DashboardStats } from '@/components/DashboardStats';
import { PlayerMoveCard } from '@/components/PlayerMoveCard';
import { TeamActivityCard } from '@/components/TeamActivityCard';
import { mockTeamActivity } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, BarChart3, Filter, Wifi, WifiOff, RefreshCw, Bell } from 'lucide-react';
import { useRealTimeNBA, requestNotificationPermission } from '@/hooks/useRealTimeNBA';

export default function Home() {
  const { 
    moves, 
    isConnected, 
    lastUpdate, 
    newMovesCount, 
    requestRefresh, 
    clearNewMovesCount 
  } = useRealTimeNBA();

  // Request notification permission on load
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Clear new moves count when user scrolls or clicks
  useEffect(() => {
    const handleUserInteraction = () => clearNewMovesCount();
    document.addEventListener('scroll', handleUserInteraction);
    document.addEventListener('click', handleUserInteraction);
    
    return () => {
      document.removeEventListener('scroll', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, [clearNewMovesCount]);

  // Calculate stats from real-time data
  const totalMoves = moves.length;
  const totalTrades = moves.filter(move => move.move_type === 'trade').length;
  const totalSalaryImpact = moves.reduce((sum, move) => sum + (move.salary_cap_impact || 0), 0);
  const activeTeams = mockTeamActivity.length; // Keep using mock for team activity for now

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
              
              {/* Connection Status */}
              <div className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs ${
                isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isConnected ? (
                  <>
                    <Wifi className="w-3 h-3" />
                    LIVE
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3" />
                    OFFLINE
                  </>
                )}
              </div>

              {/* New Moves Badge */}
              {newMovesCount > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold animate-pulse">
                  <Bell className="w-3 h-3" />
                  {newMovesCount} NEW
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {/* Last Update Time */}
              {lastUpdate && (
                <div className="text-xs text-gray-500">
                  Last update: {lastUpdate.toLocaleTimeString()}
                </div>
              )}
              
              <button 
                onClick={requestRefresh}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50"
                disabled={!isConnected}
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              
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
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Real-Time NBA Moves
                  </div>
                  <div className="text-sm font-normal text-gray-500">
                    {moves.length} moves tracked
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isConnected && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <WifiOff className="w-4 h-4" />
                      <span className="font-medium">Connection Lost</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Trying to reconnect to real-time NBA moves feed...
                    </p>
                  </div>
                )}
                
                {moves.length === 0 && isConnected ? (
                  <div className="text-center py-8">
                    <div className="text-gray-400 mb-2">🏀</div>
                    <p className="text-gray-500">No moves detected yet</p>
                    <p className="text-sm text-gray-400">Monitoring RSS feeds every 30 seconds...</p>
                  </div>
                ) : (
                  moves.map((move) => (
                    <PlayerMoveCard key={move.id} move={move} />
                  ))
                )}
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

            {/* Real-time Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-3 rounded-lg ${
                  isConnected ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <div className={`text-sm font-medium ${
                    isConnected ? 'text-green-900' : 'text-red-900'
                  }`}>
                    Real-time Connection
                  </div>
                  <div className={`text-lg font-bold ${
                    isConnected ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {isConnected ? '🟢 Connected' : '🔴 Disconnected'}
                  </div>
                  <div className={`text-xs ${
                    isConnected ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isConnected ? 'Monitoring 5 NBA sources' : 'Attempting to reconnect...'}
                  </div>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">Update Frequency</div>
                  <div className="text-lg font-bold text-blue-700">Every 30s</div>
                  <div className="text-xs text-blue-600">RSS + Underdog NBA</div>
                </div>
                
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-purple-900">Data Sources</div>
                  <div className="text-lg font-bold text-purple-700">5 Active</div>
                  <div className="text-xs text-purple-600">Shams, Haynes, Stein, Underdog</div>
                </div>
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
                  <div className="text-sm font-medium text-green-900">Response Time</div>
                  <div className="text-lg font-bold text-green-700">< 2 min</div>
                  <div className="text-xs text-green-600">From tweet to dashboard</div>
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