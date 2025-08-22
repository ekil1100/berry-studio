import { Message } from '@/lib/types'
import { MessageItem } from './message-item'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className='space-y-6 pb-8'>
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
    </div>
  )
}
