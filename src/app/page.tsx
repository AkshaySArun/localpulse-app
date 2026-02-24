'use client';

import { useState, useMemo, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import FeaturedEventCarousel from '@/components/FeaturedEventCarousel';
import SearchBar from '@/components/SearchBar';
import NearbyEventsSection from '@/components/NearbyEventsSection';
import EventList from '@/components/EventList';
import AppFooter from '@/components/AppFooter';
import type { Event, City } from '@/types';

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { MOCK_EVENTS } from '@/lib/mockData';

const AVAILABLE_LOCATIONS: City[] = [
    { id: 'all', name: 'All Locations' },
    { id: 'bengaluru', name: 'Bengaluru' },
    { id: 'mysuru', name: 'Mysuru' },
    { id: 'mangaluru', name: 'Mangaluru' },
    { id: 'mumbai', name: 'Mumbai' },
    { id: 'delhi', name: 'Delhi' },
    { id: 'chennai', name: 'Chennai' },
    { id: 'hyderabad', name: 'Hyderabad' },
    { id: 'kolkata', name: 'Kolkata' },
    { id: 'pune', name: 'Pune' },
    { id: 'hampi', name: 'Hampi' },
    { id: 'hubli', name: 'Hubballi' },
];

const AVAILABLE_CATEGORIES = ['Technology', 'Cultural', 'Music', 'Food', 'Sports', 'Wellness', 'Art'];

export default function Home() {
    const { user, profile } = useAuth();
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedQuery, setSuggestedQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
    const [selectedRating, setSelectedRating] = useState<string | null>(null);
    const [isLocating, setIsLocating] = useState(false);
    const { toast } = useToast();

    // Fetch Events from Firestore
    useEffect(() => {
        const eventsQuery = query(
            collection(db, "events"),
            where("status", "==", "approved")
        );

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            if (snapshot.empty) {
                setEvents(MOCK_EVENTS);
            } else {
                const fetchedEvents = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Event[];
                setEvents(fetchedEvents);
            }
            setLoading(false);
        }, (error) => {
            console.error("Firestore error, using mock data:", error);
            setEvents(MOCK_EVENTS);
            setLoading(false);
        });

        // Safety timeout: If Firebase takes too long to respond, use mock data
        const timeoutId = setTimeout(() => {
            if (loading) {
                console.warn("Firebase response timed out, using mock data");
                setEvents(MOCK_EVENTS);
                setLoading(false);
            }
        }, 3000);

        return () => {
            unsubscribe();
            clearTimeout(timeoutId);
        };
    }, [loading]);


    // Filter Logic including Access Control
    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            // --- ACCESS CONTROL START ---
            // College events: only visible to students from that college
            if (event.type === 'college') {
                if (!profile || profile.college !== event.college) return false;
            }
            // Department events: only visible to students from that college AND department
            if (event.type === 'department') {
                if (!profile || profile.college !== event.college || profile.department !== event.department) return false;
            }
            // Local events: visible to everyone
            // --- ACCESS CONTROL END ---

            // Search
            const matchesSearch =
                event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.city.toLowerCase().includes(searchQuery.toLowerCase());

            if (!matchesSearch) return false;

            // Category
            if (selectedCategory && event.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;

            // Location
            if (selectedLocation && selectedLocation !== 'all') {
                const locationName = AVAILABLE_LOCATIONS.find(l => l.id === selectedLocation)?.name;
                if (locationName && event.city !== locationName) return false;
            }

            // Rating
            if (selectedRating && selectedRating !== 'all') {
                const minRating = parseInt(selectedRating);
                if ((event.rating || 0) < minRating) return false;
            }

            return true;
        });
    }, [events, profile, searchQuery, selectedCategory, selectedLocation, selectedRating]);

    const handleEventClick = (eventId: string) => {
        // Navigate to event details
        window.location.href = `/events/${eventId}`;
    };

    const handleApplyFilters = () => {
        // Determine if we need to do anything specific on "Apply" or if reactive state is enough
        console.log("Filters applied");
    };

    const handleDetectLocation = () => {
        if ("geolocation" in navigator) {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                console.log(`Detected: ${latitude}, ${longitude}`);

                // Simulate processing delay clearly
                setTimeout(() => {
                    setSelectedLocation('bengaluru');
                    setIsLocating(false);
                    toast({
                        title: "Location Detected",
                        description: "Showing events near Bengaluru",
                    });
                }, 1000);

            }, (error) => {
                console.error("Location error", error);
                setIsLocating(false);
                toast({
                    title: "Access Denied",
                    description: "Could not detect location. Please enable location permissions.",
                    variant: "destructive"
                });
            });
        } else {
            toast({
                title: "Not Supported",
                description: "Geolocation is not available in your browser.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Featured Carousel */}
            <div className="container mx-auto px-4 pt-4">
                <FeaturedEventCarousel
                    events={filteredEvents.slice(0, 3)}
                    onEventClick={handleEventClick}
                />
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 pb-12 space-y-8">

                {/* Search & Filter Bar */}
                <section>
                    <SearchBar
                        searchQuery={searchQuery}
                        onSearchQueryChange={setSearchQuery}
                        suggestedQuery={suggestedQuery}
                        onSuggestedQueryChange={setSuggestedQuery}
                        selectedCategoryFilter={selectedCategory}
                        onCategoryFilterChange={setSelectedCategory}
                        availableCategories={AVAILABLE_CATEGORIES}
                        selectedDateFilter={selectedDate}
                        onDateFilterChange={setSelectedDate}
                        selectedLocationFilter={selectedLocation}
                        onLocationFilterChange={setSelectedLocation}
                        availableLocations={AVAILABLE_LOCATIONS}
                        selectedRatingFilter={selectedRating}
                        onRatingFilterChange={setSelectedRating}
                        onApplyFilters={handleApplyFilters}
                        onDetectLocation={handleDetectLocation}
                        isLocating={isLocating}
                        allEvents={events}
                    />
                </section>

                {/* Nearby Events */}
                <NearbyEventsSection onEventClick={handleEventClick} />

                {/* All Events List */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">
                            {searchQuery ? 'Search Results' : 'All Events'}
                        </h2>
                        <span className="text-sm text-muted-foreground">
                            {filteredEvents.length} events found
                        </span>
                    </div>
                    <EventList
                        events={filteredEvents}
                        isLoading={loading}
                        onEventClick={handleEventClick}
                    />
                </section>
            </div>

            <AppFooter />
        </div>
    );
}
