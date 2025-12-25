import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { marked } from '../shared/markdown';

@customElement('chat-message')
export class ChatMessage extends LitElement {
    @property({ type: String }) role = 'user';
    @property({ type: String }) content = '';
    @property({ type: String }) thinking = '';
    @property({ type: Boolean }) showThinking = false;

    createRenderRoot() {
        return this;
    }

    async updated(changedProperties: Map<string, unknown>) {
        if (changedProperties.has('content') || changedProperties.has('thinking')) {
            await this.renderMarkdown();
        }
    }

    private async renderMarkdown() {
        const textEl = this.querySelector('.text');
        const thinkingEl = this.querySelector('.thinking-content');

        if (textEl && this.content) {
            textEl.innerHTML = await marked.parse(this.content);
        }
        if (thinkingEl && this.thinking) {
            thinkingEl.innerHTML = await marked.parse(this.thinking);
        }
    }

    render() {
        const thinkingClasses = {
            'hidden': !this.showThinking || !this.thinking,
            'thinking': true,
        };

        return html`
      <div class="turn role-${this.role}">
        <details class=${classMap(thinkingClasses)} ?open=${this.showThinking}>
          <summary>Düşünüyor...</summary>
          <div class="thinking-content"></div>
        </details>
        <div class="text">${this.content}</div>
      </div>
    `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'chat-message': ChatMessage;
    }
}
