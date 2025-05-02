'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoIcon } from "lucide-react";
import { useState, useEffect } from "react";
import License from "@/components/license";

export default function Portal() {
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user license key
    const fetchLicenseKey = async () => {
      try {
        const response = await fetch('/api/user');
        const data = await response.json();
        
        if (data.authenticated && data.user && data.user.licenseKey) {
          setLicenseKey(data.user.licenseKey);
        }
      } catch (error) {
        console.error('Error fetching license key:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLicenseKey();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse h-10 bg-gray-200 rounded w-full"></div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your License Key</CardTitle>
        <CardDescription>Use this key for API access</CardDescription>
      </CardHeader>
      <CardContent>
        {licenseKey ? (
          <License license={licenseKey} />
        ) : (
          <div className="flex items-center text-yellow-600">
            <InfoIcon className="h-4 w-4 mr-2" />
            <span>License key not available</span>
          </div>
        )}
        <p className="mt-4 text-sm text-muted-foreground">
          You can use this license key to access the API directly.
        </p>
      </CardContent>
    </Card>
  )
}
