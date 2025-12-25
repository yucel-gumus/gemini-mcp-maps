import { ChatState } from './types';
import { EXAMPLE_PROMPTS } from './constants/prompts';
import { streamChat } from './services/ai.service';
import { marked } from './components/shared/markdown';

import './components/Chat/ChatContainer';
import './components/Map/MapContainer';

import type { ChatContainer } from './components/Chat/ChatContainer';
import type { MapContainer } from './components/Map/MapContainer';

async function initializeApp() {
    const rootElement = document.querySelector('#root');
    if (!rootElement) {
        throw new Error('Root element not found');
    }

    rootElement.innerHTML = `
    <div class="playground">
      <chat-container></chat-container>
      <map-container></map-container>
    </div>
  `;

    const chatContainer = rootElement.querySelector('chat-container') as ChatContainer;
    const mapContainer = rootElement.querySelector('map-container') as MapContainer;

    chatContainer.sendMessageHandler = async (input: string) => {
        const { thinking, text } = chatContainer.addMessage('assistant', '');
        text.innerHTML = '...';

        let thoughtContent = '';
        let textContent = '';

        chatContainer.setChatState(ChatState.GENERATING);

        try {
            for await (const event of streamChat(input)) {
                switch (event.type) {
                    case 'thinking':
                        chatContainer.setChatState(ChatState.THINKING);
                        if (event.content) {
                            thoughtContent += event.content;
                            thinking.innerHTML = await marked.parse(thoughtContent);
                            thinking.parentElement!.classList.remove('hidden');
                        }
                        break;

                    case 'text':
                        chatContainer.setChatState(ChatState.EXECUTING);
                        if (event.content) {
                            textContent += event.content;
                            text.innerHTML = await marked.parse(textContent);
                        }
                        break;

                    case 'function_call':
                        if (event.name && event.args) {
                            const explanation = 'Fonksiyon çağrılıyor:\n```json\n' + JSON.stringify({
                                name: event.name,
                                arguments: event.args
                            }, null, 2) + '\n```';
                            const { text: funcText } = chatContainer.addMessage('assistant', '');
                            funcText.innerHTML = await marked.parse(explanation);

                            if (event.name === 'konum_goster' && event.args.location) {
                                const result = await mapContainer.handleMapQuery({
                                    location: event.args.location as string
                                });
                                if (!result.success && result.error) {
                                    chatContainer.addMessage('assistant', result.error);
                                }
                            }
                        }
                        break;

                    case 'error':
                        const { text: errorText } = chatContainer.addMessage('error', '');
                        errorText.innerHTML = event.message || 'Bir hata oluştu';
                        break;

                    case 'done':
                        break;
                }

                chatContainer.scrollToEnd();
            }
        } catch (e: unknown) {
            const error = e as Error;
            const { text: errorText } = chatContainer.addMessage('error', '');
            errorText.innerHTML = error.message || 'API bağlantı hatası';
        }

        thinking.parentElement!.removeAttribute('open');

        if (!text.innerHTML.trim() || text.innerHTML === '...') {
            text.innerHTML = 'Tamamlandı';
        }

        chatContainer.setChatState(ChatState.IDLE);
    };

    const randomPrompt = EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)];
    chatContainer.setInputField(randomPrompt);
}

document.addEventListener('DOMContentLoaded', initializeApp);
