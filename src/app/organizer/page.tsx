
'use client';

import type { NextPage } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const OrganizerDashboardPage: NextPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="glass-effect">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">Organizer Dashboard</CardTitle>
          <CardDescription>Manage your events and view registrations.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            Welcome to your dashboard. This area is for event organizers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>My Events</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and manage events you have created.</p>
                <Button className="mt-4" variant="outline" asChild>
                  <Link href="/organizer/events">View My Events</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle>Create New Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Start by creating a new event for the community.</p>
                <Button className="mt-4" asChild>
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-effect border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  Admin: Review Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Approve or reject event submissions from the community.</p>
                <Button className="mt-4" variant="default" asChild>
                  <Link href="/admin/requests">Review Pending Requests</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Registrations Overview</h3>
            <p className="text-sm text-muted-foreground">Analytics and registration data will be displayed here.</p>
            {/* Placeholder for charts or stats */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerDashboardPage;
