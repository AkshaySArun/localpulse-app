'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Bell } from 'lucide-react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

interface Booking {
    eventId: string;
    eventName: string;
    eventDate: string;
    bookingId: string;
    remindersEnabled?: boolean;
}

export default function EventReminderManager() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [lastChecked, setLastChecked] = useState(0);

    useEffect(() => {
        const checkReminders = async () => {
            if (!user) return;
            const now = new Date();

            // Only check once every 5 minutes
            if (Date.now() - lastChecked < 300000) return;
            setLastChecked(Date.now());

            try {
                const q = query(
                    collection(db, "registrations"),
                    where("userId", "==", user.uid)
                );

                const snapshot = await getDocs(q);
                const bookings = snapshot.docs.map(doc => doc.data() as Booking);
                const dismissed = JSON.parse(localStorage.getItem('dismissed_reminders') || '[]');

                bookings.forEach(booking => {
                    if (dismissed.includes(booking.bookingId)) return;
                    if (booking.remindersEnabled === false) return;

                    const eventDate = new Date(booking.eventDate);
                    const diffTime = eventDate.getTime() - now.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    if (diffDays >= 0 && diffDays <= 1) {
                        const message = diffDays === 0
                            ? `Reminder: ${booking.eventName} is happening today!`
                            : `Reminder: ${booking.eventName} is happening tomorrow!`;

                        toast({
                            title: "Upcoming Event",
                            description: message,
                            action: <Bell className="h-4 w-4 text-primary" />,
                        });

                        const newDismissed = [...dismissed, booking.bookingId];
                        localStorage.setItem('dismissed_reminders', JSON.stringify(newDismissed));
                    }
                });
            } catch (e) {
                console.error('Failed to process reminders', e);
            }
        };

        checkReminders();
    }, [user, lastChecked, toast]);

    return null;
}
