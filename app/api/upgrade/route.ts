import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { upgradeToPremium } from "@/lib/store";

export async function POST(request: NextRequest) {
  const session = await auth();
  
  if (!session?.user) {
    return NextResponse.json({ 
      success: false, 
      message: "You must be logged in to upgrade"
    }, { status: 401 });
  }
  
  // Upgrade user to premium
  if (!session.user.email) {
    return NextResponse.json({ 
      success: false, 
      message: "User email is required" 
    }, { status: 400 });
  }
  
  const result = upgradeToPremium(session.user.email);
  
  if (result.success) {
    return NextResponse.json({
      success: true,
      licenseKey: result.licenseKey
    });
  } else {
    return NextResponse.json({
      success: false,
      message: "Failed to upgrade account"
    }, { status: 500 });
  }
} 