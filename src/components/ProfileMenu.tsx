'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    UserCircle,
    Calendar,
    Bell,
    LogOut,
    ShieldCheck,
    ChevronRight,
    Ticket
} from 'lucide-react';

interface RegisteredEvent {
    eventId: string;
    eventName: string;
    eventDate: string;
    registeredAt: string;
}

export default function ProfileMenu() {
    const { user, profile, logout } = useAuth();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([]);
    const [remindersEnabled, setRemindersEnabled] = useState(true);

    useEffect(() => {
        // Load registered events from localStorage
        const loadRegisteredEvents = () => {
            const saved = localStorage.getItem('event_registrations');
            if (saved) {
                try {
                    const bookings = JSON.parse(saved);
                    // Sort by event date and get upcoming events
                    const upcoming = bookings
                        .filter((b: any) => new Date(b.eventDate) >= new Date())
                        .sort((a: any, b: any) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
                        .slice(0, 3);
                    setRegisteredEvents(upcoming);
                } catch (e) {
                    console.error('Error loading registered events:', e);
                }
            }
        };

        // Load reminder preference
        const reminders = localStorage.getItem('event_reminders_enabled');
        if (reminders !== null) {
            setRemindersEnabled(reminders === 'true');
        }

        loadRegisteredEvents();

        // Listen for storage changes
        window.addEventListener('storage', loadRegisteredEvents);
        return () => window.removeEventListener('storage', loadRegisteredEvents);
    }, []);

    const handleReminderToggle = (checked: boolean) => {
        setRemindersEnabled(checked);
        localStorage.setItem('event_reminders_enabled', checked.toString());
        console.log('Reminder toggle changed to:', checked);
    };

    const handleSignOut = async () => {
        console.log('Sign out clicked');
        setIsOpen(false);
        await logout();
        router.push('/');
    };

    const navigateTo = (path: string) => {
        console.log('Navigating to:', path);
        setIsOpen(false);
        router.push(path);
    };

    if (!user) return null;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <button
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 border-background shadow-md hover:border-primary/50 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
                    aria-label="Profile Menu"
                >
                    <img
                        src={profile?.photoURL || user.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        alt={profile?.displayName || user.displayName || "User"}
                        className="w-full h-full object-cover"
                    />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 glass-effect border-border/50" align="end" sideOffset={8}>
                {/* User Info Section */}
                <div className="p-4 space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-background shadow-sm flex-shrink-0">
                            <img
                                src={profile?.photoURL || user.photoURL || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="flex-grow min-w-0">
                            <h3 className="font-semibold text-sm truncate">
                                {profile?.displayName || user.displayName || 'User'}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                                {user.email}
                            </p>
                            {profile?.role === 'organizer' && (
                                <Badge variant="secondary" className="bg-primary/20 text-primary border-none px-2 py-0 text-xs mt-1">
                                    <ShieldCheck className="w-3 h-3 mr-1" />
                                    Organizer
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/30 rounded-lg p-2">
                        <Ticket className="w-4 h-4" />
                        <span>{registeredEvents.length} upcoming event{registeredEvents.length !== 1 ? 's' : ''}</span>
                    </div>
                </div>

                <Separator />

                {/* Registered Events Preview */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Upcoming Events
                        </h4>
                    </div>
                    {registeredEvents.length > 0 ? (
                        <div className="space-y-2">
                            {registeredEvents.map((event, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                                    onClick={() => navigateTo(`/profile?tab=bookings`)}
                                >
                                    <Calendar className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-medium leading-tight truncate group-hover:text-primary transition-colors">
                                            {event.eventName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(event.eventDate).toLocaleDateString(undefined, {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-20" />
                            <p className="text-xs text-muted-foreground">No upcoming events</p>
                        </div>
                    )}
                </div>

                <Separator />

                {/* Event Reminders Toggle */}
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor="reminders" className="text-sm font-medium cursor-pointer">
                                Event Reminders
                            </Label>
                        </div>
                        <Switch
                            id="reminders"
                            checked={remindersEnabled}
                            onCheckedChange={handleReminderToggle}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 ml-6">
                        Get notified about upcoming events
                    </p>
                </div>

                <Separator />

                {/* Action Buttons */}
                <div className="p-2 space-y-1">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => navigateTo('/profile')}
                    >
                        <UserCircle className="w-4 h-4 mr-2" />
                        View Full Profile
                    </Button>
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm"
                        onClick={() => navigateTo('/profile?tab=bookings')}
                    >
                        <Ticket className="w-4 h-4 mr-2" />
                        My Events
                    </Button>
                    <Separator className="my-1" />
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={handleSignOut}
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
