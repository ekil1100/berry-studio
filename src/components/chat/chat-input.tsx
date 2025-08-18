import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Send, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 自动调整输入框高度
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSend(message.trim())
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className='p-6'>
      <div className='flex gap-4 items-end max-w-4xl mx-auto'>
        <div className='flex-1 relative'>
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='输入消息... (Shift + Enter 换行)'
            disabled={disabled}
            className={cn(
              'min-h-14 max-h-32 resize-none text-[15px] leading-6',
              'border-2 border-border/50 focus:border-primary/50',
              'transition-all duration-200',
              'bg-white/90 backdrop-blur-sm',
              'rounded-xl px-5 py-4',
              'focus:shadow-lg focus:shadow-primary/10',
              'disabled:bg-gray-50',
            )}
          />
          {disabled && (
            <div className='absolute inset-0 bg-white/60 rounded-xl flex items-center justify-center backdrop-blur-sm'>
              <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
            </div>
          )}
        </div>

        <Button
          type='submit'
          disabled={!message.trim() || disabled}
          className={cn(
            'h-14 w-14 rounded-xl',
            'bg-gradient-to-r from-blue-500 to-blue-600',
            'hover:from-blue-600 hover:to-blue-700',
            'transition-all duration-200',
            'shadow-lg hover:shadow-xl hover:shadow-blue-500/25',
            'transform hover:scale-105 active:scale-95',
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
            'focus:ring-4 focus:ring-blue-500/20',
          )}
        >
          <Send className='h-5 w-5' />
        </Button>
      </div>

      {/* 状态提示 */}
      <div className='flex items-center justify-between mt-3 text-xs text-muted-foreground max-w-4xl mx-auto px-1'>
        <div className='flex items-center gap-2'>
          <div
            className={cn(
              'w-2 h-2 rounded-full transition-colors',
              disabled ? 'bg-yellow-500 animate-pulse' : 'bg-green-500',
            )}
          ></div>
          <span>
            {disabled ? 'AI 正在思考...' : 'DeepSeek Chat • 准备就绪'}
          </span>
        </div>
        <span className='tabular-nums'>{message.length} 字符</span>
      </div>
    </form>
  )
}
