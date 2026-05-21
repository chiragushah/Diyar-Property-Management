"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")

export async function askAI(prompt: string) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is not set. AI features will be limited.")
      return "AI service is currently unavailable. Please set the GEMINI_API_KEY in your environment variables."
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error("AI Error:", error)
    return "Error communicating with AI service. Check your API key and network connection."
  }
}

export async function analyzeMaintenanceUrgency(description: string) {
  const prompt = `Analyze this maintenance request and determine its priority (LOW, MEDIUM, HIGH, URGENT).
  Description: "${description}"
  Return only the priority level in uppercase.`

  return await askAI(prompt)
}

export async function scoreLead(data: any) {
  const prompt = `Score this property lead from 1 to 100 based on conversion potential.
  Data: ${JSON.stringify(data)}
  Return only a JSON object like {"score": 85, "summary": "Highly motivated, looking to move within 2 weeks"}.`

  const response = await askAI(prompt)
  try {
    // Basic cleanup in case AI adds markdown
    const jsonStr = response.replace(/```json/g, "").replace(/```/g, "").trim()
    return JSON.parse(jsonStr)
  } catch {
    return { score: 50, summary: "Could not analyze lead." }
  }
}
