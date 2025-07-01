import './globals.css'

export const metadata = {
  title: 'NBA Moves - Real-Time Player Movement Tracker',
  description: 'Track NBA player trades, signings, and movement in real-time from top basketball reporters',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
