'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';

interface MockAuthDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MockAuthDialog({ isOpen, onClose }: MockAuthDialogProps) {
    const { mockLogin } = useAuth();
    const [name, setName] = useState('');
    const [userType, setUserType] = useState<'student' | 'public'>('public');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mockLogin({
            displayName: name || 'Demo User',
            userType: userType,
            role: 'user', // Basic user role for both
        });
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Sign In / Register</DialogTitle>
                    <DialogDescription>
                        Choose your role to customize your experience on LocalPulse.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Vinay Kumar"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label>I am a...</Label>
                        <RadioGroup
                            value={userType}
                            onValueChange={(val) => setUserType(val as 'student' | 'public')}
                            className="flex flex-col gap-3"
                        >
                            <div className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                                <RadioGroupItem value="student" id="student" />
                                <Label htmlFor="student" className="flex-grow cursor-pointer">
                                    <span className="block font-bold">Student</span>
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        See workshops, department events & campus fests.
                                    </span>
                                </Label>
                            </div>
                            <div className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors">
                                <RadioGroupItem value="public" id="public" />
                                <Label htmlFor="public" className="flex-grow cursor-pointer">
                                    <span className="block font-bold">Regular User</span>
                                    <span className="block text-xs text-muted-foreground mt-1">
                                        See local community events, sports & culture.
                                    </span>
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full h-11 text-base">
                        Continue with Mock Login
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest font-bold">
                        Demo Mode Enabled
                    </p>
                </form>
            </DialogContent>
        </Dialog>
    );
}
