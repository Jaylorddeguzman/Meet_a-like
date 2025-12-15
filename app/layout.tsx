import type { Metadata } from 'next';
import { UserProvider } from '@/contexts/UserContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import AuthProvider from '@/components/AuthProvider';
import KeepAlive from '@/components/KeepAlive';
import './globals.css';

// Initialize self-ping service to prevent Render.com from sleeping
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  import('@/lib/self-ping').then(({ initializeSelfPing }) => {
    initializeSelfPing();
  });
}

export const metadata: Metadata = {
  title: 'CharacterMatch - Find Your Perfect Match',
  description: 'A unique dating app where you connect through character avatars',
  keywords: ['dating', 'social', 'character', 'match', 'connect'],
  authors: [{ name: 'CharacterMatch Team' }],
  openGraph: {
    title: 'CharacterMatch',
    description: 'Find your perfect match through characters!',
    type: 'website',
  },
};

// Optimize rendering with viewport metadata
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ThemeProvider>
            <UserProvider>
              <KeepAlive />
              {children}
            </UserProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
