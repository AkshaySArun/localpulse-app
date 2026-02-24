'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Receipt, Ticket as TicketIcon, ExternalLink, Bell, BellOff } from 'lucide-react';
import Ticket from './Ticket';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, getDocs, doc, updateDoc } from 'firebase/firestore';

interface Booking {
    eventId: string;
    eventName: string;
    fullName: string;
    email: string;
    phone: string;
    attendees: string;
    registeredAt: string;
    status: string;
    amount: string;
    bookingId: string;
    eventDate?: string;
    eventLocation?: string;
}

export default function BookingHistory() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
    const [isTicketOpen, setIsTicketOpen] = useState(false);
    const [reminderPrefs, setReminderPrefs] = useState<Record<string, boolean>>({});

    const { user } = useAuth();

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(db, "registrations"),
            where("userId", "==", user.uid)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedBookings = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as any[];

            setBookings(fetchedBookings.sort((a, b) =>
                (b.registeredAt?.seconds || 0) - (a.registeredAt?.seconds || 0)
            ));
        });

        return () => unsubscribe();
    }, [user]);

    const toggleReminder = async (bookingId: string) => {
        // Find the specific doc and update it
        try {
            const q = query(collection(db, "registrations"), where("bookingId", "==", bookingId));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const docRef = doc(db, "registrations", snapshot.docs[0].id);
                const current = snapshot.docs[0].data().remindersEnabled;
                await updateDoc(docRef, { remindersEnabled: !current });
            }
        } catch (e) {
            console.error("Error updating reminder", e);
        }
    };

    const viewTicket = (booking: Booking) => {
        setSelectedBooking(booking);
        setIsTicketOpen(true);
    };

    if (bookings.length === 0) {
        return (
            <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed border-muted">
                <TicketIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold">No bookings yet</h3>
                <p className="text-muted-foreground">Your booked event tickets will appear here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {bookings.map((booking, index) => (
                <Card key={booking.bookingId || index} className="overflow-hidden glass-effect border-border/50 hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <CardTitle className="text-xl">{booking.eventName}</CardTitle>
                                <CardDescription className="flex items-center mt-1">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {new Date(booking.registeredAt).toLocaleDateString()}
                                </CardDescription>
                            </div>
                            <Badge variant={booking.status === 'completed' || !booking.status ? 'default' : 'secondary'}>
                                {booking.status === 'completed' || !booking.status ? 'Confirmed' : booking.status}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full sm:w-auto">
                                <div className="text-sm">
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Attendees</p>
                                    <p className="font-medium">{booking.attendees} {parseInt(booking.attendees) > 1 ? 'People' : 'Person'}</p>
                                </div>
                                <div className="text-sm">
                                    <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider">Price Paid</p>
                                    <p className="font-medium text-primary">{booking.amount || 'Free'}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <div className="flex items-center space-x-2 bg-muted/50 px-3 py-1.5 rounded-lg border">
                                    {reminderPrefs[booking.bookingId] !== false ? (
                                        <Bell className="w-4 h-4 text-primary" />
                                    ) : (
                                        <BellOff className="w-4 h-4 text-muted-foreground" />
                                    )}
                                    <Label htmlFor={`reminder-${booking.bookingId}`} className="text-xs font-medium cursor-pointer">
                                        Reminders
                                    </Label>
                                    <Switch
                                        id={`reminder-${booking.bookingId}`}
                                        checked={reminderPrefs[booking.bookingId] !== false}
                                        onCheckedChange={() => toggleReminder(booking.bookingId)}
                                    />
                                </div>
                                <Button variant="outline" size="sm" onClick={() => viewTicket(booking)} className="flex-1 sm:flex-none">
                                    <TicketIcon className="w-4 h-4 mr-2" /> View Ticket
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => window.location.href = `/events/${booking.eventId}`} className="flex-1 sm:flex-none">
                                    <ExternalLink className="w-4 h-4 mr-2" /> Event Page
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}

            <Dialog open={isTicketOpen} onOpenChange={setIsTicketOpen}>
                <DialogContent className="sm:max-w-md p-0 bg-transparent border-none shadow-none">
                    <div className="pt-6 pb-2">
                        {selectedBooking && (
                            <Ticket
                                bookingId={selectedBooking.bookingId}
                                eventName={selectedBooking.eventName}
                                eventDate={selectedBooking.eventDate || selectedBooking.registeredAt}
                                eventLocation={selectedBooking.eventLocation || 'Event Venue'}
                                attendeeName={selectedBooking.fullName}
                                attendees={parseInt(selectedBooking.attendees)}
                                amount={selectedBooking.amount || 'Free'}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
