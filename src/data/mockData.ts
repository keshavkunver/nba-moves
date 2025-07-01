import { Player, Team, PlayerMove, Trade, TeamActivity } from '@/types/nba';

export const mockTeams: Team[] = [
  {
    id: 'lal',
    name: 'Lakers',
    abbreviation: 'LAL',
    city: 'Los Angeles',
    logo_url: '/logos/lal.png',
    primary_color: '#552583',
    secondary_color: '#FDB927',
    conference: 'Western',
    division: 'Pacific'
  },
  {
    id: 'gsw',
    name: 'Warriors',
    abbreviation: 'GSW',
    city: 'Golden State',
    logo_url: '/logos/gsw.png',
    primary_color: '#1D428A',
    secondary_color: '#FFC72C',
    conference: 'Western',
    division: 'Pacific'
  },
  {
    id: 'mia',
    name: 'Heat',
    abbreviation: 'MIA',
    city: 'Miami',
    logo_url: '/logos/mia.png',
    primary_color: '#98002E',
    secondary_color: '#F9A01B',
    conference: 'Eastern',
    division: 'Southeast'
  },
  {
    id: 'bos',
    name: 'Celtics',
    abbreviation: 'BOS',
    city: 'Boston',
    logo_url: '/logos/bos.png',
    primary_color: '#007A33',
    secondary_color: '#BA9653',
    conference: 'Eastern',
    division: 'Atlantic'
  },
  {
    id: 'phx',
    name: 'Suns',
    abbreviation: 'PHX',
    city: 'Phoenix',
    logo_url: '/logos/phx.png',
    primary_color: '#1D1160',
    secondary_color: '#E56020',
    conference: 'Western',
    division: 'Pacific'
  }
];

export const mockPlayers: Player[] = [
  {
    id: 'lebron-james',
    name: 'LeBron James',
    position: 'SF',
    age: 39,
    height: "6'9\"",
    weight: '250 lbs',
    experience: 21,
    college: undefined,
    country: 'USA',
    jersey_number: 23,
    headshot_url: '/players/lebron.jpg'
  },
  {
    id: 'damian-lillard',
    name: 'Damian Lillard',
    position: 'PG',
    age: 33,
    height: "6'2\"",
    weight: '195 lbs',
    experience: 12,
    college: 'Weber State',
    country: 'USA',
    jersey_number: 0,
    headshot_url: '/players/lillard.jpg'
  },
  {
    id: 'james-harden',
    name: 'James Harden',
    position: 'SG',
    age: 34,
    height: "6'5\"",
    weight: '220 lbs',
    experience: 14,
    college: 'Arizona State',
    country: 'USA',
    jersey_number: 1,
    headshot_url: '/players/harden.jpg'
  },
  {
    id: 'deandre-ayton',
    name: "DeAndre Ayton",
    position: 'C',
    age: 25,
    height: "7'0\"",
    weight: '250 lbs',
    experience: 6,
    college: 'Arizona',
    country: 'Bahamas',
    jersey_number: 22,
    headshot_url: '/players/ayton.jpg'
  }
];

export const mockPlayerMoves: PlayerMove[] = [
  {
    id: 'move-1',
    player: mockPlayers[1], // Damian Lillard
    from_team: mockTeams.find(t => t.abbreviation === 'PHX') || null,
    to_team: mockTeams.find(t => t.abbreviation === 'MIA') || null,
    move_type: 'trade',
    date: '2024-01-15',
    timestamp: '2024-01-15T14:30:00Z',
    details: 'Multi-team trade involving draft picks and young talent',
    source: 'Adrian Wojnarowski',
    is_official: true,
    trade_assets: ['2024 1st Round Pick', '2025 2nd Round Pick'],
    salary_cap_impact: 45000000,
    contract: {
      value: 176000000,
      years: 4,
      guaranteed: 176000000,
      average_annual_value: 44000000,
      start_date: '2023-07-01',
      end_date: '2027-06-30'
    }
  },
  {
    id: 'move-2',
    player: mockPlayers[2], // James Harden
    from_team: mockTeams.find(t => t.abbreviation === 'LAL') || null,
    to_team: mockTeams.find(t => t.abbreviation === 'GSW') || null,
    move_type: 'signing',
    date: '2024-01-14',
    timestamp: '2024-01-14T16:45:00Z',
    details: 'Veteran minimum contract signing',
    source: 'Shams Charania',
    is_official: false,
    salary_cap_impact: 3500000,
    contract: {
      value: 3500000,
      years: 1,
      guaranteed: 3500000,
      average_annual_value: 3500000,
      start_date: '2024-01-15',
      end_date: '2024-06-30'
    }
  },
  {
    id: 'move-3',
    player: mockPlayers[3], // DeAndre Ayton
    from_team: mockTeams.find(t => t.abbreviation === 'PHX') || null,
    to_team: mockTeams.find(t => t.abbreviation === 'BOS') || null,
    move_type: 'trade',
    date: '2024-01-13',
    timestamp: '2024-01-13T11:20:00Z',
    details: 'Traded for multiple role players and future picks',
    source: 'ESPN',
    is_official: true,
    trade_assets: ['Robert Williams III', '2025 1st Round Pick', '2026 1st Round Pick'],
    salary_cap_impact: 35000000
  },
  {
    id: 'move-4',
    player: {
      id: 'kyle-kuzma',
      name: 'Kyle Kuzma',
      position: 'PF',
      age: 28,
      height: "6'9\"",
      weight: '221 lbs',
      experience: 7,
      college: 'Utah',
      country: 'USA',
      jersey_number: 33
    },
    from_team: null,
    to_team: mockTeams.find(t => t.abbreviation === 'MIA') || null,
    move_type: 'signing',
    date: '2024-01-12',
    timestamp: '2024-01-12T09:15:00Z',
    details: 'Signed after being waived by previous team',
    source: 'The Athletic',
    is_official: true,
    salary_cap_impact: 2500000
  }
];

export const mockTrades: Trade[] = [
  {
    id: 'trade-1',
    date: '2024-01-15',
    timestamp: '2024-01-15T14:30:00Z',
    teams: [
      mockTeams.find(t => t.abbreviation === 'PHX')!,
      mockTeams.find(t => t.abbreviation === 'MIA')!,
      mockTeams.find(t => t.abbreviation === 'LAL')!
    ],
    players: [mockPlayerMoves[0]],
    draft_picks: ['2024 1st Round Pick (PHX)', '2025 2nd Round Pick (LAL)'],
    cash_considerations: 1500000,
    details: 'Complex three-team trade reshuffling Western Conference',
    source: 'Adrian Wojnarowski',
    is_official: true
  }
];

export const mockTeamActivity: TeamActivity[] = [
  {
    team: mockTeams[0], // Lakers
    moves_count: 3,
    players_acquired: 1,
    players_lost: 2,
    net_salary_change: -5000000,
    recent_moves: [mockPlayerMoves[1]]
  },
  {
    team: mockTeams[1], // Warriors
    moves_count: 2,
    players_acquired: 2,
    players_lost: 0,
    net_salary_change: 8500000,
    recent_moves: [mockPlayerMoves[1]]
  },
  {
    team: mockTeams[2], // Heat
    moves_count: 4,
    players_acquired: 3,
    players_lost: 1,
    net_salary_change: 15000000,
    recent_moves: [mockPlayerMoves[0], mockPlayerMoves[3]]
  }
];