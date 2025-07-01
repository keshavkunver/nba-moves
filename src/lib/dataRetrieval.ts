import Parser from 'rss-parser';
import { PlayerMove, Team, Player, MoveType } from '@/types/nba';

interface RSSItem {
  title: string;
  content: string;
  contentSnippet: string;
  pubDate: string;
  link: string;
  creator?: string;
}

export class NBADataRetriever {
  private parser: Parser;
  private lastUpdate: Date;
  private seenMoves: Set<string>;

  constructor() {
    this.parser = new Parser({
      customFields: {
        item: ['creator', 'content:encoded']
      }
    });
    this.lastUpdate = new Date();
    this.seenMoves = new Set();
  }

  // RSS Sources - Using Nitter for free Twitter access
  private sources = [
    {
      url: 'https://nitter.net/ShamsCharania/rss',
      reporter: 'Shams Charania',
      confidence: 95
    },
    {
      url: 'https://nitter.net/ChrisBHaynes/rss', 
      reporter: 'Chris Haynes',
      confidence: 90
    },
    {
      url: 'https://nitter.net/TheSteinLine/rss',
      reporter: 'Marc Stein',
      confidence: 85
    },
    {
      url: 'https://nitter.net/underdognba/rss',
      reporter: 'Underdog NBA',
      confidence: 88
    },
    {
      url: 'https://nitter.net/ZachLowe_NBA/rss',
      reporter: 'Zach Lowe',
      confidence: 80
    }
  ];

  // NBA move detection patterns
  private movePatterns = [
    {
      pattern: /BREAKING:?\s*(.+?)\s+(?:has been\s+)?traded\s+(?:to\s+)?(.+)/i,
      type: 'trade' as MoveType
    },
    {
      pattern: /(.+?)\s+(?:signs?|signed)\s+(?:with\s+)?(.+?)(?:\s+for|\s+to|\s*$)/i,
      type: 'signing' as MoveType
    },
    {
      pattern: /(.+?)\s+(?:waived|released)\s+(?:by\s+)?(.+)/i,
      type: 'release' as MoveType
    },
    {
      pattern: /TRADE:?\s*(.+)/i,
      type: 'trade' as MoveType
    },
    {
      pattern: /(.+?)\s+agrees?\s+to\s+(?:a\s+)?(?:.*?\s+)?(?:deal|contract)\s+with\s+(.+)/i,
      type: 'signing' as MoveType
    }
  ];

  // Team name mappings for consistency
  private teamMappings: Record<string, string> = {
    'lakers': 'LAL',
    'los angeles lakers': 'LAL',
    'warriors': 'GSW',
    'golden state': 'GSW',
    'heat': 'MIA',
    'miami': 'MIA',
    'celtics': 'BOS',
    'boston': 'BOS',
    'suns': 'PHX',
    'phoenix': 'PHX',
    'clippers': 'LAC',
    'nets': 'BKN',
    'brooklyn': 'BKN',
    'bulls': 'CHI',
    'chicago': 'CHI',
    'cavaliers': 'CLE',
    'cleveland': 'CLE',
    'mavericks': 'DAL',
    'dallas': 'DAL',
    'nuggets': 'DEN',
    'denver': 'DEN',
    'pistons': 'DET',
    'detroit': 'DET',
    'rockets': 'HOU',
    'houston': 'HOU',
    'pacers': 'IND',
    'indiana': 'IND',
    'thunder': 'OKC',
    'oklahoma city': 'OKC',
    'magic': 'ORL',
    'orlando': 'ORL',
    'sixers': 'PHI',
    '76ers': 'PHI',
    'philadelphia': 'PHI',
    'trail blazers': 'POR',
    'blazers': 'POR',
    'portland': 'POR',
    'kings': 'SAC',
    'sacramento': 'SAC',
    'spurs': 'SAS',
    'san antonio': 'SAS',
    'raptors': 'TOR',
    'toronto': 'TOR',
    'jazz': 'UTA',
    'utah': 'UTA',
    'wizards': 'WAS',
    'washington': 'WAS'
  };

  async fetchAllSources(): Promise<PlayerMove[]> {
    const allMoves: PlayerMove[] = [];

    for (const source of this.sources) {
      try {
        console.log(`Fetching from ${source.reporter}...`);
        const moves = await this.fetchFromSource(source);
        allMoves.push(...moves);
      } catch (error) {
        console.error(`Failed to fetch from ${source.reporter}:`, error);
        // Continue with other sources
      }
    }

    return this.deduplicateMoves(allMoves);
  }

  private async fetchFromSource(source: { url: string; reporter: string; confidence: number }): Promise<PlayerMove[]> {
    const feed = await this.parser.parseURL(source.url);
    const moves: PlayerMove[] = [];

    for (const item of feed.items) {
      const moveData = this.parseRSSItem(item, source);
      if (moveData && this.isNewMove(moveData)) {
        moves.push(moveData);
        this.seenMoves.add(this.getMoveId(moveData));
      }
    }

    return moves;
  }

  private parseRSSItem(item: RSSItem, source: { reporter: string; confidence: number }): PlayerMove | null {
    const text = item.title + ' ' + (item.contentSnippet || '');
    
    for (const { pattern, type } of this.movePatterns) {
      const match = text.match(pattern);
      if (match) {
        return this.createMoveFromMatch(match, type, item, source);
      }
    }

    return null;
  }

  private createMoveFromMatch(
    match: RegExpMatchArray, 
    type: MoveType, 
    item: RSSItem, 
    source: { reporter: string; confidence: number }
  ): PlayerMove {
    const playerName = this.cleanPlayerName(match[1]);
    const teamInfo = match[2] ? this.parseTeamInfo(match[2]) : null;

    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      player: this.createPlayer(playerName),
      from_team: null, // Will need additional parsing for trades
      to_team: teamInfo,
      move_type: type,
      date: new Date().toISOString().split('T')[0],
      timestamp: item.pubDate || new Date().toISOString(),
      details: item.title,
      source: source.reporter,
      is_official: source.confidence >= 90,
      contract: undefined,
      trade_assets: undefined,
      salary_cap_impact: undefined
    };
  }

  private cleanPlayerName(name: string): string {
    return name
      .replace(/^(the\s+)?/i, '')
      .replace(/\s+(has been|is|was|will be)\s+.*/i, '')
      .trim();
  }

  private parseTeamInfo(teamText: string): Team | null {
    const cleanTeam = teamText.toLowerCase()
      .replace(/^(the\s+)?/, '')
      .replace(/\s+(for|in|on)\s+.*/, '')
      .trim();

    const abbrev = this.teamMappings[cleanTeam];
    if (!abbrev) return null;

    return {
      id: abbrev.toLowerCase(),
      name: this.getTeamName(abbrev),
      abbreviation: abbrev,
      city: this.getTeamCity(abbrev),
      logo_url: `/logos/${abbrev.toLowerCase()}.png`,
      primary_color: '#000000',
      secondary_color: '#FFFFFF',
      conference: this.getConference(abbrev),
      division: 'Unknown'
    };
  }

  private createPlayer(name: string): Player {
    return {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      position: 'Unknown',
      age: 0,
      height: '',
      weight: '',
      experience: 0,
      country: 'Unknown',
      jersey_number: undefined,
      headshot_url: undefined
    };
  }

  private getTeamName(abbrev: string): string {
    const names: Record<string, string> = {
      'LAL': 'Lakers', 'GSW': 'Warriors', 'MIA': 'Heat', 'BOS': 'Celtics',
      'PHX': 'Suns', 'LAC': 'Clippers', 'BKN': 'Nets', 'CHI': 'Bulls'
    };
    return names[abbrev] || abbrev;
  }

  private getTeamCity(abbrev: string): string {
    const cities: Record<string, string> = {
      'LAL': 'Los Angeles', 'GSW': 'Golden State', 'MIA': 'Miami', 'BOS': 'Boston',
      'PHX': 'Phoenix', 'LAC': 'Los Angeles', 'BKN': 'Brooklyn', 'CHI': 'Chicago'
    };
    return cities[abbrev] || 'Unknown';
  }

  private getConference(abbrev: string): 'Eastern' | 'Western' {
    const eastern = ['BOS', 'BKN', 'NYK', 'PHI', 'TOR', 'CHI', 'CLE', 'DET', 'IND', 'MIL', 'ATL', 'CHA', 'MIA', 'ORL', 'WAS'];
    return eastern.includes(abbrev) ? 'Eastern' : 'Western';
  }

  private isNewMove(move: PlayerMove): boolean {
    const moveId = this.getMoveId(move);
    return !this.seenMoves.has(moveId);
  }

  private getMoveId(move: PlayerMove): string {
    return `${move.player.name}-${move.move_type}-${move.timestamp}`;
  }

  private deduplicateMoves(moves: PlayerMove[]): PlayerMove[] {
    const seen = new Map<string, PlayerMove>();

    for (const move of moves) {
      const key = `${move.player.name}-${move.move_type}`;
      const existing = seen.get(key);

      if (!existing || new Date(move.timestamp) > new Date(existing.timestamp)) {
        seen.set(key, move);
      }
    }

    return Array.from(seen.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  // Underdog NBA API integration
  async fetchUnderdogData(): Promise<PlayerMove[]> {
    try {
      // Note: This would need the actual Underdog NBA API endpoints
      // For now, we'll simulate the structure
      console.log('Fetching from Underdog NBA...');
      
      // Placeholder for actual API call
      // const response = await fetch('https://api.underdognba.com/moves');
      // const data = await response.json();
      
      return []; // Return actual parsed moves when API is available
    } catch (error) {
      console.error('Underdog NBA fetch failed:', error);
      return [];
    }
  }

  // Main method to get all new moves
  async getLatestMoves(): Promise<PlayerMove[]> {
    console.log('🏀 Checking for new NBA moves...');
    
    const [rssMoves, underdogMoves] = await Promise.all([
      this.fetchAllSources(),
      this.fetchUnderdogData()
    ]);

    const allMoves = [...rssMoves, ...underdogMoves];
    const newMoves = this.deduplicateMoves(allMoves);

    if (newMoves.length > 0) {
      console.log(`✅ Found ${newMoves.length} new moves`);
    } else {
      console.log('ℹ️  No new moves found');
    }

    return newMoves;
  }
}