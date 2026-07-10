import type { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeAgent } from './services/agent/agent';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add CORS headers for local testing
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
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

  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const agent = await initializeAgent();
    
    const response = await agent.invoke({
      messages: [{ role: "user", content: message }]
    });

    const aiMessage = response.messages[response.messages.length - 1].content;
    
    res.status(200).json({ reply: aiMessage });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
}
