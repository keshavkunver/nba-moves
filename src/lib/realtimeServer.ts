import { Server } from 'socket.io';
import { createServer } from 'http';
import cron from 'node-cron';
import { NBADataRetriever } from './dataRetrieval';
import { PlayerMove } from '@/types/nba';

export class RealTimeNBAServer {
  private io: Server;
  private dataRetriever: NBADataRetriever;
  private currentMoves: PlayerMove[] = [];
  private isRunning = false;

  constructor(port: number = 8080) {
    const server = createServer();
    this.io = new Server(server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
    });

    this.dataRetriever = new NBADataRetriever();
    this.setupSocketHandlers();

    server.listen(port, () => {
      console.log(`🏀 NBA Moves Real-time Server running on port ${port}`);
    });
  }

  private setupSocketHandlers() {
    this.io.on('connection', (socket) => {
      console.log('📱 Client connected:', socket.id);

      // Send current moves to new client
      socket.emit('current-moves', this.currentMoves);

      socket.on('disconnect', () => {
        console.log('📱 Client disconnected:', socket.id);
      });

      // Handle client requesting refresh
      socket.on('request-refresh', async () => {
        console.log('🔄 Client requested manual refresh');
        await this.checkForNewMoves();
      });
    });
  }

  async start() {
    if (this.isRunning) {
      console.log('⚠️  Server already running');
      return;
    }

    this.isRunning = true;
    console.log('🚀 Starting NBA moves monitoring...');

    // Initial fetch
    await this.checkForNewMoves();

    // Schedule checks every 30 seconds for maximum speed
    cron.schedule('*/30 * * * * *', async () => {
      if (this.isRunning) {
        await this.checkForNewMoves();
      }
    });

    // Also check every 2 minutes as backup
    cron.schedule('*/2 * * * *', async () => {
      if (this.isRunning) {
        console.log('🔍 Backup check for NBA moves...');
        await this.checkForNewMoves();
      }
    });

    console.log('✅ NBA moves monitoring started');
    console.log('⏰ Checking every 30 seconds for new moves');
  }

  private async checkForNewMoves() {
    try {
      const newMoves = await this.dataRetriever.getLatestMoves();

      if (newMoves.length > 0) {
        // Find truly new moves
        const trulyNewMoves = newMoves.filter(move =>
          !this.currentMoves.some(existing => existing.id === move.id)
        );

        if (trulyNewMoves.length > 0) {
          console.log(`🚨 BREAKING: ${trulyNewMoves.length} new NBA moves detected!`);

          // Add to current moves
          this.currentMoves = [...trulyNewMoves, ...this.currentMoves]
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 50); // Keep only latest 50 moves

          // Broadcast to all connected clients
          this.io.emit('new-moves', trulyNewMoves);
          this.io.emit('current-moves', this.currentMoves);

          // Log the moves
          trulyNewMoves.forEach(move => {
            console.log(`📢 ${move.player.name} ${move.move_type} - ${move.source}`);
          });
        }
      }
    } catch (error) {
      console.error('❌ Error checking for moves:', error);
    }
  }

  stop() {
    this.isRunning = false;
    console.log('🛑 NBA moves monitoring stopped');
  }

  // Method to manually trigger a check (for testing)
  async triggerCheck() {
    console.log('🧪 Manual trigger check');
    await this.checkForNewMoves();
  }

  // Get current connected clients count
  getConnectedClients(): number {
    return this.io.sockets.sockets.size;
  }

  // Method to inject a test move (for development)
  injectTestMove(move: PlayerMove) {
    console.log('🧪 Injecting test move:', move.player.name);
    this.currentMoves = [move, ...this.currentMoves];
    this.io.emit('new-moves', [move]);
    this.io.emit('current-moves', this.currentMoves);
  }
}

// Function to create and start the server
export function startNBAMovesServer(port: number = 8080): RealTimeNBAServer {
  const server = new RealTimeNBAServer(port);
  server.start();
  return server;
}

// For standalone server script
if (require.main === module) {
  const server = startNBAMovesServer(8080);

  // Test injection after 5 seconds
  setTimeout(() => {
    const testMove: PlayerMove = {
      id: 'test-' + Date.now(),
      player: {
        id: 'test-player',
        name: 'Test Player',
        position: 'PG',
        age: 25,
        height: "6'2\"",
        weight: '180 lbs',
        experience: 3,
        country: 'USA'
      },
      from_team: null,
      to_team: {
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
      move_type: 'signing',
      date: new Date().toISOString().split('T')[0],
      timestamp: new Date().toISOString(),
      details: 'Test signing for development',
      source: 'Test System',
      is_official: false
    };

    server.injectTestMove(testMove);
  }, 5000);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down NBA moves server...');
    server.stop();
    process.exit(0);
  });
}