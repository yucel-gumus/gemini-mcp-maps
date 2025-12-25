import { AI_CONFIG } from '../constants/config';

export interface SSEEvent {
    type: 'text' | 'function_call' | 'thinking' | 'done' | 'error';
    content?: string;
    name?: string;
    args?: Record<string, unknown>;
    message?: string;
}

export async function* streamChat(message: string, sessionId: string = 'default'): AsyncGenerator<SSEEvent> {
    const response = await fetch(`${AI_CONFIG.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            message,
            session_id: sessionId,
        }),
    });

    if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error('No response body');
    }

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                try {
                    const data = JSON.parse(line.slice(6)) as SSEEvent;
                    yield data;
                } catch {
                    continue;
                }
            }
        }
    }
}
