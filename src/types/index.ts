// 统一的消息类型定义
export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  createdAt: Date
}

// 会话类型定义
export interface Session {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

// 应用状态类型
export interface AppState {
  currentSession: Session | null
  sessions: Session[]
  isLoading: boolean
  error: string | null
}

// API请求类型
export interface ChatRequest {
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

// 流式响应数据类型
export interface StreamData {
  type: 'text-delta'
  delta: string
}