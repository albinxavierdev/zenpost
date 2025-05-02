'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import License from "@/components/license";
import { useEffect, useState } from "react";

interface UserData {
  isPremium: boolean;
  licenseKey?: string;
  expiresAt?: string;
  email?: string;
  name?: string;
}

export default function Subscription() {
  const [userData, setUserData] = useState<UserData>({
    isPremium: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          setUserData({
            isPremium: data.user.isPremium,
            licenseKey: data.user.licenseKey,
            expiresAt: data.user.expiresAt,
            email: data.user.email,
            name: data.user.name
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading subscription data...</CardDescription>
        </CardHeader>
        <CardContent className="h-24 flex items-center justify-center">
          <div className="animate-pulse w-full h-4 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscription Status</CardTitle>
        <CardDescription>Your current plan and license key</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="text-green-500" />
          <span className="capitalize font-semibold">Active</span>
        </div>
        <Badge>Unlimited</Badge>
        {userData.licenseKey && <License license={userData.licenseKey} />}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Unlimited plan with no usage restrictions
        </p>
      </CardFooter>
    </Card>
  )
}
