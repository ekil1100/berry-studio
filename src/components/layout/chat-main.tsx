'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Copy, 
  RefreshCw, 
  ThumbsUp, 
  ThumbsDown, 
  Share,
  MoreVertical,
  User,
  Bot,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from '../markdown-renderer'
import { ChatInput } from './chat-input'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
  isStreaming?: boolean
  feedback?: 'positive' | 'negative'
}

// 模拟数据
const mockMessages: Message[] = [
  {
    id: '1',
    content: '帮我重新设计下目前的对话界面',
    role: 'user',
    createdAt: new Date(Date.now() - 300000)
  },
  {
    id: '2',
    content: `作为网页设计顾问，我将从UX/UI角度全面分析当前的对话界面，并提出改进建议。

## 当前界面分析

### 当前界面的优势
1. ✅ **基础功能完整** - 消息发送、接收、流式响应
2. ✅ **现代化样式** - 使用 Tailwind + ShadcnUI
3. ✅ **渐变背景** - 视觉层次丰富
4. ✅ **响应式设计** - 适配不同屏幕尺寸

### 关键问题识别

#### 1. 信息架构问题
- **单一视图限制** - 缺乏侧边栏、历史记录管理
- **上下文缺失** - 无会话标题、时间分组
- **功能发现性差** - 隐藏的快捷键、设置入口不明显

我建议采用三栏布局来解决这些问题。`,
    role: 'assistant',
    createdAt: new Date(Date.now() - 240000)
  }
]

export function ChatMain() {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
    // 可以添加 toast 提示
  }

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, feedback } : msg
    ))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const MessageItem = ({ message }: { message: Message }) => (
    <div className={cn(
      'group flex gap-4 px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors',
      message.role === 'user' && 'bg-blue-50/30 dark:bg-blue-900/10'
    )}>
      {/* 头像区域 */}
      <div className='flex-shrink-0'>
        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium',
          message.role === 'user' 
            ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
            : 'bg-gradient-to-r from-emerald-500 to-teal-600'
        )}>
          {message.role === 'user' ? (
            <User className='h-4 w-4' />
          ) : (
            <Bot className='h-4 w-4' />
          )}
        </div>
      </div>

      {/* 消息内容区域 */}
      <div className='flex-1 min-w-0'>
        {/* 消息头部 */}
        <div className='flex items-center gap-2 mb-2'>
          <span className='text-sm font-medium text-slate-800 dark:text-slate-200'>
            {message.role === 'user' ? '你' : 'Berry Studio'}
          </span>
          <span className='flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400'>
            <Clock className='h-3 w-3' />
            {formatTime(message.createdAt)}
          </span>
          {message.isStreaming && (
            <div className='flex items-center gap-1 text-xs text-blue-500'>
              <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
              正在输入...
            </div>
          )}
        </div>

        {/* 消息内容 */}
        <div className='prose prose-sm max-w-none dark:prose-invert'>
          {message.role === 'assistant' ? (
            <MarkdownRenderer 
              content={message.content}
              className='text-slate-700 dark:text-slate-300'
            />
          ) : (
            <p className='text-slate-700 dark:text-slate-300 whitespace-pre-wrap'>
              {message.content}
            </p>
          )}
        </div>

        {/* 消息操作栏 */}
        <div className='flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => handleCopy(message.content)}
            className='h-7 px-2 text-xs'
          >
            <Copy className='h-3 w-3 mr-1' />
            复制
          </Button>

          {message.role === 'assistant' && (
            <>
              <Button
                variant='ghost'
                size='sm'
                className='h-7 px-2 text-xs'
              >
                <RefreshCw className='h-3 w-3 mr-1' />
                重新生成
              </Button>

              <div className='flex items-center gap-1 ml-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleFeedback(message.id, 'positive')}
                  className={cn(
                    'h-6 w-6',
                    message.feedback === 'positive' && 'text-green-600 bg-green-50'
                  )}
                >
                  <ThumbsUp className='h-3 w-3' />
                </Button>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleFeedback(message.id, 'negative')}
                  className={cn(
                    'h-6 w-6',
                    message.feedback === 'negative' && 'text-red-600 bg-red-50'
                  )}
                >
                  <ThumbsDown className='h-3 w-3' />
                </Button>
              </div>
            </>
          )}

          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 ml-auto'
          >
            <MoreVertical className='h-3 w-3' />
          </Button>
        </div>
      </div>
    </div>
  )

  const EmptyState = () => (
    <div className='flex-1 flex flex-col items-center justify-center p-8 text-center'>
      <div className='w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4'>
        <Bot className='h-8 w-8 text-white' />
      </div>
      <h3 className='text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2'>
        开始新的对话
      </h3>
      <p className='text-slate-500 dark:text-slate-400 max-w-md mb-6'>
        我是 Berry Studio AI 助手，可以帮助您进行代码开发、设计讨论、问题解答等各种任务。
      </p>
      
      {/* 快速开始选项 */}
      <div className='grid grid-cols-2 gap-3 w-full max-w-md'>
        <Button variant='outline' className='h-auto p-4 flex flex-col items-start'>
          <span className='font-medium mb-1'>💡 创意助手</span>
          <span className='text-xs text-slate-500'>头脑风暴和创意设计</span>
        </Button>
        <Button variant='outline' className='h-auto p-4 flex flex-col items-start'>
          <span className='font-medium mb-1'>🔧 技术支持</span>
          <span className='text-xs text-slate-500'>代码调试和技术问题</span>
        </Button>
        <Button variant='outline' className='h-auto p-4 flex flex-col items-start'>
          <span className='font-medium mb-1'>📝 文案撰写</span>
          <span className='text-xs text-slate-500'>文档和内容创作</span>
        </Button>
        <Button variant='outline' className='h-auto p-4 flex flex-col items-start'>
          <span className='font-medium mb-1'>🎨 设计咨询</span>
          <span className='text-xs text-slate-500'>UI/UX 设计建议</span>
        </Button>
      </div>
    </div>
  )

  return (
    <div className='h-full flex flex-col bg-white dark:bg-slate-900'>
      {/* 消息区域 */}
      <ScrollArea className='flex-1'>
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          <div className='pb-4'>
            {messages.map(message => (
              <MessageItem key={message.id} message={message} />
            ))}
            {isLoading && (
              <div className='flex gap-4 px-6 py-4'>
                <div className='w-8 h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 flex items-center justify-center'>
                  <Bot className='h-4 w-4 text-white' />
                </div>
                <div className='flex-1'>
                  <div className='flex items-center gap-2 mb-2'>
                    <span className='text-sm font-medium text-slate-800 dark:text-slate-200'>
                      Berry Studio
                    </span>
                    <div className='flex items-center gap-1 text-xs text-blue-500'>
                      <div className='w-2 h-2 bg-blue-500 rounded-full animate-pulse'></div>
                      正在思考...
                    </div>
                  </div>
                  <div className='flex space-x-2'>
                    <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce'></div>
                    <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100'></div>
                    <div className='w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200'></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* 输入区域 */}
      <ChatInput 
        onSendMessage={(content) => {
          const newMessage: Message = {
            id: Date.now().toString(),
            content,
            role: 'user',
            createdAt: new Date()
          }
          setMessages(prev => [...prev, newMessage])
          setIsLoading(true)
          
          // 模拟AI响应
          setTimeout(() => {
            const aiMessage: Message = {
              id: (Date.now() + 1).toString(),
              content: '我收到了您的消息，这是一个模拟回复。在实际应用中，这里会连接到 DeepSeek API。',
              role: 'assistant',
              createdAt: new Date()
            }
            setMessages(prev => [...prev, aiMessage])
            setIsLoading(false)
          }, 2000)
        }}
        isLoading={isLoading}
      />
    </div>
  )
}