
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import { GoogleGenAI, mcpToTool } from '@google/genai';
import { ChatState, marked, Playground } from './playground';

import { startMcpGoogleMapServer } from './mcp_maps_server';



async function startClient(transport: Transport) {
  const client = new Client({ name: "AI Studio", version: "1.0.0" });
  await client.connect(transport);
  return client;
}




const SYSTEM_INSTRUCTIONS = `Sen, Yücel için oluşturulmuş, yardımsever ve esprili bir harita asistanısın.
Temel amacın, onun dünyadaki ilginç yerleri keşfetmesine yardımcı olmaktır.
Daima arkadaş canlısı olmalı ve yanıtlarına biraz kişilik katmalısın.
Yücel senden bir konum göstermeni istediğinde, sadece metinle cevap VERME. Bunun yerine, konumu haritada göstermek için **her zaman** 'konum_goster' aracını kullanmalısın.

Konum isimleri konusunda:
- Türkçe yaygın konum adlarını kullanabilirsin (örn: "Pisa Kulesi", "Eyfel Kulesi", "Ayasofya")
- Sistem, Türkçe konum isimlerini otomatik olarak İngilizce karşılıklarına çevirebilir
- Özel yerler için hem Türkçe hem de bilinen İngilizce adlarını kullanabilirsin

Tüm metin yanıtların ve açıklamaların Türkçe olmalıdır.`;

const EXAMPLE_PROMPTS = [
  'Görülecek havalı bir yer var mı?',
  'Eğik bir kulenin olduğu bir yer var mı?',
  'Beni dünyanın en kuzeydeki başkentine götür',
  "En güneydeki kalıcı yerleşim yeri neresi? Adı ne ve nerede?",
  "Perudaki Machu Picchuya atlayalım",
  "Gerçekten komik veya alışılmadık bir adı olan bir kasaba veya şehir bulup bana gösterebilir misin?"
];

// API key kontrolü - Vite için VITE_ prefix gerekli
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('API key gerekli. README.md dosyasındaki kurulum talimatlarını takip edin.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
});

function createAiChat(mcpClient: Client) {
  return ai.chats.create({
    model: 'gemini-2.5-pro',
    config: {
      systemInstruction: SYSTEM_INSTRUCTIONS,
      tools: [mcpToTool(mcpClient)],
    },
  });
}

function camelCaseToDash(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase();
}

document.addEventListener('DOMContentLoaded', async (event) => {
  const rootElement = document.querySelector('#root')! as HTMLElement;

  const playground = new Playground();
  rootElement.appendChild(playground);
  playground.initializeMap();



  const [transportA, transportB] = InMemoryTransport.createLinkedPair();

  void startMcpGoogleMapServer(transportA, (params: { location?: string, origin?: string, destination?: string, search?: string }) => {
    playground.renderMapQuery(params);
  });

  const mcpClient = await startClient(transportB);



  const aiChat = createAiChat(mcpClient);

  playground.sendMessageHandler = async (
    input: string,
    role: string,
  ) => {

    const { thinking, text } = playground.addMessage('assistant', '');
    const message = [];

    message.push({
      role,
      text: input,
    });

    playground.setChatState(ChatState.GENERATING);

    text.innerHTML = '...';

    let newCode = '';
    let thought = '';


    try {
      const res = await aiChat.sendMessageStream({ message });

      for await (const chunk of res) {
        for (const candidate of chunk.candidates ?? []) {
          for (const part of candidate.content?.parts ?? []) {
            if (part.functionCall) {
              const mcpCall = {
                name: camelCaseToDash(part.functionCall.name!),
                arguments: part.functionCall.args
              };

              const explanation = 'Calling function:\n```json\n' + JSON.stringify(mcpCall, null, 2) + '\n```'
              const { thinking, text } = playground.addMessage('assistant', '');
              text.innerHTML = await marked.parse(explanation);
            }

            if (part.thought) {
              playground.setChatState(ChatState.THINKING);
              if (part.text) {
                thought += part.text;
                thinking.innerHTML = await marked.parse(thought);
                thinking.parentElement!.classList.remove('hidden');
              }
            } else if (part.text) {
              playground.setChatState(ChatState.EXECUTING);
              newCode += part.text;
              text.innerHTML = await marked.parse(newCode);
            }
            playground.scrollToTheEnd();
          }
        }
      }
    } catch (e: any) {
      let message = e.message;
      const splitPos = e.message.indexOf('{');
      if (splitPos > -1) {
        const msgJson = e.message.substring(splitPos);
        try {
          const sdkError = JSON.parse(msgJson);
          if (sdkError.error) {
            message = sdkError.error.message;
            message = await marked.parse(message);
          }
        } catch (e) {
        }
      }
      const { text } = playground.addMessage('error', '');
      text.innerHTML = message;
    }

    thinking.parentElement!.removeAttribute('open');

    if (text.innerHTML.trim().length === 0) {
      text.innerHTML = 'Done';
    }

    playground.setChatState(ChatState.IDLE);
  };

  playground.setInputField(
    EXAMPLE_PROMPTS[Math.floor(Math.random() * EXAMPLE_PROMPTS.length)],
  );
});
