'use client'

import { useChat } from '@/hooks/use-chat'
import { MessageList } from './message-list'
import { ChatInput } from './chat-input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className='flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4'>
      <Card className='flex-1 flex flex-col max-w-6xl mx-auto rounded-xl border border-slate-200/60 bg-white/90 backdrop-blur-sm shadow-2xl'>
        <CardHeader className='border-b border-slate-200/60 bg-gradient-to-r from-white to-slate-50 px-8 py-6'>
          <CardTitle className='text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text text-transparent'>
            Berry Studio Chat
          </CardTitle>
        </CardHeader>

        <CardContent className='flex-1 p-0 flex flex-col min-h-0'>
          <div className='flex-1 min-h-0 px-6 py-4'>
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center space-y-6'>
                <div className='w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg'>
                  <svg
                    className='w-10 h-10 text-white'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={1.5}
                      d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
                    />
                  </svg>
                </div>
                <div className='space-y-3'>
                  <h3 className='text-lg font-semibold text-slate-700'>
                    开始对话
                  </h3>
                  <p className='text-slate-500 max-w-md leading-relaxed'>
                    在下面输入消息开始与Berry Studio AI助手的对话
                  </p>
                </div>
              </div>
            ) : (
              <MessageList messages={messages} />
            )}
          </div>

          <div className='flex-shrink-0 border-t border-slate-200/60 bg-gradient-to-r from-white to-slate-50/50'>
            <ChatInput onSend={sendMessage} disabled={isLoading} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
