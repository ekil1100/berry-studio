'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  Trash2, 
  MoreVertical,
  Pin,
  Archive
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatSession {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  isPinned?: boolean
  messageCount: number
}

// 模拟数据
const mockSessions: ChatSession[] = [
  {
    id: '1',
    title: '网页设计重构讨论',
    lastMessage: '帮我重新设计下目前的对话界面',
    timestamp: new Date(),
    isPinned: true,
    messageCount: 23
  },
  {
    id: '2', 
    title: 'DeepSeek API 集成',
    lastMessage: '通过 api 对接 deepseek',
    timestamp: new Date(Date.now() - 3600000),
    messageCount: 15
  },
  {
    id: '3',
    title: 'UI 界面优化',
    lastMessage: '布局太丑陋了，可以修改以下吗？',
    timestamp: new Date(Date.now() - 7200000),
    messageCount: 8
  }
]

export function ChatSidebar() {
  const [sessions] = useState<ChatSession[]>(mockSessions)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSession, setSelectedSession] = useState<string>('1')

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const pinnedSessions = filteredSessions.filter(s => s.isPinned)
  const regularSessions = filteredSessions.filter(s => !s.isPinned)

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '刚刚'
    if (diffInHours < 24) return `${diffInHours}小时前`
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}天前`
    return date.toLocaleDateString()
  }

  const SessionItem = ({ session }: { session: ChatSession }) => (
    <div
      className={cn(
        'group relative p-3 mx-2 rounded-lg cursor-pointer transition-all duration-200',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        selectedSession === session.id && 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
      )}
      onClick={() => setSelectedSession(session.id)}
    >
      <div className='flex items-start justify-between'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            {session.isPinned && <Pin className='h-3 w-3 text-blue-500' />}
            <h3 className='text-sm font-medium text-slate-800 dark:text-slate-200 truncate'>
              {session.title}
            </h3>
          </div>
          
          <p className='text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2'>
            {session.lastMessage}
          </p>
          
          <div className='flex items-center justify-between text-xs text-slate-400 dark:text-slate-500'>
            <span className='flex items-center gap-1'>
              <MessageSquare className='h-3 w-3' />
              {session.messageCount}
            </span>
            <span className='flex items-center gap-1'>
              <Clock className='h-3 w-3' />
              {formatTime(session.timestamp)}
            </span>
          </div>
        </div>
        
        <Button
          variant='ghost'
          size='icon'
          className='h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <MoreVertical className='h-3 w-3' />
        </Button>
      </div>
    </div>
  )

  return (
    <div className='h-full flex flex-col bg-white dark:bg-slate-900'>
      {/* 顶部操作区 */}
      <div className='p-4 border-b border-slate-200 dark:border-slate-700'>
        <Button 
          className='w-full mb-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          size='sm'
        >
          <Plus className='h-4 w-4 mr-2' />
          新建对话
        </Button>
        
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400' />
          <Input
            placeholder='搜索对话...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='pl-9 h-8 text-sm'
          />
        </div>
      </div>

      {/* 会话列表 */}
      <ScrollArea className='flex-1'>
        <div className='py-2'>
          {/* 置顶会话 */}
          {pinnedSessions.length > 0 && (
            <div className='mb-4'>
              <div className='px-4 py-2'>
                <h4 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  置顶对话
                </h4>
              </div>
              {pinnedSessions.map(session => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          )}

          {/* 普通会话 */}
          {regularSessions.length > 0 && (
            <div>
              <div className='px-4 py-2'>
                <h4 className='text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider'>
                  最近对话
                </h4>
              </div>
              {regularSessions.map(session => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* 底部工具栏 */}
      <div className='p-3 border-t border-slate-200 dark:border-slate-700'>
        <div className='flex items-center justify-between text-xs text-slate-500 dark:text-slate-400'>
          <span>{sessions.length} 个对话</span>
          <div className='flex items-center gap-2'>
            <Button variant='ghost' size='icon' className='h-6 w-6'>
              <Archive className='h-3 w-3' />
            </Button>
            <Button variant='ghost' size='icon' className='h-6 w-6'>
              <Trash2 className='h-3 w-3' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}