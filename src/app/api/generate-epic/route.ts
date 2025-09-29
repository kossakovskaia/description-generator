import { NextRequest, NextResponse } from "next/server";
import { generateEpic } from "@/app/lib/generators/epic-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { idea, overview, organizations, environments, json, model, temperature } = body;

    if (!idea || !overview) {
      return NextResponse.json(
        { error: "Missing required fields: idea and overview" },
        { status: 400 }
      );
    }

    const result = await generateEpic({
      idea,
      overview,
      organizations: organizations || [],
      environments: environments || [],
      json: json || false,
      model,
      temperature,
    });

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating epic:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate epic" },
      { status: 500 }
    );
  }
}
