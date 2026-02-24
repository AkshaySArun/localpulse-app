import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from '@/components/ThemeProvider';
import AppHeader from '@/components/AppHeader';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';
import EventReminderManager from '@/components/EventReminderManager';
import { AuthProvider } from '@/context/AuthContext';
import GoogleAnalytics from '@/components/GoogleAnalytics';


export const metadata: Metadata = {
  title: 'Local Pulse',
  description: 'Discover local events in Karnataka with Local Pulse',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Local Pulse',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(var(--background))' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(var(--background))' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};


import { ClerkProvider } from '@/lib/clerk-auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        <AuthProvider>
          <ClerkProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <div className="min-h-screen flex flex-col">
                <AppHeader />
                <main className="flex-grow pt-20">
                  {children}
                </main>
              </div>
              <Toaster />
              <ServiceWorkerRegistration />
              <EventReminderManager />
            </ThemeProvider>
          </ClerkProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

