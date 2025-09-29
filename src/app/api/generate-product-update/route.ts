import { NextRequest, NextResponse } from "next/server";
import { generateProductUpdate } from "@/app/lib/generators/product-updates-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { epics } = body;

    if (!epics || !Array.isArray(epics) || epics.length === 0) {
      return NextResponse.json(
        { error: "Missing required field: epics (must be a non-empty array)" },
        { status: 400 }
      );
    }

    const result = await generateProductUpdate(epics);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Error generating product update:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate product update" },
      { status: 500 }
    );
  }
}
