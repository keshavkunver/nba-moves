const { Server } = require('socket.io');
const { createServer } = require('http');
const cron = require('node-cron');

// Import the NBA Data Retriever (using dynamic import for ES modules)
let NBADataRetriever;

class RealTimeNBAServer {
    constructor(port = 8080) {
        this.currentMoves = [];
        this.isRunning = false;
        this.dataRetriever = null;

        const server = createServer();
        this.io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });

        this.setupSocketHandlers();
        this.initializeDataRetriever();

        server.listen(port, () => {
            console.log(`🏀 NBA Moves Real-time Server running on port ${port}`);
        });
    }

    async initializeDataRetriever() {
        try {
            // Dynamic import for ES modules
            const { NBADataRetriever } = await import('./dataRetrieval.js');
            this.dataRetriever = new NBADataRetriever();
            console.log('📊 NBA Data Retriever initialized');
        } catch (error) {
            console.error('❌ Failed to initialize NBA Data Retriever:', error);
            console.log('🧪 Falling back to test data mode');
        }
    }

    setupSocketHandlers() {
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

        // Initial check
        await this.checkForNewMoves();

        // Schedule checks every 30 seconds
        cron.schedule('*/30 * * * * *', async () => {
            if (this.isRunning) {
                await this.checkForNewMoves();
            }
        });

        console.log('✅ NBA moves monitoring started');
        console.log('⏰ Checking every 30 seconds for new moves');
    }

    async checkForNewMoves() {
        try {
            console.log('🔍 Checking for new NBA moves...');

            if (this.dataRetriever) {
                // Use real NBA data retriever
                const newMoves = await this.dataRetriever.getLatestMoves();

                if (newMoves && newMoves.length > 0) {
                    console.log(`🏀 Found ${newMoves.length} new moves from NBA sources`);

                    // Filter out moves we already have
                    const uniqueNewMoves = newMoves.filter(move =>
                        !this.currentMoves.some(existing => existing.id === move.id)
                    );

                    if (uniqueNewMoves.length > 0) {
                        this.currentMoves = [...uniqueNewMoves, ...this.currentMoves].slice(0, 50); // Keep last 50 moves
                        this.io.emit('new-moves', uniqueNewMoves);
                        this.io.emit('current-moves', this.currentMoves);
                        console.log(`✅ Broadcasted ${uniqueNewMoves.length} new moves to clients`);
                    } else {
                        console.log('ℹ️  No new moves (all moves already seen)');
                    }
                } else {
                    console.log('ℹ️  No new moves found from RSS sources');
                }
            } else {
                console.log('❌ NBA Data Retriever not available - no moves to check');
            }
        } catch (error) {
            console.error('❌ Error checking for moves:', error.message);
        }
    }

    stop() {
        this.isRunning = false;
        console.log('🛑 NBA moves monitoring stopped');
    }

    getConnectedClients() {
        return this.io.sockets.sockets.size;
    }
}

function startNBAMovesServer(port = 8080) {
    const server = new RealTimeNBAServer(port);
    server.start();
    return server;
}

// For standalone server script
if (require.main === module) {
    const server = startNBAMovesServer(8080);

    // Graceful shutdown
    process.on('SIGINT', () => {
        console.log('\n🛑 Shutting down NBA moves server...');
        server.stop();
        process.exit(0);
    });
}

module.exports = { RealTimeNBAServer, startNBAMovesServer }; 