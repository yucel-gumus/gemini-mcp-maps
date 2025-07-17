
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js';
import {Transport} from '@modelcontextprotocol/sdk/shared/transport.js';
import {z} from 'zod';

export interface MapParams {
  location?: string;
  search?: string;
  origin?: string;
  destination?: string;
}

export async function startMcpGoogleMapServer(
  transport: Transport,
  mapQueryHandler: (params: MapParams) => void,
) {
  const server = new McpServer({
    name: 'Yücel\'s Map Server',
    version: '1.0.0',
  });

  server.tool(
    'konum_goster',
    'Belirli bir coğrafi konumu haritada gösterir.',
    {location: z.string().describe('Görüntülenecek konumun adı.')},
    async ({location}) => {
      mapQueryHandler({location: location});
      return {
        content: [{type: 'text', text: `${location} konumuna gidiliyor.`}],
      };
    },
  );

  await server.connect(transport);
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
}
