
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AppFooter from '@/components/AppFooter';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Calendar, PlusCircle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function MyEventsPage() {
    const { user, loading: authLoading } = useAuth();
    const [activeEvents, setActiveEvents] = useState<any[]>([]);
    const [pendingRequests, setPendingRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrganizerEvents = async () => {
            if (!user) return;

            setLoading(true);
            try {
                // 1. Fetch Approved Events
                const eventsQuery = query(
                    collection(db, "events"),
                    where("organizerId", "==", user.uid)
                );

                // 2. Fetch Pending Requests
                const requestsQuery = query(
                    collection(db, "eventRequests"),
                    where("organizerId", "==", user.uid)
                );

                const [eventsSnapshot, requestsSnapshot] = await Promise.all([
                    getDocs(eventsQuery),
                    getDocs(requestsQuery)
                ]);

                const fetchedEvents = eventsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                const fetchedRequests = requestsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setActiveEvents(fetchedEvents);
                setPendingRequests(fetchedRequests);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchOrganizerEvents();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="flex flex-col min-h-screen">
                <AppHeader />
                <main className="flex-grow container mx-auto px-4 py-24 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <AppFooter />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <AppHeader />
            <main className="flex-grow container mx-auto px-4 py-24">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/organizer">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <h1 className="text-3xl font-bold">My Events</h1>
                    </div>
                    <Button asChild>
                        <Link href="/events/create">
                            <PlusCircle className="w-4 h-4 mr-2" /> Create Event
                        </Link>
                    </Button>
                </div>

                <div className="space-y-8">
                    {/* Pending Requests Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2" />
                            Pending Approval ({pendingRequests.length})
                        </h2>
                        {pendingRequests.length === 0 ? (
                            <Card className="glass-effect border-dashed">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No pending requests.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingRequests.map((req) => (
                                    <div key={req.id} className="relative group">
                                        <div className="absolute top-2 right-2 z-10">
                                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200">
                                                Pending
                                            </Badge>
                                        </div>
                                        {/* Reuse EventCard or create simple preview */}
                                        <Card className="h-full glass-effect overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="relative w-full aspect-[16/9] bg-muted">
                                                {req.imageUrl && (
                                                    <img
                                                        src={req.imageUrl}
                                                        alt={req.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-lg truncate">{req.name}</CardTitle>
                                                <CardDescription className="flex items-center mt-1">
                                                    <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                                    {req.date} at {req.time}
                                                </CardDescription>
                                            </CardHeader>
                                            <CardContent>
                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    {req.description}
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Active Events Section */}
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center">
                            <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                            Published Events ({activeEvents.length})
                        </h2>
                        {activeEvents.length === 0 ? (
                            <Card className="glass-effect border-dashed">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No published events yet.
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeEvents.map((event) => (
                                    <div key={event.id} className="relative">
                                        <div className="absolute top-2 right-2 z-10">
                                            <Badge variant="default" className="bg-green-600">
                                                Live
                                            </Badge>
                                        </div>
                                        <Card className="h-full glass-effect">
                                            <div className="relative w-full aspect-[16/9] bg-muted">
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.name}
                                                    className="w-full h-full object-cover rounded-t-xl"
                                                />
                                            </div>
                                            <CardHeader>
                                                <CardTitle className="text-lg">{event.name}</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <Button variant="outline" className="w-full" asChild>
                                                    <Link href={`/events/${event.id}`}>View Details</Link>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
