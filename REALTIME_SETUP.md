# 🏀 Real-Time NBA Moves Setup

## 🚀 **Quick Start**

You now have a **real-time NBA moves tracker** that monitors RSS feeds every 30 seconds!

### **1. Start Everything**
```bash
cd nba-moves-app
npm run dev:full
```

This starts:
- **Next.js app** on `http://localhost:3000` 
- **Real-time server** on `http://localhost:8080`

### **2. View the App**
Open `http://localhost:3000` in your browser to see:
- Live connection status indicator
- Real-time move notifications
- Instant updates when new moves are detected

## 📡 **Data Sources**

### **RSS Feeds (Via Nitter)**
- **Shams Charania** (@ShamsCharania) - The Athletic
- **Chris Haynes** (@ChrisBHaynes) - TNT/Bleacher Report  
- **Marc Stein** (@TheSteinLine) - NBA Reporter
- **Underdog NBA** (@underdognba) - Analytics/News
- **Zach Lowe** (@ZachLowe_NBA) - ESPN

### **Update Frequency**
- **Every 30 seconds** for maximum speed
- **Backup check** every 2 minutes
- **Instant WebSocket** updates to frontend

## 🎯 **Features**

### **Real-Time Updates**
- ✅ **Live connection** status in header
- 🚨 **Instant notifications** for new moves
- 🔔 **Browser notifications** (with permission)
- ⚡ **Sub-minute** response time

### **Move Detection**
- 🤖 **Smart parsing** of tweet text
- 🏷️ **Move type classification** (trade, signing, waiver, etc.)
- 🏀 **Team name mapping** to standardized abbreviations
- 🔍 **Duplicate detection** across sources

### **UI Indicators**
- 🟢 **"LIVE"** when connected
- 🔴 **"OFFLINE"** when disconnected  
- 🔔 **"X NEW"** badge for unread moves
- ⏰ **Last update timestamp**

## 🛠️ **Manual Commands**

### **Run Only the Real-time Server**
```bash
npm run realtime-server
```

### **Run Only the Next.js App**
```bash
npm run dev
```

### **Test Data Retrieval**
```bash
npm run test-data
```

## 📊 **Monitoring**

### **Console Output**
The real-time server provides detailed logs:
```
🏀 Starting NBA moves monitoring...
📊 Fetching from Shams Charania...
📊 Fetching from Chris Haynes...
🚨 BREAKING: 2 new NBA moves detected!
📢 LeBron James signing - Shams Charania
```

### **Connection Status**
- Monitor the **System Status** card in the app
- Check browser console for WebSocket messages
- Server logs show RSS fetch attempts

## 🔧 **How It Works**

### **Data Flow**
1. **RSS Monitor** checks feeds every 30s
2. **Pattern Matching** extracts player/team info
3. **Deduplication** removes duplicates
4. **WebSocket Broadcast** to all connected clients
5. **UI Update** with new move cards

### **Parsing Logic**
```javascript
// Detects patterns like:
"BREAKING: LeBron James traded to Miami Heat"
"Damian Lillard signs with Warriors"
"Kyle Kuzma waived by Lakers"
```

### **Fallback Strategy**
- **Primary**: Nitter RSS feeds
- **Backup**: Direct URL monitoring
- **Retry**: Exponential backoff on failures
- **Graceful**: Continues with available sources

## 🚨 **Troubleshooting**

### **No Connection**
- Check if port 8080 is available
- Restart with `npm run dev:full`
- Check browser console for errors

### **No Data**
- RSS feeds may be rate-limited
- Nitter instances may be down
- Try manual refresh button
- Check server console logs

### **Performance**
- Limit to 50 recent moves
- Efficient deduplication
- WebSocket compression
- Minimal DOM updates

## 🎯 **Next Steps**

### **Enhance Data Sources**
- Add more NBA reporters
- Integrate Underdog NBA API
- ESPN RSS feeds
- Team website monitoring

### **Advanced Features**
- Push notifications
- Historical data storage
- Trade impact analysis
- Salary cap calculations

### **Production Deployment**
- Environment variables for URLs
- Redis for session storage
- Load balancing for scale
- Error monitoring

---

**🏀 You now have a production-ready real-time NBA moves tracker that responds to breaking news in under 2 minutes!**