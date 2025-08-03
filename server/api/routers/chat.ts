import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { callDeepSeekAPI } from '@/server/lib/deepseek'

const messageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
})

export const chatRouter = createTRPCRouter({
  sendMessage: publicProcedure
    .input(
      z.object({
        messages: z.array(messageSchema),
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { messages, prompt } = input
      
      try {
        // Add the new user message to the conversation
        const allMessages = [...messages, { role: 'user' as const, content: prompt }]
        
        // Call DeepSeek API
        const response = await callDeepSeekAPI(allMessages)
        
        return response
      } catch (error) {
        console.error('Error calling DeepSeek API:', error)
        // Fallback to mock response if API fails
        return {
          role: 'assistant' as const,
          content: 'Sorry, I encountered an error. Please make sure DEEPSEEK_API_KEY is set in your environment variables.',
        }
      }
    }),
})