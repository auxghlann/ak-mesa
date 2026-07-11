import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeAgent } from './services/agent/agent.js';
import { z } from 'zod';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@vercel/kv';

// Initialize rate limiter: 5 requests per 10 seconds per IP
const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, '10 s'),
  analytics: true,
});

// Zod Schema to validate incoming requests
export const ChatRequestSchema = z.object({
  message: z.string().min(1, "Message cannot be empty").max(500, "Message is too long (max 500 characters)"),
  thread_id: z.uuid("Invalid thread_id format"),
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Security: Allow specific origins in production
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.VITE_APP_URL ? process.env.VITE_APP_URL : '',
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '',
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173'); // Fallback for safety
  }

  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // 1. Rate Limiting Check
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  try {
    // Only rate limit if KV is configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const { success } = await ratelimit.limit(`chat_${ip}`);
      if (!success) {
        return res.status(429).json({ error: 'Too Many Requests. Please wait a moment.' });
      }
    }
  } catch (err) {
    console.warn("Rate limit check failed (is Vercel KV configured?):", err);
  }

  // 2. Payload Validation
  try {
    const validatedData = ChatRequestSchema.parse(req.body);

    // 3. Agent Invocation
    const agent = await initializeAgent();
    const response = await agent.invoke(
      { messages: [{ role: "user", content: validatedData.message }] },
      { configurable: { thread_id: validatedData.thread_id } }
    );

    const aiMessage = response.messages[response.messages.length - 1].content;

    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Validation Error', details: error.flatten().fieldErrors });
    }
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
