import { Message } from './types'

export function createMessage(
  content: string,
  role: 'user' | 'assistant',
  status: Message['status'] = 'complete',
): Message {
  return {
    id: Math.random().toString(36).slice(2),
    content,
    role,
    timestamp: Date.now(),
    status,
  }
}

export function updateMessageContent(
  message: Message,
  content: string,
): Message {
  return { ...message, content }
}

export function updateMessageStatus(
  message: Message,
  status: Message['status'],
): Message {
  return { ...message, status }
}
