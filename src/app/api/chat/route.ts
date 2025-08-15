import { deepseek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages,
      temperature: 0.7,
      maxTokens: 2048,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    
    return Response.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}