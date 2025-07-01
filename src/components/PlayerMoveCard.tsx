import React from 'react';
import { PlayerMove } from '@/types/nba';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ArrowRight, Calendar, DollarSign, FileText, CheckCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PlayerMoveCardProps {
  move: PlayerMove;
}

export function PlayerMoveCard({ move }: PlayerMoveCardProps) {
  const getMoveTypeColor = (type: string) => {
    switch (type) {
      case 'trade': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'signing': return 'bg-green-100 text-green-800 border-green-200';
      case 'waiver': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'release': return 'bg-red-100 text-red-800 border-red-200';
      case 'draft': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatSalary = (amount?: number) => {
    if (!amount) return 'N/A';
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    return `$${(amount / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="w-full transition-all hover:shadow-lg border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
              {move.player.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{move.player.name}</h3>
              <p className="text-sm text-gray-600">{move.player.position} • {move.player.age} years old</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMoveTypeColor(move.move_type)}`}>
              {move.move_type.toUpperCase()}
            </span>
            {move.is_official ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <Clock className="w-4 h-4 text-orange-500" />
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-4">
        {/* Team Movement */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 flex-1">
            {move.from_team ? (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                  {move.from_team.abbreviation}
                </div>
                <p className="text-xs mt-1">{move.from_team.city}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  FA
                </div>
                <p className="text-xs mt-1">Free Agent</p>
              </div>
            )}
          </div>
          
          <ArrowRight className="w-5 h-5 text-gray-400" />
          
          <div className="flex items-center gap-2 flex-1 justify-end">
            {move.to_team ? (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                  {move.to_team.abbreviation}
                </div>
                <p className="text-xs mt-1">{move.to_team.city}</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                  FA
                </div>
                <p className="text-xs mt-1">Free Agent</p>
              </div>
            )}
          </div>
        </div>

        {/* Move Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{format(new Date(move.date), 'MMM d, yyyy')}</span>
          </div>
          
          {move.salary_cap_impact && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>{formatSalary(move.salary_cap_impact)}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">{move.source}</span>
          </div>
        </div>

        {/* Contract Details */}
        {move.contract && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Contract Details</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Value:</span> {formatSalary(move.contract.value)}
              </div>
              <div>
                <span className="text-gray-600">Years:</span> {move.contract.years}
              </div>
              <div>
                <span className="text-gray-600">AAV:</span> {formatSalary(move.contract.average_annual_value)}
              </div>
              <div>
                <span className="text-gray-600">Guaranteed:</span> {formatSalary(move.contract.guaranteed)}
              </div>
            </div>
          </div>
        )}

        {/* Trade Assets */}
        {move.trade_assets && move.trade_assets.length > 0 && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Trade Assets</h4>
            <div className="flex flex-wrap gap-2">
              {move.trade_assets.map((asset, index) => (
                <span key={index} className="px-2 py-1 bg-white rounded text-xs border">
                  {asset}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Details */}
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
          {move.details}
        </div>
      </CardContent>
    </Card>
  );
}