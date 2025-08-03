'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { MarkdownRenderer } from '@/components/markdown-renderer'
import { api } from '@/trpc/client'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  
  const sendMessage = api.chat.sendMessage.useMutation({
    onSuccess: (response) => {
      setMessages(prev => [...prev, response])
    },
  })

  const handleSend = () => {
    if (!input.trim()) return
    
    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    
    sendMessage.mutate({
      messages,
      prompt: input,
    })
    
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b p-4">
        <h1 className="text-2xl font-bold">Berry Studio</h1>
        <ThemeToggle />
      </header>
      
      <ScrollArea className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <MarkdownRenderer content={message.content} />
              </div>
            </div>
          ))}
          {sendMessage.isPending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-muted p-3">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/50" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 animation-delay-200" />
                  <div className="h-2 w-2 animate-pulse rounded-full bg-foreground/50 animation-delay-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-3xl gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={sendMessage.isPending}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={sendMessage.isPending || !input.trim()}
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  )
}