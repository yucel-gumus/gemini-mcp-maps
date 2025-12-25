import { LitElement, html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ChatState, type MapParams, type SendMessageHandler } from '../../types';
import { marked } from '../shared/markdown';

import './ChatMessage';
import './ChatInput';

const ICON_BUSY = html`<svg
  class="rotating"
  xmlns="http://www.w3.org/2000/svg"
  height="24px"
  viewBox="0 -960 960 960"
  width="24px"
  fill="currentColor">
  <path
    d="M480-80q-82 0-155-31.5t-127.5-86Q143-252 111.5-325T80-480q0-83 31.5-155.5t86-127Q252-817 325-848.5T480-880q17 0 28.5 11.5T520-840q0 17-11.5 28.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160q133 0 226.5-93.5T800-480q0-17 11.5-28.5T840-520q17 0 28.5 11.5T880-480q0 82-31.5 155t-86 127.5q-54.5 54.5-127 86T480-80Z" />
</svg>`;

interface MessageElement {
    container: HTMLElement;
    thinking: HTMLElement;
    text: HTMLElement;
}

@customElement('chat-container')
export class ChatContainer extends LitElement {
    @query('#anchor') anchor?: HTMLDivElement;
    @query('chat-input') chatInput?: LitElement & { setInputValue: (v: string) => void };

    @state() chatState = ChatState.IDLE;
    @state() private messages: HTMLElement[] = [];

    sendMessageHandler?: SendMessageHandler;
    mapQueryHandler?: (params: MapParams) => Promise<{ success: boolean; error?: string }>;

    createRenderRoot() {
        return this;
    }

    setChatState(state: ChatState) {
        this.chatState = state;
    }

    setInputField(value: string) {
        this.chatInput?.setInputValue(value.trim());
    }

    addMessage(role: string, content: string): MessageElement {
        const container = document.createElement('div');
        container.classList.add('turn', `role-${role.trim()}`);

        const thinkingDetails = document.createElement('details');
        thinkingDetails.classList.add('hidden', 'thinking');
        thinkingDetails.setAttribute('open', 'true');

        const summary = document.createElement('summary');
        summary.textContent = 'Düşünüyor...';
        thinkingDetails.appendChild(summary);

        const thinking = document.createElement('div');
        thinkingDetails.appendChild(thinking);
        container.appendChild(thinkingDetails);

        const text = document.createElement('div');
        text.className = 'text';
        text.textContent = content;
        container.appendChild(text);

        this.messages = [...this.messages, container];
        this.requestUpdate();
        this.scrollToEnd();

        return { container, thinking, text };
    }

    scrollToEnd() {
        requestAnimationFrame(() => {
            this.anchor?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        });
    }

    private async handleSendMessage(e: CustomEvent<{ message: string }>) {
        const { message } = e.detail;
        if (!message || this.chatState !== ChatState.IDLE) return;

        this.addMessage('user', message);

        if (this.sendMessageHandler) {
            await this.sendMessageHandler(message, 'user');
        }
    }

    async processAIStream(
        streamGenerator: AsyncGenerator<unknown>,
        messageElement: MessageElement
    ) {
        const { thinking, text } = messageElement;
        let thoughtContent = '';
        let textContent = '';

        for await (const chunk of streamGenerator) {
            const typedChunk = chunk as { candidates?: Array<{ content?: { parts?: Array<{ thought?: boolean; text?: string; functionCall?: { name: string; args: unknown } }> } }> };

            for (const candidate of typedChunk.candidates ?? []) {
                for (const part of candidate.content?.parts ?? []) {
                    if (part.functionCall) {
                        const callInfo = {
                            name: part.functionCall.name,
                            arguments: part.functionCall.args
                        };
                        const explanation = 'Fonksiyon çağrılıyor:\n```json\n' + JSON.stringify(callInfo, null, 2) + '\n```';
                        const { text: funcText } = this.addMessage('assistant', '');
                        funcText.innerHTML = await marked.parse(explanation);
                    }

                    if (part.thought && part.text) {
                        this.setChatState(ChatState.THINKING);
                        thoughtContent += part.text;
                        thinking.innerHTML = await marked.parse(thoughtContent);
                        thinking.parentElement!.classList.remove('hidden');
                    } else if (part.text) {
                        this.setChatState(ChatState.EXECUTING);
                        textContent += part.text;
                        text.innerHTML = await marked.parse(textContent);
                    }

                    this.scrollToEnd();
                }
            }
        }

        thinking.parentElement!.removeAttribute('open');

        if (!text.innerHTML.trim()) {
            text.innerHTML = 'Tamamlandı';
        }
    }

    private getStatusMessage(): TemplateResult | string {
        switch (this.chatState) {
            case ChatState.GENERATING:
                return html`${ICON_BUSY} Üretiliyor...`;
            case ChatState.THINKING:
                return html`${ICON_BUSY} Düşünüyor...`;
            case ChatState.EXECUTING:
                return html`${ICON_BUSY} Yürütülüyor...`;
            default:
                return '';
        }
    }

    render() {
        const statusClasses = { hidden: this.chatState === ChatState.IDLE };

        return html`
      <div class="sidebar">
        <div class="selector">
          <button id="geminiTab" class="selected-tab">AI-MCP-MAP</button>
        </div>
        <div id="chat" class="tabcontent showtab">
          <div class="chat-messages">
            ${this.messages}
            <div id="anchor"></div>
          </div>
          <div class="footer">
            <div id="chatStatus" class=${classMap(statusClasses)}>
              ${this.getStatusMessage()}
            </div>
            <chat-input
              .chatState=${this.chatState}
              @send-message=${this.handleSendMessage}
            ></chat-input>
          </div>
        </div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-container': ChatContainer;
    }
}
