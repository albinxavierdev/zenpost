import { User } from "next-auth";

// Types
export interface UserData {
  email: string;
  name?: string | null;
  usageLimit: number;
  usageCount: number;
  generatedAt: string[]; // ISO date strings
  isPremium: boolean;
  licenseKey: string; // No longer optional
}

// In-memory store - in a real app, you would use a database
const userStore: Map<string, UserData> = new Map();

// Usage limits
const FREE_USAGE_LIMIT = Infinity; // Set to Infinity for unlimited usage
const PREMIUM_USAGE_LIMIT = Infinity;

// Utility to generate a license key
export function generateLicenseKey(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  // Generate four groups of 5 characters
  for (let group = 0; group < 4; group++) {
    for (let i = 0; i < 5; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (group < 3) result += '-';
  }
  
  return result;
}

// Get or create user data
export function getUserData(user: User): UserData {
  if (!userStore.has(user.email!)) {
    const licenseKey = generateLicenseKey();
    const newUser: UserData = {
      email: user.email!,
      name: user.name,
      usageLimit: FREE_USAGE_LIMIT,
      usageCount: 0,
      generatedAt: [],
      isPremium: true, // Everyone is premium by default
      licenseKey: licenseKey
    };
    userStore.set(user.email!, newUser);
  }
  
  return userStore.get(user.email!)!;
}

// Record usage
export function recordUsage(email: string): { success: boolean, usageCount: number, usageLimit: number } {
  if (!userStore.has(email)) {
    return { success: false, usageCount: 0, usageLimit: FREE_USAGE_LIMIT };
  }
  
  const userData = userStore.get(email)!;
  
  // Always allow usage since it's unlimited
  userData.usageCount += 1;
  userData.generatedAt.push(new Date().toISOString());
  
  return { 
    success: true, 
    usageCount: userData.usageCount, 
    usageLimit: userData.usageLimit 
  };
}

// Upgrade user to premium - kept for compatibility
export function upgradeToPremium(email: string): { success: boolean, licenseKey: string } {
  if (!userStore.has(email)) {
    return { success: false, licenseKey: "" };
  }
  
  const userData = userStore.get(email)!;
  userData.isPremium = true;
  userData.usageLimit = PREMIUM_USAGE_LIMIT;
  
  return { 
    success: true, 
    licenseKey: userData.licenseKey 
  };
}

// Verify license key
export function verifyLicenseKey(licenseKey: string): boolean {
  // Find user with matching license key
  for (const userData of userStore.values()) {
    if (userData.licenseKey === licenseKey) {
      return true;
    }
  }
  
  return false;
}

// Administrator API key for testing
export const ADMIN_LICENSE_KEY = "ADMIN-REPLIER-TEST-KEY"; 