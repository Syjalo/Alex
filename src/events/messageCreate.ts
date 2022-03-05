import axios from 'axios';
import { count } from 'console';
import { VirusTotalAnalysesGetResult, VirusTotalURLsPostResult } from '../types';
import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageCreate', async (message) => {
    if (!message.inGuild()) return;

    const urls = [
      ...new Set(
        message.content.split(' ').filter((contentPart) => {
          try {
            return new URL(contentPart).protocol.startsWith('http');
          } catch {
            return false;
          }
        }),
      ).values(),
    ];
    if (urls.length) {
      for (const url of urls) {
        const id = await axios
          .post<VirusTotalURLsPostResult>(
            'https://www.virustotal.com/api/v3/urls',
            new URLSearchParams({ url }),
            {
              headers: {
                'X-APIKey': process.env.VIRUSTOTAL_KEY!,
              },
            },
          )
          .then((res) => res.data.data.id)
          .catch((error) => {
            console.log(error);
            return null;
          });
        if (!id) continue;

        const getAnalyses = (id: string) => {
          const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
          return new Promise<VirusTotalAnalysesGetResult | null>(async (resolve) => {
            let count = 0;
            do {
              const analyses = await axios
                .get<VirusTotalAnalysesGetResult>(`https://www.virustotal.com/api/v3/analyses/${id}`, {
                  headers: {
                    'X-APIKey': process.env.VIRUSTOTAL_KEY!,
                  },
                })
                .then((res) => res.data)
                .catch((error) => {
                  console.log(error);
                  return null;
                });
              if (!analyses) return null;
              if (analyses.data.attributes.status === 'completed') {
                resolve(analyses);
                break;
              }
              if (++count > 5) {
                resolve(null);
                break;
              }
              await wait(5000);
            } while (true);
          });
        };

        const stats = await getAnalyses(id).then((analyses) => analyses?.data.attributes.stats);
        if (!stats) continue;

        if (stats.malicious >= 3 || stats.suspicious >= 3) return void (message.delete().catch(() => null));
      }
    }

    if (!message.system) {
      const username = message.member?.displayName || message.author.username;
      switch (message.channel.id) {
        case ids.channels.suggestions:
          message
            .startThread({
              name: `[${username}] Suggestion Discussion`,
              reason: 'New suggestion',
            })
            .catch(() => null);
          await message.react('948824918500474891').catch(() => null);
          await message.react('948824918815043634').catch(() => null);
          break;
      }
    }
  });
};
