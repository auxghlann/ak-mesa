import { NextResponse, type NextRequest } from 'next/server';
import { initializeAgent } from '../../../../api/services/agent/agent';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';
import { HumanMessage, AIMessage } from "@langchain/core/messages";

// Initialize rate limiter: 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
});

// Zod Schema to validate incoming requests
export const ChatRequestSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(["user", "bot"]),
    content: z.string().max(2000, "Message is too long")
  })).min(1, "Messages array cannot be empty"),
  thread_id: z.string().uuid("Invalid thread_id format").catch('00000000-0000-0000-0000-000000000000'),
});

export async function POST(req: NextRequest) {
  // 1. Rate Limiting Check
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '127.0.0.1';
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { success } = await ratelimit.limit(`chat_${ip}`);
      if (!success) {
        return NextResponse.json(
          { error: 'Too Many Requests. Please wait a moment.' },
          { status: 429 }
        );
      }
    }
  } catch (err) {
    console.warn("Rate limit check failed (is Vercel KV configured?):", err);
  }

  // 2. Payload Validation & Agent Invocation
  try {
    const body = await req.json();
    const validatedData = ChatRequestSchema.parse(body);

    const mappedMessages = validatedData.messages.map(m => 
      m.role === "bot" ? new AIMessage(m.content) : new HumanMessage(m.content)
    );

    const agent = await initializeAgent();
    const response = await agent.invoke(
      { messages: mappedMessages },
      { configurable: { thread_id: validatedData.thread_id } }
    );

    const aiMessage = response.messages[response.messages.length - 1].content;

    return NextResponse.json({ reply: aiMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation Error', details: error.flatten().fieldErrors },
        { status: 400 }
      );
    }
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}
