'use client'

import { useChat } from '@/hooks/use-chat'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle } from 'lucide-react'

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className='h-full flex flex-col bg-background'>
      {/* 聊天内容区域 - 可滚动 */}
      <div className='flex-1 min-h-0 relative'>
        {messages.length === 0 ? (
          <div className='absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 p-4'>
            <div className='w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center'>
              <MessageCircle className='w-8 h-8 text-primary' />
            </div>
            <div className='space-y-2'>
              <h3 className='text-lg font-semibold text-foreground'>
                开始对话
              </h3>
              <p className='text-muted-foreground max-w-md leading-relaxed text-sm'>
                在下面输入消息开始与Berry Studio AI助手的对话
              </p>
            </div>
          </div>
        ) : (
          <ScrollArea className='h-full'>
            <div className='p-4'>
              <MessageList messages={messages} />
            </div>
          </ScrollArea>
        )}
      </div>

      {/* 输入框区域 - 固定在底部 */}
      <div className='flex-shrink-0 border-t bg-card/50 backdrop-blur-sm'>
        <ChatInput onSend={sendMessage} disabled={isLoading} />
      </div>
    </div>
  )
}
