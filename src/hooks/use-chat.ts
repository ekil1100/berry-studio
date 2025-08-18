import { useState, useCallback } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Message } from '@/lib/types'
import { ChatAPI } from '@/lib/api'
import {
  createMessage,
  updateMessageContent,
  updateMessageStatus,
} from '@/lib/message-utils'

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])

  const sendMessageMutation = useMutation({
    mutationFn: ChatAPI.sendMessage,
    onSuccess: async (stream) => {
      // Create assistant message with streaming status
      const assistantMessage = createMessage('', 'assistant', 'streaming')
      setMessages((prev) => [...prev, assistantMessage])

      // Process stream
      let content = ''
      try {
        for await (const chunk of ChatAPI.streamResponse(stream)) {
          if (chunk.done) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? updateMessageStatus(msg, 'complete')
                  : msg,
              ),
            )
            break
          }

          content += chunk.content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessage.id
                ? updateMessageContent(msg, content)
                : msg,
            ),
          )
        }
      } catch (error) {
        console.error('Stream processing error:', error)
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessage.id
              ? updateMessageStatus(msg, 'error')
              : msg,
          ),
        )
      }
    },
  })

  const sendMessage = useCallback(
    (content: string) => {
      const userMessage = createMessage(content, 'user')
      setMessages((prev) => [...prev, userMessage])
      sendMessageMutation.mutate(content)
    },
    [sendMessageMutation],
  )

  return {
    messages,
    sendMessage,
    isLoading: sendMessageMutation.isPending,
  }
}
