import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("Poll request body:", body) // Debug log

    if (!body.operationId) {
      console.error("Missing operationId in request")
      return NextResponse.json(
        { error: "operationId is required" },
        { status: 400 }
      )
    }

    const apiResponse = await fetch("https://api.captions.ai/api/creator/poll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": "411b1003-c9fe-4eac-bc5c-3a269818ac8a",
      },
      body: JSON.stringify({
        operationId: body.operationId
      }),
    })

    const responseText = await apiResponse.text()
    console.log("API Response:", {
      status: apiResponse.status,
      headers: Object.fromEntries(apiResponse.headers),
      body: responseText
    })

    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status} - ${responseText}`)
    }

    const data = JSON.parse(responseText)
    return NextResponse.json(data)
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error("Detailed error:", {
      message: errorMessage,
      stack: errorStack
    });
    
    return NextResponse.json(
      { error: "Failed to poll video generation status", details: errorMessage },
      { status: 500 }
    );
  }
}

