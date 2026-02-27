'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const storage = getStorage();

export default function CreateEventPage() {
  const router = useRouter();
  const { user, profile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [mapQuery, setMapQuery] = useState('Bengaluru');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    time: '',
    location: '',
    city: '',
    category: 'All',
    type: 'local',
    college: '',
    department: '',
    registrationUrl: '',
    priceType: 'free',
    price: '',
  });

  useEffect(() => {
    if (coords) {
      setMapQuery(`${coords.lat},${coords.lng}`);
    } else if (formData.location && formData.location.length > 3) {
      const timer = setTimeout(() => {
        setMapQuery(`${formData.location}, ${formData.city}`);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [coords, formData.location, formData.city]);

  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Access Denied",
        description: "Please sign in to submit event requests.",
        variant: "destructive",
      });
      router.push('/');
    }
  }, [user, authLoading, router, toast]);

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          toast({ title: "Location Detected", description: "GPS captured successfully." });
        },
        () => {
          toast({
            title: "Detection Failed",
            description: "Could not get your location.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      let imageUrl =
        'https://images.unsplash.com/photo-1540575861501-7ad05823c28b?q=80&w=2070&auto=format&fit=crop';

      if (imageFile) {
        const imageRef = ref(storage, `events/${user.uid}/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      const requestData = {
        ...formData,
        price: formData.priceType === 'paid' ? Number(formData.price) : 0,
        organizerId: user.uid,
        organizerName: profile?.displayName || user.displayName || 'Organizer',
        imageGallery: [],
        imageUrl,
        coordinates: coords,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "events"), requestData);

      toast({
        title: "Request Submitted",
        description: "Your event request has been sent for approval.",
      });

      router.push('/');
    } catch (error) {
      console.error(error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card className="glass-effect shadow-2xl border-border/50">
        <CardHeader>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Submit Event Request
          </CardTitle>
          <CardDescription>
            Submit your event for approval. Once approved, it will be visible on the platform.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Event Name */}
            <div className="space-y-2">
              <Label>Event Name</Label>
              <Input
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            {/* Category (NEW ADDED) */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                 
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Cultural">Cultural</SelectItem>
                  <SelectItem value="Music">Music</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Wellness">Wellness</SelectItem>
                  <SelectItem value="Art">Art</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* REST OF YOUR ORIGINAL CODE CONTINUES BELOW (UNCHANGED) */}

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Event Banner Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (!e.target.files || !e.target.files[0]) return;
                  const file = e.target.files[0];
                  setImageFile(file);
                  setImagePreview(URL.createObjectURL(file));
                }}
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg mt-2"
                />
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Registration URL */}
            <div className="space-y-2">
              <Label>Registration URL *</Label>
              <Input
                type="url"
                required
                value={formData.registrationUrl}
                onChange={e =>
                  setFormData({ ...formData, registrationUrl: e.target.value })
                }
              />
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Event Pricing</Label>
                <Select
                  value={formData.priceType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priceType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select pricing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.priceType === 'paid' && (
                <div className="space-y-2">
                  <Label>Event Price (₹)</Label>
                  <Input
  type="text"
  inputMode="numeric"
  pattern="[0-9]*"
  value={formData.price}
  onChange={(e) => {
    const value = e.target.value;

    // Allow only numbers
    if (/^\d*$/.test(value)) {
      setFormData({ ...formData, price: value });
    }
  }}
  placeholder="Enter price (0 for Free)"
/>
                </div>
              )}
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-6">
              <Label>Date & Time</Label>
              <Label>   </Label>
              <Input
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
              />
              <Input
                type="time"
                required
                value={formData.time}
                onChange={e => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            {/* Location */}
            <Label>Event location</Label>
            <Input
              required
              placeholder="City"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
            />

            <div className="flex gap-2">
              <Input
                required
                placeholder="Venue"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
              />
              <Button type="button" onClick={detectLocation}>
                <MapPin className="h-4 w-4 mr-2" /> Detect
              </Button>
            </div>

            {/* Map Preview */}
            <div className="w-full h-64 rounded-xl overflow-hidden border">
              <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`}
              ></iframe>
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                Submit Request
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  );
}