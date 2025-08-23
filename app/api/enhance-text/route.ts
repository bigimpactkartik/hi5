import { type NextRequest, NextResponse } from "next/server"

const GEMINI_API_KEY = "AIzaSyD6UjOYoAg1Qu-bKbNN-mWR9ZWIvsy4_VE"

export async function POST(request: NextRequest) {
  try {
    const { text, type } = await request.json()

    if (!text || !type) {
      console.error("[v0] Missing required fields:", { text, type })
      return NextResponse.json({ error: "Missing text or type" }, { status: 400 })
    }

    const isPositive = type === "loved" || type === "liked"
    const prompt = isPositive
      ? `Enhance this positive review to make it more articulate, professional, and polished, while keeping the original sentiment intact. Return only one improved version, not multiple options:\n\n"${text}"`
      : `Enhance this feedback to make it more constructive, actionable, and professional, while keeping the original concerns intact. Return only one improved version, not multiple options:\n\n"${text}"`

    console.log("[v0] Making Gemini API request with prompt:", prompt)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      },
    )

    console.log("[v0] Gemini API response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Gemini API error response:", errorText)
      return NextResponse.json({ enhancedText: text })
    }

    const data = await response.json()
    console.log("[v0] Gemini API response data:", JSON.stringify(data, null, 2))

    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text || text
    console.log("[v0] Enhanced text:", enhancedText)

    return NextResponse.json({ enhancedText })
  } catch (error) {
    console.error("[v0] Enhancement error:", error)
    const { text } = await request.json().catch(() => ({ text: "Unable to enhance feedback" }))
    return NextResponse.json({ enhancedText: text })
  }
}
