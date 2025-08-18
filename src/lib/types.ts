export interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: number
  status: 'sending' | 'streaming' | 'complete' | 'error'
}

export interface Session {
  id: string
  title: string
  messages: Message[]
  created: number
  updated: number
}

export interface StreamResponse {
  content: string
  done: boolean
}
