'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { 
  Send, 
  Paperclip, 
  Mic, 
  Square,
  Smile,
  Code,
  Image,
  FileText,
  Sparkles,
  ChevronUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSendMessage: (content: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showQuickActions, setShowQuickActions] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [input])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    onSendMessage(input.trim())
    setInput('')
    setShowQuickActions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  const insertText = (text: string) => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart
      const end = textareaRef.current.selectionEnd
      const newValue = input.substring(0, start) + text + input.substring(end)
      setInput(newValue)
      
      // 设置光标位置
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + text.length
          textareaRef.current.selectionEnd = start + text.length
          textareaRef.current.focus()
        }
      }, 0)
    }
  }

  const quickActions = [
    {
      icon: Code,
      label: '代码',
      action: () => insertText('```\n\n```'),
      color: 'text-blue-600'
    },
    {
      icon: Sparkles,
      label: '总结',
      action: () => insertText('请帮我总结一下：'),
      color: 'text-purple-600'
    },
    {
      icon: FileText,
      label: '解释',
      action: () => insertText('请详细解释：'),
      color: 'text-green-600'
    },
    {
      icon: Image,
      label: '分析',
      action: () => insertText('请分析：'),
      color: 'text-orange-600'
    }
  ]

  return (
    <div className='border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900'>
      {/* 快速操作栏 */}
      {showQuickActions && (
        <div className='px-4 py-3 border-b border-slate-200 dark:border-slate-700'>
          <div className='flex items-center gap-2 mb-2'>
            <span className='text-xs font-medium text-slate-500 dark:text-slate-400'>
              快速操作
            </span>
          </div>
          <div className='flex items-center gap-2'>
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant='outline'
                size='sm'
                onClick={action.action}
                className='h-8 text-xs'
              >
                <action.icon className={cn('h-3 w-3 mr-1', action.color)} />
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* 主输入区域 */}
      <div className='p-4'>
        <form onSubmit={handleSubmit}>
          <div className='relative flex items-end gap-3'>
            {/* 附件按钮 */}
            <div className='flex flex-col gap-2'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-slate-500 hover:text-slate-700'
              >
                <Paperclip className='h-4 w-4' />
              </Button>
              
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => setShowQuickActions(!showQuickActions)}
                className={cn(
                  'h-8 w-8 text-slate-500 hover:text-slate-700',
                  showQuickActions && 'text-blue-600 bg-blue-50'
                )}
              >
                <ChevronUp className={cn(
                  'h-4 w-4 transition-transform',
                  showQuickActions && 'rotate-180'
                )} />
              </Button>
            </div>

            {/* 输入框 */}
            <div className='flex-1 relative'>
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='输入消息与 AI 助手对话... (Enter 发送，Shift+Enter 换行)'
                className={cn(
                  'min-h-[48px] max-h-[120px] resize-none border-2 rounded-xl',
                  'focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30',
                  'transition-all duration-200 pr-20'
                )}
                disabled={isLoading}
              />
              
              {/* 输入框内操作按钮 */}
              <div className='absolute right-2 bottom-2 flex items-center gap-1'>
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  className='h-6 w-6 text-slate-500 hover:text-slate-700'
                >
                  <Smile className='h-3 w-3' />
                </Button>
                
                {/* 语音输入按钮 */}
                <Button
                  type='button'
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    'h-6 w-6',
                    isRecording 
                      ? 'text-red-600 bg-red-50 hover:bg-red-100' 
                      : 'text-slate-500 hover:text-slate-700'
                  )}
                >
                  {isRecording ? (
                    <Square className='h-3 w-3' />
                  ) : (
                    <Mic className='h-3 w-3' />
                  )}
                </Button>
              </div>
            </div>

            {/* 发送按钮 */}
            <Button
              type='submit'
              disabled={!input.trim() || isLoading}
              className={cn(
                'h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600',
                'hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl',
                'transform hover:scale-105 transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
              )}
            >
              <Send className='h-5 w-5' />
            </Button>
          </div>

          {/* 状态栏 */}
          <div className='flex items-center justify-between mt-3 text-xs text-slate-500 dark:text-slate-400'>
            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-1'>
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'
                )}></div>
                <span>
                  {isLoading ? 'AI 正在思考...' : 'DeepSeek Chat • 准备就绪'}
                </span>
              </div>
              
              {isRecording && (
                <div className='flex items-center gap-1 text-red-500'>
                  <div className='w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                  <span>录音中...</span>
                </div>
              )}
            </div>

            <div className='flex items-center gap-4'>
              <span>{input.length} 字符</span>
              <span>Ctrl+K 快速操作</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}