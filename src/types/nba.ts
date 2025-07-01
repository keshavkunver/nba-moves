export interface Player {
  id: string;
  name: string;
  position: string;
  age: number;
  height: string;
  weight: string;
  experience: number;
  college?: string;
  country: string;
  jersey_number?: number;
  headshot_url?: string;
}

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  conference: 'Eastern' | 'Western';
  division: string;
}

export interface Contract {
  value: number;
  years: number;
  guaranteed: number;
  average_annual_value: number;
  start_date: string;
  end_date: string;
}

export type MoveType = 'trade' | 'signing' | 'waiver' | 'release' | 'draft' | 'option' | 're-signing';

export interface PlayerMove {
  id: string;
  player: Player;
  from_team: Team | null;
  to_team: Team | null;
  move_type: MoveType;
  date: string;
  timestamp: string;
  contract?: Contract;
  details: string;
  source: string;
  is_official: boolean;
  trade_assets?: string[];
  salary_cap_impact?: number;
}

export interface Trade {
  id: string;
  date: string;
  timestamp: string;
  teams: Team[];
  players: PlayerMove[];
  draft_picks?: string[];
  cash_considerations?: number;
  details: string;
  source: string;
  is_official: boolean;
}

export interface TeamActivity {
  team: Team;
  moves_count: number;
  players_acquired: number;
  players_lost: number;
  net_salary_change: number;
  recent_moves: PlayerMove[];
}