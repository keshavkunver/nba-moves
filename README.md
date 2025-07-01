# NBA Moves Tracker

A modern web application for tracking real-time NBA player movements, trades, and team activities.

![NBA Moves Tracker](https://img.shields.io/badge/NBA-Moves%20Tracker-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC)

## 🚀 Features

### 📊 Dashboard Overview
- **Real-time Statistics**: Total moves, trades, salary impact, and active teams
- **Interactive Cards**: Hover effects and responsive design
- **Visual Indicators**: Color-coded move types and status indicators

### 🏀 Player Movement Tracking
- **Detailed Move Cards**: Player info, team transfers, contract details
- **Move Types**: Trades, signings, waivers, releases, drafts
- **Contract Information**: Salary, years, guarantees, AAV
- **Trade Assets**: Draft picks and additional considerations
- **Source Attribution**: Reporter credits and official status

### 🏟️ Team Activity
- **Team Summary Cards**: Acquisitions, losses, and net changes
- **Salary Cap Impact**: Visual representation of financial moves
- **Recent Activity**: Latest moves for each team
- **Conference & Division**: Organized team information

### 📈 Market Insights
- **Conference Activity**: Most active conference tracking
- **Average Deal Size**: Contract value analytics
- **Trade Deadline**: Countdown and activity predictions

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **UI Components**: Custom shadcn/ui components
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Charts**: Recharts (ready for data visualization)
- **State Management**: Zustand (for future real-time features)

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and CSS variables
│   └── page.tsx           # Main dashboard page
├── components/            # React components
│   ├── ui/               # Base UI components
│   │   └── card.tsx      # Card component system
│   ├── DashboardStats.tsx # Statistics overview
│   ├── PlayerMoveCard.tsx # Individual move display
│   └── TeamActivityCard.tsx # Team activity summary
├── data/                 # Data layer
│   └── mockData.ts       # Mock NBA data for development
├── lib/                  # Utilities
│   └── utils.ts          # Helper functions
└── types/                # TypeScript definitions
    └── nba.ts            # NBA-specific type definitions
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones for trades and main actions
- **Success**: Green for signings and positive changes
- **Warning**: Orange for waivers and pending items
- **Danger**: Red for releases and negative impacts
- **Info**: Purple for draft picks and special assets

### Component Structure
- **Responsive Design**: Mobile-first approach
- **Card-based Layout**: Consistent spacing and shadows
- **Typography**: Clear hierarchy with proper contrast
- **Interactive Elements**: Hover states and smooth transitions

## 🔮 Future Enhancements

### Real-time Data Integration
- **Web Scraping**: NBA analysts' Twitter feeds
- **API Integration**: ESPN, NBA.com, The Athletic
- **WebSocket Connections**: Live updates
- **Push Notifications**: Browser alerts for major moves

### Advanced Features
- **Player Timeline**: Career movement visualization
- **Trade Analysis**: Impact assessment and projections
- **Salary Cap Tools**: Team financial tracking
- **Historical Data**: Season-over-season comparisons
- **Search & Filters**: Advanced player/team filtering
- **Export Features**: PDF reports and data exports

### Analytics Dashboard
- **Trade Networks**: Visual team relationships
- **Market Trends**: Statistical analysis
- **Prediction Models**: ML-based move predictions
- **Performance Impact**: On-court effect analysis

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nba-moves-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📝 Data Sources (Future Implementation)

### Primary Sources
- **Adrian Wojnarowski** (@wojespn) - ESPN Senior NBA Insider
- **Shams Charania** (@ShamsCharania) - The Athletic NBA Insider
- **Marc Stein** (@TheSteinLine) - NBA Reporter
- **NBA.com** - Official league announcements
- **ESPN NBA** - Trade machine and news

### Data Collection Strategy
- **Twitter API**: Real-time tweet monitoring
- **RSS Feeds**: News aggregation
- **Web Scraping**: Official team websites
- **Manual Verification**: Cross-reference multiple sources

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (recommended)
- **Husky**: Git hooks for quality checks (future)

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for NBA fans and data enthusiasts
