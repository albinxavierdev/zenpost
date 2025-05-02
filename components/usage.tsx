'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

export default function Usage() {
  const [usageData, setUsageData] = useState({
    usageCount: 0,
    usageLimit: Infinity,
    usagePercentage: 0
  });
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.authenticated && data.user) {
          const usageCount = data.user.usageCount;
          
          setUsageData({
            usageCount,
            usageLimit: Infinity,
            usagePercentage: 0
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
          <CardTitle>Usage</CardTitle>
          <CardDescription>Loading usage data...</CardDescription>
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
        <CardTitle>Usage</CardTitle>
        <CardDescription>Total posts replied</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-2">
          {usageData.usageCount} <span className="text-muted-foreground text-sm">(Unlimited)</span>
        </div>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          You have unlimited usage with no restrictions
        </p>
      </CardFooter>
    </Card>
  )
}
