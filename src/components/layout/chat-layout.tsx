'use client'

import { useState } from 'react'
import { ChatSidebar } from './chat-sidebar'
import { ChatMain } from './chat-main'
import { ChatSettings } from './chat-settings'
import { Button } from '@/components/ui/button'
import { PanelLeftClose, PanelLeftOpen, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ChatLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className='h-screen flex bg-slate-50 dark:bg-slate-900'>
      {/* 左侧边栏 - 会话历史 */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out border-r border-slate-200 dark:border-slate-700',
          sidebarOpen ? 'w-80' : 'w-0 overflow-hidden',
        )}
      >
        <ChatSidebar />
      </div>

      {/* 主聊天区域 */}
      <div className='flex-1 flex flex-col min-w-0'>
        {/* 顶部工具栏 */}
        <div className='h-14 border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-between px-4'>
          <div className='flex items-center gap-2'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className='h-8 w-8'
            >
              {sidebarOpen ? (
                <PanelLeftClose className='h-4 w-4' />
              ) : (
                <PanelLeftOpen className='h-4 w-4' />
              )}
            </Button>

            <div className='flex flex-col'>
              <h1 className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                Berry Studio Chat
              </h1>
              <p className='text-xs text-slate-500 dark:text-slate-400'>
                AI 助手对话
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            {/* 模型选择器 */}
            <select className='text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded px-2 py-1'>
              <option>DeepSeek Chat</option>
              <option>DeepSeek Coder</option>
            </select>

            <Button
              variant='ghost'
              size='icon'
              onClick={() => setSettingsOpen(!settingsOpen)}
              className='h-8 w-8'
            >
              <Settings className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {/* 聊天内容区 */}
        <div className='flex-1 flex'>
          <div className='flex-1'>
            <ChatMain />
          </div>

          {/* 右侧设置面板 */}
          {settingsOpen && (
            <div className='w-80 border-l border-slate-200 dark:border-slate-700'>
              <ChatSettings onClose={() => setSettingsOpen(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
