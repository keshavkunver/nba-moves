const Parser = require('rss-parser');

class NBADataRetriever {
    constructor() {
        this.parser = new Parser({
            customFields: {
                item: ['creator', 'content:encoded']
            }
        });
        this.lastUpdate = new Date();
        this.seenMoves = new Set();
    }

    // RSS Sources - Using reliable sports news RSS feeds
    sources = [
        {
            url: 'https://www.espn.com/espn/rss/nba/news',
            reporter: 'ESPN NBA',
            confidence: 85
        },
        {
            url: 'https://sports.yahoo.com/nba/rss.xml',
            reporter: 'Yahoo Sports NBA',
            confidence: 80
        },
        {
            url: 'https://www.cbssports.com/rss/headlines/nba',
            reporter: 'CBS Sports NBA',
            confidence: 75
        },
        {
            url: 'https://www.si.com/rss/si_nba.rss',
            reporter: 'Sports Illustrated NBA',
            confidence: 70
        },
        {
            url: 'https://bleacherreport.com/nba.rss',
            reporter: 'Bleacher Report NBA',
            confidence: 65
        }
    ];

    // NBA move detection patterns - Enhanced for sports news headlines
    movePatterns = [
        {
            pattern: /BREAKING:?\s*(.+?)\s+(?:has been\s+)?traded\s+(?:to\s+)?(.+)/i,
            type: 'trade'
        },
        {
            pattern: /(.+?)\s+traded\s+(?:to\s+)?(.+?)(?:\s+for|\s+in|\s*$)/i,
            type: 'trade'
        },
        {
            pattern: /(.+?)\s+(?:signs?|signed)\s+(?:with\s+)?(.+?)(?:\s+for|\s+to|\s*$)/i,
            type: 'signing'
        },
        {
            pattern: /(.+?)\s+agrees?\s+to\s+(?:a\s+)?(?:.*?\s+)?(?:deal|contract)\s+with\s+(.+)/i,
            type: 'signing'
        },
        {
            pattern: /(.+?)\s+(?:waived|released|cut)\s+(?:by\s+)?(.+)/i,
            type: 'release'
        },
        {
            pattern: /(.+?)\s+(?:joins|joining)\s+(.+)/i,
            type: 'signing'
        },
        {
            pattern: /(.+?)\s+(?:re-signs?|re-signed)\s+(?:with\s+)?(.+)/i,
            type: 'signing'
        },
        {
            pattern: /(.+?)\s+(?:acquired|acquires)\s+(.+?)(?:\s+from|\s+via|\s*$)/i,
            type: 'trade'
        },
        {
            pattern: /TRADE:?\s*(.+)/i,
            type: 'trade'
        },
        {
            pattern: /(.+?)\s+(?:finalizes?|finalized)\s+(?:a\s+)?(?:deal|trade|contract)\s+(?:with\s+)?(.+)/i,
            type: 'signing'
        }
    ];

    // Team name mappings for consistency
    teamMappings = {
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

    async fetchAllSources() {
        const allMoves = [];

        for (const source of this.sources) {
            try {
                console.log(`📊 Fetching from ${source.reporter}...`);
                const moves = await this.fetchFromSource(source);
                allMoves.push(...moves);
            } catch (error) {
                console.error(`❌ Failed to fetch from ${source.reporter}:`, error.message);
                // Continue with other sources
            }
        }

        return this.deduplicateMoves(allMoves);
    }

    async fetchFromSource(source) {
        try {
            const feed = await this.parser.parseURL(source.url);
            const moves = [];

            for (const item of feed.items) {
                const moveData = this.parseRSSItem(item, source);
                if (moveData && this.isNewMove(moveData)) {
                    moves.push(moveData);
                    this.seenMoves.add(this.getMoveId(moveData));
                }
            }

            return moves;
        } catch (error) {
            throw new Error(`RSS fetch failed: ${error.message}`);
        }
    }

    parseRSSItem(item, source) {
        const text = (item.title || '') + ' ' + (item.contentSnippet || '');

        for (const { pattern, type } of this.movePatterns) {
            const match = text.match(pattern);
            if (match) {
                return this.createMoveFromMatch(match, type, item, source);
            }
        }

        return null;
    }

    createMoveFromMatch(match, type, item, source) {
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
            details: item.title || 'NBA Move',
            source: source.reporter,
            is_official: source.confidence >= 90,
            contract: undefined,
            trade_assets: undefined,
            salary_cap_impact: undefined
        };
    }

    cleanPlayerName(name) {
        return name
            .replace(/^(the\s+)?/i, '')
            .replace(/\s+(has been|is|was|will be)\s+.*/i, '')
            .trim();
    }

    parseTeamInfo(teamText) {
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

    createPlayer(name) {
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

    getTeamName(abbrev) {
        const names = {
            'LAL': 'Lakers', 'GSW': 'Warriors', 'MIA': 'Heat', 'BOS': 'Celtics',
            'PHX': 'Suns', 'LAC': 'Clippers', 'BKN': 'Nets', 'CHI': 'Bulls'
        };
        return names[abbrev] || abbrev;
    }

    getTeamCity(abbrev) {
        const cities = {
            'LAL': 'Los Angeles', 'GSW': 'Golden State', 'MIA': 'Miami', 'BOS': 'Boston',
            'PHX': 'Phoenix', 'LAC': 'Los Angeles', 'BKN': 'Brooklyn', 'CHI': 'Chicago'
        };
        return cities[abbrev] || 'Unknown';
    }

    getConference(abbrev) {
        const eastern = ['BOS', 'BKN', 'NYK', 'PHI', 'TOR', 'CHI', 'CLE', 'DET', 'IND', 'MIL', 'ATL', 'CHA', 'MIA', 'ORL', 'WAS'];
        return eastern.includes(abbrev) ? 'Eastern' : 'Western';
    }

    isNewMove(move) {
        const moveId = this.getMoveId(move);
        return !this.seenMoves.has(moveId);
    }

    getMoveId(move) {
        return `${move.player.name}-${move.move_type}-${move.timestamp}`;
    }

    deduplicateMoves(moves) {
        const seen = new Map();

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

    // Main method to get all new moves
    async getLatestMoves() {
        console.log('🏀 Checking for new NBA moves...');

        try {
            const rssMoves = await this.fetchAllSources();
            const newMoves = this.deduplicateMoves(rssMoves);

            if (newMoves.length > 0) {
                console.log(`✅ Found ${newMoves.length} new moves from RSS`);
                return newMoves;
            } else {
                console.log('ℹ️  No new moves found from RSS sources');
                return [];
            }
        } catch (error) {
            console.error('❌ Error fetching NBA moves:', error);
            return [];
        }
    }
}

module.exports = { NBADataRetriever }; 