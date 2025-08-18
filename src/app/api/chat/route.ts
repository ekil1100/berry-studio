import { deepseek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    // 检查环境变量
    if (!process.env.DEEPSEEK_API_KEY) {
      return Response.json(
        { error: 'DEEPSEEK_API_KEY is not configured' },
        { status: 500 },
      )
    }

    const result = streamText({
      model: deepseek('deepseek-chat'),
      messages: [{ role: 'user', content: message }],
      temperature: 0.7,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)

    return Response.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 },
    )
  }
}
