import { Box } from '@mui/material';
import { Inter } from 'next/font/google';
import { Providers } from './providers';
import { Header } from './components/Header';
import type { Metadata } from 'next';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Spark - Expense Tracker',
  description: 'Track your expenses with voice input',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 100%)',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Luxury background pattern */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.05) 0%, transparent 50%)',
              pointerEvents: 'none',
            }} />
            
            {/* Main content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
            }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Header />
                <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
                  {children}
                </Box>
              </Box>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
