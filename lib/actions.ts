"use server";

import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { loadEnvConfig } from "@next/env";

if (!process.env.RESEND_API_KEY) loadEnvConfig(process.cwd());

interface ContactResponse {
  success: boolean;
  message: string;
}

export async function contact(formData: FormData): Promise<ContactResponse> {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [`${process.env.RESEND_TO_NAME} <${process.env.RESEND_TO_EMAIL}>`],
      replyTo: `${name} <${email}>`,
      subject: subject,
      text: message,
    });

    if (error || !data) {
      return {
        success: false,
        message: "Failed to send message. Please try again.",
      };
    }

    return {
      success: true,
      message: "Message sent successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
} 