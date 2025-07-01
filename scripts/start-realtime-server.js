#!/usr/bin/env node

const { startNBAMovesServer } = require('../src/lib/realtimeServer');

console.log('🏀 Starting NBA Moves Real-time Server...');
console.log('📡 This will monitor RSS feeds every 30 seconds');
console.log('🔄 Server will run on http://localhost:8080');
console.log('');

// Start the server
const server = startNBAMovesServer(8080);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down NBA moves server...');
  server.stop();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down NBA moves server...');
  server.stop();
  process.exit(0);
});

console.log('✅ Real-time NBA moves server is running!');
console.log('🌐 Open your web app at http://localhost:3000 to see live updates');
console.log('⏰ Checking for moves every 30 seconds...');
console.log('📰 Monitoring: Shams, Haynes, Stein, Underdog NBA');
console.log('');
console.log('Press Ctrl+C to stop the server');