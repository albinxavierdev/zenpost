import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generate a formatted license key (replaces the Stripe-based function)
export function formatAsLicenseKey(str: string): string {
  // Base64 encode
  const encoded = btoa(str);
  
  // Split entire string into chunks of 4
  const chunks = encoded.match(/.{1,4}/g) || [];
  
  return chunks.join("-");
}

// Decode a license key (replaces the Stripe-based function)
export function decodeLicenseKey(licenseKey: string): string {
  // Remove dashes and decode
  return atob(licenseKey.replace(/-/g, ""));
}
