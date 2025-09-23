
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface OnboardingData {
    mineName?: string;
    location?: string;
    mineType?: string;
    mineSize?: string;
}


export default function SettingsPage() {
    const [mineInfo, setMineInfo] = useState<OnboardingData>({});

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
            } catch (error) {
                console.error("Failed to parse onboarding data:", error);
            }
        }
    }, []);


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
                    <Input id="mineName" defaultValue={mineInfo.mineName} readOnly />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="mineLocation">Location</Label>
                    <Input id="mineLocation" defaultValue={mineInfo.location} readOnly />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="mineType">Mine Type</Label>
                        <Input id="mineType" defaultValue={mineInfo.mineType} readOnly />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mineSize">Mine Size</Label>
                        <Input id="mineSize" defaultValue={mineInfo.mineSize} readOnly />
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
