'use client'

import { memo, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeRaw from 'rehype-raw'
import 'prismjs/themes/prism-tomorrow.css'

interface MarkdownRendererProps {
  content: string
  className?: string
}

const MarkdownRenderer = memo(({ content, className = '' }: MarkdownRendererProps) => {
  useEffect(() => {
    // 动态加载所需的语言支持
    const loadLanguages = async () => {
      try {
        await import('prismjs/components/prism-javascript')
        await import('prismjs/components/prism-typescript')
        await import('prismjs/components/prism-jsx')
        await import('prismjs/components/prism-tsx')
        await import('prismjs/components/prism-python')
        await import('prismjs/components/prism-bash')
        await import('prismjs/components/prism-json')
        await import('prismjs/components/prism-css')
        await import('prismjs/components/prism-markup')
        await import('prismjs/components/prism-markdown')
        await import('prismjs/components/prism-rust')
        await import('prismjs/components/prism-go')
        await import('prismjs/components/prism-java')
        await import('prismjs/components/prism-c')
        await import('prismjs/components/prism-cpp')
      } catch (error) {
        console.warn('Failed to load some Prism languages:', error)
      }
    }
    loadLanguages()
  }, [])

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeRaw]}
        components={{
          // 自定义代码块样式
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '')
            return !inline && match ? (
              <div className="relative">
                <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                  {match[1]}
                </div>
                <pre className="bg-muted/50 rounded-lg p-4 overflow-x-auto">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            ) : (
              <code 
                className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" 
                {...props}
              >
                {children}
              </code>
            )
          },
          // 自定义表格样式
          table({ children }) {
            return (
              <div className="overflow-x-auto my-4">
                <table className="w-full border-collapse border border-border rounded-lg">
                  {children}
                </table>
              </div>
            )
          },
          th({ children }) {
            return (
              <th className="border border-border px-4 py-2 bg-muted font-semibold text-left">
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td className="border border-border px-4 py-2">
                {children}
              </td>
            )
          },
          // 自定义引用块样式
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-primary/50 pl-4 py-2 my-4 bg-muted/30 rounded-r-lg">
                {children}
              </blockquote>
            )
          },
          // 自定义链接样式
          a({ href, children }) {
            return (
              <a
                href={href}
                className="text-primary hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            )
          },
          // 自定义列表样式
          ul({ children }) {
            return <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
          },
          ol({ children }) {
            return <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
          },
          // 自定义标题样式
          h1({ children }) {
            return <h1 className="text-2xl font-bold mt-6 mb-3">{children}</h1>
          },
          h2({ children }) {
            return <h2 className="text-xl font-semibold mt-5 mb-2">{children}</h2>
          },
          h3({ children }) {
            return <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>
          },
          h4({ children }) {
            return <h4 className="text-base font-medium mt-3 mb-1">{children}</h4>
          },
          // 自定义段落样式
          p({ children }) {
            return <p className="mb-3 leading-relaxed">{children}</p>
          },
          // 自定义水平线样式
          hr() {
            return <hr className="my-6 border-border" />
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