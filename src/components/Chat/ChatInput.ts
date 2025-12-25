import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ChatState } from '../../types';

@customElement('chat-input')
export class ChatInput extends LitElement {
    @property({ type: String }) chatState: ChatState = ChatState.IDLE;
    @property({ type: String }) placeholder = 'Görmek istediğiniz yeri tarif edin...';

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
          ?disabled=${isDisabled}
        />
        <button
          id="sendButton"
          class=${classMap(buttonClasses)}
          @click=${this.sendMessage}
          ?disabled=${isDisabled}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="30px"
            viewBox="0 -960 960 960"
            width="30px"
            fill="currentColor"
          >
            <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
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
