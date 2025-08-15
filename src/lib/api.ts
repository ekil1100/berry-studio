import { StreamResponse } from './types'

export class ChatAPI {
  static async sendMessage(message: string): Promise<ReadableStream<Uint8Array>> {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })

    if (!response.ok) {
      throw new Error('Failed to send message')
    }

    return response.body!
  }

  static async* streamResponse(stream: ReadableStream<Uint8Array>): AsyncGenerator<StreamResponse> {
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n').filter(line => line.trim())

        for (const line of lines) {
          // Handle different stream formats
          if (line.startsWith('0:')) {
            const data = line.slice(2)
            try {
              const parsed = JSON.parse(data)
              if (parsed.type === 'text-delta' && parsed.textDelta) {
                yield { 
                  content: parsed.textDelta, 
                  done: false 
                }
              }
            } catch {
              // Skip invalid JSON
            }
          } else if (line.startsWith('data: ')) {
            const data = line.slice(6)
            try {
              const parsed = JSON.parse(data)
              if (parsed.choices?.[0]?.delta?.content) {
                yield { 
                  content: parsed.choices[0].delta.content, 
                  done: false 
                }
              }
            } catch {
              // Skip invalid JSON
            }
          } else {
            // Try direct text content
            try {
              const parsed = JSON.parse(line)
              if (parsed.type === 'text-delta' && parsed.textDelta) {
                yield { 
                  content: parsed.textDelta, 
                  done: false 
                }
              } else if (parsed.choices?.[0]?.delta?.content) {
                yield { 
                  content: parsed.choices[0].delta.content, 
                  done: false 
                }
              }
            } catch {
              // If it's just text, yield it directly
              if (line.length > 0) {
                yield { 
                  content: line, 
                  done: false 
                }
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
  }
}