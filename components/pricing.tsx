'use client'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { upgradeToPremium } from "@/lib/store";
import { auth } from "@/auth";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface PricingProps {
  pathname?: string;
}

const pricingPlans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out",
    price: "€0",
    interval: "forever",
    features: [
      "10 AI reply generations",
      "Basic tone selection",
      "Twitter support",
    ],
    primary: false
  },
  {
    id: "pro",
    name: "Pro",
    description: "Ideal for regular users",
    price: "€5.99",
    interval: "month",
    features: [
      "500 AI reply generations",
      "Advanced tone selection",
      "Twitter and LinkedIn support",
      "Custom prompts",
      "Priority support"
    ],
    primary: true
  },
  {
    id: "unlimited",
    name: "Unlimited",
    description: "Best for power users",
    price: "€49.99",
    interval: "year",
    features: [
      "Unlimited AI reply generations",
      "All social platforms",
      "Custom prompts",
      "Advanced customization",
      "Priority support",
      "Early access to new features"
    ],
    primary: false
  }
];

export default function Pricing({ pathname }: PricingProps) {
  const currentPath = pathname || '/dashboard';
  const [upgrading, setUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setUpgrading(true);
    setSelectedPlan(planId);
    
    try {
      const session = await auth();
      if (!session?.user?.email) {
        toast({
          title: "Error",
          description: "You must be logged in to upgrade",
          variant: "destructive"
        });
        return;
      }
      
      const result = upgradeToPremium(session.user.email);
      
      if (result.success) {
        toast({
          title: "Upgrade successful!",
          description: "Your account has been upgraded successfully"
        });
        // Reload the page to show the updated status
        window.location.reload();
      } else {
        toast({
          title: "Upgrade failed",
          description: "There was a problem upgrading your account",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Upgrade failed",
        description: "There was a problem upgrading your account",
        variant: "destructive"
      });
    } finally {
      setUpgrading(false);
      setSelectedPlan(null);
    }
  };

  return (
    <Card id="pricing" className="mt-6">
      {currentPath === '/dashboard' ? (
        <CardHeader>
          <CardTitle>Upgrade Your Plan</CardTitle>
          <CardDescription>Choose the plan that best fits your needs</CardDescription>
        </CardHeader>
      ) : (
        <CardHeader className="container mx-auto px-4">
          <CardTitle className="text-3xl font-bold text-center mb-4">Choose Your Plan</CardTitle>
          <CardDescription className="text-xl text-muted-foreground text-center mb-12">
            Select the perfect plan for your social media management needs
          </CardDescription>
        </CardHeader>
      )}
      <CardContent className={cn(currentPath==='/' && "container mx-auto px-4", "grid gap-6 md:grid-cols-3")}>
        {pricingPlans.map((plan) => (
          <Card key={plan.id} className={`flex flex-col ${plan.primary ? 'border-primary' : ''}`}>
            <CardHeader>
              <CardTitle className={plan.primary ? 'text-primary' : ''}>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground"> /{plan.interval}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center">
                    <Check className={`h-4 w-4 mr-2 ${plan.primary ? 'text-primary' : 'text-green-500'}`} />
                    <span className="text-sm">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button 
                className={`w-full ${plan.primary ? 'bg-primary hover:bg-primary/90' : ''}`}
                onClick={() => handleUpgrade(plan.id)}
                disabled={upgrading}
              >
                {upgrading && selectedPlan === plan.id ? "Processing..." : `Choose ${plan.name}`}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </CardContent>
    </Card>
  )
}
