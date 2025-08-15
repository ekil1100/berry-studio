'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  X,
  Palette,
  Brain,
  Keyboard,
  Download,
  Upload,
  Trash2,
  Shield,
  Zap,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

interface ChatSettingsProps {
  onClose: () => void
}

export function ChatSettings({ onClose }: ChatSettingsProps) {
  const [settings, setSettings] = useState({
    theme: 'system' as 'light' | 'dark' | 'system',
    temperature: [0.7],
    maxTokens: [2048],
    streamResponse: true,
    soundEffects: true,
    showTimestamp: true,
    autoSave: true,
    markdown: true,
    codeHighlight: true
  })

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const SettingSection = ({ 
    title, 
    icon: Icon, 
    children 
  }: { 
    title: string
    icon: any
    children: React.ReactNode 
  }) => (
    <div className='mb-6'>
      <div className='flex items-center gap-2 mb-4'>
        <Icon className='h-4 w-4 text-slate-600 dark:text-slate-400' />
        <h3 className='font-medium text-slate-800 dark:text-slate-200'>
          {title}
        </h3>
      </div>
      <div className='space-y-4 pl-6'>
        {children}
      </div>
    </div>
  )

  const SettingItem = ({ 
    label, 
    description,
    children 
  }: { 
    label: string
    description?: string
    children: React.ReactNode 
  }) => (
    <div className='flex items-center justify-between'>
      <div className='space-y-1'>
        <Label className='text-sm font-medium'>{label}</Label>
        {description && (
          <p className='text-xs text-slate-500 dark:text-slate-400'>
            {description}
          </p>
        )}
      </div>
      <div className='flex items-center'>
        {children}
      </div>
    </div>
  )

  return (
    <div className='h-full flex flex-col bg-white dark:bg-slate-900'>
      {/* 标题栏 */}
      <div className='flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700'>
        <h2 className='text-lg font-semibold text-slate-800 dark:text-slate-200'>
          设置
        </h2>
        <Button
          variant='ghost'
          size='icon'
          onClick={onClose}
          className='h-8 w-8'
        >
          <X className='h-4 w-4' />
        </Button>
      </div>

      <ScrollArea className='flex-1 p-4'>
        <div className='space-y-6'>
          {/* 外观设置 */}
          <SettingSection title='外观' icon={Palette}>
            <SettingItem label='主题模式'>
              <div className='flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1'>
                {[
                  { key: 'light', icon: Sun, label: '浅色' },
                  { key: 'dark', icon: Moon, label: '深色' },
                  { key: 'system', icon: Monitor, label: '系统' }
                ].map(({ key, icon: Icon, label }) => (
                  <Button
                    key={key}
                    variant={settings.theme === key ? 'default' : 'ghost'}
                    size='sm'
                    onClick={() => updateSetting('theme', key)}
                    className='h-8 px-3'
                  >
                    <Icon className='h-3 w-3 mr-1' />
                    {label}
                  </Button>
                ))}
              </div>
            </SettingItem>

            <SettingItem 
              label='显示时间戳'
              description='在消息中显示发送时间'
            >
              <Switch
                checked={settings.showTimestamp}
                onCheckedChange={(checked) => updateSetting('showTimestamp', checked)}
              />
            </SettingItem>

            <SettingItem 
              label='Markdown 渲染'
              description='自动渲染 Markdown 格式'
            >
              <Switch
                checked={settings.markdown}
                onCheckedChange={(checked) => updateSetting('markdown', checked)}
              />
            </SettingItem>

            <SettingItem 
              label='代码高亮'
              description='启用代码语法高亮'
            >
              <Switch
                checked={settings.codeHighlight}
                onCheckedChange={(checked) => updateSetting('codeHighlight', checked)}
              />
            </SettingItem>
          </SettingSection>

          {/* AI 模型设置 */}
          <SettingSection title='AI 模型' icon={Brain}>
            <SettingItem 
              label='创造性'
              description={`当前值: ${settings.temperature[0]}`}
            >
              <div className='w-32'>
                <Slider
                  value={settings.temperature}
                  onValueChange={(value) => updateSetting('temperature', value)}
                  max={2}
                  min={0}
                  step={0.1}
                  className='cursor-pointer'
                />
              </div>
            </SettingItem>

            <SettingItem 
              label='最大令牌数'
              description={`当前值: ${settings.maxTokens[0]}`}
            >
              <div className='w-32'>
                <Slider
                  value={settings.maxTokens}
                  onValueChange={(value) => updateSetting('maxTokens', value)}
                  max={4096}
                  min={512}
                  step={256}
                  className='cursor-pointer'
                />
              </div>
            </SettingItem>

            <SettingItem 
              label='流式响应'
              description='实时显示 AI 回复'
            >
              <Switch
                checked={settings.streamResponse}
                onCheckedChange={(checked) => updateSetting('streamResponse', checked)}
              />
            </SettingItem>
          </SettingSection>

          {/* 交互设置 */}
          <SettingSection title='交互' icon={Keyboard}>
            <SettingItem 
              label='声音效果'
              description='播放消息提示音'
            >
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
              />
            </SettingItem>

            <SettingItem 
              label='自动保存'
              description='自动保存对话历史'
            >
              <Switch
                checked={settings.autoSave}
                onCheckedChange={(checked) => updateSetting('autoSave', checked)}
              />
            </SettingItem>
          </SettingSection>

          {/* 快捷键说明 */}
          <SettingSection title='快捷键' icon={Zap}>
            <div className='space-y-2 text-sm'>
              <div className='flex justify-between'>
                <span>发送消息</span>
                <code className='bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs'>
                  Enter
                </code>
              </div>
              <div className='flex justify-between'>
                <span>换行</span>
                <code className='bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs'>
                  Shift + Enter
                </code>
              </div>
              <div className='flex justify-between'>
                <span>新建对话</span>
                <code className='bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs'>
                  Ctrl + N
                </code>
              </div>
              <div className='flex justify-between'>
                <span>打开设置</span>
                <code className='bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-xs'>
                  Ctrl + ,
                </code>
              </div>
            </div>
          </SettingSection>

          {/* 数据管理 */}
          <SettingSection title='数据管理' icon={Shield}>
            <div className='space-y-3'>
              <Button variant='outline' className='w-full justify-start'>
                <Download className='h-4 w-4 mr-2' />
                导出对话记录
              </Button>
              <Button variant='outline' className='w-full justify-start'>
                <Upload className='h-4 w-4 mr-2' />
                导入对话记录
              </Button>
              <Button variant='outline' className='w-full justify-start text-red-600 hover:text-red-700'>
                <Trash2 className='h-4 w-4 mr-2' />
                清除所有数据
              </Button>
            </div>
          </SettingSection>
        </div>
      </ScrollArea>

      {/* 底部信息 */}
      <div className='p-4 border-t border-slate-200 dark:border-slate-700'>
        <div className='text-xs text-slate-500 dark:text-slate-400 space-y-1'>
          <div>Berry Studio v1.0.0</div>
          <div>基于 DeepSeek AI • Tauri 桌面应用</div>
        </div>
      </div>
    </div>
  )
}