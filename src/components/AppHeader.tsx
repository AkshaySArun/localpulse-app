
'use client';
import type { FC } from 'react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import { Home, UserCircle, LayoutDashboard, Settings, PlusCircle, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { SignedIn, SignedOut, useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import SettingsPanel from './SettingsPanel';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { useEffect, useMemo } from 'react';
import ProfileMenu from './ProfileMenu';

interface NavItem {
  href: string;
  label: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  ariaLabel: string;
  protected?: boolean;
}

const mainNavItems: NavItem[] = [
  { href: '/', label: 'Home', icon: Home, ariaLabel: 'Go to Home page' },
  { href: '/profile', label: 'Profile', icon: UserCircle, ariaLabel: 'Go to Profile page', protected: true },
  { href: '/organizer', label: 'Dashboard', icon: LayoutDashboard, ariaLabel: 'Go to Organizer Dashboard', protected: true },
];

interface AppHeaderProps {
  onOpenCreateEventModal?: () => void;
}

const AppHeader: FC<AppHeaderProps> = ({ onOpenCreateEventModal }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);

  useEffect(() => {
    const checkUpcoming = () => {
      const saved = localStorage.getItem('event_registrations');
      if (!saved) {
        setUpcomingEvents([]);
        return;
      }
      try {
        const bookings = JSON.parse(saved);
        const now = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(now.getDate() + 2); // Next 48 hours

        const upcoming = bookings.filter((b: any) => {
          const d = new Date(b.eventDate);
          return d >= now && d <= tomorrow;
        });
        setUpcomingEvents(upcoming);
      } catch (e) {
        setUpcomingEvents([]);
      }
    };

    checkUpcoming();
    window.addEventListener('storage', checkUpcoming);
    return () => window.removeEventListener('storage', checkUpcoming);
  }, []);

  if (!user) {
    // With Clerk, SignInButton handles redirection implicitly by its configuration or wrapper,
    // but since we want to trigger it programmatically or via a redirect, we'll let the SignedOut UI handle sign-ins.
    // Or we can use router to push to a sign in page if we had one.
    // For this case, we rely on the SignInButton in the UI.
  } else {
    if (onOpenCreateEventModal) {
      onOpenCreateEventModal();
    } else {
      router.push('/events/create');
    }
  }


  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="text-2xl font-semibold tracking-tight text-foreground whitespace-nowrap">
            Local Pulse
          </Link>

          <nav className="flex-grow flex justify-center items-center space-x-1 sm:space-x-2">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              const linkContent = (
                <div
                  aria-label={item.ariaLabel}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-xl w-20 h-16 transition-all text-xs sm:text-sm cursor-pointer",
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 sm:h-6 sm:w-6 mb-0.5", isActive ? "text-primary" : "")} />
                  <span className="font-medium">{item.label}</span>
                </div>
              );

              if (item.protected) {
                return (
                  <SignedIn key={item.label}>
                    <Link href={item.href} passHref legacyBehavior={false}>
                      {linkContent}
                    </Link>
                  </SignedIn>
                );
              }
              return (
                <Link key={item.label} href={item.href} passHref legacyBehavior={false}>
                  {linkContent}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-1 sm:space-x-2">
            <SignedIn>
              <Button variant="default" size="sm" className="rounded-full px-3 py-1 text-sm shadow-md hidden sm:flex" onClick={handleCreateEventClick}>
                <PlusCircle className="h-4 w-4 mr-1 sm:mr-1.5" /> Create
              </Button>
              <ProfileMenu />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" size="sm" className="rounded-full px-3 py-1.5 text-sm shadow-md">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" size="sm" className="rounded-full px-3 py-1.5 text-sm shadow-md ml-2 hidden sm:inline-flex">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
            {/* "Create Event" button visible on mobile when signed in, if above is hidden by sm:flex */}
            <SignedIn>
              <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-sm sm:hidden" onClick={handleCreateEventClick} aria-label="Create Event">
                <PlusCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </SignedIn>

            <SignedIn>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-sm relative"
                    aria-label="Notifications"
                  >
                    <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    {upcomingEvents.length > 0 && (
                      <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-[10px] bg-red-500 border-2 border-background">
                        {upcomingEvents.length}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0 glass-effect border-border/50" align="end">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-sm">Upcoming Events</h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {upcomingEvents.length > 0 ? (
                      <div className="py-2">
                        {upcomingEvents.map((event, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0 cursor-pointer"
                            onClick={() => router.push(`/profile?tab=bookings`)}
                          >
                            <p className="text-sm font-medium leading-none mb-1">{event.eventName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.eventDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                        <p className="text-sm text-muted-foreground">No upcoming events</p>
                      </div>
                    )}
                  </div>
                  {upcomingEvents.length > 0 && (
                    <div className="p-2 bg-muted/30 border-t">
                      <Button variant="ghost" size="sm" className="w-full text-xs" onClick={() => router.push('/profile?tab=bookings')}>
                        View All Bookings
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </SignedIn>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-9 h-9 sm:w-10 sm:h-10 shadow-sm"
              aria-label="Settings"
              onClick={() => setIsSettingsPanelOpen(true)}
            >
              <Settings className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} />
    </>
  );
};

export default AppHeader;
