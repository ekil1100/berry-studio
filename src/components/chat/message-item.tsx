import { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { MarkdownRenderer } from '@/components/markdown-renderer'

interface MessageItemProps {
  message: Message
}

// 现代流式光标组件
const StreamingCursor = () => (
  <span className='inline-flex ml-0.5'>
    <span className='w-0.5 h-4 bg-current animate-blink' />
  </span>
)

// 消息头像组件
const MessageAvatar = ({ role }: { role: 'user' | 'assistant' }) => (
  <div
    className={cn(
      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium shadow-sm',
      role === 'user'
        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
        : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
    )}
  >
    {role === 'user' ? '你' : 'AI'}
  </div>
)

export function MessageItem({ message }: MessageItemProps) {
  const isUser = message.role === 'user'
  const isStreaming = message.status === 'streaming'

  return (
    <div
      className={cn(
        'flex gap-3 w-full mb-6 group',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <MessageAvatar role={message.role} />

      <div
        className={cn(
          'flex flex-col gap-1',
          isUser ? 'items-end' : 'items-start',
        )}
      >
        <div
          className={cn(
            'max-w-[85%] sm:max-w-[75%] md:max-w-[65%] lg:max-w-[55%] xl:max-w-[45%]',
            'rounded-2xl px-5 py-4 shadow-sm',
            'transition-all duration-200 ease-in-out',
            'group-hover:shadow-md',
            isUser
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-blue-500/20 rounded-br-md'
              : 'bg-card border border-border text-card-foreground shadow-md rounded-bl-md',
          )}
        >
          <div
            className={cn(
              'prose prose-sm max-w-none break-words leading-relaxed',
              isUser ? 'prose-invert' : '',
              // 优化中文文本显示
              '[&>p]:mb-3 [&>p:last-child]:mb-0',
              '[&>*]:leading-7',
              // 改善列表和标题间距
              '[&>ul]:mb-3 [&>ol]:mb-3',
              '[&>h1]:mb-3 [&>h2]:mb-3 [&>h3]:mb-2',
              '[&>blockquote]:mb-3 [&>pre]:mb-3',
            )}
          >
            {isUser ? (
              <div className='whitespace-pre-wrap leading-7 text-[15px]'>
                {message.content}
              </div>
            ) : (
              <MarkdownRenderer content={message.content} />
            )}
            {isStreaming && <StreamingCursor />}
          </div>
        </div>

        <time className='text-xs text-muted-foreground px-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
          {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </time>
      </div>
    </div>
  )
}
