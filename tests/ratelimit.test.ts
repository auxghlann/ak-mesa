import "dotenv/config";
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST } from '../src/app/api/chat/route';
import { NextRequest } from 'next/server';

// Mock the rate limiter to always fail (simulate Rate Limit Exceeded)
vi.mock('@upstash/ratelimit', () => {
  const RatelimitMock = function () {
    return {
      limit: vi.fn().mockResolvedValue({ success: false }),
    };
  } as any;
  RatelimitMock.slidingWindow = vi.fn();

  return {
    Ratelimit: RatelimitMock,
  };
});

// Mock Vercel KV to prevent network errors during test
vi.mock('@vercel/kv', () => ({
  kv: {},
}));

// Mock the Agent to ensure we never hit the LLM API during tests
vi.mock('../api/services/agent/agent', () => ({
  initializeAgent: vi.fn(),
}));

describe('Chat API Rate Limiting', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.clearAllMocks();
    process.env = { ...originalEnv };
  });

  it('should return 429 Too Many Requests when rate limit is hit', async () => {
    process.env.KV_REST_API_URL = 'https://mock-url.upstash.io';
    process.env.KV_REST_API_TOKEN = 'mock-token';

    const req = new NextRequest('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: {
        'x-forwarded-for': '123.45.67.89',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Hello!' }],
        thread_id: '123e4567-e89b-12d3-a456-426614174000',
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(429);
    const body = await res.json();
    expect(body).toEqual({ error: 'Too Many Requests. Please wait a moment.' });
  });
});
