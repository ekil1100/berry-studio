import { Message } from '@/lib/types'
import { MessageItem } from './message-item'
import { ScrollArea } from '@/components/ui/scroll-area'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <ScrollArea className='flex-1 h-full'>
      <div className='space-y-6 p-4 pb-8'>
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  )
}
