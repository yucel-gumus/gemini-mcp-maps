import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ChatState } from '../../types';

@customElement('chat-input')
export class ChatInput extends LitElement {
    @property({ type: String }) chatState: ChatState = ChatState.IDLE;
    @property({ type: String }) placeholder = 'Bir konum veya mekan arayın...';

    @state() private inputValue = '';

    createRenderRoot() {
        return this;
    }

    setInputValue(value: string) {
        this.inputValue = value;
        this.requestUpdate();
    }

    private handleInput(e: InputEvent) {
        this.inputValue = (e.target as HTMLInputElement).value;
    }

    private handleKeyDown(e: KeyboardEvent) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    private sendMessage() {
        if (this.chatState !== ChatState.IDLE || !this.inputValue.trim()) return;

        const message = this.inputValue.trim();
        this.inputValue = '';

        this.dispatchEvent(new CustomEvent('send-message', {
            detail: { message },
            bubbles: true,
            composed: true,
        }));
    }

    render() {
        const isDisabled = this.chatState !== ChatState.IDLE;
        const buttonClasses = { disabled: isDisabled };

        return html`
      <div id="inputArea">
        <input
          type="text"
          id="messageInput"
          .value=${this.inputValue}
          @input=${this.handleInput}
          @keydown=${this.handleKeyDown}
          placeholder=${this.placeholder}
          autocomplete="off"
          aria-label="Konum Arama Girdisi"
          ?disabled=${isDisabled}
        />
        <button
          id="sendButton"
          class=${classMap(buttonClasses)}
          @click=${this.sendMessage}
          aria-label="Gönder"
          ?disabled=${isDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-input': ChatInput;
    }
}
