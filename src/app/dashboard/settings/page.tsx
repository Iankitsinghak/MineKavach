
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAddressFromCoordinates } from '@/ai/tools/geocoding-tool';

interface OnboardingData {
    mineName?: string;
    location?: string;
    mineType?: string;
    mineSize?: string;
}


export default function SettingsPage() {
    const [mineInfo, setMineInfo] = useState<OnboardingData>({});
    const [mineType, setMineType] = useState<string | undefined>();
    const [isLocating, setIsLocating] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const onboardingDataString = localStorage.getItem('onboardingData');
        if (onboardingDataString) {
            try {
                const data = JSON.parse(onboardingDataString);
                setMineInfo({
                    mineName: data.mineName || 'N/A',
                    location: data.location || 'N/A',
                    mineType: data.mineType || 'N/A',
                    mineSize: data.mineSize || 'N/A',
                });
                setMineType(data.mineType);
            } catch (error) {
                console.error("Failed to parse onboarding data:", error);
            }
        }
    }, []);

    const handleAutoLocate = () => {
        if (!navigator.geolocation) {
            toast({
                variant: 'destructive',
                title: 'Geolocation Not Supported',
                description: 'Your browser does not support geolocation.',
            });
            return;
        }

        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const coords = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
                setMineInfo(prev => ({...prev, location: coords}));
                
                try {
                    const address = await getAddressFromCoordinates({ latitude, longitude });
                    // Assuming there's a pinCode field to update
                    // setMineInfo(prev => ({...prev, pinCode: address.pinCode}));
                    toast({
                        title: 'Location Found',
                        description: `Set to: ${coords}.`,
                    });
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Could not fetch Address Details',
                        description: 'Location set, but address details failed.',
                    });
                } finally {
                    setIsLocating(false);
                }
            },
            (error) => {
                setIsLocating(false);
                toast({
                    variant: 'destructive',
                    title: 'Geolocation Error',
                    description: 'Could not retrieve your location. Please enter it manually.',
                });
                console.error('Geolocation Error:', error);
            }
        );
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setMineInfo(prev => ({...prev, [id]: value}));
    }


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>Manage your account and application preferences.</CardDescription>
        </CardHeader>
      </Card>

        <Card>
            <CardHeader>
                <CardTitle>Mine Information</CardTitle>
                <CardDescription>Details about your mining operation.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="mineName">Mine Name</Label>
                    <Input id="mineName" value={mineInfo.mineName || ''} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                        <Input id="location" value={mineInfo.location || ''} onChange={handleInputChange} />
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleAutoLocate}
                            disabled={isLocating}
                            aria-label="Auto-locate"
                        >
                            {isLocating ? <Loader2 className="animate-spin" /> : <MapPin />}
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mineType">Mine Type</Label>
                         <Select value={mineType} onValueChange={setMineType}>
                            <SelectTrigger id="mineType">
                                <SelectValue placeholder="Select mine type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="iron_ore">Iron Ore</SelectItem>
                                <SelectItem value="coal">Coal</SelectItem>
                                <SelectItem value="gold">Gold</SelectItem>
                                <SelectItem value="copper">Copper</SelectItem>
                                <SelectItem value="diamond">Diamond</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mineSize">Mine Size</Label>
                        <Input id="mineSize" value={mineInfo.mineSize || ''} onChange={handleInputChange} />
                    </div>
                </div>
            </CardContent>
        </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue="Mine Operator" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="operator@mine.com" />
          </div>
           <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" type="tel" defaultValue="+1234567890" />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>How you would like to be notified.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
              <span>SMS Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive critical alerts via text message.
              </span>
            </Label>
            <Switch id="sms-notifications" defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive alerts and reports via email.
              </span>
            </Label>
            <Switch id="email-notifications" defaultChecked />
          </div>
          <div className="space-y-2">
            <Label>Email Reporting Frequency</Label>
            <Select defaultValue="daily">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="never">Never</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Change your password.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input id="current-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input id="new-password" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input id="confirm-password" type="password" />
          </div>
        </CardContent>
      </Card>

       <div className="flex justify-end">
            <Button>Save Changes</Button>
        </div>
    </div>
  );
}

    