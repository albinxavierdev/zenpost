import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserData } from "@/lib/store";

export async function GET(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ 
      authenticated: false,
      user: null 
    });
  }
  
  // Get user data from our store
  const userData = getUserData(session.user);
  
  // Calculate expiration date - 30 days from now
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.user.email,
      name: session.user.name,
      image: session.user.image,
      isPremium: userData.isPremium,
      licenseKey: userData.licenseKey,
      usageCount: userData.usageCount,
      usageLimit: userData.usageLimit,
      expiresAt: expiresAt.toLocaleDateString()
    }
  });
} 