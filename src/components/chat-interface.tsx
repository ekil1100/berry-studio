'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Textarea } from '@/components/ui/textarea'
import { Send } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from './markdown-renderer'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: 'user',
      createdAt: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setError(null)

    // Create assistant message for streaming
    const assistantId = (Date.now() + 1).toString()
    const assistantMessage: Message = {
      id: assistantId,
      content: '',
      role: 'assistant',
      createdAt: new Date(),
    }
    
    setMessages((prev) => [...prev, assistantMessage])

    try {
      abortControllerRef.current = new AbortController()

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages.map(msg => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: userMessage.role,
              content: userMessage.content
            }
          ],
        }),
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body')
      }

      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          const trimmed = line.trim()
          
          if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
            try {
              const jsonStr = trimmed.slice(6) // Remove "data: "
              if (jsonStr === '') continue
              
              const data = JSON.parse(jsonStr)
              
              // Handle UI Message Stream format
              if (data.type === 'text-delta') {
                content += data.delta
                setMessages((prev) => 
                  prev.map(msg => 
                    msg.id === assistantId 
                      ? { ...msg, content }
                      : msg
                  )
                )
              }
            } catch (e) {
              console.warn('Failed to parse stream data:', trimmed)
            }
          }
        }
      }

      if (!content.trim()) {
        throw new Error('Empty response from API')
      }

    } catch (error) {
      console.error('Chat error:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        return // User cancelled, don't show error
      }

      setError(error instanceof Error ? error.message : 'Unknown error occurred')
      
      setMessages((prev) => 
        prev.map(msg => 
          msg.id === assistantId 
            ? { 
                ...msg, 
                content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}` 
              }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      abortControllerRef.current = null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900'>
      <Card className='flex-1 flex flex-col rounded-none border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-2xl'>
        <CardHeader className='border-b border-slate-200/60 dark:border-slate-700/60 bg-gradient-to-r from-white to-slate-50 dark:from-slate-900 dark:to-slate-800'>
          <CardTitle className='text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
            Berry Studio Chat
          </CardTitle>
        </CardHeader>

        <CardContent className='flex-1 p-0 flex flex-col'>
          <ScrollArea className='flex-1 p-6'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center space-y-6'>
                <div className='w-24 h-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg'>
                  <svg className='w-12 h-12 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z' />
                  </svg>
                </div>
                <div className='space-y-2'>
                  <h3 className='text-xl font-semibold text-slate-700 dark:text-slate-300'>开始对话</h3>
                  <p className='text-slate-500 dark:text-slate-400 max-w-md'>在下面输入消息开始与Berry Studio AI助手的对话</p>
                </div>
              </div>
            ) : (
              <div className='space-y-6 max-w-4xl mx-auto'>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex',
                      message.role === 'user' ? 'justify-end' : 'justify-start',
                    )}
                  >
                    <div className={cn(
                      'flex items-end gap-3 max-w-[75%]',
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}>
                      <div className={cn(
                        'w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-md',
                        message.role === 'user' 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      )}>
                        {message.role === 'user' ? (
                          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                          </svg>
                        ) : (
                          <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                          </svg>
                        )}
                      </div>
                      <Card className={cn(
                        'relative px-4 py-3 shadow-lg border-0',
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-200/50 dark:shadow-indigo-900/30'
                          : 'bg-white dark:bg-slate-800 shadow-slate-200/50 dark:shadow-slate-900/30 border border-slate-200/60 dark:border-slate-700/60'
                      )}>
                        <div className={cn(
                          'absolute w-3 h-3 transform rotate-45',
                          message.role === 'user' 
                            ? 'right-[-6px] top-4 bg-gradient-to-br from-indigo-500 to-purple-600' 
                            : 'left-[-6px] top-4 bg-white dark:bg-slate-800 border-l border-b border-slate-200/60 dark:border-slate-700/60'
                        )} />
                        {message.role === 'assistant' ? (
                          <MarkdownRenderer 
                            content={message.content}
                            className="break-words text-slate-700 dark:text-slate-300"
                          />
                        ) : (
                          <p className='whitespace-pre-wrap break-words text-white'>
                            {message.content}
                          </p>
                        )}
                        <p className={cn(
                          'text-xs mt-2 opacity-70',
                          message.role === 'user'
                            ? 'text-white/80'
                            : 'text-slate-500 dark:text-slate-400'
                        )}>
                          {message.createdAt.toLocaleTimeString()}
                        </p>
                      </Card>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className='flex justify-start'>
                    <div className='flex items-end gap-3 max-w-[75%]'>
                      <div className='w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md'>
                        <svg className='w-5 h-5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                        </svg>
                      </div>
                      <Card className='relative px-4 py-3 bg-white dark:bg-slate-800 shadow-lg border border-slate-200/60 dark:border-slate-700/60 shadow-slate-200/50 dark:shadow-slate-900/30'>
                        <div className='absolute w-3 h-3 transform rotate-45 left-[-6px] top-4 bg-white dark:bg-slate-800 border-l border-b border-slate-200/60 dark:border-slate-700/60' />
                        <div className='flex space-x-2 items-center'>
                          <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce' />
                          <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100' />
                          <div className='w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200' />
                          <span className='text-sm text-slate-500 dark:text-slate-400 ml-2'>AI正在思考...</span>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className='border-t border-slate-200/60 dark:border-slate-700/60 p-6 bg-gradient-to-r from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/50'>
            <form onSubmit={handleSubmit} className='max-w-4xl mx-auto'>
              <div className='relative flex items-end gap-3'>
                <div className='flex-1 relative'>
                  <Textarea
                    ref={textareaRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder='输入消息与AI助手对话...'
                    className='flex-1 min-h-[52px] max-h-[200px] resize-none pr-12 border-2 border-slate-200 dark:border-slate-700 rounded-xl shadow-md focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/30 bg-white dark:bg-slate-800 transition-all duration-200'
                    rows={1}
                    disabled={isLoading}
                  />
                  <div className='absolute right-3 bottom-3 text-xs text-slate-400 dark:text-slate-500'>
                    Enter发送 • Shift+Enter换行
                  </div>
                </div>
                <Button
                  type='submit'
                  size='icon'
                  disabled={!input.trim() || isLoading}
                  className='h-[52px] w-[52px] rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                >
                  <Send className='h-5 w-5' />
                </Button>
              </div>
              <div className='flex items-center justify-center mt-3 text-xs text-slate-400 dark:text-slate-500'>
                <div className='flex items-center gap-1'>
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    error ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-emerald-500'
                  )}></div>
                  <span>
                    {error ? 'API连接异常' : isLoading ? 'AI正在响应...' : 'Berry Studio • 基于DeepSeek技术 • 流式响应'}
                  </span>
                </div>
              </div>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
