import { describe, it, expect } from 'vitest';
import { ChatRequestSchema } from '../src/app/api/chat/route';

describe('Chat API Payload Validation', () => {

  it('should pass with a valid message array and uuid', () => {
    const validPayload = {
      messages: [{ role: 'user', content: 'Hello Quokka!' }],
      thread_id: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = ChatRequestSchema.safeParse(validPayload);
    expect(result.success).toBe(true);
  });

  it('should fail if messages array is empty', () => {
    const emptyMessages = {
      messages: [],
      thread_id: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = ChatRequestSchema.safeParse(emptyMessages);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.messages).toBeDefined();
    }
  });

  it('should fail if message content exceeds 2000 characters', () => {
    const hugeMessage = {
      messages: [{ role: 'user', content: 'A'.repeat(2001) }],
      thread_id: '123e4567-e89b-12d3-a456-426614174000'
    };

    const result = ChatRequestSchema.safeParse(hugeMessage);
    expect(result.success).toBe(false);
  });

  it('should fallback to default uuid if thread_id is not a valid UUID', () => {
    const invalidUuid = {
      messages: [{ role: 'user', content: 'Hello' }],
      thread_id: 'not-a-uuid-123'
    };

    const result = ChatRequestSchema.safeParse(invalidUuid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.thread_id).toBe('00000000-0000-0000-0000-000000000000');
    }
  });

});
