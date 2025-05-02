import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { verifyLicenseKey, recordUsage, ADMIN_LICENSE_KEY } from "@/lib/store";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Email",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const req = await request.json();
  const license: string | undefined = request.headers
    .get("Authorization")
    ?.split("Bearer ")[1];
  const userEmail = request.headers.get("Email");

  // Check if license key is valid or if it's the admin key
  const isValidLicense = license === ADMIN_LICENSE_KEY || verifyLicenseKey(license as string);

  if (!isValidLicense) {
    return NextResponse.json(
      {
        error: "Invalid license key",
        details: "The provided license key is not valid",
      },
      {
        status: 401,
        headers: corsHeaders,
      }
    );
  }

  if (req.type === "SET_API_KEY") {
    return NextResponse.json(
      { message: "License key is valid" },
      { headers: corsHeaders }
    );
  }

  try {
    // Record usage if email is provided (for authenticated users)
    if (userEmail && license !== ADMIN_LICENSE_KEY) {
      const usageResult = recordUsage(userEmail);
      
      if (!usageResult.success) {
        return NextResponse.json(
          { 
            error: "Usage limit reached", 
            details: `You have reached your usage limit of ${usageResult.usageLimit}. Please upgrade to continue.`
          },
          { 
            status: 403, 
            headers: corsHeaders 
          }
        );
      }
    }

    let systemPrompt = `You will be provided with a ${req.src} post ${
      req.comment ? "and comments" : ""
    }. Your task is to ${
      req.comment ? "reply to the comment" : "write a comment"
    } for it based on the initial language accounting the context and emotion of the ${
      req.comment ? "comment" : "post"
    }. Make the ${
      req.comment ? "reply" : "comment"
    } short and concise. Don't forget to use the ${
      req.tone
    } tone as it was a preferred option selected by the user. Use emojis if necessary. Use easier and common words. Do not start your response with "Replying:", "quotation", or similar stuff. Only use "hashtags" when you need to and "hashtags" shouldn't be more than "one" or "two".`;

    if (req.customPrompt && req.userPrompt) {
      systemPrompt += `\n\nAdditional context and instructions: ${req.userPrompt}\nPlease consider the above additional context and instructions when generating responses, but also adhere to the core functionality of generating social media comments based on the given context and tone.`;
    }

    const userPost =
      `Posted by: ${req.actor}, Description: ${req.description}` +
      (req.comment
        ? `, Comment: ${req.comment?.description}, Commented by: ${req.comment?.name}, Commenter profile headline: ${req.comment?.headline}`
        : "");

    const result = await generateObject({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: userPost,
      schema: z.object({
        generate: z.string(),
      }),
    });

    return NextResponse.json(result.object, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: error },
      { status: 500, headers: corsHeaders }
    );
  }
}
