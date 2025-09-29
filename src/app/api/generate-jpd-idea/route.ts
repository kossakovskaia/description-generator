import { NextRequest, NextResponse } from "next/server";
import { generateJpdIdea } from "@/app/lib/generators/jpd-idea-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea } = body;

    if (!idea) {
      return NextResponse.json(
        { error: "Missing required field: idea" },
        { status: 400 }
      );
    }

    const result = await generateJpdIdea(idea);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating JPD idea:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate JPD idea" },
      { status: 500 }
    );
  }
}
