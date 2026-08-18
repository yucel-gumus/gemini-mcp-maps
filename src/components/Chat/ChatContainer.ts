import { LitElement, html, TemplateResult } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ChatState, type SendMessageHandler } from '../../types';

import './ChatInput';

const ICON_BUSY = html`<svg
  class="rotating"
  xmlns="http://www.w3.org/2000/svg"
  height="20px"
  viewBox="0 -960 960 960"
  width="20px"
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

  createRenderRoot() {
    return this;
  }

  setChatState(state: ChatState) {
    this.chatState = state;
  }

  async setInputField(value: string) {
    await this.updateComplete;
    if (this.chatInput) {
      this.chatInput.setInputValue(value.trim());
    }
  }

  addMessage(role: string, content: string): MessageElement {
    const container = document.createElement('div');
    container.classList.add('turn', `role-${role.trim()}`);

    const thinkingDetails = document.createElement('details');
    thinkingDetails.classList.add('hidden', 'thinking');
    thinkingDetails.setAttribute('open', 'true');

    const summary = document.createElement('summary');
    summary.textContent = 'Düşünme Süreci...';
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
        <!-- Redesigned Brand Header -->
        <div class="brand-header">
          <div class="brand-logo">
            <div class="brand-icon">
              <svg viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <div>
              <div class="brand-title">KENSAI</div>
              <div class="brand-subtitle">Harita Asistanı</div>
            </div>
          </div>
        </div>

        <!-- Chat Area -->
        <div id="chat">
          <div class="chat-messages">
            ${this.messages.length === 0
        ? html`
                  <div class="chat-welcome">
                    <div class="chat-welcome-icon">
                      <svg viewBox="0 0 24 24">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                    </div>
                    <div class="chat-welcome-title">KENSAI Harita Asistanı</div>
                    <div class="chat-welcome-desc">
                      Görmek veya keşfetmek istediğiniz herhangi bir konumu aşağıdaki arama çubuğuna yazabilirsiniz.
                    </div>
                  </div>
                `
        : this.messages}
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
            <div style="text-align: center; margin-top: 10px; font-size: 12px; font-weight: 700; color: var(--c-30-border-strong); opacity: 0.9;">
              Geliştirici: <a href="https://www.yucelgumus.dev/" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">Yücel Gümüş</a>
            </div>
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
