/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// tslint:disable
import hljs from 'highlight.js';
import {html, LitElement} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import * as L from 'leaflet';
import {Marked} from 'marked';
import {markedHighlight} from 'marked-highlight';

import {MapParams} from './mcp_maps_server';

// Türkçe konum isimleri için çeviri sözlüğü
const LOCATION_TRANSLATIONS: Record<string, string[]> = {
  'pisa kulesi': ['Leaning Tower of Pisa', 'Torre di Pisa', 'Pisa Tower'],
  'eyfel kulesi': ['Eiffel Tower', 'Tour Eiffel'],
  'özgürlük heykeli': ['Statue of Liberty', 'Liberty Statue'],
  'büyük çin seddi': ['Great Wall of China', 'Chinese Wall'],
  'koloseum': ['Colosseum Rome', 'Roman Colosseum'],
  'kapadokya': ['Cappadocia Turkey', 'Cappadocia'],
  'boğaziçi köprüsü': ['Bosphorus Bridge', '15 July Martyrs Bridge'],
  'galata kulesi': ['Galata Tower Istanbul'],
  'ayasofya': ['Hagia Sophia Istanbul'],
  'sultanahmet camii': ['Blue Mosque Istanbul'],
  'topkapı sarayı': ['Topkapi Palace Istanbul'],
  'machu picchu': ['Machu Picchu Peru'],
  'petra': ['Petra Jordan'],
  'stonehenge': ['Stonehenge England'],
  'taj mahal': ['Taj Mahal India'],
  'christ the redeemer': ['Christ the Redeemer Brazil', 'Cristo Redentor'],
  'christ heykeli': ['Christ the Redeemer Brazil', 'Cristo Redentor'],
  'chichen itza': ['Chichen Itza Mexico'],
  'angkor wat': ['Angkor Wat Cambodia'],
  'sagrada familia': ['Sagrada Familia Barcelona'],
  'neuschwanstein kalesi': ['Neuschwanstein Castle Germany'],
  'mont saint-michel': ['Mont Saint-Michel France'],
  'akropolis': ['Acropolis Athens', 'Parthenon Athens'],
  'big ben': ['Big Ben London'],
  'london eye': ['London Eye'],
  'burj khalifa': ['Burj Khalifa Dubai'],
  'sydney opera evi': ['Sydney Opera House'],
  'golden gate köprüsü': ['Golden Gate Bridge San Francisco'],
  'niagara şelalesi': ['Niagara Falls'],
  'grand canyon': ['Grand Canyon'],
  'mount rushmore': ['Mount Rushmore'],
  'uluru': ['Uluru Australia', 'Ayers Rock'],
  'everest dağı': ['Mount Everest', 'Everest'],
  'kilimanjaro': ['Mount Kilimanjaro'],
  'fuji dağı': ['Mount Fuji Japan'],
  'matterhorn': ['Matterhorn Switzerland'],
  'santorini': ['Santorini Greece'],
  'venedik': ['Venice Italy'],
  'floransa': ['Florence Italy'],
  'roma': ['Rome Italy'],
  'paris': ['Paris France'],
  'londra': ['London UK'],
  'new york': ['New York City'],
  'tokyo': ['Tokyo Japan'],
  'pekin': ['Beijing China'],
  'moskova': ['Moscow Russia'],
  'saint petersburg': ['Saint Petersburg Russia'],
  'istanbul': ['Istanbul Turkey'],
  'ankara': ['Ankara Turkey'],
  'izmir': ['Izmir Turkey'],
  'antalya': ['Antalya Turkey'],
  'bodrum': ['Bodrum Turkey'],
  'kaş': ['Kas Turkey'],
  'marmaris': ['Marmaris Turkey'],
  'fethiye': ['Fethiye Turkey'],
  'pamukkale': ['Pamukkale Turkey'],
  'göreme': ['Goreme Turkey', 'Cappadocia Turkey'],
  'ürgüp': ['Urgup Turkey', 'Cappadocia Turkey'],
  'nevşehir': ['Nevsehir Turkey', 'Cappadocia Turkey'],
  'trabzon': ['Trabzon Turkey'],
  'rize': ['Rize Turkey'],
  'artvin': ['Artvin Turkey'],
  'erzurum': ['Erzurum Turkey'],
  'van': ['Van Turkey'],
  'diyarbakır': ['Diyarbakir Turkey'],
  'gaziantep': ['Gaziantep Turkey'],
  'şanlıurfa': ['Sanliurfa Turkey'],
  'mardin': ['Mardin Turkey'],
  'hatay': ['Hatay Turkey', 'Antakya Turkey'],
};

// Konum ismini normalize etme fonksiyonu
function normalizeLocationName(location: string): string {
  return location.toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim();
}

// Konum için arama terimlerini getiren fonksiyonu
function getSearchTermsForLocation(location: string): string[] {
  const normalized = normalizeLocationName(location);
  const searchTerms = [location]; // Orijinal ismi de dene
  
  // Sözlükten çevirileri ekle
  if (LOCATION_TRANSLATIONS[normalized]) {
    searchTerms.push(...LOCATION_TRANSLATIONS[normalized]);
  }
  
  // Yaygın konum türleri için ek terimler
  if (normalized.includes('kulesi') || normalized.includes('tower')) {
    searchTerms.push(location.replace('kulesi', 'tower'));
  }
  if (normalized.includes('köprüsü') || normalized.includes('bridge')) {
    searchTerms.push(location.replace('köprüsü', 'bridge'));
  }
  if (normalized.includes('camii') || normalized.includes('mosque')) {
    searchTerms.push(location.replace('camii', 'mosque'));
  }
  if (normalized.includes('sarayı') || normalized.includes('palace')) {
    searchTerms.push(location.replace('sarayı', 'palace'));
  }
  if (normalized.includes('kalesi') || normalized.includes('castle')) {
    searchTerms.push(location.replace('kalesi', 'castle'));
  }
  
  return [...new Set(searchTerms)]; // Tekrarları kaldır
}

/** Markdown formatting function with syntax hilighting */
export const marked = new Marked(
  markedHighlight({
    async: true,
    emptyLangClass: 'hljs',
    langPrefix: 'hljs language-',
    highlight(code, lang, info) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, {language}).value;
    },
  }),
);

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

/**
 * Chat state enum to manage the current state of the chat interface.
 */
export enum ChatState {
  IDLE,
  GENERATING,
  THINKING,
  EXECUTING,
}

/**
 * Chat tab enum to manage the current selected tab in the chat interface.
 */
enum ChatTab {
  GEMINI,
}

/**
 * Chat role enum to manage the current role of the message.
 */
export enum ChatRole {
  USER,
  ASSISTANT,
  SYSTEM,
}

/**
 * Playground component for p5js.
 */
@customElement('gdm-playground')
export class Playground extends LitElement {
  @query('#anchor') anchor?: HTMLDivElement;

  @state() chatState = ChatState.IDLE;
  @state() isRunning = true;
  @state() selectedChatTab = ChatTab.GEMINI;
  @state() inputMessage = '';
  @state() messages: HTMLElement[] = [];

  private map?: L.Map;
  private markerLayer: L.LayerGroup = new L.LayerGroup();

  sendMessageHandler?: CallableFunction;

  constructor() {
    super();
  }

  /** Disable shadow DOM */
  createRenderRoot() {
    return this;
  }

  initializeMap() {
    const mapElement = this.querySelector('#map');
    if (mapElement && !this.map) {
      this.map = L.map(mapElement as HTMLElement).setView(
        [48.8566, 2.3522],
        13,
      );
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(this.map);
      this.markerLayer.addTo(this.map);
    }
  }

  setChatState(state: ChatState) {
    this.chatState = state;
  }

  async renderMapQuery(location: MapParams) {
    if (!this.map) {
      this.initializeMap();
    }
    this.markerLayer.clearLayers();

    if (location.location) {
      try {
        const searchTerms = getSearchTermsForLocation(location.location);
        let found = false;
        
        // Her arama terimini sırayla dene
        for (const searchTerm of searchTerms) {
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchTerm)}&format=json&limit=1`,
            );
            const data = await response.json();
            
            if (data.length > 0) {
              const {lat, lon, display_name} = data[0];
              this.map?.setView([lat, lon], 13);
              L.marker([lat, lon])
                .bindPopup(`<b>${location.location}</b><br/>${display_name}`)
                .addTo(this.markerLayer);
              
              console.log(`🗺️ Konum bulundu: "${location.location}" -> "${searchTerm}" (${lat}, ${lon})`);
              found = true;
              break;
            }
          } catch (searchError) {
            console.warn(`Arama terimi "${searchTerm}" için hata:`, searchError);
            continue;
          }
        }
        
        if (!found) {
          this.addMessage(
            'assistant',
            `Üzgünüm, "${location.location}" konumunu bulamadım. Lütfen daha spesifik bir konum adı deneyin.`,
          );
        }
      } catch (error) {
        console.error('Geocoding error:', error);
        this.addMessage(
          'assistant',
          'Konum arama sırasında bir hata oluştu.',
        );
      }
    } else {
      this.addMessage(
        'assistant',
        'This operation is not supported with Leaflet yet.',
      );
    }
  }

  setInputField(message: string) {
    this.inputMessage = message.trim();
  }

  addMessage(role: string, message: string) {
    const div = document.createElement('div');
    div.classList.add('turn');
    div.classList.add(`role-${role.trim()}`);

    const thinkingDetails = document.createElement('details');
    thinkingDetails.classList.add('hidden');
    const summary = document.createElement('summary');
    summary.textContent = 'Thinking...';
    thinkingDetails.classList.add('thinking');
    thinkingDetails.setAttribute('open', 'true');
    const thinking = document.createElement('div');
    thinkingDetails.append(thinking);
    div.append(thinkingDetails);
    const text = document.createElement('div');
    text.className = 'text';
    text.textContent = message;
    div.append(text);

    this.messages.push(div);
    this.requestUpdate();

    this.scrollToTheEnd();

    return {thinking, text};
  }

  scrollToTheEnd() {
    if (!this.anchor) return;
    this.anchor.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  async sendMessageAction(message?: string, role?: string) {
    if (this.chatState !== ChatState.IDLE) return;

    this.chatState = ChatState.GENERATING;

    let msg = '';
    if (message) {
      msg = message.trim();
    } else {
      // get message and empty the field
      msg = this.inputMessage.trim();
      this.inputMessage = '';
    }

    if (msg.length === 0) {
      this.chatState = ChatState.IDLE;
      return;
    }

    const msgRole = role ? role.toLowerCase() : 'user';

    if (msgRole === 'user' && msg) {
      this.addMessage(msgRole, msg);
    }

    if (this.sendMessageHandler) {
      await this.sendMessageHandler(msg, msgRole);
    }

    this.chatState = ChatState.IDLE;
  }

  private async inputKeyDownAction(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      this.sendMessageAction();
    }
  }

  render() {
    return html`<div class="playground">
      <div class="sidebar">
        <div class="selector">
          <button
            id="geminiTab"
            class=${classMap({
              'selected-tab': this.selectedChatTab === ChatTab.GEMINI,
            })}
            @click=${() => {
              this.selectedChatTab = ChatTab.GEMINI;
            }}>
            Gemini
          </button>
        </div>
        <div
          id="chat"
          class=${classMap({
            'tabcontent': true,
            'showtab': this.selectedChatTab === ChatTab.GEMINI,
          })}>
          <div class="chat-messages">
            ${this.messages}
            <div id="anchor"></div>
          </div>

          <div class="footer">
            <div
              id="chatStatus"
              class=${classMap({'hidden': this.chatState === ChatState.IDLE})}>
              ${this.chatState === ChatState.GENERATING
                ? html`${ICON_BUSY} Generating...`
                : html``}
              ${this.chatState === ChatState.THINKING
                ? html`${ICON_BUSY} Thinking...`
                : html``}
              ${this.chatState === ChatState.EXECUTING
                ? html`${ICON_BUSY} Executing...`
                : html``}
            </div>
            <div id="inputArea">
              <input
                type="text"
                id="messageInput"
                .value=${this.inputMessage}
                @input=${(e: InputEvent) => {
                  this.inputMessage = (e.target as HTMLInputElement).value;
                }}
                @keydown=${(e: KeyboardEvent) => {
                  this.inputKeyDownAction(e);
                }}
                placeholder="Type your message..."
                autocomplete="off" />
              <button
                id="sendButton"
                class=${classMap({
                  'disabled': this.chatState !== ChatState.IDLE,
                })}
                @click=${() => {
                  this.sendMessageAction();
                }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="currentColor">
                  <path d="M120-160v-240l320-80-320-80v-240l760 320-760 320Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="map" class="main-container"></div>
    </div>`;
  }
}
