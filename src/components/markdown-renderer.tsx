'use client'

import { memo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const MarkdownRenderer = memo(({ content, className = '' }: MarkdownRendererProps) => {
  return (
    <div className={cn('prose prose-sm max-w-none', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { className, children } = props
            const inline = !className
            return inline ? (
              <code 
                className="px-1 py-0.5 rounded bg-gray-100 text-gray-800 font-mono text-sm"
                {...props}
              >
                {children}
              </code>
            ) : (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                <code className="font-mono text-sm">
                  {children}
                </code>
              </pre>
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
})

MarkdownRenderer.displayName = 'MarkdownRenderer'

export { MarkdownRenderer }