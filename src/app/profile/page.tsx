'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { UserCircle, Camera, Save, Trash2, Ticket as TicketIcon, School, GraduationCap, ShieldCheck, Loader2 } from 'lucide-react';
import AppFooter from '@/components/AppFooter';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import BookingHistory from '@/components/BookingHistory';
import { useSearchParams } from 'next/navigation';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProfilePage() {
    const { user, profile, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const defaultTab = searchParams.get('tab') || 'profile';

    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        interests: '',
        userType: 'public',
        college: '',
        department: '',
    });

    const [isSaving, setIsSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || '',
                bio: profile.bio || '',
                interests: profile.interests || '',
                userType: profile.userType || 'public',
                college: profile.college || '',
                department: profile.department || '',
            });
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSaving(true);
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                ...formData,
                updatedAt: new Date().toISOString()
            });
            toast({ title: "Profile Updated", description: "Your changes have been saved successfully." });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({ title: "Error", description: "Failed to save profile. Please try again.", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `profiles/${user.uid}/avatar`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, { photoURL: downloadURL });

            toast({ title: "Photo Updated", description: "Your profile picture has been updated." });
        } catch (error) {
            console.error("Error uploading photo:", error);
            toast({ title: "Upload Failed", description: "Could not upload photo.", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const requestOrganizerStatus = async () => {
        if (!user) return;
        try {
            const userRef = doc(db, "users", user.uid);
            await updateDoc(userRef, {
                role: 'organizer', // In real app, this might be 'pending_organizer'
                organizerRequestedAt: new Date().toISOString()
            });
            toast({
                title: "Status Updated",
                description: "You are now an Organizer! You can create event requests now.",
                variant: "default"
            });
        } catch (error) {
            toast({ title: "Error", description: "Failed to request status.", variant: "destructive" });
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold">Your Profile</h1>
                        {profile?.role === 'organizer' && (
                            <Badge variant="secondary" className="bg-primary/20 text-primary border-none px-4 py-1">
                                <ShieldCheck className="w-4 h-4 mr-2" /> Organizer
                            </Badge>
                        )}
                    </div>

                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8 h-12">
                            <TabsTrigger value="profile">Profile Details</TabsTrigger>
                            <TabsTrigger value="bookings" className="flex items-center">
                                <TicketIcon className="w-4 h-4 mr-2" /> My Bookings
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="profile">
                            <form onSubmit={handleSave} className="space-y-8">
                                {/* Avatar Section */}
                                <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 p-6 bg-card glass-effect rounded-2xl border border-border/50 shadow-sm">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                    <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-background shadow-md">
                                            {uploading ? (
                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                                                </div>
                                            ) : (
                                                <img
                                                    src={profile?.photoURL || user?.photoURL || "https://github.com/shadcn.png"}
                                                    alt="Profile"
                                                    className="w-full h-full object-cover"
                                                />
                                            )}
                                        </div>
                                        {!uploading && (
                                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-4 text-center sm:text-left flex-grow">
                                        <div>
                                            <h2 className="text-xl font-semibold">Profile Photo</h2>
                                            <p className="text-sm text-muted-foreground">Click on the image to update your profile photo.</p>
                                        </div>
                                        {profile?.role !== 'organizer' && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="border-primary/50 text-primary hover:bg-primary/5"
                                                onClick={requestOrganizerStatus}
                                            >
                                                Request Organizer Status
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Personal Info Section */}
                                <div className="p-6 bg-card glass-effect rounded-2xl border border-border/50 shadow-sm space-y-6">
                                    <h2 className="text-xl font-semibold flex items-center">
                                        <UserCircle className="w-5 h-5 mr-2" /> Personal Information
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="displayName">Display Name</Label>
                                            <Input
                                                id="displayName"
                                                value={formData.displayName}
                                                onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={user?.email || ''}
                                                disabled
                                                className="bg-muted/50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            rows={3}
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            placeholder="Tell us a bit about yourself..."
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="interests">Interests (comma separated)</Label>
                                        <Input
                                            id="interests"
                                            value={formData.interests}
                                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                                            placeholder="e.g. Music, Tech, Hiking"
                                        />
                                    </div>
                                </div>

                                {/* Academic Affiliation */}
                                <div className="p-6 bg-card glass-effect rounded-2xl border border-border/50 shadow-sm space-y-6">
                                    <h2 className="text-xl font-semibold flex items-center">
                                        <School className="w-5 h-5 mr-2" /> Academic Affiliation
                                    </h2>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>User Type</Label>
                                            <Select
                                                value={formData.userType}
                                                onValueChange={(val) => setFormData({ ...formData, userType: val })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="public">General Public</SelectItem>
                                                    <SelectItem value="student">Student</SelectItem>
                                                    <SelectItem value="faculty">Faculty/Staff</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {(formData.userType === 'student' || formData.userType === 'faculty') && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
                                                <div className="space-y-2">
                                                    <Label htmlFor="college">College / University</Label>
                                                    <div className="relative">
                                                        <GraduationCap className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            id="college"
                                                            className="pl-10"
                                                            placeholder="e.g. RV College of Engineering"
                                                            value={formData.college}
                                                            onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="department">Department</Label>
                                                    <Input
                                                        id="department"
                                                        placeholder="e.g. Computer Science"
                                                        value={formData.department}
                                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <Button type="submit" size="lg" disabled={isSaving} className="min-w-[150px]">
                                        {isSaving ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4 mr-2" /> Save Profile
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </TabsContent>

                        <TabsContent value="bookings">
                            <BookingHistory />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
